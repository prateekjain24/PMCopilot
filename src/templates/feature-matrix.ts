/**
 * Feature Matrix Generator (PMC-059)
 *
 * Builds markdown feature-comparison tables for competitive teardowns.
 * Supports up to 10 competitors and 50+ features.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureCell {
  /** Whether the competitor offers this feature */
  availability: "yes" | "no" | "partial" | "unknown";
  /** Pricing tier where the feature is available (e.g. "Pro", "Enterprise") */
  tier: string | null;
  /** Free-form notes about the implementation quality or caveats */
  notes: string | null;
}

export interface FeatureMatrixData {
  /** Ordered list of competitor names (columns) */
  competitors: string[];
  /** Ordered list of feature names (rows) */
  features: string[];
  /**
   * Nested lookup: matrix[featureName][competitorName] = FeatureCell
   * Every feature x competitor combination should have an entry.
   */
  matrix: Record<string, Record<string, FeatureCell>>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AVAILABILITY_ICONS: Record<FeatureCell["availability"], string> = {
  yes: "[x]",
  no: "[ ]",
  partial: "[~]",
  unknown: "[?]",
};

function escapeMarkdownPipe(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function formatCell(cell: FeatureCell | undefined): string {
  if (!cell) {
    return "[?]";
  }

  const icon = AVAILABILITY_ICONS[cell.availability];
  const parts: string[] = [icon];

  if (cell.tier) {
    parts.push(escapeMarkdownPipe(cell.tier));
  }

  if (cell.notes) {
    parts.push(escapeMarkdownPipe(cell.notes));
  }

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a markdown table comparing features across competitors.
 *
 * Output format:
 *
 * | Feature          | Competitor A | Competitor B | ...
 * |------------------|-------------|-------------|-----
 * | Feature 1        | [x] Pro     | [ ]         | ...
 * | Feature 2        | [~] Note    | [x]         | ...
 *
 * Legend:
 *   [x] = available, [ ] = not available, [~] = partial, [?] = unknown
 */
export function generateFeatureMatrix(data: FeatureMatrixData): string {
  const { competitors, features, matrix } = data;

  if (competitors.length === 0 || features.length === 0) {
    return "_No feature data available._\n";
  }

  const lines: string[] = [];

  // Header row
  const headerCells = ["Feature", ...competitors.map(escapeMarkdownPipe)];
  lines.push("| " + headerCells.join(" | ") + " |");

  // Separator row
  const separatorCells = headerCells.map((cell) =>
    "-".repeat(Math.max(cell.length, 3))
  );
  lines.push("| " + separatorCells.join(" | ") + " |");

  // Data rows
  for (const feature of features) {
    const featureRow = matrix[feature] ?? {};
    const cells = [
      escapeMarkdownPipe(feature),
      ...competitors.map((comp) => formatCell(featureRow[comp])),
    ];
    lines.push("| " + cells.join(" | ") + " |");
  }

  // Legend
  lines.push("");
  lines.push("**Legend:** [x] Available | [ ] Not available | [~] Partial | [?] Unknown");

  return lines.join("\n") + "\n";
}
