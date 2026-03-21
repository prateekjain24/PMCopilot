---
id: PMC-070
title: Opportunity Score (ODI) MCP Tool
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description

Implement the `opportunity_score` tool in the pm-frameworks MCP server. This tool calculates opportunity scores based on the Outcome-Driven Innovation (ODI) methodology developed by Tony Ulwick. ODI identifies underserved customer needs by comparing how important a job outcome is versus how satisfied customers currently are with existing solutions.

**Formula:** `Opportunity Score = Importance + max(Importance - Satisfaction, 0)`

This formula emphasizes outcomes where importance is high and satisfaction is low. Scores above 15 indicate significantly underserved needs (strong opportunities), scores between 12-15 indicate moderate opportunities, and scores below 12 indicate adequately served or overserved needs.

**Parameters:**
- `features` (object[]) - Array of feature/outcome objects, each containing:
  - `name` (string) - Feature or job outcome name
  - `importance` (number) - Importance rating (1-10 scale)
  - `satisfaction` (number) - Current satisfaction rating (1-10 scale)

**Output:** Ranked list of features by opportunity score, including importance, satisfaction, the gap (importance - satisfaction), the calculated opportunity score, and a classification label (underserved / appropriately served / overserved).

## Acceptance Criteria

- [ ] Tool registered as `opportunity_score` in the pm-frameworks MCP server
- [ ] Accepts `features` array with `name`, `importance`, and `satisfaction` for each entry
- [ ] Validates that importance and satisfaction values are in the 1-10 range
- [ ] Correctly applies ODI formula: `Importance + max(Importance - Satisfaction, 0)`
- [ ] Returns features ranked by opportunity score (descending)
- [ ] Classifies each feature: "underserved" (score > 15), "appropriately served" (12-15), "overserved" (< 12)
- [ ] Returns importance, satisfaction, gap, opportunity score, and classification for each feature
- [ ] Handles edge case where satisfaction exceeds importance (gap clamped to 0)
- [ ] Returns meaningful error messages for invalid inputs
- [ ] Unit tests cover: standard scoring, overserved features (satisfaction > importance), boundary values, and validation errors

## Files to Create/Modify

- `mcp-servers/pm-frameworks/src/tools/opportunity-score.ts` - Tool implementation
- `mcp-servers/pm-frameworks/src/tools/opportunity-score.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/index.ts` - Register the new tool
