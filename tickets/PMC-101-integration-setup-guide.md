---
id: PMC-101
title: Write integration setup guide
phase: 5 - Polish and Distribution
status: todo
type: docs
estimate: 1
dependencies: [PMC-047, PMC-048, PMC-049]
---

## Description

Write a comprehensive guide for setting up all external integrations that PMCopilot supports. Each integration is optional, but PMs who connect their tools get significantly more value. The guide must be practical -- step-by-step instructions with screenshots or terminal output examples where helpful.

Integrations to document:

- **Jira** -- API token setup, project selection, permission requirements. Used by sprint-review, prioritize, and PRD skills.
- **Confluence** -- API token (shared with Jira for Atlassian Cloud), space configuration. Used by PRD skill for publishing.
- **Slack** -- App/bot token setup, channel permissions. Used by stakeholder-update and research-synthesizer.
- **Amplitude** -- MCP server configuration, API key setup, project selection. Used by metrics-review.
- **Mixpanel** -- MCP server configuration, API credentials, project setup. Used by metrics-review.
- **Figma** -- MCP server configuration, personal access token, file/project access. Used by ux-reviewer and PRD skills.
- **Granola** -- MCP server configuration, authentication. Used by user-research skill for meeting notes.
- **Gmail** -- OAuth setup, scope permissions. Used by stakeholder-update for email drafts.
- **Google Calendar** -- OAuth setup (shared with Gmail), calendar selection. Used by sprint-review for ceremony scheduling.

## Acceptance Criteria

- [ ] Guide exists at `docs/integration-setup.md`
- [ ] Each integration has its own section with: purpose, prerequisites, step-by-step setup, verification command, and troubleshooting tips
- [ ] Jira/Confluence setup instructions cover both Cloud and Data Center editions
- [ ] Slack setup instructions include bot token scopes and channel invite steps
- [ ] Amplitude and Mixpanel sections explain MCP server configuration in `settings.json`
- [ ] Figma section covers personal access token generation and file permissions
- [ ] Gmail and Google Calendar sections explain OAuth consent screen and required scopes
- [ ] Granola section explains how to connect meeting transcripts
- [ ] Each section includes a "Verify it works" step (e.g., a test command or skill invocation)
- [ ] Guide clearly states which integrations are optional vs. recommended
- [ ] Guide is linked from the main README

## Files to Create/Modify

- `docs/integration-setup.md` -- the integration setup guide
