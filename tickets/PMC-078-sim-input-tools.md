---
id: PMC-078
title: Simulator Input Interaction Tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-074]
---

## Description

Implement the user input simulation tools in the simulator-bridge MCP server: `tap`, `swipe`, `type_text`, and `press_button`. These tools use Facebook's `idb` (iOS Development Bridge) to simulate touch and hardware button interactions on a booted iOS Simulator. This enables Claude Code to drive app flows programmatically for teardowns and automated UX walkthroughs.

**Prerequisite:** `idb` must be installed on the host machine (`brew install idb-companion`).

### tap

Simulates a tap gesture at a specific screen coordinate.

- **CLI command:** `idb ui tap --udid <device_id> <x> <y>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `x` (number, required) - X coordinate of the tap point
  - `y` (number, required) - Y coordinate of the tap point
- **Returns:** Confirmation with device_id, coordinates, and success status

### swipe

Simulates a swipe gesture from one point to another.

- **CLI command:** `idb ui swipe --udid <device_id> <x1> <y1> <x2> <y2> --duration <duration>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `x1` (number, required) - Start X coordinate
  - `y1` (number, required) - Start Y coordinate
  - `x2` (number, required) - End X coordinate
  - `y2` (number, required) - End Y coordinate
  - `duration` (number, optional) - Swipe duration in seconds (default: 0.5)
- **Returns:** Confirmation with device_id, start/end coordinates, duration, and success status

### type_text

Types text into the currently focused input field.

- **CLI command:** `idb ui text --udid <device_id> <text>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `text` (string, required) - Text to type
- **Returns:** Confirmation with device_id, text typed, and success status

### press_button

Simulates pressing a hardware button (home or lock).

- **CLI command:** `idb ui button --udid <device_id> <button>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `button` (string, required) - Button name: "home" or "lock"
- **Returns:** Confirmation with device_id, button pressed, and success status

## Acceptance Criteria

- [ ] `tap` tool registered in the simulator-bridge MCP server
- [ ] `tap` validates that `device_id`, `x`, and `y` are provided and coordinates are non-negative numbers
- [ ] `tap` invokes `idb ui tap --udid <device_id> <x> <y>` and returns confirmation
- [ ] `swipe` tool registered in the simulator-bridge MCP server
- [ ] `swipe` validates that `device_id`, `x1`, `y1`, `x2`, `y2` are provided and are non-negative numbers
- [ ] `swipe` supports optional `duration` parameter (defaults to 0.5 seconds)
- [ ] `swipe` invokes `idb ui swipe --udid <device_id> <x1> <y1> <x2> <y2> --duration <duration>`
- [ ] `type_text` tool registered in the simulator-bridge MCP server
- [ ] `type_text` validates that `device_id` and `text` are provided
- [ ] `type_text` properly escapes special characters in the text before passing to the CLI
- [ ] `type_text` invokes `idb ui text --udid <device_id> <text>` and returns confirmation
- [ ] `press_button` tool registered in the simulator-bridge MCP server
- [ ] `press_button` validates that `device_id` and `button` are provided
- [ ] `press_button` validates that `button` is one of "home" or "lock"
- [ ] `press_button` invokes `idb ui button --udid <device_id> <button>` and returns confirmation
- [ ] All four tools check for `idb` availability and return a clear error if not installed
- [ ] All tools return descriptive error messages when commands fail
- [ ] Unit tests cover: tap success, swipe with default and custom duration, type_text with special characters, press_button for home and lock, invalid button name, and idb-not-found error

## Files to Create/Modify

- `mcp-servers/simulator-bridge/src/tools/tap.ts` - tap implementation
- `mcp-servers/simulator-bridge/src/tools/swipe.ts` - swipe implementation
- `mcp-servers/simulator-bridge/src/tools/type-text.ts` - type_text implementation
- `mcp-servers/simulator-bridge/src/tools/press-button.ts` - press_button implementation
- `mcp-servers/simulator-bridge/src/tools/input.test.ts` - Unit tests for all four tools
- `mcp-servers/simulator-bridge/src/index.ts` - Register the four tools
