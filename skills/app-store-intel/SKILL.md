---
name: app-store-intel
description: >
  Gather app store intelligence for any iOS or Android app. Pull ratings,
  reviews, version history, and sentiment analysis. Supports single-app
  deep dives and multi-app competitive comparisons.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - mcp__app-store-intel__*
---

# App Store Intelligence

You are a PM researcher extracting actionable intelligence from app store data. Your job is to analyze an app (or compare multiple apps) across ratings, reviews, version history, and user sentiment.

## Input

Target app: $ARGUMENTS[0] (app name or bundle ID)
Comparison: Parse `--compare` flag for a comma-separated list of competitor app names. If provided, run in multi-app comparison mode.

## Process

### Step 1 -- Search

Use `mcp__app-store-intel__*` tools to locate the target app(s) on both the iOS App Store and Google Play Store.

- Search by app name. If multiple results are returned, present the top matches and ask the user to confirm the correct one.
- Capture: app ID, bundle ID, developer name, category, current version, and store URLs.

**Fallback**: If an app cannot be found on one platform, proceed with the platform where it is available and note the gap. If the app is not found on either platform, suggest alternative search terms and ask the user to clarify.

### Step 2 -- Pull Ratings and Reviews

For each target app, retrieve:

- **Overall rating** on each platform (iOS and Android).
- **Rating distribution**: breakdown by star level (5, 4, 3, 2, 1) with counts and percentages.
- **Recent reviews**: the most recent 50-100 reviews, including review text, rating, date, and region where available.
- **Volume trends**: review volume per month over the last 6-12 months to identify spikes or drops in user feedback activity.

### Step 3 -- Pull Version History

Retrieve the release history for each app:

- **Release notes** for the last 10-20 versions.
- **Release dates** to calculate update frequency.
- **Feature cadence**: categorize each release as major (new features, redesigns), minor (improvements, optimizations), or patch (bug fixes, stability).
- **Update patterns**: identify whether the app follows a regular release schedule or ships ad hoc.

### Step 4 -- Sentiment Analysis

Analyze the recent reviews collected in Step 2:

- Classify each review as **positive**, **neutral**, or **negative** based on both star rating and text content.
- Calculate the overall sentiment breakdown as percentages.
- Identify sentiment trend over time -- is sentiment improving, declining, or stable compared to 3-6 months ago?
- Flag any sudden sentiment shifts and correlate with specific app versions or events.

### Step 5 -- Theme Extraction

Cluster the reviews into recurring themes:

- **Performance**: speed, crashes, battery drain, loading times.
- **UX and Design**: navigation, layout, visual design, accessibility.
- **Pricing**: cost complaints, subscription value, free-vs-paid feature gating.
- **Features**: specific feature requests, missing functionality, feature appreciation.
- **Bugs**: specific bugs reported by multiple users.
- **Customer Support**: response quality, resolution time, communication.

For each theme:
- Count the number of reviews mentioning it.
- Determine the average sentiment within the theme.
- Pull 2-3 representative quotes (verbatim from reviews).

### Step 6 -- Version Cadence Analysis

Synthesize the version history into a cadence profile:

- **Release frequency**: average days between releases, separately for major and minor releases.
- **Major vs. minor ratio**: proportion of releases that introduce new features vs. fixes.
- **Rating correlation**: plot whether major releases correlate with rating improvements or drops.
- **Momentum indicator**: is the app shipping faster, slower, or at a steady pace compared to 6-12 months ago?

## Output

Generate a structured report with the following sections:

### App Overview
Basic metadata: name, developer, category, platforms, current version, last updated, download count (if available).

### Rating Summary
| Platform | Rating | Total Reviews | 5-star | 4-star | 3-star | 2-star | 1-star |
|----------|--------|---------------|--------|--------|--------|--------|--------|

### Sentiment Breakdown
| Sentiment | Percentage | Trend |
|-----------|-----------|-------|
| Positive | ... | ... |
| Neutral | ... | ... |
| Negative | ... | ... |

### Top Themes
| Theme | Mentions | Avg Sentiment | Example Quote |
|-------|----------|---------------|---------------|

### Version Cadence Timeline
Table or timeline showing major and minor releases over the last 12 months with brief descriptions.

### Competitive Comparison Table (if multi-app mode)
| Dimension | App A | App B | App C |
|-----------|-------|-------|-------|
| Overall Rating (iOS) | ... | ... | ... |
| Overall Rating (Android) | ... | ... | ... |
| Review Volume (monthly avg) | ... | ... | ... |
| Release Frequency | ... | ... | ... |
| Top Positive Theme | ... | ... | ... |
| Top Negative Theme | ... | ... | ... |
| Sentiment Trend | ... | ... | ... |

Save the report to:

```
docs/app-store-intel/{app-name}-{YYYY-MM-DD}.md
```

Create the `docs/app-store-intel/` directory if it does not exist.

## Next Steps

After generating the report, suggest:

- Feed app store insights into a competitive teardown with `/pmcopilot:competitive-teardown`.
- Use user sentiment themes to inform PRD requirements with `/pmcopilot:prd`.
- Design experiments to address top negative themes with `/pmcopilot:experiment`.
- Track whether future releases improve sentiment using a follow-up run of this skill.

## Graceful Degradation

This skill works best with the app-store-intel MCP server connected but functions without it:

- **app-store-intel MCP unavailable**: The skill prompts the user to provide app metadata, ratings, and reviews manually. The user can paste data from App Store or Google Play web pages, or provide a CSV export.
- **App not found on one platform**: Analysis proceeds with the platform where the app is available. The missing platform is noted in the report with a clear gap marker.
- All fallbacks prompt the user for manual input with clear instructions.
