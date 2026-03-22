---
id: PMC-082
title: Emulator app management tools
phase: 4 - App Teardown Engine
status: done
type: mcp-tool
estimate: 1
dependencies: [PMC-080]
---

## Description

Implement the app lifecycle management tools for the emulator-bridge MCP server. These tools handle installing APKs, launching activities, granting runtime permissions, and clearing app data -- the core operations needed to set up and reset apps during teardowns.

**Tools:**

1. **install_apk** -- Installs an APK onto a device.
   - CLI: `adb -s <device_id> install <apk_path>`
   - Params: `device_id` (required), `apk_path` (required)
   - Returns: success/failure with installer output

2. **launch_app** -- Launches an app activity.
   - CLI: `adb -s <device_id> shell am start -n <package>/<activity>`
   - Params: `device_id` (required), `package` (required), `activity` (required)
   - Returns: launch result including any error output

3. **grant_permission** -- Grants a runtime permission to an app.
   - CLI: `adb -s <device_id> shell pm grant <package> <permission>`
   - Params: `device_id` (required), `package` (required), `permission` (required)
   - Returns: success/failure

4. **clear_app_data** -- Clears all data for an app (storage, cache, accounts).
   - CLI: `adb -s <device_id> shell pm clear <package>`
   - Params: `device_id` (required), `package` (required)
   - Returns: success/failure

## Acceptance Criteria

- [ ] `install_apk` validates that `apk_path` exists before calling adb
- [ ] `install_apk` handles reinstall scenarios (already-installed app) gracefully
- [ ] `launch_app` constructs the correct component name from `package` and `activity`
- [ ] `launch_app` detects and reports launch errors (e.g. activity not found, security exception)
- [ ] `grant_permission` validates permission string format (must start with `android.permission.`)
- [ ] `clear_app_data` returns confirmation of data cleared
- [ ] All tools target a specific device via `-s <device_id>` flag
- [ ] All tools return structured JSON responses with stdout/stderr
- [ ] Unit tests with mocked adb output for each tool
- [ ] Error cases covered: missing device, missing APK file, invalid package name

## Files to Create/Modify

- `mcp-servers/emulator-bridge/src/tools/install-apk.ts`
- `mcp-servers/emulator-bridge/src/tools/launch-app.ts`
- `mcp-servers/emulator-bridge/src/tools/grant-permission.ts`
- `mcp-servers/emulator-bridge/src/tools/clear-app-data.ts`
- `mcp-servers/emulator-bridge/src/index.ts` (register tools)
- `mcp-servers/emulator-bridge/tests/tools/install-apk.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/launch-app.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/grant-permission.test.ts`
- `mcp-servers/emulator-bridge/tests/tools/clear-app-data.test.ts`
