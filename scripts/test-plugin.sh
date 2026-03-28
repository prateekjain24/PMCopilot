#!/usr/bin/env bash
# =============================================================================
# PMCopilot Plugin Test Suite
# =============================================================================
# Validates the full plugin structure, builds MCP servers, tests hooks,
# and verifies cross-references between components.
#
# Usage:
#   ./scripts/test-plugin.sh          # Run all tests
#   ./scripts/test-plugin.sh --quick  # Skip MCP builds (fast structural check)
#
# Exit codes:
#   0 = all tests passed
#   1 = one or more tests failed
# =============================================================================

set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0
WARN=0
SKIP_BUILDS=false

if [[ "${1:-}" == "--quick" ]]; then
  SKIP_BUILDS=true
fi

# -- Helpers ------------------------------------------------------------------

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

pass() {
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}PASS${NC}  $1"
}

fail() {
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}FAIL${NC}  $1"
  if [[ -n "${2:-}" ]]; then
    echo -e "        ${RED}$2${NC}"
  fi
}

warn() {
  WARN=$((WARN + 1))
  echo -e "  ${YELLOW}WARN${NC}  $1"
}

section() {
  echo ""
  echo -e "${BOLD}${CYAN}[$1]${NC}"
}

# =============================================================================
# 1. PLUGIN MANIFEST
# =============================================================================
section "Plugin Manifest"

if [[ -f "$PLUGIN_ROOT/.claude-plugin/plugin.json" ]]; then
  if python3 -c "import json; json.load(open('$PLUGIN_ROOT/.claude-plugin/plugin.json'))" 2>/dev/null; then
    pass "plugin.json is valid JSON"
    # Check required fields
    for field in name version description; do
      if python3 -c "import json; d=json.load(open('$PLUGIN_ROOT/.claude-plugin/plugin.json')); assert '$field' in d" 2>/dev/null; then
        pass "plugin.json has '$field' field"
      else
        fail "plugin.json missing '$field' field"
      fi
    done
  else
    fail "plugin.json is invalid JSON"
  fi
else
  fail ".claude-plugin/plugin.json not found"
fi

# .mcp.json
if [[ -f "$PLUGIN_ROOT/.mcp.json" ]]; then
  if python3 -c "import json; json.load(open('$PLUGIN_ROOT/.mcp.json'))" 2>/dev/null; then
    pass ".mcp.json is valid JSON"
    MCP_SERVERS=$(python3 -c "import json; d=json.load(open('$PLUGIN_ROOT/.mcp.json')); print(len(d.get('mcpServers', {})))")
    pass ".mcp.json declares $MCP_SERVERS MCP servers"
  else
    fail ".mcp.json is invalid JSON"
  fi
else
  fail ".mcp.json not found"
fi

# =============================================================================
# 2. COMMANDS
# =============================================================================
section "Commands"

EXPECTED_COMMANDS=(
  competitive-teardown prd sprint-review market-sizing prioritize
  user-research roadmap experiment stakeholder-update app-store-intel
  launch-checklist metrics-review setup
)

COMMAND_COUNT=0
for cmd in "${EXPECTED_COMMANDS[@]}"; do
  cmd_file="$PLUGIN_ROOT/commands/$cmd.md"
  if [[ -f "$cmd_file" ]]; then
    # Check YAML frontmatter exists (starts with ---)
    if head -1 "$cmd_file" | grep -q "^---"; then
      # Check for description field
      if grep -q "^description:" "$cmd_file"; then
        COMMAND_COUNT=$((COMMAND_COUNT + 1))
        pass "command: $cmd (has frontmatter + description)"
      else
        fail "command: $cmd (missing description in frontmatter)"
      fi
    else
      fail "command: $cmd (missing YAML frontmatter)"
    fi
  else
    fail "command: $cmd (file not found)"
  fi
done

echo -e "  ${CYAN}INFO${NC}  $COMMAND_COUNT/${#EXPECTED_COMMANDS[@]} commands validated"

# =============================================================================
# 3. AGENTS
# =============================================================================
section "Agents"

EXPECTED_AGENTS=(app-teardown web-teardown research-synthesizer prd-writer data-analyst sprint-analyst ux-reviewer)

AGENT_COUNT=0
for agent in "${EXPECTED_AGENTS[@]}"; do
  agent_file="$PLUGIN_ROOT/agents/$agent.md"
  if [[ -f "$agent_file" ]]; then
    AGENT_ERRORS=""

    # Check frontmatter
    if ! head -1 "$agent_file" | grep -q "^---"; then
      AGENT_ERRORS="missing frontmatter"
    fi

    # Agents must have 'tools' (not 'allowed-tools')
    if grep -q "^tools:" "$agent_file"; then
      : # good
    elif grep -q "^allowed-tools:" "$agent_file"; then
      AGENT_ERRORS="${AGENT_ERRORS:+$AGENT_ERRORS, }uses 'allowed-tools' instead of 'tools'"
    else
      AGENT_ERRORS="${AGENT_ERRORS:+$AGENT_ERRORS, }missing 'tools' field"
    fi

    # Agents must have maxTurns
    if ! grep -q "^maxTurns:" "$agent_file"; then
      AGENT_ERRORS="${AGENT_ERRORS:+$AGENT_ERRORS, }missing 'maxTurns'"
    fi

    if [[ -z "$AGENT_ERRORS" ]]; then
      AGENT_COUNT=$((AGENT_COUNT + 1))
      pass "agent: $agent"
    else
      fail "agent: $agent ($AGENT_ERRORS)"
    fi
  else
    fail "agent: $agent (file not found)"
  fi
done

echo -e "  ${CYAN}INFO${NC}  $AGENT_COUNT/${#EXPECTED_AGENTS[@]} agents validated"

# =============================================================================
# 4. SKILLS
# =============================================================================
section "Skills"

EXPECTED_SKILLS=(
  app-store-intel competitive-teardown experiment-design launch-checklist
  market-sizing metrics-review prd-generator prioritize roadmap
  sprint-review stakeholder-update user-research
)

SKILL_COUNT=0
for skill in "${EXPECTED_SKILLS[@]}"; do
  skill_file="$PLUGIN_ROOT/skills/$skill/SKILL.md"
  if [[ -f "$skill_file" ]]; then
    SKILL_ERRORS=""

    # Check frontmatter
    if ! head -1 "$skill_file" | grep -q "^---"; then
      SKILL_ERRORS="missing frontmatter"
    fi

    # Skills must have 'allowed-tools' (not 'tools')
    if grep -q "^allowed-tools:" "$skill_file"; then
      : # good
    elif grep -q "^tools:" "$skill_file"; then
      SKILL_ERRORS="${SKILL_ERRORS:+$SKILL_ERRORS, }uses 'tools' instead of 'allowed-tools'"
    fi

    # Skills must NOT have maxTurns
    if grep -q "^maxTurns:" "$skill_file"; then
      SKILL_ERRORS="${SKILL_ERRORS:+$SKILL_ERRORS, }has 'maxTurns' (skills should not have this)"
    fi

    # Check for Execution Protocol section
    if grep -q "## Execution Protocol" "$skill_file"; then
      : # good
    else
      SKILL_ERRORS="${SKILL_ERRORS:+$SKILL_ERRORS, }missing Execution Protocol section"
    fi

    if [[ -z "$SKILL_ERRORS" ]]; then
      SKILL_COUNT=$((SKILL_COUNT + 1))
      pass "skill: $skill"
    else
      fail "skill: $skill ($SKILL_ERRORS)"
    fi
  else
    fail "skill: $skill (SKILL.md not found)"
  fi
done

echo -e "  ${CYAN}INFO${NC}  $SKILL_COUNT/${#EXPECTED_SKILLS[@]} skills validated"

# =============================================================================
# 5. HOOKS
# =============================================================================
section "Hooks"

HOOKS_JSON="$PLUGIN_ROOT/hooks/hooks.json"

if [[ -f "$HOOKS_JSON" ]]; then
  if python3 -c "import json; json.load(open('$HOOKS_JSON'))" 2>/dev/null; then
    pass "hooks.json is valid JSON"

    # Count hooks by event
    python3 -c "
import json
data = json.load(open('$HOOKS_JSON'))
for event, entries in data.get('hooks', {}).items():
    count = sum(len(e.get('hooks', [])) for e in entries)
    print(f'{event}:{count}')
" | while IFS=: read -r event count; do
      pass "hooks.json: $event has $count hook(s)"
    done

    # Extract all command scripts referenced in hooks.json
    python3 -c "
import json
data = json.load(open('$HOOKS_JSON'))
def find_commands(obj):
    if isinstance(obj, dict):
        if obj.get('type') == 'command' and 'command' in obj:
            print(obj['command'].replace('\${CLAUDE_PLUGIN_ROOT}/', ''))
        for v in obj.values():
            find_commands(v)
    elif isinstance(obj, list):
        for item in obj:
            find_commands(item)
find_commands(data)
" | sort -u | while read -r script; do
      script_path="$PLUGIN_ROOT/$script"
      if [[ -f "$script_path" ]]; then
        if [[ -x "$script_path" ]]; then
          pass "hook script: $script (exists, executable)"
        else
          fail "hook script: $script (exists but NOT executable)"
        fi
      else
        fail "hook script: $script (referenced in hooks.json but NOT found)"
      fi
    done

    # Validate prompt hooks have required fields
    PROMPT_HOOK_ISSUES=$(python3 -c "
import json
data = json.load(open('$HOOKS_JSON'))
issues = []
def check_prompts(obj, path=''):
    if isinstance(obj, dict):
        if obj.get('type') == 'prompt':
            if 'prompt' not in obj:
                issues.append(f'{path}: prompt hook missing prompt field')
        for k, v in obj.items():
            check_prompts(v, f'{path}/{k}')
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            check_prompts(item, f'{path}[{i}]')
check_prompts(data)
for issue in issues:
    print(issue)
" 2>/dev/null)

    if [[ -z "$PROMPT_HOOK_ISSUES" ]]; then
      pass "all prompt hooks have required 'prompt' field"
    else
      while IFS= read -r issue; do
        fail "prompt hook: $issue"
      done <<< "$PROMPT_HOOK_ISSUES"
    fi

  else
    fail "hooks.json is invalid JSON"
  fi
else
  fail "hooks/hooks.json not found"
fi

# =============================================================================
# 6. MCP SERVER BUILDS
# =============================================================================
section "MCP Servers"

MCP_SERVERS_DIR="$PLUGIN_ROOT/mcp-servers"
CUSTOM_MCPS=(simulator-bridge emulator-bridge app-store-intel pm-frameworks)

for mcp in "${CUSTOM_MCPS[@]}"; do
  mcp_dir="$MCP_SERVERS_DIR/$mcp"

  if [[ ! -d "$mcp_dir" ]]; then
    fail "mcp-server: $mcp (directory not found)"
    continue
  fi

  # Check package.json
  if [[ ! -f "$mcp_dir/package.json" ]]; then
    fail "mcp-server: $mcp (missing package.json)"
    continue
  fi

  if ! python3 -c "import json; json.load(open('$mcp_dir/package.json'))" 2>/dev/null; then
    fail "mcp-server: $mcp (invalid package.json)"
    continue
  fi

  # Check tsconfig.json
  if [[ ! -f "$mcp_dir/tsconfig.json" ]]; then
    fail "mcp-server: $mcp (missing tsconfig.json)"
    continue
  fi

  # Check src/index.ts
  if [[ ! -f "$mcp_dir/src/index.ts" ]]; then
    fail "mcp-server: $mcp (missing src/index.ts)"
    continue
  fi

  pass "mcp-server: $mcp (structure OK)"

  if [[ "$SKIP_BUILDS" == true ]]; then
    warn "mcp-server: $mcp (build skipped -- use full mode to test)"
    continue
  fi

  # Install dependencies
  if (cd "$mcp_dir" && npm install --silent 2>&1 | tail -1) >/dev/null 2>&1; then
    pass "mcp-server: $mcp (npm install OK)"
  else
    fail "mcp-server: $mcp (npm install failed)"
    continue
  fi

  # TypeScript compilation
  TSC_OUTPUT=$(cd "$mcp_dir" && npx tsc 2>&1)
  if [[ $? -eq 0 ]]; then
    pass "mcp-server: $mcp (tsc build OK)"
  else
    fail "mcp-server: $mcp (tsc build failed)" "$TSC_OUTPUT"
    continue
  fi

  # Check dist/index.js was produced
  if [[ ! -f "$mcp_dir/dist/index.js" ]]; then
    fail "mcp-server: $mcp (dist/index.js not produced after build)"
    continue
  fi

  # Verify .mcp.json references this server
  if python3 -c "import json; d=json.load(open('$PLUGIN_ROOT/.mcp.json')); assert '$mcp' in d.get('mcpServers', {})" 2>/dev/null; then
    pass "mcp-server: $mcp (registered in .mcp.json)"
  else
    fail "mcp-server: $mcp (NOT registered in .mcp.json)"
  fi

  # Start server and call tools/list
  TOOLS_OUTPUT=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | timeout 10 node "$mcp_dir/dist/index.js" 2>/dev/null || true)

  if echo "$TOOLS_OUTPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); tools=d['result']['tools']; print(len(tools))" 2>/dev/null; then
    TOOL_COUNT=$(echo "$TOOLS_OUTPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['result']['tools']))")
    pass "mcp-server: $mcp (starts OK, exposes $TOOL_COUNT tools)"
  else
    # Check if it's a known config-dependency failure (like emulator-bridge needing ANDROID_HOME)
    STDERR_OUTPUT=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | timeout 10 node "$mcp_dir/dist/index.js" 2>&1 1>/dev/null || true)
    if echo "$STDERR_OUTPUT" | grep -qi "configuration error\|environment variable"; then
      warn "mcp-server: $mcp (requires external config: $(echo "$STDERR_OUTPUT" | head -1 | sed 's/\[.*\] //'))"
    else
      fail "mcp-server: $mcp (failed to start or respond to tools/list)"
    fi
  fi
done

# =============================================================================
# 7. CROSS-REFERENCE CHECKS
# =============================================================================
section "Cross-References"

# Check that agents referenced in commands actually exist
for cmd_file in "$PLUGIN_ROOT"/commands/*.md; do
  cmd_name=$(basename "$cmd_file" .md)
  [[ "$cmd_name" == "CLAUDE" ]] && continue

  # Extract Agent(...) references -- handles Agent(a, b, c) and Agent(a)
  AGENT_REFS=$(grep -oP 'Agent\([^)]+\)' "$cmd_file" 2>/dev/null || true)
  if [[ -n "$AGENT_REFS" ]]; then
    # Strip Agent(), split on comma, trim whitespace
    echo "$AGENT_REFS" | sed 's/Agent(//g;s/)//g' | tr ',' '\n' | while IFS= read -r ref; do
      ref=$(echo "$ref" | xargs) # trim whitespace
      [[ -z "$ref" ]] && continue
      if [[ -f "$PLUGIN_ROOT/agents/$ref.md" ]]; then
        pass "command '$cmd_name' references agent '$ref' (exists)"
      else
        fail "command '$cmd_name' references agent '$ref' (NOT found)"
      fi
    done
  fi
done

# Check that MCP tools referenced in .mcp.json have dist/index.js
for mcp in "${CUSTOM_MCPS[@]}"; do
  dist_file="$MCP_SERVERS_DIR/$mcp/dist/index.js"
  if [[ -f "$dist_file" ]]; then
    pass ".mcp.json '$mcp' has built artifact"
  else
    if [[ "$SKIP_BUILDS" == true ]]; then
      warn ".mcp.json '$mcp' dist/index.js missing (builds skipped)"
    else
      fail ".mcp.json '$mcp' referenced but dist/index.js missing"
    fi
  fi
done

# Check templates exist
section "Templates"

for tpl_dir in folder-context schedules; do
  tpl_path="$PLUGIN_ROOT/templates/$tpl_dir"
  if [[ -d "$tpl_path" ]]; then
    tpl_count=$(ls "$tpl_path"/*.md 2>/dev/null | wc -l | xargs)
    pass "templates/$tpl_dir: $tpl_count templates"
  else
    warn "templates/$tpl_dir: directory not found"
  fi
done

# =============================================================================
# 8. FUNCTIONAL TESTS (pm-frameworks -- no external deps needed)
# =============================================================================
if [[ "$SKIP_BUILDS" == false ]]; then
  section "Functional Tests (pm-frameworks)"

  PM_FW_DIR="$MCP_SERVERS_DIR/pm-frameworks"

  if [[ -f "$PM_FW_DIR/dist/index.js" ]]; then
    # Test RICE score
    RICE_RESULT=$(printf '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"rice_score","arguments":{"reach":1000,"impact":2,"confidence":0.8,"effort":3}}}\n' \
      | timeout 10 node "$PM_FW_DIR/dist/index.js" 2>/dev/null || true)

    if echo "$RICE_RESULT" | python3 -c "
import json, sys
d = json.load(sys.stdin)
result = json.loads(d['result']['content'][0]['text'])
assert 'score' in result and isinstance(result['score'], (int, float))
print(f'RICE score = {result[\"score\"]}')
" 2>/dev/null; then
      pass "rice_score returns valid score"
    else
      fail "rice_score returned unexpected result"
    fi

    # Test ICE score
    ICE_RESULT=$(printf '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"ice_score","arguments":{"impact":8,"confidence":7,"ease":6}}}\n' \
      | timeout 10 node "$PM_FW_DIR/dist/index.js" 2>/dev/null || true)

    if echo "$ICE_RESULT" | python3 -c "
import json, sys
d = json.load(sys.stdin)
result = json.loads(d['result']['content'][0]['text'])
assert 'score' in result
print(f'ICE score = {result[\"score\"]}')
" 2>/dev/null; then
      pass "ice_score returns valid score"
    else
      fail "ice_score returned unexpected result"
    fi

    # Test sample_size_calc
    SAMPLE_RESULT=$(printf '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"sample_size_calc","arguments":{"baseline_rate":0.10,"mde":0.10,"significance":0.95,"power":0.80}}}\n' \
      | timeout 10 node "$PM_FW_DIR/dist/index.js" 2>/dev/null || true)

    if echo "$SAMPLE_RESULT" | python3 -c "
import json, sys
d = json.load(sys.stdin)
result = json.loads(d['result']['content'][0]['text'])
assert 'sample_size_per_variant' in result
print(f'Sample size = {result[\"sample_size_per_variant\"]} per variant')
" 2>/dev/null; then
      pass "sample_size_calc returns valid result"
    else
      fail "sample_size_calc returned unexpected result"
    fi
  else
    warn "pm-frameworks dist/index.js not found, skipping functional tests"
  fi
fi

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
echo -e "${BOLD}=============================================${NC}"
TOTAL=$((PASS + FAIL))
echo -e "${BOLD}  PMCopilot Test Results${NC}"
echo -e "${BOLD}=============================================${NC}"
echo -e "  ${GREEN}PASSED${NC}: $PASS"
echo -e "  ${RED}FAILED${NC}: $FAIL"
echo -e "  ${YELLOW}WARNED${NC}: $WARN"
echo -e "  TOTAL : $TOTAL checks"
echo -e "${BOLD}=============================================${NC}"

if [[ $FAIL -gt 0 ]]; then
  echo -e "  ${RED}${BOLD}RESULT: SOME TESTS FAILED${NC}"
  exit 1
else
  echo -e "  ${GREEN}${BOLD}RESULT: ALL TESTS PASSED${NC}"
  exit 0
fi
