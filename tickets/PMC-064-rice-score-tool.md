---
id: PMC-064
title: RICE Score Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description
Implement the RICE prioritization framework as two MCP tools within the pm-frameworks server: `rice_score` for scoring a single feature and `rice_batch` for scoring multiple features at once with ranked output.

RICE is a prioritization framework developed by Intercom. The formula is:

**RICE Score = (Reach x Impact x Confidence) / Effort**

Where:
- **Reach**: Number of people/events per time period (positive integer). Example: "500 customers per quarter"
- **Impact**: Estimated impact per person. Scale: 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
- **Confidence**: Percentage expressing certainty in estimates. Typical values: 100% (high), 80% (medium), 50% (low). Accepted range: 0-100, stored as decimal (0-1) for calculation
- **Effort**: Person-months of work required (positive number). Example: "2" = 2 person-months

`rice_score` takes individual parameters and returns the computed score along with the input values and a human-readable summary.

`rice_batch` takes an array of features (each with name + RICE parameters), computes scores for all, and returns a ranked list sorted by RICE score descending. It should also include summary statistics (mean, median, min, max scores) and highlight the top recommendation.

## Acceptance Criteria
- [ ] `rice_score` tool registered in pm-frameworks MCP server with parameters: `reach` (number, required), `impact` (number, required), `confidence` (number 0-100, required), `effort` (number, required)
- [ ] `rice_score` returns: `{ score: number, reach: number, impact: number, confidence: number, effort: number, summary: string }`
- [ ] RICE formula correctly implemented: `(reach * impact * (confidence / 100)) / effort`
- [ ] Input validation: reach >= 0, impact in [0.25, 0.5, 1, 2, 3] (with warning for non-standard values but still accepted), confidence 0-100, effort > 0
- [ ] Division by zero guarded: effort of 0 returns an error
- [ ] `rice_batch` tool registered with parameter: `features` (array of `{ name: string, reach: number, impact: number, confidence: number, effort: number }`)
- [ ] `rice_batch` returns features sorted by score descending with rank numbers
- [ ] `rice_batch` includes summary stats: mean score, median score, highest scoring feature, lowest scoring feature
- [ ] Human-readable summary string explains the score in plain English (e.g., "RICE score of 150: High priority. Reaches 500 users with high impact at 80% confidence for 2 person-months of effort.")
- [ ] Tool descriptions in MCP registration include clear parameter documentation and example usage
- [ ] Unit tests cover: standard calculation, edge cases (minimal impact, low confidence), batch sorting, validation errors

## Files to Create/Modify
- `mcp-servers/pm-frameworks/src/tools/rice.ts` - RICE score and batch tool implementations
- `mcp-servers/pm-frameworks/src/tools/rice.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Register RICE tools in barrel export
