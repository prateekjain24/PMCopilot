---
id: PMC-020
title: A/B Test Plan Template
phase: 1 - Core Skills
status: done
type: template
estimate: 1
dependencies: [PMC-019]
---

## Description

Create the A/B test plan template at `skills/experiment-design/templates/ab-test-plan.md`. This template provides a comprehensive, fill-in-the-blanks document for planning and documenting an A/B test. It should be usable both as a planning tool before launch and as a record of decisions after the experiment concludes.

The template must include the structured hypothesis format: "If we [change], then [metric] will [direction] by [amount] because [rationale]".

## Acceptance Criteria

- [ ] `skills/experiment-design/templates/ab-test-plan.md` exists
- [ ] Template includes experiment metadata: experiment name, owner, start date, end date
- [ ] Template includes the structured hypothesis format: "If we [change], then [metric] will [direction] by [amount] because [rationale]"
- [ ] Template includes a variants section with fields for control and one or more treatment variants, each with a description
- [ ] Template includes a metrics section with three categories: primary metric, secondary metrics, and guardrail metrics
- [ ] Template includes a sample size calculation section with fields for baseline rate, minimum detectable effect, significance level, and power
- [ ] Template includes a segmentation section defining the target population and any exclusion criteria
- [ ] Template includes a decision framework section defining success criteria, expected duration, and what actions to take for win/loss/inconclusive outcomes
- [ ] Template includes a rollout plan section with phased rollout percentages and go/no-go checkpoints

## Files to Create/Modify

- `skills/experiment-design/templates/ab-test-plan.md`
