#!/bin/bash
# PMCopilot Hook: SessionStart
# Checks if iOS Simulator (xcrun simctl) and/or Android Emulator (adb/emulator)
# are available. Outputs JSON context about available devices.
# Exit 0 = allow session (informational only, never blocks)

# Read stdin (SessionStart may not have meaningful input)
cat > /dev/null 2>&1 || true

# --- iOS Simulator availability ---
IOS_AVAILABLE=false
IOS_SIMULATORS="[]"

if which xcrun > /dev/null 2>&1; then
  SIMCTL_JSON=$(xcrun simctl list devices --json 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$SIMCTL_JSON" ]; then
    IOS_AVAILABLE=true
    # Extract booted and available device names using python3
    IOS_SIMULATORS=$(echo "$SIMCTL_JSON" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    devices = data.get('devices', {})
    result = []
    for runtime, dev_list in devices.items():
        for d in dev_list:
            if d.get('isAvailable', False) or d.get('state', '') == 'Booted':
                result.append({
                    'name': d.get('name', ''),
                    'udid': d.get('udid', ''),
                    'state': d.get('state', 'Unknown'),
                    'runtime': runtime.split('.')[-1] if '.' in runtime else runtime
                })
    print(json.dumps(result))
except Exception:
    print('[]')
" 2>/dev/null)
    if [ -z "$IOS_SIMULATORS" ]; then
      IOS_SIMULATORS="[]"
    fi
  fi
fi

# --- Android Emulator/Device availability ---
ANDROID_AVAILABLE=false
ANDROID_EMULATORS="[]"
ANDROID_DEVICES="[]"

# Check for ANDROID_HOME and emulator command
ANDROID_HOME_SET=false
if [ -n "$ANDROID_HOME" ]; then
  ANDROID_HOME_SET=true
fi

if which emulator > /dev/null 2>&1; then
  AVD_LIST=$(emulator -list-avds 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$AVD_LIST" ]; then
    ANDROID_AVAILABLE=true
    ANDROID_EMULATORS=$(echo "$AVD_LIST" | python3 -c "
import sys, json
try:
    lines = [line.strip() for line in sys.stdin if line.strip()]
    print(json.dumps(lines))
except Exception:
    print('[]')
" 2>/dev/null)
    if [ -z "$ANDROID_EMULATORS" ]; then
      ANDROID_EMULATORS="[]"
    fi
  fi
fi

if which adb > /dev/null 2>&1; then
  ADB_OUTPUT=$(adb devices 2>/dev/null)
  if [ $? -eq 0 ] && [ -n "$ADB_OUTPUT" ]; then
    ANDROID_DEVICES=$(echo "$ADB_OUTPUT" | python3 -c "
import sys, json
try:
    lines = sys.stdin.read().strip().split('\n')
    devices = []
    for line in lines[1:]:  # skip header
        parts = line.strip().split('\t')
        if len(parts) >= 2 and parts[1].strip():
            devices.append({
                'id': parts[0].strip(),
                'state': parts[1].strip()
            })
    print(json.dumps(devices))
except Exception:
    print('[]')
" 2>/dev/null)
    if [ -z "$ANDROID_DEVICES" ]; then
      ANDROID_DEVICES="[]"
    fi
    # If we have connected devices, android is available even without emulator command
    DEVICE_COUNT=$(echo "$ANDROID_DEVICES" | python3 -c "
import sys, json
try:
    print(len(json.load(sys.stdin)))
except:
    print(0)
" 2>/dev/null)
    if [ "$DEVICE_COUNT" -gt 0 ] 2>/dev/null; then
      ANDROID_AVAILABLE=true
    fi
  fi
fi

# --- Output JSON summary ---
python3 -c "
import json
result = {
    'ios': {
        'available': $( [ "$IOS_AVAILABLE" = true ] && echo 'True' || echo 'False' ),
        'simulators': $IOS_SIMULATORS
    },
    'android': {
        'available': $( [ "$ANDROID_AVAILABLE" = true ] && echo 'True' || echo 'False' ),
        'emulators': $ANDROID_EMULATORS,
        'devices': $ANDROID_DEVICES
    }
}
print(json.dumps(result, indent=2))
" 2>/dev/null || echo '{"ios": {"available": false, "simulators": []}, "android": {"available": false, "emulators": [], "devices": []}}'

# Always exit 0 -- this is informational, never blocks session
exit 0
