---
id: PMC-084
title: Emulator input simulation tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-080]
---

## Description

Implement the input simulation tools for the emulator-bridge MCP server. These tools let the app-teardown agent interact with running apps by tapping, swiping, typing text, and pressing hardware/software keys. Together with UI dump and screenshot tools, they enable fully automated app navigation.

**Tools:**

1. **tap** -- Taps at a specific screen coordinate.
   - CLI: `adb -s <device_id> shell input tap <x> <y>`
   - Params: `device_id` (required), `x` (required, integer), `y` (required, integer)
   - Returns: confirmation of tap executed

2. **swipe** -- Performs a swipe gesture between two points.
   - CLI: `adb -s <device_id> shell input swipe <x1> <y1> <x2> <y2> <duration_ms>`
   - Params: `device_id` (required), `x1` (required), `y1` (required), `x2` (required), `y2` (required), `duration_ms` (optional, default 300)
   - Returns: confirmation of swipe executed

3. **type_text** -- Types a string of text into the currently focused input field.
   - CLI: `adb -s <device_id> shell input text <text>`
   - Params: `device_id` (required), `text` (required)
   - Must escape special characters for shell (spaces become `%s`, special chars are escaped)
   - Returns: confirmation of text entered

4. **press_key** -- Sends a keyevent to the device.
   - CLI: `adb -s <device_id> shell input keyevent <keycode>`
   - Params: `device_id` (required), `keycode` (required -- integer or string like `KEYCODE_BACK`, `KEYCODE_HOME`, `KEYCODE_ENTER`)
   - Returns: confirmation of key pressed

## Acceptance Criteria

- [ ] `tap` validates that `x` and `y` are non-negative integers
- [ ] `swipe` validates all coordinate params and `duration_ms` is positive
- [ ] `swipe` uses sensible default duration (300ms) when not specified
- [ ] `type_text` properly escapes spaces, ampersands, quotes, and other shell-special characters
- [ ] `type_text` handles empty string gracefully (returns error, does not crash)
- [ ] `press_key` accepts both integer keycodes and string keycode names (e.g. `KEYCODE_BACK` or `4`)
- [ ] `press_key` provides a reference list of common keycodes in tool description
- [ ] All tools target a specific device via `-s <device_id>` flag
- [ ] All tools return structured JSON responses
- [ ] Unit tests with mocked adb output for each tool
- [ ] Error cases covered: device not found, invalid coordinates

## Files to Create/Modify

- `mcp-servers/emulator-bridge/src/tools/tap.ts`
- `mcp-servers/emulator-bridge/src/tools/swipe.ts`
- `mcp-servers/emulator-bridge/src/tools/type-text.ts`
- `mcp-servers/emulator-bridge/src/tools/press-key.ts`
- `mcp-servers/emulator-bridge/src/index.ts` (register tools)
- `mcp-servers/emulator-bridge/tests/tools/tap.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/swipe.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/type-text.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/press-key.test.ts`
