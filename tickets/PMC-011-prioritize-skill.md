---
id: PMC-011
title: Prioritize Skill Definition
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Create the prioritize skill at `skills/prioritize/SKILL.md` with full YAML frontmatter. This skill enables PMs to score and rank features or initiatives using industry-standard prioritization frameworks. It must support six frameworks: RICE, ICE, MoSCoW, Kano, Weighted Scoring, and Cost of Delay (CoD). The skill should accept feature lists via manual input (user provides items inline) and optionally pull items from Jira via MCP. The SKILL.md frontmatter defines the skill metadata, allowed tools, model selection, and instructions for how the assistant should guide the PM through prioritization.

## Acceptance Criteria

- [ ] File created at `skills/prioritize/SKILL.md` with valid YAML frontmatter
- [ ] Frontmatter includes `name`, `description`, `version`, and `model: sonnet`
- [ ] Frontmatter specifies `allowed-tools` including Read, Write, Bash, and Jira MCP tools
- [ ] Skill instructions support **RICE** framework (Reach x Impact x Confidence / Effort)
- [ ] Skill instructions support **ICE** framework (Impact x Confidence x Ease, all 1-10)
- [ ] Skill instructions support **MoSCoW** framework (Must / Should / Could / Won&apos;t)
- [ ] Skill instructions support **Kano** framework (Must-be, One-dimensional, Attractive, Indifferent, Reverse)
- [ ] Skill instructions support **Weighted Scoring** framework (custom criteria with weights)
- [ ] Skill instructions support **Cost of Delay** (CoD) framework (urgency-based prioritization)
- [ ] Skill handles manual feature input (user lists items directly in the prompt)
- [ ] Skill references pm-frameworks MCP tools for framework calculations where available
- [ ] Skill instructions guide the assistant to ask the user which framework to use if not specified
- [ ] Skill instructions direct the assistant to output a ranked table with scores and rationale
- [ ] Framework detail files are referenced from `skills/prioritize/frameworks/` directory

## Files to Create/Modify

- `skills/prioritize/SKILL.md`
