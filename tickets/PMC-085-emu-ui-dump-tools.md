---
id: PMC-085
title: Emulator UI inspection and logcat tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-080]
---

## Description

Implement the UI inspection and logging tools for the emulator-bridge MCP server. These tools let the app-teardown agent understand what is on screen (accessibility tree), determine the current activity, and pull filtered logcat output for debugging.

**Tools:**

1. **dump_ui** -- Dumps the current UI hierarchy (accessibility tree) as XML.
   - CLI: `adb -s <device_id> shell uiautomator dump /sdcard/ui_dump.xml && adb -s <device_id> pull /sdcard/ui_dump.xml <local_path>`
   - Params: `device_id` (required)
   - Returns: parsed UI tree as structured JSON with element bounds, text, content-desc, class, resource-id, clickable/scrollable/focusable attributes
   - The XML should be parsed into a JSON tree for easier consumption by the agent. Each node should include its bounding box coordinates to support coordinate-based tap/swipe.

2. **get_current_activity** -- Returns the currently focused activity and package.
   - CLI: `adb -s <device_id> shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'`
   - Params: `device_id` (required)
   - Returns: `{ package, activity, window_title }`

3. **get_logcat** -- Retrieves filtered logcat output.
   - CLI: `adb -s <device_id> logcat -d -t <lines> <tag>:* *:S` (or unfiltered if no tag)
   - Params: `device_id` (required), `tag` (optional -- filter to specific log tag), `lines` (optional, default 100)
   - Returns: array of log entries with timestamp, level, tag, and message

## Acceptance Criteria

- [ ] `dump_ui` captures the UI hierarchy XML and parses it into structured JSON
- [ ] `dump_ui` output includes for each element: bounds (as `{ x, y, width, height }`), text, content-desc, class, resource-id, clickable, scrollable, focusable
- [ ] `dump_ui` cleans up the temp file on the device after pulling
- [ ] `get_current_activity` correctly parses package and activity from `dumpsys window` output
- [ ] `get_current_activity` handles cases where no activity is focused (e.g. lock screen)
- [ ] `get_logcat` returns structured log entries parsed from raw logcat output
- [ ] `get_logcat` supports filtering by tag when provided
- [ ] `get_logcat` clamps `lines` to a reasonable max (e.g. 5000) to avoid excessive output
- [ ] All tools target a specific device via `-s <device_id>` flag
- [ ] All tools return structured JSON responses
- [ ] Unit tests with mocked adb output for each tool, including XML parsing for dump_ui
- [ ] Error cases covered: device not found, uiautomator dump failure, empty logcat

## Files to Create/Modify

- `mcp-servers/emulator-bridge/src/tools/dump-ui.ts`
- `mcp-servers/emulator-bridge/src/tools/get-current-activity.ts`
- `mcp-servers/emulator-bridge/src/tools/get-logcat.ts`
- `mcp-servers/emulator-bridge/src/helpers/xml-parser.ts`
- `mcp-servers/emulator-bridge/src/index.ts` (register tools)
- `mcp-servers/emulator-bridge/tests/tools/dump-ui.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/get-current-activity.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/get-logcat.test.ts`
- `mcp-servers/emulator-bridge/tests/helpers/xml-parser.test.ts`
