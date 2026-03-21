---
id: PMC-097
title: Create auto-screenshot hook
phase: 5 - Polish and Distribution
status: todo
type: hook
estimate: 1
dependencies: [PMC-004, PMC-074, PMC-080]
---

## Description

Implement a PostToolUse hook that automatically captures a screenshot after every tap or swipe interaction on a simulator or emulator. This provides a visual audit trail of app teardown sessions without requiring the agent to explicitly request screenshots after each action.

The hook triggers on PostToolUse for simulator-bridge and emulator-bridge MCP tools whose `tool_name` matches tap or swipe actions. It runs `auto-screenshot.sh`, which captures the current screen state and stores it in a session-scoped directory.

Hook exit code 0 allows the workflow to continue; stdout can include the screenshot path so the agent is aware of the captured image.

## Acceptance Criteria

- [ ] `hooks.json` contains a PostToolUse entry matching simulator/emulator tap and swipe tool names
- [ ] `auto-screenshot.sh` script is created and executable
- [ ] The script captures a screenshot from the active simulator (via `xcrun simctl io screenshot`) or emulator (via `adb exec-out screencap`)
- [ ] Screenshots are saved to `.pmcopilot/screenshots/<session_id>/` with sequential filenames including timestamp and action type (e.g., `001-tap-1711000000.png`)
- [ ] The script reads hook input JSON from stdin and extracts `session_id`, `tool_name`, and `tool_input`
- [ ] Screenshot path is written to stdout so the agent can reference it
- [ ] The script exits 0 on success (never blocks the workflow)
- [ ] The script handles failures gracefully -- if screenshot capture fails, it logs a warning to stderr but still exits 0
- [ ] The script detects whether the action was on a simulator or emulator and uses the appropriate capture command
- [ ] Old screenshot directories are cleaned up after configurable retention (default: 7 days)

## Files to Create/Modify

- `.pmcopilot/hooks.json` -- add PostToolUse hook entry for auto-screenshot
- `.pmcopilot/hooks/auto-screenshot.sh` -- screenshot capture script
