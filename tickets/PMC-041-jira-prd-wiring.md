---
id: PMC-041
title: Wire Jira createJiraIssue and Confluence createConfluencePage into PRD skill
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-006]
---

## Description
Wire the Jira MCP tool `createJiraIssue` and the Confluence MCP tool `createConfluencePage` into the PRD skill. This enables the PRD skill to publish finished PRDs directly to Confluence as a page, and optionally create a corresponding Jira epic or story for tracking. Both tools are on the already-connected Jira/Confluence MCP server (ID: `43470b8f-a656-4653-8dba-c593836b1597`).

## Acceptance Criteria
- [ ] `skills/prd/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Atlassian__createJiraIssue` and `mcp__claude_ai_Atlassian__createConfluencePage`
- [ ] Skill prompt updated to offer a `--publish-confluence` option that creates a Confluence page with the PRD content
- [ ] Skill prompt updated to offer a `--create-jira` option that creates a Jira epic/story linked to the PRD
- [ ] Confluence page is created in the correct space with proper formatting
- [ ] Jira issue includes a link back to the Confluence PRD page
- [ ] Skill still works in local-only mode without publishing (default behavior unchanged)

## Files to Create/Modify
- `skills/prd/SKILL.md` (modify frontmatter and prompt)
