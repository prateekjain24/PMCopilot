---
id: PMC-043
title: Wire Slack search tools into research-synthesizer agent
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-038]
---

## Description
Wire Slack MCP search tools into the research-synthesizer agent to enable it to pull relevant Slack conversations as a research input source. This includes `search_public` for searching public channels and `search_public_and_private` for broader searches across all accessible channels. This allows the research-synthesizer to incorporate internal team discussions, customer feedback shared in Slack, and stakeholder conversations into its synthesis. The Slack MCP server is already connected (ID: `0d3ccbd5-2c59-4d74-aa42-4830ee6d1e48`).

## Acceptance Criteria
- [ ] `agents/research-synthesizer.md` frontmatter `tools` includes `mcp__claude_ai_Slack__slack_search_public` and `mcp__claude_ai_Slack__slack_search_public_and_private`
- [ ] Agent prompt updated to describe when and how to search Slack as a research source
- [ ] Agent can search Slack for relevant discussions based on research topic keywords
- [ ] Slack findings are attributed with channel name and date in the synthesis output
- [ ] Agent still functions correctly when Slack search returns no results (graceful handling)

## Files to Create/Modify
- `agents/research-synthesizer.md` (modify frontmatter and prompt)
