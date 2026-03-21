---
id: PMC-033
title: App Store Intelligence Skill
phase: 1 - Core Skills
status: todo
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the app store intelligence skill at `skills/app-store-intel/SKILL.md`. This skill provides competitive and market intelligence by analyzing app store data including ratings, reviews, version history, and sentiment trends. It helps PMs understand competitor positioning, user sentiment, and feature release cadence from public app store data.

The skill must use model `sonnet` and follows this process:

1. **Search** - Use the app-store-intel MCP to search for the target app(s) across iOS App Store and Google Play Store
2. **Pull Ratings and Reviews** - Retrieve overall ratings, rating distribution, recent reviews, and review volume trends
3. **Pull Version History** - Retrieve version/release notes history to understand feature release cadence and update patterns
4. **Sentiment Analysis** - Analyze recent reviews to determine sentiment distribution (positive, neutral, negative) and extract common praise/complaint themes
5. **Theme Extraction** - Cluster review content into themes (e.g., performance, UX, pricing, missing features, bugs) with frequency and sentiment per theme
6. **Version Cadence Analysis** - Analyze release frequency, time between major vs. minor updates, and correlate releases with rating changes

Allowed tools: `Read`, `Write`, `Bash`, `app-store-intel MCP` (wildcard - all tools from this MCP server).

## Acceptance Criteria

- [ ] `skills/app-store-intel/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `sonnet`
- [ ] Allowed tools include `Read`, `Write`, `Bash`, and all tools from the `app-store-intel` MCP (wildcard pattern)
- [ ] Skill instructions describe the full process: search, pull ratings/reviews, pull versions, sentiment analysis, theme extraction, cadence analysis
- [ ] Skill prompts the user for target app name(s) and optional competitor app names for comparison
- [ ] Skill supports single-app deep dive and multi-app comparison modes
- [ ] Output includes: app overview, rating summary, sentiment breakdown, top themes with examples, version cadence timeline, and competitive comparison table (if multiple apps)
- [ ] Skill handles apps not found in store gracefully with suggestions for alternative search terms
- [ ] Skill includes guidance on interpreting sentiment trends and what actions to take based on findings

## Files to Create/Modify

- `skills/app-store-intel/SKILL.md`
