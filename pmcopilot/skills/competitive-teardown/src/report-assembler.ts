/**
 * Report Assembler
 *
 * Takes raw data from the three teardown workstreams (app teardown, web teardown,
 * and store intel) plus an optional UX review, and produces a unified markdown
 * competitive teardown report.
 *
 * Handles missing data gracefully -- any section with unavailable data is marked
 * clearly rather than omitted, so the reader knows what was and was not analyzed.
 */

import type {
  AppTeardownData,
  WebTeardownData,
  StoreIntelData,
  UxReviewData,
} from "./orchestrator";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_UNAVAILABLE = "_Data not available for this section. The corresponding workstream did not return results._";
const SEPARATOR = "\n\n---\n\n";
const TODAY = new Date().toISOString().split("T")[0];

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildHeader(competitor: string): string {
  return [
    `# Competitive Teardown: ${competitor}`,
    "",
    `**Generated:** ${TODAY}`,
    `**Tool:** PMCopilot Competitive Teardown`,
    "",
  ].join("\n");
}

function buildExecutiveSummary(
  appData: AppTeardownData | null,
  webData: WebTeardownData | null,
  storeData: StoreIntelData | null,
  uxReview: UxReviewData | null | undefined
): string {
  const lines: string[] = ["## 1. Executive Summary", ""];

  const hasAnyData = appData || webData || storeData;

  if (!hasAnyData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  // Build summary from available data sources
  const dataSources: string[] = [];
  if (appData) dataSources.push(`mobile app analysis (${appData.screenCount} screens, ${appData.flowCount} flows)`);
  if (webData) dataSources.push(`web presence analysis (${webData.pagesVisited} pages)`);
  if (storeData) {
    const ratings: string[] = [];
    if (storeData.appStoreRating) ratings.push(`App Store: ${storeData.appStoreRating}/5`);
    if (storeData.playStoreRating) ratings.push(`Play Store: ${storeData.playStoreRating}/5`);
    if (ratings.length > 0) {
      dataSources.push(`store intelligence (${ratings.join(", ")})`);
    } else {
      dataSources.push("store intelligence");
    }
  }

  lines.push(`This teardown covers ${dataSources.join(", ")}.`);
  lines.push("");

  if (uxReview) {
    lines.push(`**UX Score:** ${uxReview.overallScore}/10 | **Issues found:** ${uxReview.issueCount} (${uxReview.criticalIssues} critical)`);
    lines.push("");
  }

  if (appData && appData.crashCount > 0) {
    lines.push(`> **Warning:** ${appData.crashCount} crash(es) encountered during app teardown.`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildAppOverview(storeData: StoreIntelData | null): string {
  const lines: string[] = ["## 2. App Overview", ""];

  if (!storeData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  lines.push(storeData.storeListingMarkdown);
  lines.push("");

  // Ratings table
  lines.push("### Ratings", "");
  lines.push("| Store | Rating | Reviews |");
  lines.push("|-------|--------|---------|");

  if (storeData.appStoreRating !== undefined) {
    lines.push(
      `| App Store | ${storeData.appStoreRating}/5 | ${storeData.appStoreReviewCount?.toLocaleString() ?? "N/A"} |`
    );
  }
  if (storeData.playStoreRating !== undefined) {
    lines.push(
      `| Play Store | ${storeData.playStoreRating}/5 | ${storeData.playStoreReviewCount?.toLocaleString() ?? "N/A"} |`
    );
  }

  lines.push("");

  // Version history
  if (storeData.versionHistory) {
    lines.push("### Version History", "");
    lines.push(storeData.versionHistory);
    lines.push("");
  }

  // Recent reviews
  if (storeData.recentReviews) {
    lines.push("### Recent Review Themes", "");
    lines.push(storeData.recentReviews);
    lines.push("");
  }

  return lines.join("\n");
}

function buildProductTeardown(appData: AppTeardownData | null): string {
  const lines: string[] = ["## 3. Product Teardown", ""];

  if (!appData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  // Screen inventory
  lines.push("### Screen Inventory", "");
  lines.push(`Total unique screens: **${appData.screenCount}**`);
  lines.push("");
  lines.push(appData.screenInventory);
  lines.push("");

  // Navigation map
  lines.push("### Navigation Map", "");
  lines.push(appData.navigationMap);
  lines.push("");

  // Key flows
  lines.push("### Key User Flows", "");
  lines.push(`Total documented flows: **${appData.flowCount}**`);
  lines.push("");

  for (const [flowName, flowContent] of Object.entries(appData.flows)) {
    lines.push(`#### ${flowName}`, "");
    lines.push(flowContent);
    lines.push("");
  }

  // Observations
  lines.push("### Observations", "");
  lines.push(appData.observations);
  lines.push("");

  return lines.join("\n");
}

function buildUxAssessment(uxReview: UxReviewData | null | undefined): string {
  const lines: string[] = ["## 4. UX Assessment", ""];

  if (!uxReview) {
    lines.push(DATA_UNAVAILABLE);
    lines.push("");
    lines.push("_Run the teardown with `--ux-review` to include a full UX assessment against Nielsen heuristics and accessibility criteria._");
    return lines.join("\n");
  }

  lines.push(`**Overall UX Score:** ${uxReview.overallScore}/10`);
  lines.push("");
  lines.push(uxReview.reportMarkdown);

  return lines.join("\n");
}

function buildMarketPositioning(
  webData: WebTeardownData | null,
  storeData: StoreIntelData | null
): string {
  const lines: string[] = ["## 5. Market Positioning", ""];

  if (!webData && !storeData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  if (webData) {
    // Landing page messaging reveals positioning
    lines.push("### Positioning from Website", "");
    lines.push(webData.landingPage);
    lines.push("");

    // Pricing strategy
    if (webData.pricing) {
      lines.push("### Pricing Strategy", "");
      lines.push(webData.pricing);
      lines.push("");
    }
  }

  if (storeData && storeData.storeListingMarkdown) {
    lines.push("### Store Positioning", "");
    lines.push("The app store listing provides additional positioning signals (category choice, keywords, description emphasis).");
    lines.push("");
  }

  return lines.join("\n");
}

function buildWebPresence(webData: WebTeardownData | null): string {
  const lines: string[] = ["## 6. Web Presence", ""];

  if (!webData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  lines.push(`Pages analyzed: **${webData.pagesVisited}**`);
  lines.push("");

  // Features
  if (webData.features) {
    lines.push("### Features & Capabilities", "");
    lines.push(webData.features);
    lines.push("");
  }

  // Signup flow
  if (webData.signupFlow) {
    lines.push("### Signup Flow", "");
    lines.push(webData.signupFlow);
    lines.push("");
  }

  // Technical analysis
  if (webData.technical) {
    lines.push("### Technical Stack", "");
    lines.push(webData.technical);
    lines.push("");
  }

  // Content strategy
  if (webData.contentStrategy) {
    lines.push("### Content Strategy", "");
    lines.push(webData.contentStrategy);
    lines.push("");
  }

  return lines.join("\n");
}

function buildStrengthsWeaknesses(
  appData: AppTeardownData | null,
  webData: WebTeardownData | null,
  storeData: StoreIntelData | null,
  uxReview: UxReviewData | null | undefined
): string {
  const lines: string[] = ["## 7. Strengths and Weaknesses", ""];

  const hasAnyData = appData || webData || storeData;

  if (!hasAnyData) {
    lines.push(DATA_UNAVAILABLE);
    return lines.join("\n");
  }

  lines.push("### Strengths", "");
  lines.push("| # | Strength | Source | Evidence |");
  lines.push("|---|----------|--------|----------|");
  lines.push("| 1 | _Populated from teardown findings_ | | |");
  lines.push("");

  lines.push("### Weaknesses", "");
  lines.push("| # | Weakness | Source | Evidence |");
  lines.push("|---|----------|--------|----------|");
  lines.push("| 1 | _Populated from teardown findings_ | | |");
  lines.push("");

  lines.push("_Note: The research-synthesizer agent populates these tables by cross-referencing findings from all workstreams. If running without the synthesizer, review the individual section findings above to identify strengths and weaknesses._");

  return lines.join("\n");
}

function buildStrategicRecommendations(): string {
  const lines: string[] = [
    "## 8. Strategic Recommendations",
    "",
    "| Priority | Recommendation | Impact | Effort | Type | Rationale |",
    "|----------|---------------|--------|--------|------|-----------|",
    "| 1 | _Populated by research-synthesizer_ | | | | |",
    "",
    "**Recommendation types:**",
    "- **Quick Win**: Low effort, high impact -- do these first",
    "- **Strategic Bet**: High effort, high impact -- plan and resource carefully",
    "- **Table Stakes**: Required for competitive parity regardless of effort",
    "- **Defensive**: Close a gap where the competitor leads",
    "- **Offensive**: Differentiate in an area where the competitor is weak",
    "",
    "_Note: Recommendations are generated by the research-synthesizer agent based on cross-cutting analysis of all teardown data. If running without the synthesizer, derive recommendations from the findings in sections 3-7._",
  ];

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main assembler
// ---------------------------------------------------------------------------

/**
 * Assemble a unified competitive teardown report from the outputs of
 * all teardown workstreams.
 *
 * Each parameter may be null if the corresponding workstream failed or
 * was skipped. The report will include a "Data not available" notice
 * for any missing section rather than omitting it entirely.
 *
 * @param appData   - Results from the app-teardown agent
 * @param webData   - Results from the web-teardown agent
 * @param storeData - Results from app-store-intel MCP queries
 * @param uxReview  - Optional results from the ux-reviewer agent
 * @returns Complete markdown report as a string
 */
export function assembleTeardownReport(
  appData: AppTeardownData | null,
  webData: WebTeardownData | null,
  storeData: StoreIntelData | null,
  uxReview?: UxReviewData | null
): string {
  // Determine competitor name from available data
  const competitor = "Competitor";

  const sections: string[] = [
    buildHeader(competitor),
    buildExecutiveSummary(appData, webData, storeData, uxReview),
    buildAppOverview(storeData),
    buildProductTeardown(appData),
    buildUxAssessment(uxReview),
    buildMarketPositioning(webData, storeData),
    buildWebPresence(webData),
    buildStrengthsWeaknesses(appData, webData, storeData, uxReview),
    buildStrategicRecommendations(),
  ];

  // Join sections with separators
  let report = sections.join(SEPARATOR);

  // Append metadata footer
  report += "\n\n---\n\n";
  report += `_Report generated by PMCopilot Competitive Teardown on ${TODAY}._\n`;
  report += `_Data sources: ${[
    appData ? "App Teardown" : null,
    webData ? "Web Teardown" : null,
    storeData ? "Store Intel" : null,
    uxReview ? "UX Review" : null,
  ]
    .filter(Boolean)
    .join(", ") || "None"}_\n`;

  return report;
}
