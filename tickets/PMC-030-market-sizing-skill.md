---
id: PMC-030
title: Market Sizing Skill
phase: 1 - Core Skills
status: todo
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the market sizing skill at `skills/market-sizing/SKILL.md`. This is a research-intensive skill that produces rigorous, defensible market size estimates using both top-down and bottom-up methodologies, then cross-validates the results. It is designed for investment cases, business cases, and strategic planning.

The skill must use model `opus` (due to the analytical complexity) and follows this process:

1. **Web Research** - Use WebSearch and Perplexity MCP to gather industry reports, market data, competitor revenue estimates, and analyst projections
2. **Top-Down Analysis (TAM/SAM/SOM)** - Start from total market size, apply filters for serviceable segment, then estimate obtainable share based on competitive positioning
3. **Bottom-Up Analysis** - Calculate from number of potential customers x average revenue per user (ARPU) x realistic penetration rate
4. **Cross-Validation** - Compare top-down and bottom-up estimates, identify and explain discrepancies, triangulate to a confidence range
5. **Framework Application** - Use the `pm-frameworks` MCP `tam_sam_som` tool to structure the final output

Allowed tools: `Read`, `Write`, `Bash`, `WebSearch`, `Perplexity MCP`.

## Acceptance Criteria

- [ ] `skills/market-sizing/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `opus`
- [ ] Allowed tools list includes `Read`, `Write`, `Bash`, `WebSearch`, `Perplexity MCP`
- [ ] Skill instructions describe the five-step process: web research, top-down, bottom-up, cross-validation, framework application
- [ ] Skill prompts the user for market definition, geography, time horizon, and any known data points
- [ ] Skill instructs the model to cite all data sources with URLs and dates
- [ ] Skill includes guidance on expressing confidence ranges (low/mid/high) rather than single-point estimates
- [ ] Skill references the `pm-frameworks` MCP `tam_sam_som` tool for structured output
- [ ] Skill handles scenarios where web research yields limited data (falls back to assumption-based modeling with clear disclaimers)

## Files to Create/Modify

- `skills/market-sizing/SKILL.md`
