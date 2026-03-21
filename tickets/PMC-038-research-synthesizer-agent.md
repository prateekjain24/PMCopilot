---
id: PMC-038
title: Create research-synthesizer agent
phase: 2 - Tool Integrations
status: todo
type: agent
estimate: 1
dependencies: [PMC-005]
---

## Description
Create the research-synthesizer agent definition file at `agents/research-synthesizer.md`. This is an orchestrator agent that uses Opus to coordinate sub-agents (app-teardown, web-teardown, ux-reviewer) and synthesize their findings into a unified research report. It has access to project memory for continuity across sessions. Configured with maxTurns: 30 and permissionMode: acceptEdits to allow file creation while prompting for confirmation on edits.

## Acceptance Criteria
- [ ] Agent file created at `agents/research-synthesizer.md` with valid YAML frontmatter
- [ ] Model set to `opus`
- [ ] Tools include: Read, Write, Bash, Grep, Glob, Agent(app-teardown), Agent(web-teardown), Agent(ux-reviewer)
- [ ] maxTurns set to 30
- [ ] permissionMode set to acceptEdits
- [ ] memory set to project
- [ ] Agent prompt describes orchestration: dispatch to sub-agents, collect results, synthesize findings
- [ ] Agent produces a unified research synthesis document with cross-cutting themes and actionable insights
- [ ] Smoke test: agent can be invoked and correctly delegates to sub-agents

## Files to Create/Modify
- `agents/research-synthesizer.md` (create)
