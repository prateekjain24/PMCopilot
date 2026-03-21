---
id: PMC-051
title: Wire Figma MCP into ux-reviewer agent and PRD skill
phase: 2 - Tool Integrations
status: todo
type: integration
estimate: 1
dependencies: [PMC-049, PMC-006]
---

## Description

Wire the Figma MCP into the ux-reviewer agent and the PRD generator skill so that both can pull design context directly from Figma. The ux-reviewer agent (Phase 4) will be defined later, but its configuration dependency on Figma MCP tools should be established now. The PRD skill benefits from being able to reference live Figma designs when generating requirements.

For the **ux-reviewer agent** (to be created in Phase 4):
- Pre-configure the agent file with Figma MCP tool wildcards in its tools list
- Include prompt instructions for using `get_file`, `get_file_nodes`, `get_images`, and `get_comments` to inspect designs
- The agent should be able to pull a Figma frame, describe the UI, identify usability issues, and cross-reference design comments

For the **PRD skill**:
- Add Figma MCP tool wildcards to `allowed-tools`
- Update skill instructions to optionally accept a Figma file URL as input
- When a Figma URL is provided, the skill should pull relevant frames and incorporate design references into the PRD

## Acceptance Criteria

- [ ] PRD generator skill `allowed-tools` includes `mcp__figma__*`
- [ ] PRD skill instructions updated to accept optional Figma file URL
- [ ] PRD skill instructions describe how to embed Figma design references in generated PRDs
- [ ] UX-reviewer agent file created at `agents/ux-reviewer.md` with Figma MCP tool wildcards
- [ ] UX-reviewer agent tools include: Read, Write, Bash, `mcp__figma__*`
- [ ] UX-reviewer agent prompt covers: pull design file, describe UI, identify usability issues, review comments
- [ ] Agent model set to `sonnet`
- [ ] Smoke test: PRD skill can reference a Figma file when URL is provided

## Files to Create/Modify

- `skills/prd-generator/SKILL.md` (modify -- add Figma MCP tools and instructions)
- `agents/ux-reviewer.md` (create -- Phase 4 agent, configured now)
