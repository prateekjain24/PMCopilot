---
id: PMC-072
title: A/B Test Sample Size Calculator MCP Tool
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description

Implement the `sample_size_calc` tool in the pm-frameworks MCP server. This tool calculates the required sample size per variant for an A/B test, given a baseline conversion rate and the minimum detectable effect (MDE) the PM wants to be able to observe. This is essential for experiment planning so PMs can estimate how long a test needs to run based on their traffic.

The calculation uses the standard two-sample proportion z-test formula based on desired statistical significance (alpha) and power (1 - beta).

**Parameters:**
- `baseline_rate` (number) - Current baseline conversion rate (e.g., 0.05 for 5%)
- `mde` (number) - Minimum detectable effect as a relative change (e.g., 0.10 for a 10% relative lift, meaning baseline would move from 5% to 5.5%)
- `significance` (number, default: 0.95) - Desired confidence level (1 - alpha)
- `power` (number, default: 0.80) - Desired statistical power (1 - beta)

**Output:**
- Required sample size per variant
- Total sample size (both variants combined)
- The absolute effect size (baseline_rate * mde)
- The expected variant rate (baseline_rate + absolute effect)
- Summary of all input parameters used in the calculation

## Acceptance Criteria

- [ ] Tool registered as `sample_size_calc` in the pm-frameworks MCP server
- [ ] Accepts `baseline_rate`, `mde`, `significance` (default 0.95), and `power` (default 0.80)
- [ ] Validates that `baseline_rate` is between 0 and 1 (exclusive)
- [ ] Validates that `mde` is a positive number
- [ ] Validates that `significance` is between 0 and 1 (exclusive)
- [ ] Validates that `power` is between 0 and 1 (exclusive)
- [ ] Correctly computes required sample size per variant using the two-sample proportion z-test formula
- [ ] Returns sample size per variant, total sample size, absolute effect size, expected variant rate, and input parameter summary
- [ ] Defaults to significance=0.95 and power=0.80 when not provided
- [ ] Returns meaningful error messages for invalid inputs (rates outside valid range, negative MDE)
- [ ] Unit tests cover: standard calculation with defaults, custom significance/power, small vs large baseline rates, small vs large MDE values, and validation errors

## Files to Create/Modify

- `mcp-servers/pm-frameworks/src/tools/sample-size-calc.ts` - Tool implementation
- `mcp-servers/pm-frameworks/src/tools/sample-size-calc.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/index.ts` - Register the new tool
