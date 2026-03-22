---
id: PMC-039
title: Wire Jira into sprint-review skill and sprint-analyst agent
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-032, PMC-036]
---

## Description
Wire the Jira MCP tools `searchJiraIssuesUsingJql` and `getJiraIssue` into the sprint-review skill and the sprint-analyst agent. This enables both to pull live sprint data directly from Jira rather than requiring manual input. The Jira/Confluence MCP server is already connected (ID: `43470b8f-a656-4653-8dba-c593836b1597`). Wiring means adding the specific MCP tool references to the `allowed-tools` list in the skill YAML frontmatter and the `tools` list in the agent YAML frontmatter.

## Acceptance Criteria
- [ ] `skills/sprint-review/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql` and `mcp__claude_ai_Atlassian__getJiraIssue`
- [ ] `agents/sprint-analyst.md` frontmatter `tools` includes `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql` and `mcp__claude_ai_Atlassian__getJiraIssue`
- [ ] Sprint-review skill can query Jira for sprint issues using JQL
- [ ] Sprint-review skill can fetch individual issue details for deep analysis
- [ ] Sprint-analyst agent can pull sprint board data and calculate metrics from live Jira data
- [ ] No regressions: skills/agents still work when Jira MCP is unavailable (graceful degradation)

## Files to Create/Modify
- `skills/sprint-review/SKILL.md` (modify frontmatter)
- `agents/sprint-analyst.md` (modify frontmatter)
