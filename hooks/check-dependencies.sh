#!/bin/bash
# PMCopilot Diagnostic: Check all optional dependencies
# Reads from cached environment.json (created by scripts/install.sh) if available,
# otherwise falls back to live detection.
# Exit 0 always (diagnostic only, never blocks anything)

PLUGIN_DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/pmcopilot}"
ENV_CACHE="$PLUGIN_DATA/environment.json"

echo "=== PMCopilot Dependency Check ==="
echo ""

# If install.sh has been run, use cached state
if [ -f "$ENV_CACHE" ]; then
  CACHE_AGE_DAYS=0
  if command -v stat &>/dev/null; then
    if [[ "$(uname -s)" == "Darwin" ]]; then
      MTIME=$(stat -f %m "$ENV_CACHE" 2>/dev/null || echo "0")
    else
      MTIME=$(stat -c %Y "$ENV_CACHE" 2>/dev/null || echo "0")
    fi
    NOW=$(date +%s)
    CACHE_AGE_DAYS=$(( (NOW - MTIME) / 86400 ))
  fi

  echo "Using cached environment from install.sh (${CACHE_AGE_DAYS}d old)"
  if [ "$CACHE_AGE_DAYS" -gt 7 ]; then
    echo "  STALE: Consider re-running ./scripts/install.sh to refresh"
  fi
  echo ""

  python3 -c "
import json

with open('$ENV_CACHE') as f:
    env = json.load(f)

def status(key, label, detail=''):
    val = env.get(key, '')
    if val and val != '0':
        print(f'[INSTALLED] {label}: {val}')
    else:
        print(f'[NOT FOUND] {label}')
    if detail:
        print(f'            {detail}')

print('--- Core ---')
status('node', 'Node.js')
status('bun', 'Bun')
print()

print('--- Android ---')
status('adb', 'adb', env.get('adb_path', ''))
if env.get('android_home'):
    print(f'[SET]       ANDROID_HOME: {env[\"android_home\"]}')
else:
    print('[NOT SET]   ANDROID_HOME')
print()

print('--- iOS ---')
status('simctl', 'simctl')
if env.get('simulators', '0') != '0':
    print(f'            Simulators: {env[\"simulators\"]}')
status('idb', 'idb', env.get('idb_path', ''))
print()

print('--- Other ---')
status('chrome', 'Chrome')
print()

builds_ok = env.get('builds_ok', 0)
builds_fail = env.get('builds_fail', 0)
print(f'MCP Servers: {builds_ok} built, {builds_fail} failed')
print(f'Installed: {env.get(\"installed_at\", \"unknown\")}')
" 2>/dev/null

  echo ""
  echo "Re-run ./scripts/install.sh to update."
  exit 0
fi

# Fallback: live detection (original behavior)
echo "No cached environment. Run ./scripts/install.sh for full setup."
echo "Falling back to live detection..."
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

check_tool "Node.js" "node" "node --version" \
  "Required for MCP servers"

check_tool "Bun" "bun" "bun --version" \
  "Required to build MCP servers"

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

check_tool "idb_companion" "idb_companion" "idb_companion --version" \
  "Enriched iOS Simulator interaction (optional)"

# --- Android tools ---
echo "--- Android ---"
echo ""

if [ -n "${ANDROID_HOME:-}" ]; then
  echo "[SET] ANDROID_HOME = $ANDROID_HOME"
elif [ -n "${ANDROID_NDK_HOME:-}" ]; then
  echo "[SET] ANDROID_NDK_HOME = $ANDROID_NDK_HOME (note: this is the NDK, not the SDK)"
else
  echo "[NOT SET] ANDROID_HOME environment variable"
fi
echo ""

check_tool "Android Debug Bridge (adb)" "adb" "adb version" \
  "Android device/emulator communication and control"

# --- Summary ---
echo "=== Summary ==="
echo ""
echo "For full setup with auto-installation, run: ./scripts/install.sh"
echo ""

# Always exit 0
exit 0
