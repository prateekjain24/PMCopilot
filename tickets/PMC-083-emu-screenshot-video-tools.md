---
id: PMC-083
title: Emulator screenshot and video recording tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-080]
---

## Description

Implement screenshot capture and screen recording tools for the emulator-bridge MCP server. These are critical for the app-teardown agent, which needs to visually inspect each screen of an app and optionally record interaction flows.

**Tools:**

1. **take_screenshot** -- Captures the current screen of a device.
   - CLI: `adb -s <device_id> shell screencap /sdcard/screenshot.png && adb -s <device_id> pull /sdcard/screenshot.png <output_path>`
   - Params: `device_id` (required), `output_path` (optional -- defaults to `SCREENSHOT_DIR/<device_id>_<timestamp>.png`)
   - Returns: `{ path, size_bytes }` for the saved screenshot
   - Must clean up the on-device temp file after pull

2. **record_screen** -- Records the device screen to a video file.
   - CLI: `adb -s <device_id> shell screenrecord --time-limit <seconds> /sdcard/recording.mp4 && adb -s <device_id> pull /sdcard/recording.mp4 <output_path>`
   - Params: `device_id` (required), `output_path` (optional -- defaults to `VIDEO_DIR/<device_id>_<timestamp>.mp4`), `time_limit` (optional, max 180s, default 30s)
   - Returns: `{ path, size_bytes, duration_seconds }`
   - Must enforce the 180-second Android maximum
   - Recording runs asynchronously; the tool should wait for completion then pull the file

## Acceptance Criteria

- [ ] `take_screenshot` captures screen, pulls file to host, and cleans up device temp file
- [ ] `take_screenshot` auto-generates a timestamped filename when `output_path` is omitted
- [ ] `take_screenshot` creates parent directories for `output_path` if they do not exist
- [ ] `record_screen` records for the specified duration and pulls the video to host
- [ ] `record_screen` clamps `time_limit` to 1-180 seconds range
- [ ] `record_screen` auto-generates a timestamped filename when `output_path` is omitted
- [ ] Both tools return structured JSON with file path and size
- [ ] Both tools handle device-not-found and screencap/screenrecord failures gracefully
- [ ] Unit tests with mocked adb commands for each tool
- [ ] Files are saved to `SCREENSHOT_DIR` / `VIDEO_DIR` by default

## Files to Create/Modify

- `mcp-servers/emulator-bridge/src/tools/take-screenshot.ts`
- `mcp-servers/emulator-bridge/src/tools/record-screen.ts`
- `mcp-servers/emulator-bridge/src/index.ts` (register tools)
- `mcp-servers/emulator-bridge/tests/tools/take-screenshot.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/record-screen.test.ts`
