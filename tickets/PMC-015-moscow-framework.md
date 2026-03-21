---
id: PMC-015
title: MoSCoW Framework Reference
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-011]
---

## Description

Create the MoSCoW framework reference document at `skills/prioritize/frameworks/moscow.md`. MoSCoW is a categorical prioritization framework that sorts features into four buckets based on necessity and stakeholder agreement. It is widely used in Agile and timeboxed delivery contexts where the goal is to define a viable scope for a fixed timeline. This reference file is used by the prioritize skill to guide the assistant through MoSCoW classification, including category definitions, the effort allocation rule of thumb, and guidance on facilitating MoSCoW sessions.

## Acceptance Criteria

- [ ] File created at `skills/prioritize/frameworks/moscow.md`
- [ ] Defines all **4 MoSCoW categories** with clear descriptions:
  - **Must have** -- non-negotiable requirements; the release fails without these
  - **Should have** -- important but not critical; painful to leave out but the release is still viable
  - **Could have** -- desirable nice-to-haves; included if time and budget allow
  - **Won&apos;t have (this time)** -- explicitly out of scope for this iteration; may be reconsidered later
- [ ] Documents the **effort allocation rule of thumb**: Must = ~60% of total effort, Should = ~20%, Could = ~20%
- [ ] Contains guidance on how to facilitate a MoSCoW classification session (stakeholder alignment, definition of "Must" threshold, handling disagreements)
- [ ] Contains a brief example showing 6-8 features classified into the four categories
- [ ] Contains **When to Use** guidance explaining MoSCoW is best for timeboxed releases, stakeholder negotiation, and scope definition when effort is constrained
- [ ] Contains **Limitations** or caveats (e.g., "Must" category can become a dumping ground, requires strong facilitation, does not produce a numeric ranking)
- [ ] Formatting is clean markdown suitable for inclusion in skill output

## Files to Create/Modify

- `skills/prioritize/frameworks/moscow.md`
