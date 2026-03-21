---
id: PMC-096
title: Create simulator health check hook
phase: 5 - Polish and Distribution
status: todo
type: hook
estimate: 1
dependencies: [PMC-004, PMC-074, PMC-080]
---

## Description

Implement two hooks that ensure iOS Simulator and Android Emulator availability before they are needed:

1. **SessionStart hook** -- runs `check-simulators.sh` at the beginning of every session to detect available simulators/emulators and surface their status as context. This gives the agent early awareness of the device landscape without blocking the session.

2. **PreToolUse hook** -- runs `check-simulator-running.sh` before any simulator or emulator MCP tool is invoked. If the required simulator/emulator is not running, the hook blocks the tool call (exit 2) with a clear error message explaining how to start it.

Both hooks receive JSON on stdin with `session_id`, `hook_event_name`, `tool_name`, and `tool_input`.

## Acceptance Criteria

- [ ] `hooks.json` contains a SessionStart entry that runs `check-simulators.sh`
- [ ] `check-simulators.sh` detects installed iOS Simulators (via `xcrun simctl list`) and Android Emulators (via `emulator -list-avds`)
- [ ] SessionStart hook exits 0 with a JSON summary of available devices written to stdout
- [ ] SessionStart hook gracefully handles missing `xcrun` or `emulator` commands (reports unavailability, does not fail)
- [ ] `hooks.json` contains a PreToolUse entry matching simulator-bridge and emulator-bridge MCP tool names
- [ ] `check-simulator-running.sh` verifies the target device is booted before allowing the tool call
- [ ] PreToolUse hook exits 0 if the required simulator/emulator is running
- [ ] PreToolUse hook exits 2 with a helpful error on stderr if the device is not running, including the command to start it
- [ ] Both scripts read hook input JSON from stdin and parse relevant fields
- [ ] Scripts handle platform-specific scenarios (macOS-only for iOS Simulator, cross-platform for Android Emulator)

## Files to Create/Modify

- `.pmcopilot/hooks.json` -- add SessionStart and PreToolUse hook entries
- `.pmcopilot/hooks/check-simulators.sh` -- session-start health check script
- `.pmcopilot/hooks/check-simulator-running.sh` -- pre-tool-use guard script
