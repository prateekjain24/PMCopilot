#!/usr/bin/env bash
# -----------------------------------------------------------------------
# SessionStart hook: Smart Session Start
#
# Injects a personalized session brief into Claude's context by writing
# to stdout. Covers: user identity, folder context, stale data warnings,
# integration status, and unfinished work from the last session.
#
# Exit code 0 always -- never blocks the session.
# -----------------------------------------------------------------------

set -euo pipefail

PLUGIN_DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/pmcopilot}"
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$0")")}"
PROFILE_PATH="$PLUGIN_DATA/pm-profile.json"
CWD="${CLAUDE_PROJECT_DIR:-.}"
CONTEXT_FILE="$CWD/_Context.md"
SETTINGS_FILE="$PLUGIN_ROOT/settings.json"
CACHE_DIR="$PLUGIN_DATA/app-store-cache"

# Read session input from stdin (JSON with session_id, transcript_path, etc.)
SESSION_INPUT=""
if [ ! -t 0 ]; then
  SESSION_INPUT=$(cat)
fi

# Start building the session brief
BRIEF=""

# -----------------------------------------------------------------------
# 1. User Profile
# -----------------------------------------------------------------------
if [ -f "$PROFILE_PATH" ]; then
  NAME=$(python3 -c "import json; d=json.load(open('$PROFILE_PATH')); print(d.get('name',''))" 2>/dev/null || echo "")
  ROLE=$(python3 -c "import json; d=json.load(open('$PROFILE_PATH')); print(d.get('role',''))" 2>/dev/null || echo "")
  COMPANY=$(python3 -c "import json; d=json.load(open('$PROFILE_PATH')); print(d.get('company',''))" 2>/dev/null || echo "")
  TEAM=$(python3 -c "import json; d=json.load(open('$PROFILE_PATH')); print(d.get('team',''))" 2>/dev/null || echo "")
  JIRA_KEY=$(python3 -c "import json; d=json.load(open('$PROFILE_PATH')); print(d.get('jira_project_key',''))" 2>/dev/null || echo "")

  if [ -n "$NAME" ]; then
    BRIEF+="[PMCopilot Session Brief]
User: $NAME"
    [ -n "$ROLE" ] && BRIEF+=", $ROLE"
    [ -n "$COMPANY" ] && BRIEF+=" at $COMPANY"
    [ -n "$TEAM" ] && BRIEF+=" ($TEAM)"
    BRIEF+="
"
    [ -n "$JIRA_KEY" ] && BRIEF+="Default Jira project: $JIRA_KEY
"

    # Load output preferences
    PREFS=$(python3 -c "
import json
d = json.load(open('$PROFILE_PATH'))
prefs = d.get('output_preferences', {})
rules = prefs.get('custom_rules', [])
if prefs.get('comparison_format'):
    print(f\"Output preference: {prefs['comparison_format']} for comparisons\")
if prefs.get('language'):
    print(f\"Language: {prefs['language']}\")
for r in rules:
    print(f\"Rule: {r}\")
" 2>/dev/null || echo "")
    [ -n "$PREFS" ] && BRIEF+="$PREFS
"
  fi
else
  BRIEF+="[PMCopilot] No PM profile found. Run /pmcopilot:setup to personalize your experience (takes ~5 minutes).
"
fi

# -----------------------------------------------------------------------
# 2. Folder Context
# -----------------------------------------------------------------------
if [ -f "$CONTEXT_FILE" ]; then
  BRIEF+="
Folder context (_Context.md) found. Read it before starting any task.
"
else
  # Check if there are many files in the folder -- suggest creating _Context.md
  FILE_COUNT=$(find "$CWD" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$FILE_COUNT" -gt 5 ]; then
    BRIEF+="
Note: This folder has ${FILE_COUNT} markdown files but no _Context.md. Consider creating one to focus PMCopilot on the relevant files. Run /pmcopilot:setup to scaffold one.
"
  fi
fi

# -----------------------------------------------------------------------
# 3. Stale Data Warnings
# -----------------------------------------------------------------------
STALE_WARNINGS=""

# Check competitive intel cache age
if [ -d "$CACHE_DIR" ]; then
  CACHE_DAYS="${COMPETITIVE_INTEL_CACHE_DAYS:-7}"
  STALE_CACHE=$(find "$CACHE_DIR" -name "*.json" -mtime +"$CACHE_DAYS" 2>/dev/null | head -5)
  if [ -n "$STALE_CACHE" ]; then
    STALE_COUNT=$(echo "$STALE_CACHE" | wc -l | tr -d ' ')
    STALE_WARNINGS+="- Competitive intel cache: ${STALE_COUNT} entries older than ${CACHE_DAYS} days. Consider refreshing with /pmcopilot:app-store-intel.
"
  fi
fi

# Check for stale competitive pulse files in the working directory
if [ -d "$CWD" ]; then
  STALE_PULSE=$(find "$CWD" -maxdepth 1 -name "competitive-pulse-*.md" -mtime +14 2>/dev/null | head -1)
  if [ -n "$STALE_PULSE" ]; then
    PULSE_DATE=$(basename "$STALE_PULSE" | sed 's/competitive-pulse-//;s/\.md//')
    STALE_WARNINGS+="- Last competitive pulse is from ${PULSE_DATE} (over 2 weeks ago). Consider running a fresh one.
"
  fi
fi

# Check for stale sprint files
if [ -d "$CWD" ]; then
  STALE_SPRINT=$(find "$CWD" -maxdepth 1 -name "sprint-digest-*.md" -mtime +5 2>/dev/null | head -1)
  if [ -n "$STALE_SPRINT" ] && [ ! -f "$CWD/sprint-digest-$(date +%Y-%m-%d).md" ]; then
    STALE_WARNINGS+="- No sprint digest for today. Last one is over 5 days old.
"
  fi
fi

if [ -n "$STALE_WARNINGS" ]; then
  BRIEF+="
Stale data warnings:
$STALE_WARNINGS"
fi

# -----------------------------------------------------------------------
# 4. Last Session Context (unfinished work)
# -----------------------------------------------------------------------
if [ -n "$SESSION_INPUT" ]; then
  TRANSCRIPT_PATH=$(echo "$SESSION_INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('transcript_path',''))" 2>/dev/null || echo "")

  if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    # Check if the last session had any in-progress todos or unfinished tasks
    LAST_TODOS=$(tail -50 "$TRANSCRIPT_PATH" 2>/dev/null | python3 -c "
import json, sys
todos = []
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        entry = json.loads(line)
        # Look for todo updates in the transcript
        if isinstance(entry, dict):
            msg = entry.get('message', {})
            content = msg.get('content', '')
            if isinstance(content, str) and 'in_progress' in content.lower():
                todos.append('Found unfinished work in last session')
    except:
        pass
if todos:
    print('Note: Your last session may have unfinished work. Check the transcript if needed.')
" 2>/dev/null || echo "")

    [ -n "$LAST_TODOS" ] && BRIEF+="
$LAST_TODOS
"
  fi
fi

# -----------------------------------------------------------------------
# 5. Output the brief
# -----------------------------------------------------------------------
if [ -n "$BRIEF" ]; then
  echo "$BRIEF"
fi

exit 0
