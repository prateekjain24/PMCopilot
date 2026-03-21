---
id: PMC-036
title: Create sprint-analyst agent
phase: 2 - Tool Integrations
status: todo
type: agent
estimate: 1
dependencies: [PMC-005]
---

## Description
Create the sprint-analyst agent definition file at `agents/sprint-analyst.md`. This agent uses Sonnet to pull and analyze sprint execution data from Jira and Linear. It calculates velocity, analyzes burndown charts, identifies carry-over items, tracks bug/feature ratios, and monitors cycle time. The agent is configured with maxTurns: 15 and permissionMode: default, with access to Read, Write, Bash, and wildcarded Jira MCP and Linear MCP tools.

## Acceptance Criteria
- [ ] Agent file created at `agents/sprint-analyst.md` with valid YAML frontmatter
- [ ] Model set to `sonnet`
- [ ] Tools include: Read, Write, Bash, Jira MCP wildcard (`mcp__claude_ai_Atlassian__*`), Linear MCP wildcard
- [ ] maxTurns set to 15
- [ ] permissionMode set to default
- [ ] Agent prompt covers: pull sprint data, calculate velocity, analyze burndown, identify carry-over, track bug/feature ratio, monitor cycle time
- [ ] Agent returns structured markdown output with sprint health metrics
- [ ] Smoke test: agent can be invoked and responds with expected format

## Files to Create/Modify
- `agents/sprint-analyst.md` (create)
