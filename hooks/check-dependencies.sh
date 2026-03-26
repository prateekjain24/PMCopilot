#!/bin/bash
# PMCopilot Diagnostic: Check all optional dependencies
# Reports installed/not-installed status with version info for each tool.
# Exit 0 always (diagnostic only, never blocks anything)

echo "=== PMCopilot Dependency Check ==="
echo ""

# Helper function: check a command and print its status
check_tool() {
  local TOOL_NAME="$1"
  local CMD="$2"
  local VERSION_CMD="$3"
  local DESCRIPTION="$4"

  if which "$CMD" > /dev/null 2>&1; then
    VERSION="unknown"
    if [ -n "$VERSION_CMD" ]; then
      VERSION=$(eval "$VERSION_CMD" 2>/dev/null | head -1)
    fi
    echo "[INSTALLED] $TOOL_NAME ($CMD)"
    echo "           Version: $VERSION"
    echo "           Purpose: $DESCRIPTION"
  else
    echo "[NOT INSTALLED] $TOOL_NAME ($CMD)"
    echo "           Purpose: $DESCRIPTION"
  fi
  echo ""
}

# --- Core dependencies ---
echo "--- Core Tools ---"
echo ""

check_tool "Python 3" "python3" "python3 --version" \
  "Required for hook scripts (JSON parsing, data processing)"

check_tool "jq" "jq" "jq --version" \
  "JSON processing (optional, hooks use python3 as fallback)"

# --- iOS Simulator tools ---
echo "--- iOS Simulator ---"
echo ""

check_tool "Xcode CLI (xcrun)" "xcrun" "xcrun --version" \
  "iOS Simulator control via xcrun simctl"

if which xcrun > /dev/null 2>&1; then
  SIMCTL_CHECK=$(xcrun simctl list devices 2>/dev/null)
  if [ $? -eq 0 ]; then
    BOOTED_COUNT=$(echo "$SIMCTL_CHECK" | grep -c "Booted" 2>/dev/null || echo "0")
    TOTAL_COUNT=$(xcrun simctl list devices available 2>/dev/null | grep -c "(" || echo "0")
    echo "           Available simulators: $TOTAL_COUNT"
    echo "           Currently booted: $BOOTED_COUNT"
    echo ""
  fi
fi

# --- Android tools ---
echo "--- Android Emulator ---"
echo ""

if [ -n "$ANDROID_HOME" ]; then
  echo "[SET] ANDROID_HOME = $ANDROID_HOME"
else
  echo "[NOT SET] ANDROID_HOME environment variable"
fi
echo ""

check_tool "Android Emulator" "emulator" "emulator -version" \
  "Android Emulator for competitor app teardowns"

if which emulator > /dev/null 2>&1; then
  AVD_LIST=$(emulator -list-avds 2>/dev/null)
  if [ -n "$AVD_LIST" ]; then
    AVD_COUNT=$(echo "$AVD_LIST" | wc -l | tr -d ' ')
    echo "           Available AVDs: $AVD_COUNT"
    echo ""
  fi
fi

check_tool "Android Debug Bridge (adb)" "adb" "adb version" \
  "Android device/emulator communication and control"

if which adb > /dev/null 2>&1; then
  DEVICE_COUNT=$(adb devices 2>/dev/null | tail -n +2 | grep -c "device$" || echo "0")
  echo "           Connected devices: $DEVICE_COUNT"
  echo ""
fi

# --- Summary ---
echo "=== Summary ==="
echo ""

MISSING=""

if ! which python3 > /dev/null 2>&1; then
  MISSING="$MISSING python3"
fi
if ! which xcrun > /dev/null 2>&1; then
  MISSING="$MISSING xcrun"
fi
if ! which adb > /dev/null 2>&1; then
  MISSING="$MISSING adb"
fi
if ! which emulator > /dev/null 2>&1; then
  MISSING="$MISSING emulator"
fi
if ! which jq > /dev/null 2>&1; then
  MISSING="$MISSING jq"
fi

if [ -z "$MISSING" ]; then
  echo "All optional dependencies are installed."
else
  echo "Missing optional dependencies:$MISSING"
  echo "PMCopilot will use graceful degradation for features that require these tools."
fi

echo ""
echo "Note: iOS Simulator and Android Emulator are optional. Skills that require"
echo "them will fall back to web-only analysis or manual data input when unavailable."

# Always exit 0
exit 0
