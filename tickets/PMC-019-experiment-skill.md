---
id: PMC-019
title: Experiment Design Skill Definition
phase: 1 - Core Skills
status: todo
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Create the experiment design skill definition file at `skills/experiment-design/SKILL.md`. This skill guides PMs through designing rigorous A/B tests and experiments. It covers the full experiment lifecycle from hypothesis formulation through rollout planning.

The skill must reference the `pm-frameworks` MCP `sample_size_calc` tool for statistical sample size calculations. The frontmatter must specify `model: sonnet`.

The skill should produce the following output structure for any experiment:
- Hypothesis (structured format)
- Variants (control + treatment descriptions)
- Metrics: primary, secondary, and guardrail
- Sample size (calculated via `pm-frameworks` MCP `sample_size_calc`)
- Duration estimate
- Segmentation plan
- Rollout plan (phased rollout with go/no-go criteria)

## Acceptance Criteria

- [ ] `skills/experiment-design/SKILL.md` exists with valid YAML frontmatter
- [ ] Frontmatter specifies `model: sonnet`
- [ ] Skill references `pm-frameworks` MCP `sample_size_calc` tool for sample size calculations
- [ ] Skill defines the full experiment output structure: hypothesis, variants, primary/secondary/guardrail metrics, sample size, duration, segmentation, rollout plan
- [ ] Skill includes guidance on formulating testable hypotheses
- [ ] Skill includes guidance on selecting appropriate metrics (primary for decision-making, secondary for learning, guardrail for safety)
- [ ] Skill references the template files in `skills/experiment-design/templates/`

## Files to Create/Modify

- `skills/experiment-design/SKILL.md`
