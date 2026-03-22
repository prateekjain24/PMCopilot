---
id: PMC-076
title: Simulator App Management Tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-074]
---

## Description

Implement the app lifecycle management tools in the simulator-bridge MCP server: `install_app`, `launch_app`, `terminate_app`, and `get_app_container`. These tools allow Claude Code to install, run, stop, and inspect applications on a booted iOS Simulator.

### install_app

Installs an application bundle onto a simulator device.

- **CLI command:** `xcrun simctl install <device_id> <app_path>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `app_path` (string, required) - Path to the .app bundle to install
- **Returns:** Confirmation with device_id, app_path, and success status

### launch_app

Launches an installed application on a simulator device.

- **CLI command:** `xcrun simctl launch <device_id> <bundle_id>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `bundle_id` (string, required) - Bundle identifier of the app (e.g., "com.example.MyApp")
- **Returns:** Confirmation with device_id, bundle_id, and PID if available

### terminate_app

Terminates a running application on a simulator device.

- **CLI command:** `xcrun simctl terminate <device_id> <bundle_id>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the booted simulator device
  - `bundle_id` (string, required) - Bundle identifier of the app
- **Returns:** Confirmation with device_id, bundle_id, and terminated status

### get_app_container

Returns the filesystem path of an installed application's container on the simulator.

- **CLI command:** `xcrun simctl get_app_container <device_id> <bundle_id>`
- **Parameters:**
  - `device_id` (string, required) - UDID of the simulator device
  - `bundle_id` (string, required) - Bundle identifier of the app
- **Returns:** Object with device_id, bundle_id, and container_path

## Acceptance Criteria

- [ ] `install_app` tool registered in the simulator-bridge MCP server
- [ ] `install_app` validates that `device_id` and `app_path` are provided
- [ ] `install_app` validates that `app_path` ends with `.app` and the path exists
- [ ] `install_app` invokes `xcrun simctl install <device_id> <app_path>` and returns success confirmation
- [ ] `launch_app` tool registered in the simulator-bridge MCP server
- [ ] `launch_app` validates that `device_id` and `bundle_id` are provided
- [ ] `launch_app` invokes `xcrun simctl launch <device_id> <bundle_id>` and returns confirmation with PID
- [ ] `terminate_app` tool registered in the simulator-bridge MCP server
- [ ] `terminate_app` validates that `device_id` and `bundle_id` are provided
- [ ] `terminate_app` invokes `xcrun simctl terminate <device_id> <bundle_id>` and returns confirmation
- [ ] `terminate_app` handles gracefully when the app is not running
- [ ] `get_app_container` tool registered in the simulator-bridge MCP server
- [ ] `get_app_container` validates that `device_id` and `bundle_id` are provided
- [ ] `get_app_container` invokes `xcrun simctl get_app_container <device_id> <bundle_id>` and returns the container path
- [ ] All four tools return descriptive error messages when commands fail (e.g., device not booted, app not installed)
- [ ] Unit tests cover: install success, launch success with PID parsing, terminate success, terminate when not running, get_app_container success, and error scenarios

## Files to Create/Modify

- `mcp-servers/simulator-bridge/src/tools/install-app.ts` - install_app implementation
- `mcp-servers/simulator-bridge/src/tools/launch-app.ts` - launch_app implementation
- `mcp-servers/simulator-bridge/src/tools/terminate-app.ts` - terminate_app implementation
- `mcp-servers/simulator-bridge/src/tools/get-app-container.ts` - get_app_container implementation
- `mcp-servers/simulator-bridge/src/tools/app-mgmt.test.ts` - Unit tests for all four tools
- `mcp-servers/simulator-bridge/src/index.ts` - Register the four tools
