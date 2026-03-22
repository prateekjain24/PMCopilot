---
id: PMC-068
title: TAM/SAM/SOM Calculation Tool
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description
Implement the TAM/SAM/SOM market sizing framework as an MCP tool within the pm-frameworks server. This tool provides the structured calculation engine that the market sizing skill (PMC-061) calls with web-researched data, but it also works standalone with manually provided inputs.

**Market sizing definitions:**
- **TAM (Total Addressable Market)**: The total revenue opportunity if you captured 100% of the market. Represents the upper bound.
- **SAM (Serviceable Addressable Market)**: The portion of TAM you can realistically target given your product scope, geography, customer segment, and go-to-market capabilities. Calculated as `TAM * serviceable_pct`.
- **SOM (Serviceable Obtainable Market)**: The portion of SAM you can realistically capture in the near term given competition, resources, and current traction. Calculated as `SAM * obtainable_pct`.

The `tam_sam_som` tool takes the total market value, serviceable percentage, obtainable percentage, and methodology label, then returns the three market size figures along with contextual analysis.

The tool should support multiple input formats:
1. **Direct values**: User provides TAM as a dollar amount, serviceable_pct as a decimal (0-1), obtainable_pct as a decimal (0-1)
2. **Breakdown inputs**: User provides segment-level data (e.g., number of potential customers, average revenue per customer) and the tool calculates TAM from those

The methodology parameter documents the approach used (e.g., "top-down from Gartner 2025 report" or "bottom-up from customer unit economics") and is included in the output for auditability.

## Acceptance Criteria
- [ ] `tam_sam_som` tool registered with parameters: `total_market` (number, required, in dollars), `serviceable_pct` (number 0-100, required), `obtainable_pct` (number 0-100, required), `methodology` (string, required)
- [ ] Core calculation: SAM = total_market * (serviceable_pct / 100), SOM = SAM * (obtainable_pct / 100)
- [ ] Returns: `{ tam: number, sam: number, som: number, methodology: string, formatted: { tam: string, sam: string, som: string }, ratios: { sam_to_tam: number, som_to_sam: number, som_to_tam: number }, summary: string }`
- [ ] Formatted values use human-readable currency strings (e.g., "$1.2B", "$450M", "$12.5M")
- [ ] Ratios expressed as percentages for easy interpretation
- [ ] Input validation: total_market > 0, serviceable_pct between 0-100, obtainable_pct between 0-100
- [ ] Sanity check warnings emitted (but not blocking) for unusual inputs: serviceable_pct > 80% ("unusually high serviceable percentage"), obtainable_pct > 30% ("aggressive obtainable estimate"), SOM < $10K ("very small obtainable market")
- [ ] Summary string provides a narrative explanation (e.g., "In a $5B total market, your serviceable market is $1.5B (30%). With a 5% capture rate, your obtainable market is $75M.")
- [ ] Methodology string is preserved verbatim in output for traceability
- [ ] Handles large numbers correctly (billions/trillions) without floating-point precision issues in formatted output
- [ ] Unit tests cover: standard calculation, edge cases (100% serviceable, 0% obtainable), sanity check warnings, formatting of various magnitudes ($1K through $1T), validation errors

## Files to Create/Modify
- `mcp-servers/pm-frameworks/src/tools/tam-sam-som.ts` - TAM/SAM/SOM tool implementation
- `mcp-servers/pm-frameworks/src/tools/tam-sam-som.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Register TAM/SAM/SOM tool in barrel export
