---
id: PMC-093
title: Competitive teardown integration
phase: 4 - App Teardown Engine
status: done
type: integration
estimate: 1
dependencies: [PMC-035, PMC-091, PMC-053, PMC-038]
---

## Description

Wire the flagship competitive teardown skill to orchestrate the full teardown pipeline. This integration connects the app-teardown agent (PMC-091), web-teardown capabilities (PMC-053), app-store-intel MCP (PMC-038 context), and the research-synthesizer (PMC-035) into a single unified workflow that a PM can trigger with one command.

**Orchestration flow:**

1. PM provides a competitor app identifier (app store URL, package name, or app name) and optionally a list of focus areas
2. The skill resolves the app across both stores using app-store-intel search tools
3. Three parallel workstreams are launched:
   - **App teardown**: app-teardown agent installs and explores the Android app (PMC-091)
   - **Web teardown**: web-teardown scrapes the competitor&apos;s marketing site, docs, and changelog (PMC-053)
   - **Store intelligence**: app-store-intel gathers reviews, ratings, version history, similar apps, and category rankings (PMC-038 context)
4. Once all three complete, results are fed to the research-synthesizer (PMC-035) which produces a unified competitive teardown report
5. The UX reviewer agent (PMC-092) optionally runs on the app teardown output to add a UX score and recommendations

**Unified report structure:**
- Executive summary
- App overview (metadata, store presence, rating trends)
- Product teardown (screens, flows, features, navigation map)
- UX assessment (score, heuristic analysis, accessibility)
- Market positioning (category rank, similar apps, review sentiment)
- Web presence analysis (marketing, docs, messaging)
- Strengths and weaknesses
- Strategic recommendations

## Acceptance Criteria

- [ ] Skill definition accepts competitor identifier (app URL, package name, or app name) as input
- [ ] Skill resolves the app across App Store and Play Store using search tools
- [ ] App teardown, web teardown, and store intelligence run in parallel
- [ ] Parallel execution uses research-synthesizer orchestration pattern from PMC-035
- [ ] Results from all three workstreams are collected and merged
- [ ] Unified competitive teardown report is generated with all sections listed above
- [ ] UX reviewer agent runs as an optional post-processing step on app teardown output
- [ ] Report includes embedded screenshot references from the app teardown
- [ ] Report includes review sentiment analysis and rating trends from store intelligence
- [ ] Skill handles partial failures gracefully (e.g. app only on one store, web teardown timeout)
- [ ] Report clearly indicates which sections had data and which were unavailable
- [ ] End-to-end test with mocked agent/MCP outputs verifies orchestration and report assembly
- [ ] Skill is registered and discoverable in the PMCopilot skill registry

## Files to Create/Modify

- `skills/competitive-teardown/index.ts`
- `skills/competitive-teardown/orchestrator.ts`
- `skills/competitive-teardown/report-assembler.ts`
- `skills/competitive-teardown/templates/competitive-teardown-report.md`
- `skills/competitive-teardown/tests/orchestrator.test.ts`
- `skills/competitive-teardown/tests/report-assembler.test.ts`
