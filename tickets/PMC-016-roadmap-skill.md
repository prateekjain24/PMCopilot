---
id: PMC-016
title: Roadmap Skill Definition
phase: 1 - Core Skills
status: todo
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Create the roadmap skill definition file at `skills/roadmap/SKILL.md`. The roadmap skill enables PMs to generate strategic roadmaps in three distinct formats: Now/Next/Later, timeline-based, and outcome-based. This skill is foundational for product planning workflows and integrates with Jira MCP for pulling in existing backlog data.

The skill frontmatter must specify `model: sonnet` and `allowed-tools: Read, Write, Bash, Jira MCP`. The skill should describe when each format is most appropriate and how to invoke them.

## Acceptance Criteria

- [ ] `skills/roadmap/SKILL.md` exists with valid YAML frontmatter
- [ ] Frontmatter specifies `model: sonnet`
- [ ] Frontmatter specifies `allowed-tools` including Read, Write, Bash, and Jira MCP
- [ ] Skill description documents all 3 supported formats: Now/Next/Later, timeline-based, and outcome-based
- [ ] Each format includes a brief description of when to use it
- [ ] Skill includes instructions for gathering context (product goals, existing backlog, stakeholder input)
- [ ] Skill references the template files in `skills/roadmap/templates/`

## Files to Create/Modify

- `skills/roadmap/SKILL.md`
