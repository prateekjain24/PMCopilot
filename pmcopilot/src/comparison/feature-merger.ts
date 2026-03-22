/**
 * Feature Merger (PMC-062)
 *
 * Deduplicates and aligns feature names across multiple competitors using
 * Levenshtein distance for fuzzy matching.
 *
 * Two features are considered the same if:
 *   - Levenshtein distance <= 3, OR
 *   - Normalized similarity >= 0.8
 */

// ---------------------------------------------------------------------------
// Levenshtein Distance
// ---------------------------------------------------------------------------

/**
 * Compute the Levenshtein edit distance between two strings.
 * Uses a full matrix approach for clarity; O(m*n) time and space.
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Edge cases
  if (m === 0) return n;
  if (n === 0) return m;

  // Build distance matrix
  const matrix: number[][] = [];

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost  // substitution
      );
    }
  }

  return matrix[m][n];
}

// ---------------------------------------------------------------------------
// Similarity helpers
// ---------------------------------------------------------------------------

/**
 * Normalized similarity score between 0 and 1.
 * 1.0 = identical strings, 0.0 = completely different.
 */
function normalizedSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return 1 - levenshtein(a, b) / maxLen;
}

/** Lowercase and trim for comparison */
function normalize(feature: string): string {
  return feature.toLowerCase().trim();
}

/**
 * Determine if two feature names refer to the same capability.
 */
function areSameFeature(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);

  if (na === nb) return true;

  const dist = levenshtein(na, nb);
  if (dist <= 3) return true;

  if (normalizedSimilarity(na, nb) >= 0.8) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Merge feature lists from multiple competitors into a single deduplicated
 * master list.
 *
 * Features that are semantically equivalent (determined by Levenshtein
 * distance or normalized similarity) are collapsed into a single canonical
 * name.  The canonical name chosen is the longest variant, on the theory
 * that longer names are usually more descriptive.
 *
 * @param competitors - Array of { name, features } per competitor
 * @returns Deduplicated and ordered master feature list
 */
export function mergeFeatureLists(
  competitors: { name: string; features: string[] }[]
): string[] {
  // Collect every unique feature name across all competitors
  const allFeatures: string[] = [];
  for (const comp of competitors) {
    for (const feat of comp.features) {
      allFeatures.push(feat.trim());
    }
  }

  // Group features into clusters of similar names
  const clusters: string[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < allFeatures.length; i++) {
    if (assigned.has(i)) continue;

    const cluster: string[] = [allFeatures[i]];
    assigned.add(i);

    for (let j = i + 1; j < allFeatures.length; j++) {
      if (assigned.has(j)) continue;

      if (areSameFeature(allFeatures[i], allFeatures[j])) {
        cluster.push(allFeatures[j]);
        assigned.add(j);
      }
    }

    clusters.push(cluster);
  }

  // Pick canonical name for each cluster (longest variant)
  const canonicalNames = clusters.map((cluster) => {
    return cluster.reduce((best, current) =>
      current.length > best.length ? current : best
    );
  });

  return canonicalNames;
}
