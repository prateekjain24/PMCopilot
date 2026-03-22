---
id: PMC-044
title: Wire Granola meeting tools into user-research skill
phase: 2 - Tool Integrations
status: done
type: integration
estimate: 1
dependencies: [PMC-021]
---

## Description
Wire Granola MCP tools `list_meetings` and `get_meeting_transcript` into the user-research skill. This enables PMs to pull meeting transcripts from Granola as primary source material for user research analysis -- extracting themes, pain points, feature requests, and quotes directly from customer/user interviews. The Granola MCP server is already connected (ID: `3053a93d-10f6-40f2-893b-fcd0bb589fb8`).

## Acceptance Criteria
- [ ] `skills/user-research/SKILL.md` frontmatter `allowed-tools` includes `mcp__claude_ai_Granola__list_meetings` and `mcp__claude_ai_Granola__get_meeting_transcript`
- [ ] Skill prompt updated to support `--from-granola` option that lists recent meetings and lets the user select which to analyze
- [ ] Skill can pull full meeting transcripts and run them through the user-research analysis framework
- [ ] Extracted insights (themes, pain points, quotes) are attributed to specific meetings by title and date
- [ ] Skill still accepts manual transcript input when `--from-granola` is not used

## Files to Create/Modify
- `skills/user-research/SKILL.md` (modify frontmatter and prompt)
