---
name: competitive-teardown
description: >
  The flagship skill. Orchestrates a comprehensive competitive teardown by
  dispatching app-teardown, web-teardown, and research-synthesizer agents
  in parallel. Produces an 8-section competitive intelligence report with
  feature matrix, UX analysis, SWOT, and strategic recommendations.
---

# Competitive Teardown

You are a senior PM running a comprehensive competitive teardown. This is the flagship skill of PMCopilot -- it orchestrates multiple agents in parallel to deliver a deep, multi-dimensional competitive analysis covering product, UX, positioning, pricing, and strategy.

## Input

Competitor: $ARGUMENTS[0] (competitor name or app name; can be a comma-separated list for multi-competitor analysis)
Your product: Parse `--vs YOUR_PRODUCT` from arguments. If not provided, check `${CLAUDE_PLUGIN_DATA}/settings.json` for `own_product_name`. If still not found, prompt the user.
Platform: Parse `--platform` from arguments. Options: `ios`, `android`, `web`, `all`. Defaults to `all`.

## Process

### Step 0 -- Confirm Scope

Before dispatching agents, confirm with the user:

- Which competitor(s) to analyze.
- What your product is (for comparison context).
- Which platforms to cover (skip simulator-based teardowns if the user only wants web, and vice versa).
- Any specific areas of focus (e.g., "focus on onboarding and pricing" vs. full teardown).

### Step 1 -- Dispatch Agents in Parallel

Launch three sub-agents simultaneously. Each operates independently and returns its findings:

**Agent(app-teardown)** -- Mobile App Analysis
- Install and navigate the competitor app on a simulator/emulator.
- Capture screenshots of every distinct screen (using accessibility tree for navigation, coordinates as fallback).
- Document: feature inventory, information architecture (screen hierarchy and navigation structure), onboarding flow (every step from install to first value), key user flows (core actions a user would perform), pricing screens (plans, paywalls, trial flows), settings and configuration options.
- Apply screen deduplication (skip screens with more than 80% element overlap).
- Platform dispatch: iOS Simulator via simulator-bridge MCP for `ios` or `all`; Android Emulator via emulator-bridge MCP for `android` or `all`.

**Agent(web-teardown)** -- Web Presence Analysis
- Browse the competitor website via Chrome automation.
- Document: positioning and messaging (homepage, about page, key landing pages), SEO strategy (title tags, meta descriptions, heading structure, content depth), content marketing (blog topics, publication frequency, content quality), social media presence (linked profiles, posting frequency), job postings (what roles they are hiring for -- signals investment areas), press coverage and announcements (recent news, funding, partnerships).
- Respect robots.txt. Wait 2 seconds between navigations. Cap at 50 pages per competitor.

**Agent(research-synthesizer)** -- Strategic Research
- Gather: analyst reports and industry coverage, funding history and investor information, market share estimates and competitive positioning, strategic direction signals (executive statements, product announcements, conference talks), partnerships and integrations ecosystem, team size and organizational signals from job postings and LinkedIn data.
- Synthesize findings from the other two agents alongside its own research into a unified narrative.

### Step 2 -- Collect and Merge Results

Wait for all three agents to complete. Merge their findings, resolving any conflicts or overlaps:

- Deduplicate information that appears in multiple agent outputs.
- Cross-reference findings (e.g., features visible in the app teardown should align with marketing claims from the web teardown).
- Flag any discrepancies between what the competitor says on their website and what the product actually does.

### Step 3 -- Generate the Report

Produce the final competitive teardown report with these eight sections:

---

#### Section 1 -- Executive Summary

A one-page overview of the competitive landscape. Cover:

- Who the competitor is and what they do.
- Their primary strengths and weaknesses relative to your product.
- The single most important strategic insight from the teardown.
- Recommended immediate actions (2-3 bullet points).

#### Section 2 -- Feature Matrix

Side-by-side comparison of features between the competitor and your product.

| Feature Category | Feature | Competitor | Your Product | Assessment |
|-----------------|---------|-----------|-------------|------------|
| ... | ... | Yes/No/Partial | Yes/No/Partial | Parity / Gap / Advantage |

- Group features by category (core, secondary, differentiators).
- For multi-competitor analysis, expand the table with additional columns.
- Mark features where the competitor has a clear advantage, where you have parity, and where you lead.

#### Section 3 -- UX Analysis

Deep dive into user experience quality:

- **Onboarding**: step count, time-to-value, friction points, sign-up requirements.
- **Core flows**: how the primary user actions are structured, number of taps/clicks to complete key tasks.
- **Design quality**: visual consistency, modern vs. dated patterns, accessibility considerations.
- **Friction points**: where users are likely to get stuck, confused, or frustrated.
- **Delight moments**: clever UX patterns, animations, or touches that create positive impressions.

Include annotated screenshots where available.

#### Section 4 -- Pricing Comparison

Analyze pricing strategy and value:

| Dimension | Competitor | Your Product |
|-----------|-----------|-------------|
| Pricing Model | ... | ... |
| Free Tier | ... | ... |
| Entry Price | ... | ... |
| Mid Tier | ... | ... |
| Enterprise | ... | ... |
| Trial Length | ... | ... |
| Value per Dollar | ... | ... |

- Note any recent pricing changes.
- Assess value-per-dollar from a user perspective.
- Identify pricing as a competitive advantage or vulnerability.

#### Section 5 -- App Store Performance

Summarize app store data (pull from app-store-intel MCP if available, or from agent findings):

- Ratings on iOS and Android.
- Sentiment summary from recent reviews.
- Download estimates if available.
- Update cadence and recent release notes.
- User complaints and praise themes.

#### Section 6 -- SWOT Analysis

Structured SWOT for the competitor:

| | Helpful | Harmful |
|---|---------|---------|
| **Internal** | **Strengths**: ... | **Weaknesses**: ... |
| **External** | **Opportunities**: ... | **Threats**: ... |

For each quadrant, provide 3-5 items with brief explanations. Each item should be specific and actionable -- not generic statements. Include what your team can do in response to each finding.

#### Section 7 -- Strategic Recommendations

Prioritized list of recommendations based on the teardown:

| Priority | Recommendation | Impact | Effort | Rationale |
|----------|---------------|--------|--------|-----------|
| 1 | ... | High/Med/Low | High/Med/Low | ... |
| 2 | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |

- Rank by impact-to-effort ratio.
- Distinguish between quick wins (low effort, high impact), strategic bets (high effort, high impact), and table stakes (things you must do to maintain parity).
- Include both offensive moves (where to differentiate) and defensive moves (where to close gaps).

#### Section 8 -- Screenshot Gallery

Organized collection of screenshots from the app teardown, grouped by flow:

- Onboarding flow
- Core user journey
- Pricing and paywall screens
- Settings and profile
- Notable or unique screens

Each screenshot should include a brief annotation describing what it shows and any notable UX observations.

---

## Handling Partial Data

Not every agent will return complete data in every scenario:

- If the app is not available on a platform, note the gap and proceed with available platforms.
- If web teardown encounters access restrictions, document what was accessible and what was blocked.
- If research data is sparse (e.g., the competitor is a small startup), note the limitation and focus the analysis on what is observable from the product itself.
- Never fabricate data or speculate without labeling it as speculation.

## Multi-Competitor Mode

When multiple competitors are specified:

- Run agent sets for each competitor in parallel.
- The Feature Matrix (Section 2) expands to include all competitors in columns.
- Add a "Competitive Positioning Map" showing where each player sits on key dimensions.
- The Executive Summary should address the competitive landscape holistically, not just individual competitors.

## Output

Save the competitive teardown report to:

```
docs/teardowns/competitive-teardown-{competitor-name}-{YYYY-MM-DD}.md
```

Save screenshots to:

```
docs/teardowns/screenshots/{competitor-name}/
```

Create directories if they do not exist.

## Orchestration Pipeline

This skill uses TypeScript orchestration files in `src/` to coordinate the parallel workstreams:

### src/orchestrator.ts

The `orchestrateTeardown(competitor, options)` function manages the full pipeline:

1. **Parallel dispatch**: Launches three workstreams simultaneously via `Promise.all`:
   - `dispatchAppTeardown()` -- sends the app-teardown agent brief with platform targets and output directory
   - `dispatchWebTeardown()` -- sends the web-teardown agent brief with the competitor domain
   - `fetchStoreIntel()` -- queries app-store-intel MCP tools for store metadata and reviews
2. **Graceful failure handling**: Each workstream is wrapped in error handling. If one fails (e.g., no APK available for the app teardown), the remaining workstreams continue and the report marks the failed section as "Data not available."
3. **Optional UX review**: If `--ux-review` is passed, a fourth step dispatches the ux-reviewer agent against the collected screenshots after the app teardown completes.
4. **Result collection**: All workstream results are gathered with status tracking (success, partial, failed) and timing data.

### src/report-assembler.ts

The `assembleTeardownReport(appData, webData, storeData, uxReview?)` function produces the final markdown report:

- Accepts nullable data for each workstream -- any missing section shows "Data not available" rather than being silently omitted.
- Generates all eight report sections (Executive Summary, App Overview, Product Teardown, UX Assessment, Market Positioning, Web Presence, Strengths/Weaknesses, Strategic Recommendations).
- Includes a metadata footer with generation date and data source inventory.

### Pipeline flow

```
/pmcopilot:competitive-teardown "Competitor" --platform all --ux-review
  |
  v
orchestrator.ts: orchestrateTeardown()
  |
  +---> [parallel] app-teardown agent ---> simulator-bridge / emulator-bridge MCP
  +---> [parallel] web-teardown agent ---> Chrome MCP
  +---> [parallel] app-store-intel MCP queries
  |
  v (after all complete)
  +---> [sequential] ux-reviewer agent (if --ux-review)
  |
  v
report-assembler.ts: assembleTeardownReport()
  |
  v
Final report: docs/teardowns/competitive-teardown-{name}-{date}.md
```

## Next Steps

After generating the teardown, suggest:

- Share the executive summary with leadership via Slack or email.
- Feed the feature matrix gaps into PRD planning with `/pmcopilot:prd`.
- Use strategic recommendations to update roadmap priorities with `/pmcopilot:roadmap`.
- Run `/pmcopilot:prioritize` on the recommendations to determine sequencing.
- Schedule a follow-up teardown in 3-6 months to track competitor evolution.

## Graceful Degradation

This skill works best with simulators, emulators, and app-store-intel MCP connected but functions without them:

- **iOS Simulator unavailable**: The app-teardown agent skips iOS analysis. If Android is available, the teardown proceeds on Android only. If neither is available, the skill falls back to web-only and store data analysis.
- **Android Emulator unavailable**: The app-teardown agent skips Android analysis. If iOS is available, the teardown proceeds on iOS only.
- **Both simulators unavailable**: The app teardown section is marked "Data not available." The skill proceeds with web-teardown and app-store-intel data, producing a report covering web presence, store performance, and strategic analysis.
- **app-store-intel MCP unavailable**: App Store Performance (Section 5) uses data gathered by the web-teardown agent from public store pages, or the user is prompted to provide ratings and review data manually.
- All fallbacks prompt the user for manual input with clear instructions.
