---
id: PMC-069
title: Weighted Scoring MCP Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description

Implement the `weighted_score` tool in the pm-frameworks MCP server. This tool performs custom weighted scoring for feature prioritization, allowing PMs to define their own criteria and weights rather than relying on a fixed formula like RICE or ICE.

The tool accepts a list of features, a list of scoring criteria, and a corresponding list of weights. Each feature is scored 1-10 on every criterion. The tool multiplies each score by its criterion weight, sums the weighted scores across all criteria, and returns a ranked list of features.

**Parameters:**
- `features` (string[]) - List of feature names to evaluate
- `criteria` (string[]) - List of scoring criteria (e.g., "Strategic Alignment", "Revenue Impact", "Technical Feasibility")
- `weights` (number[]) - Weight for each criterion (must match criteria length); values are normalized to sum to 1.0 if they do not already
- `scores` (object) - Map of feature name to an object of criterion name to score (1-10)

**Calculation:**
For each feature: `Total = SUM(score_for_criterion_i * weight_i)` across all criteria.

**Output:** Ranked list of features with total weighted score, plus a breakdown table showing each feature's per-criterion scores and weighted contributions.

## Acceptance Criteria

- [ ] Tool registered as `weighted_score` in the pm-frameworks MCP server
- [ ] Accepts `features`, `criteria`, `weights`, and `scores` parameters
- [ ] Validates that `weights` array length matches `criteria` array length
- [ ] Validates that all scores are in the 1-10 range
- [ ] Normalizes weights to sum to 1.0 if they do not already
- [ ] Computes weighted score for each feature: `SUM(score_i * weight_i)`
- [ ] Returns features ranked by total weighted score (descending)
- [ ] Returns a breakdown table with per-criterion scores and weighted contributions for each feature
- [ ] Returns meaningful error messages for invalid inputs (mismatched array lengths, missing scores, out-of-range values)
- [ ] Unit tests cover: basic scoring, weight normalization, edge cases (single feature, single criterion), and validation errors

## Files to Create/Modify

- `mcp-servers/pm-frameworks/src/tools/weighted-score.ts` - Tool implementation
- `mcp-servers/pm-frameworks/src/tools/weighted-score.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/index.ts` - Register the new tool
