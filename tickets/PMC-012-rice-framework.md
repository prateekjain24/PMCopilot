---
id: PMC-012
title: RICE Framework Reference
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-011]
---

## Description

Create the RICE framework reference document at `skills/prioritize/frameworks/rice.md`. RICE is a quantitative prioritization framework developed by Intercom that scores features by Reach, Impact, Confidence, and Effort. This reference file is used by the prioritize skill to guide the assistant through RICE scoring with the correct formula, parameter definitions, scales, and calculation methodology. It should also include an example calculation and guidance on when RICE is the right framework to use.

## Acceptance Criteria

- [ ] File created at `skills/prioritize/frameworks/rice.md`
- [ ] Contains the RICE formula: `Score = (Reach x Impact x Confidence) / Effort`
- [ ] Defines **Reach** parameter: number of users/customers affected per quarter, with guidance on how to estimate
- [ ] Defines **Impact** parameter with its discrete scale: 0.25 (Minimal), 0.5 (Low), 1 (Medium), 2 (High), 3 (Massive)
- [ ] Defines **Confidence** parameter with its percentage scale: 50% (Low), 80% (Medium), 100% (High), with guidance on what drives confidence level
- [ ] Defines **Effort** parameter: person-months of work, with guidance on including design, engineering, and QA
- [ ] Contains a worked example calculation with realistic values showing how to compute a RICE score end-to-end
- [ ] Contains **When to Use** guidance explaining that RICE is best for comparing features with measurable reach and when effort estimation is feasible
- [ ] Contains **Limitations** or caveats (e.g., bias toward high-reach features, difficulty estimating reach for new products)
- [ ] Formatting is clean markdown suitable for inclusion in skill output

## Files to Create/Modify

- `skills/prioritize/frameworks/rice.md`
