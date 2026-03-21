---
id: PMC-004
title: Create hooks/hooks.json with event placeholders
phase: 0 - Foundation
status: todo
type: setup
estimate: 1
dependencies:
  - PMC-001
---

## Description

Create the `hooks/hooks.json` file that defines the lifecycle hooks PMCopilot uses to inject behavior at key points during a Claude Code session. Hooks allow the plugin to react to session events, gate tool usage, post-process tool results, and intercept subagent completion.

The file must define skeleton entries for all 4 supported event types:

1. **SessionStart** -- Fires when a new Claude Code session begins. Used to load PM context, check for active sprint data, display a welcome message, and verify MCP server connectivity.

2. **PreToolUse** -- Fires before a tool is invoked. Used to validate inputs, enforce guardrails (e.g., prevent accidental production data access), and inject PM-specific context. Matchers should reference the custom MCP tool patterns (e.g., `mcp__simulator-bridge__*`, `mcp__app-store-intel__*`).

3. **PostToolUse** -- Fires after a tool returns results. Used to cache competitive intel responses, log analytics, auto-capture screenshots, and format output for PM consumption. Matchers should reference the same MCP tool patterns.

4. **SubagentStop** -- Fires when a subagent (e.g., prd-writer) completes its work. Used to run quality checks on generated artifacts, validate PRD completeness, and trigger follow-up actions (e.g., suggest next steps).

Each event entry should include: `event` name, `hooks` array with at least one hook containing `matcher` (tool pattern or `*`), `command` (path to hook script using `${CLAUDE_PLUGIN_ROOT}`), and `description`.

## Acceptance Criteria

- [ ] File exists at `hooks/hooks.json`
- [ ] File is valid JSON
- [ ] All 4 event types are defined: `SessionStart`, `PreToolUse`, `PostToolUse`, `SubagentStop`
- [ ] Each event entry has a `hooks` array with at least one hook definition
- [ ] PreToolUse and PostToolUse matchers reference correct MCP tool patterns (e.g., `mcp__simulator-bridge__*`, `mcp__emulator-bridge__*`, `mcp__app-store-intel__*`, `mcp__pm-frameworks__*`)
- [ ] Hook commands reference scripts via `${CLAUDE_PLUGIN_ROOT}/hooks/` paths
- [ ] Each hook has a human-readable `description` field

## Files to Create/Modify

- `hooks/hooks.json`
