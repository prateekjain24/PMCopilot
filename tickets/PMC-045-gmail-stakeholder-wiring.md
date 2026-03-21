---
id: PMC-045
title: Wire Gmail gmail_create_draft into stakeholder-update skill
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-025]
---

## Description
Wire the Gmail MCP tool `gmail_create_draft` into the stakeholder-update skill. This enables PMs to generate a stakeholder update and have it saved as a Gmail draft ready for review and sending, in addition to (or instead of) the Slack delivery path. This is useful for executive updates or external stakeholder communications that go via email. The Gmail MCP server is already connected (ID: `b504e51d-4881-4f6f-aee3-552af7b5ffcd`).

## Acceptance Criteria
- [ ] `skills/stakeholder-update/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Gmail__gmail_create_draft`
- [ ] Skill prompt updated to support `--email-draft` option with recipient list
- [ ] When `--email-draft` is provided, skill creates a Gmail draft with the stakeholder update as the email body
- [ ] Email draft includes a clear subject line derived from the update title/date
- [ ] Skill confirms draft creation with a summary (subject, recipients, draft ID)
- [ ] Skill still generates local markdown and/or Slack output when `--email-draft` is not used

## Files to Create/Modify
- `skills/stakeholder-update/SKILL.md` (modify frontmatter and prompt)
