---
id: PMC-073
title: A/B Test Significance Test MCP Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description

Implement the `significance_test` tool in the pm-frameworks MCP server. This tool evaluates the results of an A/B test to determine whether the observed difference between control and variant is statistically significant. PMs use this after collecting experiment data to make a ship/no-ship decision with statistical rigor.

The tool performs a two-proportion z-test comparing the control and variant conversion rates, returning the p-value, whether the result is statistically significant, the confidence interval for the difference, and the observed relative lift.

**Parameters:**
- `control_visitors` (number) - Number of visitors in the control group
- `control_conversions` (number) - Number of conversions in the control group
- `variant_visitors` (number) - Number of visitors in the variant group
- `variant_conversions` (number) - Number of conversions in the variant group
- `significance_level` (number, default: 0.05) - Alpha threshold for significance

**Output:**
- Control conversion rate
- Variant conversion rate
- Relative lift (percentage change from control to variant)
- p-value from the two-proportion z-test
- `significant` boolean (true if p-value < significance_level)
- Confidence interval for the difference in conversion rates
- Plain-language interpretation of the result

## Acceptance Criteria

- [ ] Tool registered as `significance_test` in the pm-frameworks MCP server
- [ ] Accepts `control_visitors`, `control_conversions`, `variant_visitors`, `variant_conversions`, and optional `significance_level` (default 0.05)
- [ ] Validates that conversions do not exceed visitors for either group
- [ ] Validates that all counts are positive integers
- [ ] Computes conversion rates for both groups
- [ ] Performs a two-proportion z-test and returns the p-value
- [ ] Returns `significant: true` when p-value < significance_level, `false` otherwise
- [ ] Computes and returns the relative lift as a percentage
- [ ] Computes and returns the 95% confidence interval for the difference in proportions
- [ ] Returns a plain-language interpretation (e.g., "The variant shows a statistically significant 12.3% lift over control with 95% confidence")
- [ ] Returns meaningful error messages for invalid inputs (negative counts, conversions > visitors)
- [ ] Unit tests cover: significant result, non-significant result, edge cases (zero conversions, identical rates), custom significance level, and validation errors

## Files to Create/Modify

- `mcp-servers/pm-frameworks/src/tools/significance-test.ts` - Tool implementation
- `mcp-servers/pm-frameworks/src/tools/significance-test.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/index.ts` - Register the new tool
