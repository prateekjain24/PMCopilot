---
id: PMC-040
title: Wire Jira searchJiraIssuesUsingJql into prioritize skill
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-011]
---

## Description
Wire the Jira MCP tool `searchJiraIssuesUsingJql` into the prioritize skill to support a `--from-jira` flag. This allows PMs to pull backlog items directly from a Jira project/board and run them through the prioritization framework (RICE, MoSCoW, etc.) without manually listing items. The Jira/Confluence MCP server is already connected (ID: `43470b8f-a656-4653-8dba-c593836b1597`).

## Acceptance Criteria
- [ ] `skills/prioritize/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql`
- [ ] Skill prompt updated to handle `--from-jira` flag with JQL query or project key as input
- [ ] When `--from-jira` is provided, skill queries Jira for issues and feeds them into the prioritization framework
- [ ] Output maps prioritized items back to their Jira issue keys for traceability
- [ ] Skill still works without `--from-jira` (manual item input remains supported)

## Files to Create/Modify
- `skills/prioritize/SKILL.md` (modify frontmatter and prompt)
