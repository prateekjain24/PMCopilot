---
id: PMC-104
title: Write simulator/emulator integration tests
phase: 5 - Polish and Distribution
status: done
type: test
estimate: 1
dependencies: [PMC-075, PMC-076, PMC-077, PMC-078, PMC-079, PMC-081, PMC-082, PMC-083, PMC-084, PMC-085]
---

## Description

Write integration tests for the simulator-bridge and emulator-bridge MCP servers. Unlike the pm-frameworks unit tests, these tests require actual simulator/emulator availability and exercise real device interactions. Tests should be tagged so they can be skipped in CI environments without device access.

The test suite validates that each MCP tool correctly communicates with the underlying platform tooling (`xcrun simctl` for iOS, `adb`/`emulator` for Android) and produces the expected results.

Test categories:

**iOS Simulator (simulator-bridge)**:
- Device management: list, create, boot, shutdown, delete devices
- App management: install, launch, terminate, uninstall apps
- Screenshot/video: capture screenshot, start/stop video recording
- Input: tap, swipe, type text, press hardware buttons
- Accessibility: dump accessibility tree, query element properties

**Android Emulator (emulator-bridge)**:
- Device management: list AVDs, start, stop, snapshot management
- App management: install APK, launch activity, force-stop, uninstall
- Screenshot/video: capture screenshot, screen record
- Input: tap, swipe, text input, key events
- UI dump: capture UI hierarchy XML, query view properties

## Acceptance Criteria

- [ ] Test files exist at `tests/simulator-bridge/` and `tests/emulator-bridge/`
- [ ] All tests are tagged with `@requires-simulator` or `@requires-emulator` for conditional execution
- [ ] A test setup helper detects device availability and skips tests gracefully when devices are absent
- [ ] iOS device management tests: list devices, boot a simulator, verify boot state, shut down
- [ ] iOS app management tests: install a test app, launch it, verify it is running, terminate it
- [ ] iOS screenshot tests: capture a screenshot, verify the output file is a valid PNG
- [ ] iOS input tests: send a tap event, send a swipe event, verify no errors
- [ ] iOS accessibility tests: dump accessibility tree, verify it contains expected root elements
- [ ] Android device management tests: list AVDs, start an emulator, verify boot, stop
- [ ] Android app management tests: install a test APK, launch activity, verify running, force-stop
- [ ] Android screenshot tests: capture a screenshot, verify valid PNG output
- [ ] Android input tests: send tap, swipe, and text input events, verify no errors
- [ ] Android UI dump tests: capture UI hierarchy, verify valid XML structure
- [ ] Tests clean up after themselves (shut down devices they started, uninstall apps they installed)
- [ ] Tests can be run with `bun test --tag requires-simulator` and `bun test --tag requires-emulator`
- [ ] A CI configuration example is provided showing how to skip device-dependent tests

## Files to Create/Modify

- `tests/simulator-bridge/device-management.test.ts` -- iOS device management tests
- `tests/simulator-bridge/app-management.test.ts` -- iOS app management tests
- `tests/simulator-bridge/screenshot-video.test.ts` -- iOS capture tests
- `tests/simulator-bridge/input.test.ts` -- iOS input tests
- `tests/simulator-bridge/accessibility.test.ts` -- iOS accessibility tests
- `tests/emulator-bridge/device-management.test.ts` -- Android device management tests
- `tests/emulator-bridge/app-management.test.ts` -- Android app management tests
- `tests/emulator-bridge/screenshot-video.test.ts` -- Android capture tests
- `tests/emulator-bridge/input.test.ts` -- Android input tests
- `tests/emulator-bridge/ui-dump.test.ts` -- Android UI hierarchy tests
- `tests/simulator-bridge/setup.ts` -- iOS test utilities and device detection
- `tests/emulator-bridge/setup.ts` -- Android test utilities and device detection
