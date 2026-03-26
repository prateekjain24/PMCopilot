/**
 * Positioning Map (PMC-062)
 *
 * Generates a 2D competitive positioning map with configurable axes.
 * Default axes: x = price (normalized 0-100), y = feature richness (0-100).
 * Includes an ASCII scatter plot renderer for terminal / markdown output.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompetitorData {
  name: string;
  features: string[];
  pricing: { monthlyPrice: number | null };
  metadata: Record<string, number | string>;
}

export interface PositionedCompetitor {
  name: string;
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Position Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate normalized (0-100) positions for each competitor on a 2D map.
 *
 * @param competitors - Competitor data with features, pricing, and metadata
 * @param xAxis       - Metric name for the X axis (default: "price")
 * @param yAxis       - Metric name for the Y axis (default: "featureRichness")
 * @returns Array of positioned competitors with x,y in [0,100]
 */
export function calculatePositions(
  competitors: CompetitorData[],
  xAxis: string = "price",
  yAxis: string = "featureRichness"
): PositionedCompetitor[] {
  if (competitors.length === 0) return [];

  const rawX = competitors.map((c) => extractMetric(c, xAxis));
  const rawY = competitors.map((c) => extractMetric(c, yAxis));

  const normalizedX = normalizeRange(rawX);
  const normalizedY = normalizeRange(rawY);

  return competitors.map((c, i) => ({
    name: c.name,
    x: normalizedX[i],
    y: normalizedY[i],
  }));
}

/**
 * Extract a numeric metric from competitor data.
 */
function extractMetric(competitor: CompetitorData, metric: string): number {
  switch (metric) {
    case "price":
      return competitor.pricing.monthlyPrice ?? 0;

    case "featureRichness":
      return competitor.features.length;

    default: {
      // Look in metadata for custom metrics
      const value = competitor.metadata[metric];
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    }
  }
}

/**
 * Normalize an array of numbers to the 0-100 range.
 * If all values are equal, all normalized values are 50.
 */
function normalizeRange(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return values.map(() => 50);
  }

  return values.map((v) => Math.round(((v - min) / range) * 100));
}

// ---------------------------------------------------------------------------
// ASCII Map Rendering
// ---------------------------------------------------------------------------

/**
 * Render an ASCII scatter plot showing competitor positions.
 *
 * The map is rendered as a grid of characters with:
 *   - Y axis on the left (top = high, bottom = low)
 *   - X axis on the bottom (left = low, right = high)
 *   - Competitor markers as numbered labels
 *   - A legend mapping numbers to competitor names
 *
 * @param positions - Positioned competitors
 * @param width     - Map width in characters (default: 60)
 * @param height    - Map height in characters (default: 20)
 * @returns Multi-line ASCII art string
 */
export function renderAsciiMap(
  positions: PositionedCompetitor[],
  width: number = 60,
  height: number = 20
): string {
  if (positions.length === 0) {
    return "_No positioning data available._\n";
  }

  // Initialize empty grid
  const grid: string[][] = [];
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      grid[row][col] = " ";
    }
  }

  // Place competitors on the grid
  const legend: string[] = [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const marker = String(i + 1);

    // Map 0-100 to grid coordinates
    const col = Math.min(
      width - 1,
      Math.max(0, Math.round((pos.x / 100) * (width - 1)))
    );
    // Y axis is inverted: row 0 = top = high value
    const row = Math.min(
      height - 1,
      Math.max(0, height - 1 - Math.round((pos.y / 100) * (height - 1)))
    );

    // Place marker (handle collisions by preferring the first placed)
    if (grid[row][col] === " " || grid[row][col] === ".") {
      grid[row][col] = marker.length === 1 ? marker : marker[0];
    }

    legend.push(`  ${marker}. ${pos.name} (x=${pos.x}, y=${pos.y})`);
  }

  // Build output
  const lines: string[] = [];

  // Y axis label
  const yLabel = "Feature Richness";
  lines.push("");

  // Top axis marker
  const topLabel = "100";
  lines.push(`${topLabel.padStart(4)} |${"_".repeat(width)}`);

  // Grid rows with Y axis
  for (let row = 0; row < height; row++) {
    const yValue = Math.round(((height - 1 - row) / (height - 1)) * 100);
    const rowContent = grid[row].join("");

    // Show Y axis ticks at 25% intervals
    if (
      yValue === 100 ||
      yValue === 75 ||
      yValue === 50 ||
      yValue === 25 ||
      yValue === 0
    ) {
      lines.push(`${String(yValue).padStart(4)} |${rowContent}|`);
    } else {
      lines.push(`     |${rowContent}|`);
    }
  }

  // X axis
  lines.push(`     |${"_".repeat(width)}|`);

  // X axis labels
  const xLabels = "0".padStart(6) +
    "25".padStart(Math.round(width / 4)) +
    "50".padStart(Math.round(width / 4)) +
    "75".padStart(Math.round(width / 4)) +
    "100".padStart(Math.round(width / 4));
  lines.push(xLabels);

  // Axis title
  lines.push(" ".repeat(Math.round(width / 2)) + "Price -->");

  // Legend
  lines.push("");
  lines.push(`Y: ${yLabel} | X: Price`);
  lines.push("");
  lines.push("Legend:");
  lines.push(...legend);
  lines.push("");

  return lines.join("\n");
}
