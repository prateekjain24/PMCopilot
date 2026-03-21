---
id: PMC-028
title: Launch Checklist Skill
phase: 1 - Core Skills
status: todo
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the launch checklist skill at `skills/launch-checklist/SKILL.md`. This skill generates comprehensive, type-appropriate launch readiness checklists that ensure nothing falls through the cracks across all functional areas. PMs specify the launch type and the skill produces a tailored checklist with the right level of rigor.

The skill must use model `sonnet` and support three launch types: **soft**, **hard**, and **beta**. Each type adjusts the checklist depth and required sign-offs (e.g., a beta launch may skip marketing and legal sections, while a hard launch requires full coverage).

The checklist covers the following categories:
1. **Engineering Readiness** - Code complete, feature flags, load testing, rollback plan
2. **QA** - Test plans executed, regression pass, known issues documented
3. **Design Sign-off** - Visual QA, accessibility review, design-dev parity
4. **Analytics** - Event tracking implemented, dashboards configured, success metrics defined
5. **Marketing** - Launch comms, blog posts, social assets, press coordination
6. **Support** - Help articles, runbooks, support team briefed, escalation paths
7. **Legal/Compliance** - Privacy review, ToS updates, regulatory checks
8. **Rollout Plan** - Phased rollout percentages, geographic targeting, kill switch
9. **Post-Launch** - Monitoring plan, war room schedule, retrospective date, success criteria review

## Acceptance Criteria

- [ ] `skills/launch-checklist/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `sonnet`
- [ ] Skill declares three supported launch types: `soft`, `hard`, `beta`
- [ ] All nine checklist categories are defined with specific line items per category
- [ ] Each launch type maps to a subset of categories (hard = all, soft = reduced, beta = minimal)
- [ ] Skill prompts the user for launch type, product name, and target date
- [ ] Skill outputs a structured checklist with checkboxes, owners, and due dates
- [ ] Skill includes guidance on how to customize categories for specific teams or products

## Files to Create/Modify

- `skills/launch-checklist/SKILL.md`
