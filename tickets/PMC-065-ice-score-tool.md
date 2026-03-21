---
id: PMC-065
title: ICE Score Tool
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-063]
---

## Description
Implement the ICE scoring framework as an MCP tool within the pm-frameworks server. ICE is a lightweight prioritization method that scores ideas on three dimensions, all on a 1-10 scale.

**ICE Score = Impact x Confidence x Ease**

Where:
- **Impact**: How much will this idea improve the target metric? Scale 1-10 where 1 = negligible improvement and 10 = transformative improvement
- **Confidence**: How confident are we in our impact and ease estimates? Scale 1-10 where 1 = pure speculation and 10 = data-backed certainty
- **Ease**: How easy is this to implement? Scale 1-10 where 1 = extremely difficult (months of work, many dependencies) and 10 = trivial (can be done in hours)

ICE is simpler than RICE and best suited for quick triage when rough prioritization is sufficient. The tool should make this clear in its description and provide guidance on when to use ICE vs RICE (ICE for early-stage ideation and quick sorting; RICE for more rigorous prioritization with specific reach data).

The tool should return the score along with a qualitative tier: scores 700-1000 = "High Priority", 400-699 = "Medium Priority", 100-399 = "Low Priority", below 100 = "Deprioritize".

## Acceptance Criteria
- [ ] `ice_score` tool registered in pm-frameworks MCP server with parameters: `impact` (number 1-10, required), `confidence` (number 1-10, required), `ease` (number 1-10, required)
- [ ] ICE formula correctly implemented: `impact * confidence * ease`
- [ ] All three parameters validated to be integers in the 1-10 range; non-integer values rounded with a warning
- [ ] Result includes: `{ score: number, impact: number, confidence: number, ease: number, tier: string, summary: string }`
- [ ] Tier classification: 700-1000 "High Priority", 400-699 "Medium Priority", 100-399 "Low Priority", 1-99 "Deprioritize"
- [ ] Human-readable summary string (e.g., "ICE score of 480 (Medium Priority): Impact 8/10, Confidence 6/10, Ease 10/10")
- [ ] Tool description in MCP registration includes parameter scale definitions and guidance on ICE vs RICE usage
- [ ] Handles edge cases: all 10s (max score 1000), all 1s (min score 1), mixed extremes
- [ ] Unit tests cover: standard scoring, tier boundaries (99 vs 100, 399 vs 400, 699 vs 700), validation errors, rounding behavior

## Files to Create/Modify
- `mcp-servers/pm-frameworks/src/tools/ice.ts` - ICE score tool implementation
- `mcp-servers/pm-frameworks/src/tools/ice.test.ts` - Unit tests
- `mcp-servers/pm-frameworks/src/tools/index.ts` - Register ICE tool in barrel export
