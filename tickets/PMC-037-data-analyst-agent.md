---
id: PMC-037
title: Create data-analyst agent
phase: 2 - Tool Integrations
status: todo
type: agent
estimate: 1
dependencies: [PMC-005]
---

## Description
Create the data-analyst agent definition file at `agents/data-analyst.md`. This agent uses Sonnet to query product analytics platforms (Amplitude, Mixpanel) via their MCP servers. It can calculate retention curves, build funnels, segment cohorts, and identify anomalies in product usage data. Configured with maxTurns: 20 and permissionMode: default to allow sufficient reasoning depth for complex analytical queries.

## Acceptance Criteria
- [ ] Agent file created at `agents/data-analyst.md` with valid YAML frontmatter
- [ ] Model set to `sonnet`
- [ ] Tools include: Read, Write, Bash, Amplitude MCP wildcard, Mixpanel MCP wildcard
- [ ] maxTurns set to 20
- [ ] permissionMode set to default
- [ ] Agent prompt covers: query events, calculate retention, build funnels, segment cohorts, identify anomalies
- [ ] Agent returns structured markdown with charts/tables where appropriate
- [ ] Smoke test: agent can be invoked and responds with expected format

## Files to Create/Modify
- `agents/data-analyst.md` (create)
