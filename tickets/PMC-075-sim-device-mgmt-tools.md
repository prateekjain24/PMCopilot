---
id: PMC-075
title: Simulator Device Management Tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-074]
---

## Description

Implement the device management tools in the simulator-bridge MCP server: `list_simulators`, `boot_simulator`, and `shutdown_simulator`. These tools provide the foundation for all simulator interactions by allowing Claude Code to discover available iOS Simulator devices, start them, and shut them down.

### list_simulators

Lists all available iOS Simulator devices and their current states.

- **CLI command:** `xcrun simctl list devices --json`
- **Parameters:**
  - `filter` (string, optional) - Filter devices by name, runtime, or state (e.g., "iPhone 15", "iOS-17", "Booted")
- **Returns:** Array of device objects with `udid`, `name`, `state`, `runtime`, and `isAvailable` fields

### boot_simulator

Boots a simulator device so it is ready for app installation and interaction.

- **CLI command:** `xcrun simctl boot <device_id>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the simulator device
- **Returns:** Confirmation object with device_id and new state

### shutdown_simulator

Shuts down a running simulator device.

- **CLI command:** `xcrun simctl shutdown <device_id>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the simulator device
- **Returns:** Confirmation object with device_id and new state

## Acceptance Criteria

- [ ] `list_simulators` tool registered in the simulator-bridge MCP server
- [ ] `list_simulators` invokes `xcrun simctl list devices --json` and parses the JSON output
- [ ] `list_simulators` supports optional `filter` parameter to narrow results by device name, runtime, or state
- [ ] `list_simulators` returns structured array with `udid`, `name`, `state`, `runtime`, and `isAvailable` per device
- [ ] `boot_simulator` tool registered in the simulator-bridge MCP server
- [ ] `boot_simulator` validates `device_id` is provided and invokes `xcrun simctl boot <device_id>`
- [ ] `boot_simulator` returns confirmation with device_id and state "Booted"
- [ ] `boot_simulator` handles already-booted devices gracefully (not an error)
- [ ] `shutdown_simulator` tool registered in the simulator-bridge MCP server
- [ ] `shutdown_simulator` validates `device_id` is provided and invokes `xcrun simctl shutdown <device_id>`
- [ ] `shutdown_simulator` returns confirmation with device_id and state "Shutdown"
- [ ] `shutdown_simulator` handles already-shutdown devices gracefully (not an error)
- [ ] All three tools return descriptive error messages when `xcrun simctl` commands fail
- [ ] Unit tests cover: list parsing, filter matching, boot success, shutdown success, and error scenarios

## Files to Create/Modify

- `mcp-servers/simulator-bridge/src/tools/list-simulators.ts` - list_simulators implementation
- `mcp-servers/simulator-bridge/src/tools/boot-simulator.ts` - boot_simulator implementation
- `mcp-servers/simulator-bridge/src/tools/shutdown-simulator.ts` - shutdown_simulator implementation
- `mcp-servers/simulator-bridge/src/tools/device-mgmt.test.ts` - Unit tests for all three tools
- `mcp-servers/simulator-bridge/src/index.ts` - Register the three tools
