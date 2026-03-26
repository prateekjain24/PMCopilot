#!/bin/bash
# PMCopilot Hook: PostToolUse (simulator/emulator tap/swipe)
# Automatically takes a screenshot after every tap or swipe action
# on a simulator/emulator. Saves to ${CLAUDE_PLUGIN_DATA}/screenshots/
# Exit 0 = success (always, never blocks workflow)

# Read JSON input from stdin
INPUT=$(cat)

# Extract session_id, tool_name, device_id, and action details using python3
PARSED=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    session_id = data.get('session_id', 'unknown')
    tool_name = data.get('tool_name', '')
    tool_input = data.get('tool_input', {})
    if isinstance(tool_input, str):
        tool_input = json.loads(tool_input)
    device_id = tool_input.get('device_id', tool_input.get('udid', tool_input.get('serial', '')))
    x = tool_input.get('x', '')
    y = tool_input.get('y', '')
    print(session_id)
    print(tool_name)
    print(device_id)
    print(x)
    print(y)
except Exception:
    print('unknown')
    print('')
    print('')
    print('')
    print('')
" 2>/dev/null)

SESSION_ID=$(echo "$PARSED" | sed -n '1p')
TOOL_NAME=$(echo "$PARSED" | sed -n '2p')
DEVICE_ID=$(echo "$PARSED" | sed -n '3p')
X_COORD=$(echo "$PARSED" | sed -n '4p')
Y_COORD=$(echo "$PARSED" | sed -n '5p')

# If we could not parse the tool name, exit gracefully
if [ -z "$TOOL_NAME" ]; then
  exit 0
fi

# Determine platform from tool name
if echo "$TOOL_NAME" | grep -q "simulator-bridge"; then
  PLATFORM="ios"
elif echo "$TOOL_NAME" | grep -q "emulator-bridge"; then
  PLATFORM="android"
else
  exit 0
fi

# Determine action type from tool name
ACTION="action"
if echo "$TOOL_NAME" | grep -q "tap"; then
  ACTION="tap"
elif echo "$TOOL_NAME" | grep -q "swipe"; then
  ACTION="swipe"
fi

# Set up screenshot directory
SCREENSHOT_DIR="${CLAUDE_PLUGIN_DATA:-/tmp}/screenshots/${SESSION_ID}"
mkdir -p "$SCREENSHOT_DIR" 2>/dev/null

# Generate sequential filename
# Count existing screenshots to determine the next sequence number
EXISTING_COUNT=$(ls -1 "$SCREENSHOT_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ')
NEXT_NUM=$((EXISTING_COUNT + 1))
PADDED_NUM=$(printf "%03d" "$NEXT_NUM")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_PATH="${SCREENSHOT_DIR}/${PADDED_NUM}-${ACTION}-${TIMESTAMP}.png"

# Take screenshot based on platform
if [ "$PLATFORM" = "ios" ]; then
  if which xcrun > /dev/null 2>&1; then
    if [ -n "$DEVICE_ID" ]; then
      xcrun simctl io "$DEVICE_ID" screenshot "$OUTPUT_PATH" 2>/dev/null
    else
      # Try with booted device
      xcrun simctl io booted screenshot "$OUTPUT_PATH" 2>/dev/null
    fi

    if [ $? -eq 0 ] && [ -f "$OUTPUT_PATH" ]; then
      echo "$OUTPUT_PATH"
    else
      echo "Warning: iOS screenshot capture failed for ${ACTION} at (${X_COORD}, ${Y_COORD})" >&2
    fi
  else
    echo "Warning: xcrun not available, skipping iOS screenshot" >&2
  fi

elif [ "$PLATFORM" = "android" ]; then
  if which adb > /dev/null 2>&1; then
    DEVICE_FLAG=""
    if [ -n "$DEVICE_ID" ]; then
      DEVICE_FLAG="-s $DEVICE_ID"
    fi

    # Capture screenshot on device, pull to local, clean up
    adb $DEVICE_FLAG shell screencap -p /sdcard/auto_screenshot.png 2>/dev/null && \
    adb $DEVICE_FLAG pull /sdcard/auto_screenshot.png "$OUTPUT_PATH" 2>/dev/null && \
    adb $DEVICE_FLAG shell rm /sdcard/auto_screenshot.png 2>/dev/null

    if [ $? -eq 0 ] && [ -f "$OUTPUT_PATH" ]; then
      echo "$OUTPUT_PATH"
    else
      echo "Warning: Android screenshot capture failed for ${ACTION} at (${X_COORD}, ${Y_COORD})" >&2
    fi
  else
    echo "Warning: adb not available, skipping Android screenshot" >&2
  fi
fi

# Always exit 0 -- never block the workflow
exit 0
