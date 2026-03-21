---
id: PMC-013
title: ICE Framework Reference
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-011]
---

## Description

Create the ICE framework reference document at `skills/prioritize/frameworks/ice.md`. ICE is a lightweight prioritization framework that scores features on three dimensions -- Impact, Confidence, and Ease -- each on a 1-10 scale. It is simpler and faster than RICE, making it ideal for early-stage prioritization, hackathon-style triage, or when detailed reach data is unavailable. This reference file is used by the prioritize skill to guide the assistant through ICE scoring with the correct formula, scale definitions, and usage guidance.

## Acceptance Criteria

- [ ] File created at `skills/prioritize/frameworks/ice.md`
- [ ] Contains the ICE formula: `Score = Impact x Confidence x Ease`
- [ ] Defines **Impact** scale (1-10) with guidance on what each end of the range represents (1 = negligible impact, 10 = transformative impact)
- [ ] Defines **Confidence** scale (1-10) with guidance on what drives confidence (data availability, prior experience, assumption risk)
- [ ] Defines **Ease** scale (1-10) with guidance on what each end represents (1 = extremely difficult/costly, 10 = trivial to implement)
- [ ] Contains a worked example calculation with at least two features scored and compared
- [ ] Contains **When to Use** guidance explaining ICE is best for rapid prioritization, early-stage products, or when quantitative reach data is unavailable
- [ ] Contains **Limitations** or caveats (e.g., subjectivity of 1-10 scales, lack of normalization, potential for score inflation)
- [ ] Formatting is clean markdown suitable for inclusion in skill output

## Files to Create/Modify

- `skills/prioritize/frameworks/ice.md`
