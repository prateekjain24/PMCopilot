#!/bin/bash
# PMCopilot Hook: PreToolUse (simulator-bridge/emulator-bridge tools)
# Verifies that a simulator/emulator is running before allowing
# simulator-bridge or emulator-bridge MCP tool calls.
# Exit 0 = allow tool use, Exit 2 = block with error message

# Read JSON input from stdin (hook receives tool context as JSON)
INPUT=$(cat)

# Extract tool_name and device_id from the JSON tool_input
PARSED=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tool_name = data.get('tool_name', '')
    tool_input = data.get('tool_input', {})
    if isinstance(tool_input, str):
        import json as j
        tool_input = j.loads(tool_input)
    device_id = tool_input.get('device_id', tool_input.get('udid', tool_input.get('serial', '')))
    print(tool_name)
    print(device_id)
except Exception:
    print('')
    print('')
" 2>/dev/null)

TOOL_NAME=$(echo "$PARSED" | head -1)
DEVICE_ID=$(echo "$PARSED" | tail -1)

# If we could not extract the tool name, allow the operation
if [ -z "$TOOL_NAME" ]; then
  exit 0
fi

# Determine platform from tool name
if echo "$TOOL_NAME" | grep -q "simulator-bridge"; then
  PLATFORM="ios"
elif echo "$TOOL_NAME" | grep -q "emulator-bridge"; then
  PLATFORM="android"
else
  # Not a simulator/emulator tool -- allow
  exit 0
fi

# --- iOS: Check if simulator is booted ---
if [ "$PLATFORM" = "ios" ]; then
  if ! which xcrun > /dev/null 2>&1; then
    echo "xcrun is not installed. iOS Simulator tools require Xcode Command Line Tools." >&2
    echo "Install with: xcode-select --install" >&2
    exit 2
  fi

  SIMCTL_JSON=$(xcrun simctl list devices --json 2>/dev/null)
  if [ $? -ne 0 ] || [ -z "$SIMCTL_JSON" ]; then
    echo "Failed to query iOS Simulator devices. Ensure Xcode is properly installed." >&2
    exit 2
  fi

  IS_BOOTED=$(echo "$SIMCTL_JSON" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    device_id = '$DEVICE_ID'
    devices = data.get('devices', {})
    for runtime, dev_list in devices.items():
        for d in dev_list:
            if device_id:
                if d.get('udid', '') == device_id and d.get('state', '') == 'Booted':
                    print('yes')
                    sys.exit(0)
            else:
                # No specific device_id -- check if any simulator is booted
                if d.get('state', '') == 'Booted':
                    print('yes')
                    sys.exit(0)
    print('no')
except Exception:
    print('no')
" 2>/dev/null)

  if [ "$IS_BOOTED" = "yes" ]; then
    exit 0
  else
    if [ -n "$DEVICE_ID" ]; then
      echo "iOS Simulator device '$DEVICE_ID' is not currently booted." >&2
      echo "Start it with: xcrun simctl boot $DEVICE_ID" >&2
    else
      echo "No iOS Simulator device is currently booted." >&2
      echo "List available simulators: xcrun simctl list devices available" >&2
      echo "Boot a simulator: xcrun simctl boot <device-udid>" >&2
      echo "Or open Simulator.app and start a device from the UI." >&2
    fi
    exit 2
  fi
fi

# --- Android: Check if emulator/device is connected ---
if [ "$PLATFORM" = "android" ]; then
  if ! which adb > /dev/null 2>&1; then
    echo "adb is not installed. Android Emulator tools require the Android SDK Platform Tools." >&2
    echo "Install via Android Studio or download from: https://developer.android.com/tools/releases/platform-tools" >&2
    if [ -n "$ANDROID_HOME" ]; then
      echo "ANDROID_HOME is set to: $ANDROID_HOME" >&2
      echo "Check if adb exists at: \$ANDROID_HOME/platform-tools/adb" >&2
    fi
    exit 2
  fi

  ADB_OUTPUT=$(adb devices 2>/dev/null)
  if [ $? -ne 0 ] || [ -z "$ADB_OUTPUT" ]; then
    echo "Failed to query Android devices. Ensure adb server is running." >&2
    echo "Start adb server with: adb start-server" >&2
    exit 2
  fi

  IS_CONNECTED=$(echo "$ADB_OUTPUT" | python3 -c "
import sys
try:
    lines = sys.stdin.read().strip().split('\n')
    device_id = '$DEVICE_ID'
    for line in lines[1:]:  # skip header
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            did = parts[0].strip()
            state = parts[1].strip()
            if device_id:
                if did == device_id and state == 'device':
                    print('yes')
                    sys.exit(0)
            else:
                # No specific device_id -- check if any device is connected
                if state == 'device':
                    print('yes')
                    sys.exit(0)
    print('no')
except Exception:
    print('no')
" 2>/dev/null)

  if [ "$IS_CONNECTED" = "yes" ]; then
    exit 0
  else
    if [ -n "$DEVICE_ID" ]; then
      echo "Android device '$DEVICE_ID' is not connected or not in 'device' state." >&2
      echo "Check connected devices with: adb devices" >&2
      echo "If using an emulator, start it with: emulator -avd <avd-name>" >&2
    else
      echo "No Android device or emulator is currently connected." >&2
      echo "List available AVDs: emulator -list-avds" >&2
      echo "Start an emulator: emulator -avd <avd-name>" >&2
      echo "Or connect a physical device via USB with USB debugging enabled." >&2
    fi
    exit 2
  fi
fi

# Fallback -- should not reach here
exit 0
