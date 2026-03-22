---
id: PMC-061
title: Market Sizing Web Research Integration
phase: 3 - Web Teardown Engine
status: done
type: integration
estimate: 1
dependencies: [PMC-030, PMC-053]
---

## Description
Integrate web research capabilities into the existing market-sizing skill so that TAM/SAM/SOM estimates are grounded in real data rather than relying solely on user-provided inputs. This ticket connects two data sources: the Perplexity MCP for web research queries and the pm-frameworks MCP `tam_sam_som` tool for structured calculation.

The integration should implement a two-pass market sizing workflow:

1. **Data gathering via web research (Perplexity MCP)**: Automatically formulate and execute search queries to find market size reports, industry analyses, company revenue figures, user base estimates, and growth rates relevant to the target market. Extract structured data points from search results.

2. **Calculation via pm-frameworks MCP**: Feed the gathered data into the `tam_sam_som(total_market, serviceable_pct, obtainable_pct, methodology)` tool to produce structured estimates.

3. **Cross-validation**: Run both top-down (industry reports, analyst estimates) and bottom-up (unit economics, customer counts, pricing) approaches. Compare results and flag discrepancies exceeding a configurable threshold (default: 30%).

4. **Sensitivity analysis**: Vary key assumptions (market growth rate, serviceable percentage, obtainable percentage) across low/base/high scenarios to produce confidence ranges rather than point estimates.

The output should include the data sources used, assumptions made, both top-down and bottom-up estimates, the cross-validation delta, and the sensitivity range.

## Acceptance Criteria
- [ ] Web research module formulates market sizing queries from a product/market description (e.g., "global project management software market size 2025")
- [ ] Perplexity MCP integration retrieves and parses market data points (market size, growth rate, key players, segment breakdowns)
- [ ] Extracted data is passed to `tam_sam_som` tool with appropriate `methodology` parameter for both top-down and bottom-up runs
- [ ] Top-down estimate derives TAM from industry reports, SAM from segment filtering, SOM from realistic capture rate
- [ ] Bottom-up estimate derives TAM from unit economics extrapolation, SAM from addressable customer count, SOM from current traction
- [ ] Cross-validation compares top-down and bottom-up results and flags delta > 30% (configurable threshold)
- [ ] Sensitivity analysis produces low/base/high scenarios by varying serviceable_pct (+/- 20%) and obtainable_pct (+/- 30%)
- [ ] Output report includes: data sources with URLs, key assumptions, both estimates, cross-validation result, sensitivity ranges
- [ ] Graceful fallback when web research returns insufficient data (prompts user for manual inputs on missing fields)
- [ ] Integration tests mock Perplexity MCP and pm-frameworks MCP responses to verify end-to-end flow

## Files to Create/Modify
- `src/skills/market-sizing/web-research.ts` - Web research query formulation and data extraction
- `src/skills/market-sizing/cross-validation.ts` - Top-down vs bottom-up comparison and sensitivity analysis
- `src/skills/market-sizing/index.ts` - Update existing market-sizing skill to incorporate web research flow
- `src/skills/market-sizing/web-research.test.ts` - Tests for web research integration
- `src/skills/market-sizing/cross-validation.test.ts` - Tests for cross-validation and sensitivity analysis
