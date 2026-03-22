---
id: PMC-046
title: Wire GCal gcal_list_events into sprint-review skill
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-032]
---

## Description
Wire the Google Calendar MCP tool `gcal_list_events` into the sprint-review skill to provide meeting context for sprint reviews. This allows the skill to pull calendar events from the sprint period (standups, retros, planning sessions, ad-hoc meetings) to enrich the sprint review with context about team ceremonies and meeting load. The GCal MCP server is already connected (ID: `d5c1cc85-a409-49e0-9524-f68853313121`).

## Acceptance Criteria
- [ ] `skills/sprint-review/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Google_Calendar__gcal_list_events`
- [ ] Skill prompt updated to optionally pull calendar events for the sprint date range
- [ ] Sprint review output includes a section on team ceremonies and meeting context when calendar data is available
- [ ] Meeting data is used to identify potential process issues (e.g., missed standups, excessive ad-hoc meetings)
- [ ] Skill still produces a complete sprint review when calendar data is unavailable

## Files to Create/Modify
- `skills/sprint-review/SKILL.md` (modify frontmatter and prompt)
