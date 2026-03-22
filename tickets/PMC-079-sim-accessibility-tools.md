---
id: PMC-079
title: Simulator Accessibility and URL Tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-074]
---

## Description

Implement the accessibility inspection and URL handling tools in the simulator-bridge MCP server: `get_accessibility_tree` and `open_url`. These tools are critical for intelligent app interaction -- the accessibility tree allows Claude Code to understand the current screen structure and identify UI elements by label, type, and position, while open_url enables deep-link navigation and URL scheme testing.

### get_accessibility_tree

Retrieves the full accessibility hierarchy of the current simulator screen as structured JSON. This is the primary mechanism for Claude Code to "see" and understand the app UI without relying solely on screenshots. Each element in the tree includes its type, label, frame (position and size), value, and traits.

- **CLI command:** `idb ui describe-all --udid <device_id> --json`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
- **Returns:** Parsed JSON array of accessibility elements, each containing `type`, `label`, `frame` (x, y, width, height), `value`, and `traits`

### open_url

Opens a URL on the simulator, which can be a web URL (opens in Safari) or a custom URL scheme / universal link (opens in the registered app). Useful for testing deep links, onboarding flows triggered by URL schemes, and navigating directly to specific app screens.

- **CLI command:** `xcrun simctl openurl <device_id> <url>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `url` (string, required) - URL to open (e.g., "https://example.com", "myapp://screen/settings")
- **Returns:** Confirmation with device_id, url, and success status

## Acceptance Criteria

- [ ] `get_accessibility_tree` tool registered in the simulator-bridge MCP server
- [ ] `get_accessibility_tree` validates that `device_id` is provided
- [ ] `get_accessibility_tree` invokes `idb ui describe-all --udid <device_id> --json`
- [ ] `get_accessibility_tree` parses the JSON output into a structured array of accessibility elements
- [ ] Each element in the returned array includes `type`, `label`, `frame` (with x, y, width, height), `value`, and `traits` fields
- [ ] `get_accessibility_tree` handles empty screens (returns empty array, not an error)
- [ ] `get_accessibility_tree` checks for `idb` availability and returns a clear error if not installed
- [ ] `open_url` tool registered in the simulator-bridge MCP server
- [ ] `open_url` validates that `device_id` and `url` are provided
- [ ] `open_url` validates that `url` is a well-formed URL (has a scheme)
- [ ] `open_url` invokes `xcrun simctl openurl <device_id> <url>` and returns confirmation
- [ ] `open_url` supports both http/https URLs and custom URL schemes
- [ ] Both tools return descriptive error messages when commands fail
- [ ] Unit tests cover: accessibility tree parsing with multiple elements, empty screen, malformed JSON handling, open_url with web URL, open_url with custom scheme, invalid URL, and error scenarios

## Files to Create/Modify

- `mcp-servers/simulator-bridge/src/tools/get-accessibility-tree.ts` - get_accessibility_tree implementation
- `mcp-servers/simulator-bridge/src/tools/open-url.ts` - open_url implementation
- `mcp-servers/simulator-bridge/src/tools/accessibility.test.ts` - Unit tests for both tools
- `mcp-servers/simulator-bridge/src/index.ts` - Register the two tools
