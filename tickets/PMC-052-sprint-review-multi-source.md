---
id: PMC-052
title: Full sprint review pulling from Jira + Slack + Granola + GCal
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-039, PMC-046, PMC-044]
---

## Description

Build a comprehensive sprint review workflow that pulls data from all four integrated sources -- Jira, Slack, Granola, and Google Calendar -- to generate a complete sprint retrospective and review document. This is the culmination of Phase 2 tool integrations, combining structured project data (Jira), team communication context (Slack), meeting notes and decisions (Granola), and ceremony/event data (GCal) into a single coherent review.

The sprint review skill or agent orchestration should:

1. **Jira** -- Pull completed stories, carry-over items, velocity metrics, bug counts, and cycle time for the sprint
2. **Slack** -- Scan relevant channels for sprint-related discussions, blockers raised, decisions made, and team sentiment
3. **Granola** -- Retrieve meeting transcripts from standup, planning, and review ceremonies during the sprint window
4. **GCal** -- List sprint ceremonies that occurred, identify missed meetings, and calculate meeting load vs. maker time

The output should be a structured sprint review document containing:
- Sprint summary (goal, dates, team)
- Velocity and delivery metrics from Jira
- Key decisions and context from Slack and Granola
- Meeting cadence analysis from GCal
- Blockers and how they were resolved
- Carry-over items with reasons
- Recommendations for the next sprint

## Acceptance Criteria

- [ ] Sprint review skill/agent can pull data from Jira MCP (`mcp__claude_ai_Atlassian__*`)
- [ ] Sprint review skill/agent can pull data from Slack MCP (`mcp__claude_ai_Slack__*`)
- [ ] Sprint review skill/agent can pull data from Granola MCP (`mcp__claude_ai_Granola__*`)
- [ ] Sprint review skill/agent can pull data from GCal MCP (`mcp__claude_ai_Google_Calendar__*`)
- [ ] Output includes: sprint summary, velocity metrics, key decisions, meeting analysis, blockers, carry-over, recommendations
- [ ] Output is written as structured markdown to `docs/sprint-reviews/`
- [ ] Graceful degradation: if one source is unavailable, the review still generates with available data and notes the gap
- [ ] Sprint date range is configurable (defaults to last 2 weeks)
- [ ] Smoke test: with all four sources configured, a complete sprint review document is generated

## Files to Create/Modify

- `skills/sprint-planning/SKILL.md` (modify -- add sprint-review mode and multi-source tools)
- `agents/sprint-analyst.md` (modify -- add Slack, Granola, GCal MCP tools and multi-source prompt)
