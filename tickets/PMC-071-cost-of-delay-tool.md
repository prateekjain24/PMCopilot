---
id: PMC-071
title: Cost of Delay (CD3) MCP Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description

Implement the `cost_of_delay` tool in the pm-frameworks MCP server. This tool calculates Cost of Delay Divided by Duration (CD3), a scheduling prioritization method that helps PMs decide which features to build first based on the economic cost of not having them versus how long they take to deliver.

**Formula:** `CD3 = Cost of Delay per week / Job Duration in weeks`

The Cost of Delay is the sum of multiple delay cost components:
- **Revenue lost** - Direct revenue impact per week of delay
- **Churn risk** - Estimated customer loss value per week
- **Competitive erosion** - Market share or positioning cost per week
- **Regulatory risk** - Compliance penalty or blocked-market cost per week

Features with the highest CD3 should be scheduled first (Weighted Shortest Job First).

**Parameters:**
- `features` (object[]) - Array of feature objects, each containing:
  - `name` (string) - Feature name
  - `delay_cost` (object) - Breakdown of cost of delay per week:
    - `revenue_lost` (number) - Revenue impact per week (default: 0)
    - `churn_risk` (number) - Churn cost per week (default: 0)
    - `competitive_erosion` (number) - Competitive cost per week (default: 0)
    - `regulatory_risk` (number) - Regulatory cost per week (default: 0)
  - `duration` (number) - Job duration in weeks

**Output:** Ranked list of features by CD3 score (descending), including the total cost of delay, the cost breakdown, duration, and CD3 score for each feature.

## Acceptance Criteria

- [ ] Tool registered as `cost_of_delay` in the pm-frameworks MCP server
- [ ] Accepts `features` array with `name`, `delay_cost` (containing `revenue_lost`, `churn_risk`, `competitive_erosion`, `regulatory_risk`), and `duration`
- [ ] Computes total Cost of Delay as sum of all four delay cost components
- [ ] Computes CD3 as `total_cost_of_delay / duration`
- [ ] Defaults each delay cost component to 0 if not provided
- [ ] Validates that duration is a positive number (> 0)
- [ ] Returns features ranked by CD3 score (descending, Weighted Shortest Job First)
- [ ] Returns total cost of delay, individual cost breakdown, duration, and CD3 score per feature
- [ ] Returns meaningful error messages for invalid inputs (zero/negative duration, negative costs)
- [ ] Unit tests cover: standard CD3 calculation, partial delay cost components, edge cases (very short duration, single component), and validation errors

## Files to Create/Modify

- `mcp-servers/pm-frameworks/src/tools/cost-of-delay.ts` - Tool implementation
- `mcp-servers/pm-frameworks/src/tools/cost-of-delay.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/index.ts` - Register the new tool
