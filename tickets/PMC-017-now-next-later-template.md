---
id: PMC-017
title: Now/Next/Later Roadmap Template
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-016]
---

## Description

Create the Now/Next/Later roadmap template at `skills/roadmap/templates/now-next-later.md`. This template structures roadmap items into three time-horizon buckets, each with distinct confidence levels and commitment states. It is the most commonly used lightweight roadmap format and is ideal for communicating priorities without committing to fixed dates.

The template must clearly define the semantics of each column:
- **Now** = this quarter, high confidence, committed work
- **Next** = next quarter, medium confidence, planned work
- **Later** = 2+ quarters out, low confidence, exploratory work

## Acceptance Criteria

- [ ] `skills/roadmap/templates/now-next-later.md` exists
- [ ] Template has three clearly labeled columns/sections: Now, Next, Later
- [ ] Each column includes its confidence level (high/medium/low)
- [ ] Each column includes its commitment state (committed/planned/exploratory)
- [ ] Each column includes its time horizon (this quarter/next quarter/2+ quarters)
- [ ] Guidance is provided for what belongs in each bucket (criteria for placement)
- [ ] Template includes placeholder rows for roadmap items with fields for initiative name, owner, and objective
- [ ] Template includes instructions or tips for maintaining and reviewing the roadmap

## Files to Create/Modify

- `skills/roadmap/templates/now-next-later.md`
