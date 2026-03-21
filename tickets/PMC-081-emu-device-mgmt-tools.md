---
id: PMC-081
title: Emulator device management tools
phase: 4 - App Teardown Engine
status: todo
type: mcp-tool
estimate: 1
dependencies: [PMC-080]
---

## Description

Implement the device management tools for the emulator-bridge MCP server. These tools let the agent discover available AVDs, see which devices are currently connected, and boot an emulator instance.

**Tools:**

1. **list_emulators** -- Lists all available Android Virtual Devices.
   - CLI: `emulator -list-avds`
   - Params: none
   - Returns: array of AVD names

2. **list_devices** -- Lists all connected devices/emulators and their states.
   - CLI: `adb devices`
   - Params: none
   - Returns: array of `{ device_id, state }` (e.g. `device`, `offline`, `unauthorized`)

3. **start_emulator** -- Boots an AVD by name. Waits for the device to reach `device` state before returning.
   - CLI: `emulator -avd <name> [options]`
   - Params: `avd_name` (required), `options` (optional object -- e.g. `{ no_snapshot: true, wipe_data: true }`)
   - The emulator process must be spawned detached so the MCP server does not block. The tool should poll `adb devices` until the new emulator appears with state `device` or a timeout (default 120s) is reached.

## Acceptance Criteria

- [ ] `list_emulators` tool registered and returns AVD names parsed from `emulator -list-avds` output
- [ ] `list_devices` tool registered and returns structured device list parsed from `adb devices` output
- [ ] `start_emulator` spawns emulator process in detached mode and polls until device is online
- [ ] `start_emulator` returns error if AVD name is not found in available AVDs
- [ ] `start_emulator` supports optional flags: `no_snapshot`, `wipe_data`, `gpu_mode`, `memory`
- [ ] `start_emulator` times out gracefully after configurable period (default 120s)
- [ ] All tools return structured JSON responses
- [ ] Unit tests with mocked adb/emulator output for each tool
- [ ] Integration test that verifies tool registration in MCP server

## Files to Create/Modify

- `mcp-servers/emulator-bridge/src/tools/list-emulators.ts`
- `mcp-servers/emulator-bridge/src/tools/list-devices.ts`
- `mcp-servers/emulator-bridge/src/tools/start-emulator.ts`
- `mcp-servers/emulator-bridge/src/index.ts` (register tools)
- `mcp-servers/emulator-bridge/tests/tools/list-emulators.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/list-devices.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/start-emulator.test.ts`
