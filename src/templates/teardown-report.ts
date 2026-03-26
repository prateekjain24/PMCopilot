/**
 * Teardown Report Generator (PMC-058)
 *
 * Assembles a complete competitive teardown report in markdown from
 * structured data collected by the teardown agents.
 */

import { FeatureMatrixData, generateFeatureMatrix } from "./feature-matrix";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UXObservation {
  competitor: string;
  flow: string;
  observation: string;
  severity: "positive" | "neutral" | "negative";
}

export interface PricingTierInfo {
  competitor: string;
  tierName: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  perSeat: boolean;
  highlights: string[];
}

export interface AppStoreEntry {
  competitor: string;
  platform: "ios" | "android" | "both";
  rating: number | null;
  reviewCount: number | null;
  sentiment: "positive" | "mixed" | "negative" | null;
  topComplaints: string[];
  topPraises: string[];
}

export interface SWOTEntry {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Recommendation {
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  priority: number;
}

export interface ScreenshotEntry {
  competitor: string;
  flowCategory: string;
  caption: string;
  filePath: string;
}

export interface TeardownReportData {
  /** High-level summary of findings */
  executiveSummary: string;
  /** Feature comparison across competitors */
  features: FeatureMatrixData;
  /** Per-competitor UX observations */
  uxPatterns: UXObservation[];
  /** Pricing tier comparison data */
  pricing: PricingTierInfo[];
  /** App Store / Play Store performance metrics */
  appStorePerformance: AppStoreEntry[];
  /** Per-competitor SWOT analysis */
  swot: SWOTEntry[];
  /** Prioritized list of recommendations */
  recommendations: Recommendation[];
  /** Screenshots organized by flow category */
  screenshots: ScreenshotEntry[];
}

// ---------------------------------------------------------------------------
// Section Renderers (private)
// ---------------------------------------------------------------------------

function renderExecutiveSummary(summary: string): string {
  return `## 1. Executive Summary\n\n${summary}\n`;
}

function renderFeatureMatrix(data: FeatureMatrixData): string {
  const lines: string[] = [];
  lines.push("## 2. Feature Comparison Matrix\n");
  lines.push(generateFeatureMatrix(data));
  return lines.join("\n");
}

function renderUXPatterns(observations: UXObservation[]): string {
  const lines: string[] = [];
  lines.push("## 3. UX Patterns & Observations\n");

  if (observations.length === 0) {
    lines.push("_No UX observations recorded._\n");
    return lines.join("\n");
  }

  // Group by competitor
  const grouped = new Map<string, UXObservation[]>();
  for (const obs of observations) {
    const list = grouped.get(obs.competitor) ?? [];
    list.push(obs);
    grouped.set(obs.competitor, list);
  }

  const severityIcon: Record<UXObservation["severity"], string> = {
    positive: "+",
    neutral: "o",
    negative: "-",
  };

  for (const [competitor, items] of grouped) {
    lines.push(`### ${competitor}\n`);
    for (const item of items) {
      const icon = severityIcon[item.severity];
      lines.push(`- **(${icon}) ${item.flow}**: ${item.observation}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function renderPricing(tiers: PricingTierInfo[]): string {
  const lines: string[] = [];
  lines.push("## 4. Pricing Comparison\n");

  if (tiers.length === 0) {
    lines.push("_No pricing data collected._\n");
    return lines.join("\n");
  }

  // Build table
  lines.push(
    "| Competitor | Tier | Monthly | Annual | Per Seat | Highlights |"
  );
  lines.push(
    "|------------|------|---------|--------|----------|------------|"
  );

  for (const tier of tiers) {
    const monthly =
      tier.monthlyPrice !== null ? `$${tier.monthlyPrice}` : "N/A";
    const annual =
      tier.annualPrice !== null ? `$${tier.annualPrice}` : "N/A";
    const perSeat = tier.perSeat ? "Yes" : "No";
    const highlights = tier.highlights.join(", ");
    lines.push(
      `| ${tier.competitor} | ${tier.tierName} | ${monthly} | ${annual} | ${perSeat} | ${highlights} |`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function renderAppStorePerformance(entries: AppStoreEntry[]): string {
  const lines: string[] = [];
  lines.push("## 5. App Store Performance\n");

  if (entries.length === 0) {
    lines.push("_No app store data collected._\n");
    return lines.join("\n");
  }

  for (const entry of entries) {
    lines.push(`### ${entry.competitor} (${entry.platform})\n`);
    lines.push(
      `- **Rating:** ${entry.rating !== null ? entry.rating.toFixed(1) : "N/A"}`
    );
    lines.push(
      `- **Reviews:** ${entry.reviewCount !== null ? entry.reviewCount.toLocaleString() : "N/A"}`
    );
    lines.push(
      `- **Sentiment:** ${entry.sentiment ?? "N/A"}`
    );

    if (entry.topPraises.length > 0) {
      lines.push("- **Top Praises:**");
      for (const praise of entry.topPraises) {
        lines.push(`  - ${praise}`);
      }
    }

    if (entry.topComplaints.length > 0) {
      lines.push("- **Top Complaints:**");
      for (const complaint of entry.topComplaints) {
        lines.push(`  - ${complaint}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

function renderSWOT(entries: SWOTEntry[]): string {
  const lines: string[] = [];
  lines.push("## 6. SWOT Analysis\n");

  if (entries.length === 0) {
    lines.push("_No SWOT data available._\n");
    return lines.join("\n");
  }

  for (const entry of entries) {
    lines.push(`### ${entry.competitor}\n`);
    lines.push("| Strengths | Weaknesses |");
    lines.push("|-----------|-----------|");

    const maxSW = Math.max(entry.strengths.length, entry.weaknesses.length);
    for (let i = 0; i < maxSW; i++) {
      const s = entry.strengths[i] ?? "";
      const w = entry.weaknesses[i] ?? "";
      lines.push(`| ${s} | ${w} |`);
    }

    lines.push("");
    lines.push("| Opportunities | Threats |");
    lines.push("|--------------|---------|");

    const maxOT = Math.max(
      entry.opportunities.length,
      entry.threats.length
    );
    for (let i = 0; i < maxOT; i++) {
      const o = entry.opportunities[i] ?? "";
      const t = entry.threats[i] ?? "";
      lines.push(`| ${o} | ${t} |`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

function renderRecommendations(recs: Recommendation[]): string {
  const lines: string[] = [];
  lines.push("## 7. Recommendations\n");

  if (recs.length === 0) {
    lines.push("_No recommendations generated._\n");
    return lines.join("\n");
  }

  // Sort by priority ascending (1 = highest priority)
  const sorted = [...recs].sort((a, b) => a.priority - b.priority);

  lines.push("| # | Recommendation | Effort | Impact |");
  lines.push("|---|---------------|--------|--------|");

  for (const rec of sorted) {
    lines.push(
      `| ${rec.priority} | **${rec.title}** -- ${rec.description} | ${rec.effort} | ${rec.impact} |`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function renderScreenshots(screenshots: ScreenshotEntry[]): string {
  const lines: string[] = [];
  lines.push("## 8. Screenshots\n");

  if (screenshots.length === 0) {
    lines.push("_No screenshots captured._\n");
    return lines.join("\n");
  }

  // Group by flow category
  const grouped = new Map<string, ScreenshotEntry[]>();
  for (const ss of screenshots) {
    const list = grouped.get(ss.flowCategory) ?? [];
    list.push(ss);
    grouped.set(ss.flowCategory, list);
  }

  for (const [category, items] of grouped) {
    lines.push(`### ${category}\n`);
    for (const item of items) {
      lines.push(
        `**${item.competitor}** -- ${item.caption}\n`
      );
      lines.push(`![${item.caption}](${item.filePath})\n`);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a full competitive teardown report in markdown.
 *
 * The report includes 8 sections:
 *  1. Executive Summary
 *  2. Feature Comparison Matrix
 *  3. UX Patterns & Observations
 *  4. Pricing Comparison
 *  5. App Store Performance
 *  6. SWOT Analysis
 *  7. Recommendations
 *  8. Screenshots
 */
export function generateTeardownReport(data: TeardownReportData): string {
  const sections: string[] = [
    "# Competitive Teardown Report\n",
    renderExecutiveSummary(data.executiveSummary),
    renderFeatureMatrix(data.features),
    renderUXPatterns(data.uxPatterns),
    renderPricing(data.pricing),
    renderAppStorePerformance(data.appStorePerformance),
    renderSWOT(data.swot),
    renderRecommendations(data.recommendations),
    renderScreenshots(data.screenshots),
  ];

  return sections.join("\n---\n\n") + "\n";
}
