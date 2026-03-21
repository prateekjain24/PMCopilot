---
id: PMC-021
title: User Research Skill Definition
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Create the user research skill definition file at `skills/user-research/SKILL.md`. This skill supports PMs in conducting and synthesizing user research. It produces five distinct artifact types: persona, interview-guide, jtbd (Jobs to Be Done canvas), affinity-map, and analyze-transcript.

The skill must reference the Granola MCP for pulling in meeting transcripts and notes from user interviews. The frontmatter must specify `model: opus` (given the complexity of qualitative analysis) and `allowed-tools: Read, Write, Bash, Grep, Granola MCP`.

## Acceptance Criteria

- [ ] `skills/user-research/SKILL.md` exists with valid YAML frontmatter
- [ ] Frontmatter specifies `model: opus`
- [ ] Frontmatter specifies `allowed-tools` including Read, Write, Bash, Grep, and Granola MCP
- [ ] Skill documents all 5 supported artifact types: persona, interview-guide, jtbd, affinity-map, analyze-transcript
- [ ] Each artifact type includes a description of its purpose and when to use it
- [ ] Skill describes how to use Granola MCP to pull interview transcripts for the analyze-transcript and affinity-map artifacts
- [ ] Skill references the template files in `skills/user-research/templates/`
- [ ] Skill includes guidance on ethical research practices (consent, privacy, data handling)

## Files to Create/Modify

- `skills/user-research/SKILL.md`
