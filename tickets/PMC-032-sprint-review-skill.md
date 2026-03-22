---
id: PMC-032
title: Sprint Review Skill
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the sprint review skill at `skills/sprint-review/SKILL.md`. This skill automates sprint retrospective preparation by pulling sprint data from Jira, analyzing team velocity and delivery patterns, and producing a structured review document ready for the sprint review meeting.

The skill must use model `sonnet` and follows this process:

1. **Pull Sprint Data** - Use Jira MCP to retrieve all issues from the current/specified sprint, including status, story points, assignees, labels, and completion dates
2. **Analyze Velocity** - Compare story points committed vs. completed, track velocity trends across recent sprints, and flag anomalies
3. **Categorize Work** - Break down completed work by type (feature, bug fix, tech debt, chore), team/squad, and epic alignment
4. **Identify Risks** - Surface carry-over items, consistently missed estimates, dependency bottlenecks, and scope creep indicators
5. **Draft Review** - Generate a sprint review document with visualizable data summaries and talking points

Allowed tools: `Read`, `Write`, `Bash`, `Agent(sprint-analyst)`, `Jira MCP`.

The `sprint-analyst` sub-agent handles the detailed velocity calculations and trend analysis, allowing the main skill to focus on narrative construction and actionable insights.

## Acceptance Criteria

- [ ] `skills/sprint-review/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `sonnet`
- [ ] Allowed tools list includes `Read`, `Write`, `Bash`, `Agent(sprint-analyst)`, `Jira MCP`
- [ ] Skill instructions describe the five-step process: pull data, analyze velocity, categorize work, identify risks, draft review
- [ ] Skill defines the `sprint-analyst` sub-agent with its responsibilities and tool access
- [ ] Skill prompts for sprint identifier (or defaults to current sprint) and Jira project key
- [ ] Skill output includes: sprint summary stats, velocity chart data, work breakdown, carry-over list, risks, and team highlights
- [ ] Skill handles incomplete sprint data gracefully (e.g., missing story points default to count-based tracking)
- [ ] Skill includes talking points for the PM to use during the sprint review meeting

## Files to Create/Modify

- `skills/sprint-review/SKILL.md`
