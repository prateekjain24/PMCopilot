---
id: PMC-031
title: TAM/SAM/SOM Template
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-030]
---

## Description

Create the TAM/SAM/SOM template used by the market sizing skill. This template structures the market sizing output into a clear, presentation-ready format that stakeholders and investors can quickly parse. It must support both the top-down and bottom-up methodologies and show how they converge.

The template must include the following sections:

1. **Total Addressable Market (TAM)** - The total market demand for the product/service category, expressed as annual revenue. Includes geographic scope, market definition, and data sources.
2. **Serviceable Addressable Market (SAM)** - The portion of TAM reachable given the company&apos;s business model, geography, and go-to-market. Expressed as a percentage of TAM with rationale for each filter applied.
3. **Serviceable Obtainable Market (SOM)** - The realistic near-term capture based on competitive positioning, current traction, and execution capacity. Expressed as a percentage of SAM with supporting assumptions.
4. **Methodology** - Options for top-down (industry reports, analyst data), bottom-up (customers x ARPU x penetration), and analogous market comparisons. Each methodology includes its assumptions, data sources, and confidence level.

## Acceptance Criteria

- [ ] Template file exists at the designated path within the market-sizing skill directory
- [ ] Template contains all four required sections: TAM, SAM, SOM, Methodology
- [ ] TAM section includes fields for total market value, geography, time horizon, growth rate (CAGR), and data sources
- [ ] SAM section includes fields for serviceable percentage, filtering criteria applied, and resulting market value
- [ ] SOM section includes fields for obtainable percentage, competitive assumptions, timeline to achieve, and resulting market value
- [ ] Methodology section supports top-down, bottom-up, and analogous approaches with structured fields for each
- [ ] Template includes a cross-validation summary comparing top-down vs. bottom-up estimates with variance analysis
- [ ] Template includes a confidence range indicator (low/mid/high) for each market tier
- [ ] Template includes a sources table for all referenced data points
- [ ] Template is referenced correctly from the market-sizing SKILL.md

## Files to Create/Modify

- `skills/market-sizing/templates/tam-sam-som.md`
