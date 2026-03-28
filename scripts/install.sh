#!/usr/bin/env bash
# =============================================================================
# PMCopilot Installer
# =============================================================================
# Smart installer that discovers tools, builds MCP servers, and configures
# the plugin for first use. Run once after cloning.
#
# Usage:
#   ./scripts/install.sh              # Full install (interactive)
#   ./scripts/install.sh --auto       # Non-interactive (install what's missing)
#   ./scripts/install.sh --check      # Check only, don't install anything
#
# Exit codes:
#   0 = all critical components ready
#   1 = critical failure (Node or Bun missing, can't build)
# =============================================================================

set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/pmcopilot}"
ENV_CACHE="$PLUGIN_DATA/environment.json"

MODE="interactive"
[[ "${1:-}" == "--auto" ]] && MODE="auto"
[[ "${1:-}" == "--check" ]] && MODE="check"

# -- Colors & Helpers ---------------------------------------------------------

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}OK${NC}    $1"; }
miss() { echo -e "  ${RED}MISS${NC}  $1"; }
skip() { echo -e "  ${YELLOW}SKIP${NC}  $1"; }
info() { echo -e "  ${CYAN}INFO${NC}  $1"; }
head() { echo ""; echo -e "${BOLD}$1${NC}"; echo -e "${DIM}$(printf '%.0s-' {1..60})${NC}"; }

confirm() {
  if [[ "$MODE" == "auto" ]]; then return 0; fi
  if [[ "$MODE" == "check" ]]; then return 1; fi
  local prompt="$1"
  read -rp "  $prompt [Y/n] " answer
  [[ -z "$answer" || "$answer" =~ ^[Yy] ]]
}

# -- State tracking (plain variables for bash 3.2 compat) --------------------

ENV_OS="$(uname -s)"
ENV_ARCH="$(uname -m)"
ENV_NODE=""
ENV_BUN=""
ENV_ADB=""
ENV_ADB_PATH=""
ENV_ANDROID_HOME=""
ENV_XCRUN=""
ENV_SIMCTL=""
ENV_XCODE_PATH=""
ENV_SIMULATORS="0"
ENV_IDB=""
ENV_IDB_PATH=""
ENV_CHROME=""

BUILDS_OK=0
BUILDS_FAIL=0

# =============================================================================
# PHASE 1: System Prerequisites
# =============================================================================
head "Phase 1: System Prerequisites"

# Node.js
if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version 2>/dev/null)
  NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
  if [[ "$NODE_MAJOR" -ge 18 ]]; then
    ok "Node.js $NODE_VERSION"
    ENV_NODE="$NODE_VERSION"
  else
    miss "Node.js $NODE_VERSION (need 18+)"
    echo -e "       Install: ${DIM}brew install node${NC} or ${DIM}https://nodejs.org${NC}"
  fi
else
  miss "Node.js not found"
  echo -e "       Install: ${DIM}brew install node${NC} or ${DIM}https://nodejs.org${NC}"
  if confirm "Install Node.js via Homebrew?"; then
    brew install node
    ENV_NODE=$(node --version 2>/dev/null)
    ok "Node.js installed: $ENV_NODE"
  fi
fi

# Bun
if command -v bun &>/dev/null; then
  BUN_VERSION=$(bun --version 2>/dev/null)
  ok "Bun $BUN_VERSION"
  ENV_BUN="$BUN_VERSION"
else
  miss "Bun not found (needed to build MCP servers)"
  if confirm "Install Bun? (curl -fsSL https://bun.sh/install | bash)"; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    ENV_BUN=$(bun --version 2>/dev/null)
    ok "Bun installed: $ENV_BUN"
  else
    skip "Bun -- MCP servers won't build without it"
  fi
fi

# Python 3 (needed for hooks)
if command -v python3 &>/dev/null; then
  PYTHON_VERSION=$(python3 --version 2>/dev/null)
  ok "$PYTHON_VERSION"
else
  miss "Python 3 not found (needed for hook scripts)"
  echo -e "       Install: ${DIM}brew install python3${NC}"
fi

# =============================================================================
# PHASE 2: Tool Discovery
# =============================================================================
head "Phase 2: Tool Discovery"

# --- adb (Android Debug Bridge) ---
echo ""
echo -e "  ${BOLD}Android (adb)${NC}"

ADB_PATH=""

# Search order: ANDROID_HOME, ANDROID_SDK_ROOT, ANDROID_NDK_HOME sibling, PATH, common locations
if [[ -n "${ANDROID_HOME:-}" ]] && [[ -x "$ANDROID_HOME/platform-tools/adb" ]]; then
  ADB_PATH="$ANDROID_HOME/platform-tools/adb"
  info "Found via \$ANDROID_HOME"
elif [[ -n "${ANDROID_SDK_ROOT:-}" ]] && [[ -x "$ANDROID_SDK_ROOT/platform-tools/adb" ]]; then
  ADB_PATH="$ANDROID_SDK_ROOT/platform-tools/adb"
  info "Found via \$ANDROID_SDK_ROOT"
elif [[ -n "${ANDROID_NDK_HOME:-}" ]]; then
  # NDK is typically inside the SDK: sdk/ndk/<version>/ -- try going up
  SDK_GUESS="$(cd "$ANDROID_NDK_HOME/../.." 2>/dev/null && pwd)"
  if [[ -x "$SDK_GUESS/platform-tools/adb" ]]; then
    ADB_PATH="$SDK_GUESS/platform-tools/adb"
    info "Found via \$ANDROID_NDK_HOME (sibling path: $SDK_GUESS)"
  fi
fi

# Check PATH (e.g., Homebrew install)
if [[ -z "$ADB_PATH" ]] && command -v adb &>/dev/null; then
  ADB_PATH="$(command -v adb)"
  info "Found on PATH (likely Homebrew)"
fi

# Common locations
if [[ -z "$ADB_PATH" ]]; then
  for candidate in \
    "$HOME/Library/Android/sdk/platform-tools/adb" \
    "/usr/local/share/android-sdk/platform-tools/adb" \
    "/opt/homebrew/bin/adb" \
    "/usr/local/bin/adb"; do
    if [[ -x "$candidate" ]]; then
      ADB_PATH="$candidate"
      info "Found at common location"
      break
    fi
  done
fi

if [[ -n "$ADB_PATH" ]]; then
  ADB_VERSION=$("$ADB_PATH" version 2>/dev/null | head -1 || echo "unknown")
  ok "adb: $ADB_PATH"
  info "$ADB_VERSION"
  ENV_ADB="found"
  ENV_ADB_PATH="$ADB_PATH"

  # Try to determine ANDROID_HOME
  if [[ -z "${ANDROID_HOME:-}" ]]; then
    # If adb is at .../platform-tools/adb, ANDROID_HOME is the parent
    POSSIBLE_HOME="$(dirname "$(dirname "$ADB_PATH")")"
    if [[ -d "$POSSIBLE_HOME/platform-tools" ]]; then
      ENV_ANDROID_HOME="$POSSIBLE_HOME"
      info "Inferred ANDROID_HOME: $POSSIBLE_HOME"
      echo ""
      echo -e "  ${YELLOW}NOTE${NC}: \$ANDROID_HOME is not set. Add this to your ~/.zshrc:"
      echo -e "         ${DIM}export ANDROID_HOME=\"$POSSIBLE_HOME\"${NC}"
      echo -e "         ${DIM}export PATH=\"\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/emulator:\$PATH\"${NC}"
    else
      # Homebrew standalone adb -- no SDK root
      info "adb is standalone (Homebrew). No full SDK found."
      info "Emulator boot won't work, but adb device control will."
    fi
  else
    ENV_ANDROID_HOME="$ANDROID_HOME"
  fi

  # Check for emulator binary
  if command -v emulator &>/dev/null; then
    AVD_COUNT=$(emulator -list-avds 2>/dev/null | wc -l | tr -d ' ')
    ok "Android Emulator: $AVD_COUNT AVDs available"
  elif [[ -n "$ENV_ANDROID_HOME" ]] && [[ -x "$ENV_ANDROID_HOME/emulator/emulator" ]]; then
    AVD_COUNT=$("$ENV_ANDROID_HOME/emulator/emulator" -list-avds 2>/dev/null | wc -l | tr -d ' ')
    ok "Android Emulator: $AVD_COUNT AVDs available"
  else
    info "No emulator binary found. adb works for connected devices."
  fi
else
  miss "adb not found"
  echo -e "       Quickest fix: ${DIM}brew install --cask android-platform-tools${NC}"
  if confirm "Install adb via Homebrew?"; then
    brew install --cask android-platform-tools
    ADB_PATH="$(command -v adb 2>/dev/null)"
    if [[ -n "$ADB_PATH" ]]; then
      ENV_ADB="found"
      ENV_ADB_PATH="$ADB_PATH"
      ok "adb installed: $ADB_PATH"
    fi
  fi
fi

# --- xcrun / simctl (iOS Simulator) ---
echo ""
echo -e "  ${BOLD}iOS (xcrun simctl)${NC}"

if command -v xcrun &>/dev/null; then
  ok "xcrun found"
  ENV_XCRUN="found"

  # Check where xcode-select points
  XCODE_DEV_PATH=$(xcode-select -p 2>/dev/null || echo "")
  ENV_XCODE_PATH="$XCODE_DEV_PATH"

  if [[ "$XCODE_DEV_PATH" == *"CommandLineTools"* ]]; then
    miss "xcode-select points to CommandLineTools (no simctl)"
    if [[ -d "/Applications/Xcode.app" ]]; then
      info "Xcode.app exists. Switching xcode-select..."
      if confirm "Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer ?"; then
        sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
        XCODE_DEV_PATH="/Applications/Xcode.app/Contents/Developer"
        ENV_XCODE_PATH="$XCODE_DEV_PATH"
        ok "xcode-select switched to Xcode.app"
      fi
    else
      info "Xcode.app not installed. Install from the Mac App Store for simulator support."
    fi
  fi

  # Test simctl
  if xcrun simctl list devices available &>/dev/null; then
    SIM_COUNT=$(xcrun simctl list devices available 2>/dev/null | grep -c "(" || echo "0")
    ENV_SIMCTL="found"
    ENV_SIMULATORS="$SIM_COUNT"
    ok "simctl works: $SIM_COUNT simulators available"
  else
    miss "simctl not working (Xcode may need first launch or license acceptance)"
    info "Try: sudo xcodebuild -license accept"
  fi
else
  if [[ "$ENV_OS" == "Darwin" ]]; then
    miss "xcrun not found (Xcode Command Line Tools not installed)"
    info "Install: xcode-select --install (for basics) or install Xcode.app (for simulators)"
  else
    skip "iOS Simulator (macOS only)"
  fi
fi

# --- idb (iOS Debug Bridge) ---
echo ""
echo -e "  ${BOLD}iOS (idb)${NC}"

if command -v idb_companion &>/dev/null; then
  IDB_VERSION=$(idb_companion --version 2>/dev/null | head -1 || echo "unknown")
  ok "idb_companion: $IDB_VERSION"
  ENV_IDB="found"
  ENV_IDB_PATH="$(command -v idb_companion)"
elif command -v idb &>/dev/null; then
  ok "idb found (Python client)"
  ENV_IDB="found"
  ENV_IDB_PATH="$(command -v idb)"
else
  miss "idb_companion not found (optional, enriches simulator interaction)"
  if [[ "$ENV_OS" == "Darwin" ]]; then
    if confirm "Install idb-companion via Homebrew?"; then
      brew install idb-companion
      ENV_IDB="found"
      ENV_IDB_PATH="$(command -v idb_companion 2>/dev/null)"
      ok "idb_companion installed"
    fi
  fi
fi

# --- Chrome ---
echo ""
echo -e "  ${BOLD}Chrome (web teardowns)${NC}"

if [[ "$ENV_OS" == "Darwin" ]] && [[ -d "/Applications/Google Chrome.app" ]]; then
  ok "Google Chrome installed"
  ENV_CHROME="found"
  info "Web teardowns use Chrome via MCP. Enable Chrome MCP in Cowork Settings > Connectors."
elif command -v google-chrome &>/dev/null || command -v chromium &>/dev/null; then
  ok "Chrome/Chromium found"
  ENV_CHROME="found"
else
  skip "Chrome not detected. Web teardowns won't be available."
fi

# =============================================================================
# PHASE 3: Build MCP Servers
# =============================================================================
head "Phase 3: Build MCP Servers"

if [[ -z "$ENV_NODE" ]] || [[ -z "$ENV_BUN" ]]; then
  miss "Cannot build MCP servers: need both Node.js 18+ and Bun"
  echo -e "       Fix prerequisites first, then re-run this script."
else
  # Always build these two (no external deps)
  SERVERS_TO_BUILD=("pm-frameworks" "app-store-intel")

  # Conditionally build platform servers
  if [[ -n "$ENV_ADB" ]]; then
    SERVERS_TO_BUILD+=("emulator-bridge")
  else
    skip "emulator-bridge (no adb found)"
  fi

  if [[ "$ENV_SIMCTL" == "found" ]]; then
    SERVERS_TO_BUILD+=("simulator-bridge")
  else
    skip "simulator-bridge (no simctl found)"
  fi

  for server in "${SERVERS_TO_BUILD[@]}"; do
    SERVER_DIR="$PLUGIN_ROOT/mcp-servers/$server"

    if [[ ! -d "$SERVER_DIR" ]]; then
      miss "$server: directory not found"
      BUILDS_FAIL=$((BUILDS_FAIL + 1))
      continue
    fi

    echo -e "  ${DIM}Building $server...${NC}"

    # Install dependencies
    if ! (cd "$SERVER_DIR" && bun install --silent 2>&1) >/dev/null 2>&1; then
      miss "$server: bun install failed"
      BUILDS_FAIL=$((BUILDS_FAIL + 1))
      continue
    fi

    # Build
    if ! (cd "$SERVER_DIR" && bun run build 2>&1) >/dev/null 2>&1; then
      miss "$server: build failed"
      BUILDS_FAIL=$((BUILDS_FAIL + 1))
      continue
    fi

    # Verify output
    if [[ -f "$SERVER_DIR/dist/index.js" ]]; then
      ok "$server built successfully"
      BUILDS_OK=$((BUILDS_OK + 1))
    else
      miss "$server: dist/index.js not produced"
      BUILDS_FAIL=$((BUILDS_FAIL + 1))
    fi
  done
fi

# =============================================================================
# PHASE 4: Configure .mcp.json
# =============================================================================
head "Phase 4: Configure Environment"

# Create plugin data directory
mkdir -p "$PLUGIN_DATA"
mkdir -p "$PLUGIN_DATA/screenshots/ios"
mkdir -p "$PLUGIN_DATA/screenshots/android"
mkdir -p "$PLUGIN_DATA/videos/ios"
mkdir -p "$PLUGIN_DATA/videos/android"
mkdir -p "$PLUGIN_DATA/app-store-cache"
ok "Plugin data directory: $PLUGIN_DATA"

# Update .mcp.json with discovered ANDROID_HOME if needed
if [[ -n "$ENV_ANDROID_HOME" ]] && [[ "$ENV_ANDROID_HOME" != "${ANDROID_HOME:-}" ]]; then
  info "Updating .mcp.json emulator-bridge env with discovered ANDROID_HOME"
  python3 -c "
import json
mcp_path = '$PLUGIN_ROOT/.mcp.json'
with open(mcp_path) as f:
    data = json.load(f)
if 'emulator-bridge' in data.get('mcpServers', {}):
    data['mcpServers']['emulator-bridge']['env']['ANDROID_HOME'] = '$ENV_ANDROID_HOME'
    with open(mcp_path, 'w') as f:
        json.dump(data, f, indent=2)
    print('  Updated.')
" 2>/dev/null && ok ".mcp.json updated with ANDROID_HOME" || info "Skipped .mcp.json update"
fi

# =============================================================================
# PHASE 5: Save Environment State
# =============================================================================
head "Phase 5: Save Environment State"

python3 -c "
import json, datetime

env = {
    'os': '$ENV_OS',
    'arch': '$ENV_ARCH',
    'node': '$ENV_NODE',
    'bun': '$ENV_BUN',
    'adb': '$ENV_ADB',
    'adb_path': '$ENV_ADB_PATH',
    'android_home': '$ENV_ANDROID_HOME',
    'xcrun': '$ENV_XCRUN',
    'simctl': '$ENV_SIMCTL',
    'xcode_path': '$ENV_XCODE_PATH',
    'simulators': '$ENV_SIMULATORS',
    'idb': '$ENV_IDB',
    'idb_path': '$ENV_IDB_PATH',
    'chrome': '$ENV_CHROME',
    'builds_ok': $BUILDS_OK,
    'builds_fail': $BUILDS_FAIL,
    'installed_at': datetime.datetime.now().isoformat(),
    'plugin_root': '$PLUGIN_ROOT'
}

with open('$ENV_CACHE', 'w') as f:
    json.dump(env, f, indent=2)
" 2>/dev/null

ok "Environment state saved to $ENV_CACHE"

# =============================================================================
# TIER REPORT
# =============================================================================
head "PMCopilot Environment Report"
echo ""

# Tier 0: Core (pm-frameworks + app-store-intel built)
T0_OK=false
if [[ -f "$PLUGIN_ROOT/mcp-servers/pm-frameworks/dist/index.js" ]] && \
   [[ -f "$PLUGIN_ROOT/mcp-servers/app-store-intel/dist/index.js" ]]; then
  T0_OK=true
fi

# Tier 3: Mobile
T3_ANDROID=false
T3_IOS=false
[[ -n "$ENV_ADB" ]] && [[ -f "$PLUGIN_ROOT/mcp-servers/emulator-bridge/dist/index.js" ]] && T3_ANDROID=true
[[ "$ENV_SIMCTL" == "found" ]] && [[ -f "$PLUGIN_ROOT/mcp-servers/simulator-bridge/dist/index.js" ]] && T3_IOS=true

echo -e "  ${BOLD}Tier 0 -- Core${NC}"
if $T0_OK; then
  echo -e "    ${GREEN}Ready${NC}  PRDs, prioritization, roadmaps, experiments, market sizing, app store intel"
else
  echo -e "    ${RED}Not ready${NC}  MCP server builds failed. Re-run after fixing prerequisites."
fi

echo ""
echo -e "  ${BOLD}Tier 1 -- Analytics${NC}"
echo -e "    ${CYAN}--${NC}  Connect Amplitude or Mixpanel in Cowork Settings > Connectors"

echo ""
echo -e "  ${BOLD}Tier 2 -- PM Tools${NC}"
echo -e "    ${CYAN}--${NC}  Connect Jira, Slack, Gmail, Calendar, Figma in Cowork Settings > Connectors"

echo ""
echo -e "  ${BOLD}Tier 3 -- Mobile Testing${NC}"
if $T3_ANDROID; then
  echo -e "    ${GREEN}Ready${NC}  Android: adb at $ENV_ADB_PATH"
else
  if [[ -n "$ENV_ADB" ]]; then
    echo -e "    ${YELLOW}Partial${NC}  Android: adb found but emulator-bridge not built"
  else
    echo -e "    ${RED}Not ready${NC}  Android: install adb (brew install --cask android-platform-tools)"
  fi
fi
if $T3_IOS; then
  echo -e "    ${GREEN}Ready${NC}  iOS: $ENV_SIMULATORS simulators available"
  [[ "$ENV_IDB" == "found" ]] && echo -e "    ${GREEN}Ready${NC}  idb: enriched simulator interaction" || echo -e "    ${YELLOW}Optional${NC}  idb: brew install idb-companion (richer interaction)"
else
  if [[ "$ENV_SIMCTL" == "found" ]]; then
    echo -e "    ${YELLOW}Partial${NC}  iOS: simctl works but simulator-bridge not built"
  else
    echo -e "    ${RED}Not ready${NC}  iOS: install Xcode from Mac App Store for simulator support"
  fi
fi

echo ""
echo -e "  ${BOLD}Tier 4 -- Full Stack${NC}"
if [[ "$ENV_CHROME" == "found" ]]; then
  echo -e "    ${GREEN}Ready${NC}  Chrome installed. Enable Chrome MCP for web teardowns."
else
  echo -e "    ${RED}Not ready${NC}  Install Google Chrome for web teardowns"
fi

# =============================================================================
# NEXT STEPS
# =============================================================================
echo ""
head "What's Next"
echo ""

if [[ ! -f "$PLUGIN_DATA/pm-profile.json" ]]; then
  echo -e "  1. Run ${BOLD}/pmcopilot:setup${NC} to create your PM profile"
  echo -e "     This is the single most important step -- it personalizes every future session."
else
  echo -e "  1. ${GREEN}PM profile exists${NC} -- you're already set up"
fi

echo -e "  2. Connect integrations in ${BOLD}Cowork Settings > Connectors${NC} (Jira, Slack, etc.)"
echo -e "  3. Try ${BOLD}/pmcopilot:brief${NC} to see the Chief of Staff in action"
echo ""

if [[ $BUILDS_FAIL -gt 0 ]]; then
  echo -e "  ${YELLOW}$BUILDS_FAIL MCP server(s) failed to build. Fix prerequisites and re-run:${NC}"
  echo -e "  ${DIM}./scripts/install.sh${NC}"
  echo ""
fi

echo -e "${DIM}Environment state saved to $ENV_CACHE${NC}"
echo -e "${DIM}Re-run this script any time to update.${NC}"
echo ""

# Exit with failure only if core servers didn't build
if $T0_OK; then
  exit 0
else
  exit 1
fi
