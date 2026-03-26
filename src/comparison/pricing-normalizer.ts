/**
 * Pricing Normalizer (PMC-062)
 *
 * Aligns competitor pricing tiers into a standard set of buckets
 * (Free, Starter, Pro, Enterprise) for side-by-side comparison.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PricingTier {
  /** Display name of the tier (e.g. "Business", "Premium") */
  name: string;
  /** Monthly price in USD (null if not available or custom) */
  monthlyPrice: number | null;
  /** Annual price in USD (null if not available or custom) */
  annualPrice: number | null;
  /** Whether the price is per-seat */
  perSeat: boolean;
  /** Key features included in this tier */
  features: string[];
}

export type StandardBucket = "Free" | "Starter" | "Pro" | "Enterprise";

export interface NormalizedTierEntry {
  /** Original tier name from the competitor */
  originalName: string;
  /** Standardized bucket */
  bucket: StandardBucket;
  /** Monthly price (null if custom/contact-sales) */
  monthlyPrice: number | null;
  /** Annual price (null if custom/contact-sales) */
  annualPrice: number | null;
  /** Per-seat pricing flag */
  perSeat: boolean;
  /** Features included */
  features: string[];
}

export interface NormalizedPricingTable {
  /** Ordered list of standard buckets that have at least one competitor */
  buckets: StandardBucket[];
  /** Competitor name -> bucket -> normalized tier entry */
  data: Record<string, Record<StandardBucket, NormalizedTierEntry | null>>;
  /** Ordered list of competitor names */
  competitors: string[];
}

// ---------------------------------------------------------------------------
// Bucket classification
// ---------------------------------------------------------------------------

const BUCKET_ORDER: StandardBucket[] = ["Free", "Starter", "Pro", "Enterprise"];

/**
 * Keywords and price ranges used to classify a tier into a standard bucket.
 */
const FREE_KEYWORDS = ["free", "basic", "community", "open source", "hobby"];
const STARTER_KEYWORDS = ["starter", "personal", "individual", "lite", "essentials", "standard"];
const PRO_KEYWORDS = ["pro", "professional", "business", "team", "growth", "plus", "premium"];
const ENTERPRISE_KEYWORDS = ["enterprise", "organization", "unlimited", "custom", "corporate"];

function classifyTier(tier: PricingTier): StandardBucket {
  const nameLower = tier.name.toLowerCase();

  // Explicit free tier
  if (tier.monthlyPrice === 0 || tier.annualPrice === 0) {
    return "Free";
  }

  // Keyword matching (check most specific first)
  if (ENTERPRISE_KEYWORDS.some((kw) => nameLower.includes(kw))) {
    return "Enterprise";
  }
  if (PRO_KEYWORDS.some((kw) => nameLower.includes(kw))) {
    return "Pro";
  }
  if (STARTER_KEYWORDS.some((kw) => nameLower.includes(kw))) {
    return "Starter";
  }
  if (FREE_KEYWORDS.some((kw) => nameLower.includes(kw))) {
    return "Free";
  }

  // Price-based heuristic when keywords do not match
  const price = tier.monthlyPrice ?? (tier.annualPrice ? tier.annualPrice / 12 : null);

  if (price === null) {
    // Custom pricing typically means Enterprise
    return "Enterprise";
  }
  if (price === 0) return "Free";
  if (price <= 15) return "Starter";
  if (price <= 60) return "Pro";
  return "Enterprise";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize pricing tiers across competitors into standard buckets.
 *
 * Each competitor's tiers are classified into Free / Starter / Pro / Enterprise
 * based on tier name keywords and price ranges.  If a competitor has multiple
 * tiers that map to the same bucket, the lowest-priced one is kept.
 *
 * @param competitors - Array of { name, tiers } per competitor
 * @returns Normalized pricing table aligned on standard buckets
 */
export function normalizePricing(
  competitors: { name: string; tiers: PricingTier[] }[]
): NormalizedPricingTable {
  const data: Record<string, Record<StandardBucket, NormalizedTierEntry | null>> = {};
  const competitorNames: string[] = [];
  const activeBuckets = new Set<StandardBucket>();

  for (const comp of competitors) {
    competitorNames.push(comp.name);
    const bucketMap: Record<StandardBucket, NormalizedTierEntry | null> = {
      Free: null,
      Starter: null,
      Pro: null,
      Enterprise: null,
    };

    for (const tier of comp.tiers) {
      const bucket = classifyTier(tier);
      activeBuckets.add(bucket);

      const entry: NormalizedTierEntry = {
        originalName: tier.name,
        bucket,
        monthlyPrice: tier.monthlyPrice,
        annualPrice: tier.annualPrice,
        perSeat: tier.perSeat,
        features: tier.features,
      };

      // Keep the lowest-priced entry if there is a collision
      const existing = bucketMap[bucket];
      if (!existing) {
        bucketMap[bucket] = entry;
      } else {
        const existingPrice = existing.monthlyPrice ?? Infinity;
        const newPrice = entry.monthlyPrice ?? Infinity;
        if (newPrice < existingPrice) {
          bucketMap[bucket] = entry;
        }
      }
    }

    data[comp.name] = bucketMap;
  }

  // Preserve canonical bucket order, filtered to active buckets
  const buckets = BUCKET_ORDER.filter((b) => activeBuckets.has(b));

  return {
    buckets,
    data,
    competitors: competitorNames,
  };
}

// ---------------------------------------------------------------------------
// Markdown Rendering
// ---------------------------------------------------------------------------

/**
 * Render a normalized pricing table as a markdown table.
 *
 * Columns: Bucket | Competitor A | Competitor B | ...
 * Each cell shows: price, per-seat flag, and original tier name.
 */
export function renderPricingTable(table: NormalizedPricingTable): string {
  const { buckets, data, competitors } = table;

  if (competitors.length === 0 || buckets.length === 0) {
    return "_No pricing data available._\n";
  }

  const lines: string[] = [];

  // Header
  const header = ["Tier", ...competitors];
  lines.push("| " + header.join(" | ") + " |");
  lines.push(
    "| " + header.map((h) => "-".repeat(Math.max(h.length, 4))).join(" | ") + " |"
  );

  // Rows
  for (const bucket of buckets) {
    const cells: string[] = [bucket];

    for (const comp of competitors) {
      const entry = data[comp]?.[bucket];
      if (!entry) {
        cells.push("--");
        continue;
      }

      const parts: string[] = [];

      if (entry.monthlyPrice !== null) {
        parts.push(`$${entry.monthlyPrice}/mo`);
      } else if (entry.annualPrice !== null) {
        parts.push(`$${entry.annualPrice}/yr`);
      } else {
        parts.push("Custom");
      }

      if (entry.perSeat) {
        parts.push("per seat");
      }

      if (entry.originalName !== bucket) {
        parts.push(`(${entry.originalName})`);
      }

      cells.push(parts.join(" "));
    }

    lines.push("| " + cells.join(" | ") + " |");
  }

  return lines.join("\n") + "\n";
}
