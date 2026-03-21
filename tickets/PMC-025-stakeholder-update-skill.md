---
id: PMC-025
title: Stakeholder Update Skill
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the stakeholder update skill at `skills/stakeholder-update/SKILL.md`. This skill enables PMs to generate polished stakeholder communications in multiple formats (weekly, monthly, exec-summary) by pulling data from project tools and synthesizing it into structured updates.

The skill must use model `sonnet` and support three output formats: **weekly**, **monthly**, and **exec-summary**. Each format has a dedicated template (see PMC-026 and PMC-027). The skill orchestrates data gathering from Jira and Slack, then renders the appropriate template with the collected context.

Allowed tools: `Read`, `Write`, `Bash`, `Slack MCP`, `Jira MCP`.

## Acceptance Criteria

- [ ] `skills/stakeholder-update/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `sonnet`
- [ ] Skill declares three supported formats: `weekly`, `monthly`, `exec-summary`
- [ ] Allowed tools list includes `Read`, `Write`, `Bash`, `Slack MCP`, `Jira MCP`
- [ ] Skill instructions describe how to pull recent activity from Jira (completed issues, in-progress work, blockers)
- [ ] Skill instructions describe how to pull relevant Slack channel context (key decisions, announcements)
- [ ] Skill routes to the correct template based on the requested format
- [ ] Skill includes prompt guidance for tone (concise, action-oriented, audience-appropriate)
- [ ] Skill handles missing data gracefully (e.g., no Jira connection defaults to manual input)

## Files to Create/Modify

- `skills/stakeholder-update/SKILL.md`
