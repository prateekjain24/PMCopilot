---
id: PMC-018
title: Outcome-Based Roadmap Template
phase: 1 - Core Skills
status: todo
type: template
estimate: 1
dependencies: [PMC-016]
---

## Description

Create the outcome-based roadmap template at `skills/roadmap/templates/outcome-based.md`. This template structures the roadmap around desired business and user outcomes rather than features or timelines. It follows the hierarchy: Outcomes -> Key Results -> Initiatives -> Metrics. This format is ideal for teams practicing OKR-driven planning and want to ensure every initiative ties back to a measurable outcome.

## Acceptance Criteria

- [ ] `skills/roadmap/templates/outcome-based.md` exists
- [ ] Template defines the four-level hierarchy: Outcomes, Key Results, Initiatives, Metrics
- [ ] Outcome level includes fields for outcome name, description, and target state
- [ ] Key Results level includes fields for measurable results with baseline and target values
- [ ] Initiatives level includes fields for initiative name, owner, effort estimate, and status
- [ ] Metrics level includes fields for metric name, measurement method, current value, and target value
- [ ] Template shows the nesting relationship clearly (outcome contains key results, key results contain initiatives, initiatives have metrics)
- [ ] Template includes guidance on writing good outcomes (user/business-centric, not feature-centric)

## Files to Create/Modify

- `skills/roadmap/templates/outcome-based.md`
