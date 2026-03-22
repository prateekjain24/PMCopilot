---
id: PMC-077
title: Simulator Screenshot and Video Recording Tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-074]
---

## Description

Implement the screenshot and video recording tools in the simulator-bridge MCP server: `take_screenshot` and `record_video`. These tools capture visual evidence of app flows running in the iOS Simulator, which is essential for app teardowns, UX analysis, and competitive research documentation.

Screenshots and videos are saved to the directories configured in PMC-074 (`SCREENSHOT_DIR` and `VIDEO_DIR` respectively).

### take_screenshot

Captures a screenshot of the current simulator screen.

- **CLI command:** `xcrun simctl io <device_id> screenshot <output_path> --type <format>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `output_path` (string, optional) - Custom output file path; defaults to `${SCREENSHOT_DIR}/<device_id>-<timestamp>.<format>`
  - `format` (string, optional) - Image format: "png" (default), "jpeg", "bmp", or "tiff"
- **Returns:** Object with device_id, output_path (absolute path to the saved screenshot), format, and file size

### record_video

Starts or stops video recording of the simulator screen.

- **CLI command:** `xcrun simctl io <device_id> recordVideo <output_path>` (start) / sends SIGINT to stop
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `action` (string, required) - Either "start" or "stop"
  - `output_path` (string, optional) - Custom output file path; defaults to `${VIDEO_DIR}/<device_id>-<timestamp>.mp4`
- **Returns:**
  - On start: Object with device_id, output_path, status "recording", and the recording process ID
  - On stop: Object with device_id, output_path, status "stopped", duration (if determinable), and file size

## Acceptance Criteria

- [ ] `take_screenshot` tool registered in the simulator-bridge MCP server
- [ ] `take_screenshot` validates that `device_id` is provided
- [ ] `take_screenshot` generates a default output path using SCREENSHOT_DIR, device_id, and timestamp when output_path is not provided
- [ ] `take_screenshot` supports format parameter with values "png", "jpeg", "bmp", "tiff" (defaults to "png")
- [ ] `take_screenshot` invokes `xcrun simctl io <device_id> screenshot <output_path> --type <format>`
- [ ] `take_screenshot` returns the absolute path to the saved file and its size
- [ ] `take_screenshot` ensures the output directory exists before writing
- [ ] `record_video` tool registered in the simulator-bridge MCP server
- [ ] `record_video` validates that `device_id` and `action` ("start" or "stop") are provided
- [ ] `record_video` on "start": spawns `xcrun simctl io <device_id> recordVideo <output_path>` as a background process and tracks its PID
- [ ] `record_video` on "stop": sends SIGINT to the tracked recording process for the given device_id, waits for the file to finalize
- [ ] `record_video` generates a default output path using VIDEO_DIR, device_id, and timestamp when not provided
- [ ] `record_video` returns file path and file size on stop
- [ ] `record_video` returns an error if "stop" is called with no active recording for the given device_id
- [ ] All tools return descriptive error messages when commands fail
- [ ] Unit tests cover: screenshot with default path, screenshot with custom path and format, video start/stop lifecycle, stop without active recording, and error scenarios

## Files to Create/Modify

- `mcp-servers/simulator-bridge/src/tools/take-screenshot.ts` - take_screenshot implementation
- `mcp-servers/simulator-bridge/src/tools/record-video.ts` - record_video implementation
- `mcp-servers/simulator-bridge/src/tools/media.test.ts` - Unit tests for both tools
- `mcp-servers/simulator-bridge/src/index.ts` - Register the two tools
