---
id: PMC-042
title: Wire Slack send_message, create_canvas, schedule_message into stakeholder-update skill
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-025]
---

## Description
Wire Slack MCP tools into the stakeholder-update skill to enable direct posting of stakeholder updates to Slack channels. This includes `send_message` for immediate posting, `create_canvas` for rich formatted updates, and `schedule_message` for timed delivery (e.g., Monday morning status updates). The Slack MCP server is already connected (ID: `0d3ccbd5-2c59-4d74-aa42-4830ee6d1e48`).

## Acceptance Criteria
- [ ] `skills/stakeholder-update/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Slack__slack_send_message`, `mcp__claude_ai_Slack__slack_create_canvas`, and `mcp__claude_ai_Slack__slack_schedule_message`
- [ ] Skill prompt updated to support `--slack-channel` option for specifying target channel
- [ ] Skill prompt updated to support `--schedule` option for deferred delivery via `schedule_message`
- [ ] When `--slack-channel` is provided, skill posts the update to the specified Slack channel
- [ ] Rich updates use `create_canvas` for formatted, linkable content
- [ ] Skill still generates local markdown output by default when no Slack options are provided

## Files to Create/Modify
- `skills/stakeholder-update/SKILL.md` (modify frontmatter and prompt)
