---
id: PMC-058
title: Teardown Report Template
phase: 3 - Web Teardown Engine
status: todo
type: template
estimate: 1
dependencies: [PMC-035]
---

## Description
Create the standardized teardown report template that structures the output of a full competitive web teardown into a comprehensive, actionable document. This template defines the canonical sections and layout that every teardown report follows, ensuring consistency across all competitor analyses.

The template must include the following sections in order:
1. **Executive Summary** - High-level findings, key takeaways, and strategic implications (2-3 paragraphs max)
2. **Feature Comparison Matrix** - Tabular comparison of features across the target product and competitors (references the feature matrix template from PMC-059)
3. **UX Pattern Analysis** - Catalogues interaction patterns, navigation paradigms, information architecture, and design system observations per competitor
4. **Pricing Comparison** - Tier-by-tier breakdown including free plans, trial lengths, per-seat vs flat pricing, and hidden costs
5. **App Store Performance** - Ratings, review counts, download estimates, review sentiment highlights, and ranking trends
6. **Strengths/Weaknesses (SWOT per Competitor)** - Individual SWOT analysis block for each competitor with Strengths, Weaknesses, Opportunities, Threats
7. **Strategic Recommendations** - Prioritized list of actionable recommendations derived from the analysis, tagged by effort/impact
8. **Screenshot Gallery** - Organized by flow: onboarding, core loop, monetization, settings. Each screenshot captioned with observation notes

The template should be implemented as a TypeScript module that exports a function to generate the markdown report from structured data, and a TypeScript interface defining the expected input shape.

## Acceptance Criteria
- [ ] TypeScript interface `TeardownReportData` defines all required section data shapes (executive summary, features, UX patterns, pricing, app store, SWOT entries, recommendations, screenshots)
- [ ] `generateTeardownReport(data: TeardownReportData): string` function produces well-formatted markdown output
- [ ] Executive Summary section renders as prose paragraphs
- [ ] Feature Comparison Matrix section renders as a markdown table (or delegates to PMC-059 feature matrix template)
- [ ] UX Pattern Analysis section supports per-competitor subsections with bullet points
- [ ] Pricing Comparison section renders as a structured table with tier columns
- [ ] App Store Performance section renders rating, reviews, downloads, and sentiment per competitor
- [ ] SWOT section renders a separate S/W/O/T block per competitor
- [ ] Strategic Recommendations section renders as a numbered list with effort/impact tags
- [ ] Screenshot Gallery section organizes images by flow category (onboarding, core loop, monetization, settings) with captions
- [ ] Template output is valid markdown that renders correctly
- [ ] Unit tests cover each section renderer in isolation and the full report assembly

## Files to Create/Modify
- `src/templates/teardown-report.ts` - Template interfaces and report generation function
- `src/templates/teardown-report.test.ts` - Unit tests for the teardown report template
