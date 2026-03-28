#!/usr/bin/env bash
# -----------------------------------------------------------------------
# SessionStart hook: Smart Session Start (Chief of Staff)
#
# Injects a personalized session brief into Claude's context by writing
# to stdout. This is PMCopilot's "Chief of Staff" -- it reviews everything
# before the PM sits down and surfaces what needs attention.
#
# Covers:
#   1. User identity (from pm-profile.json)
#   2. Folder context (_Context.md)
#   3. Artifact health (freshness, completeness, gaps)
#   4. Unfinished work (TBD/TODO scanning)
#   5. Stale data warnings
#   6. Last session context
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
ARTIFACT_INDEX="$CWD/docs/.artifact-index.json"
NOW_EPOCH=$(date +%s)

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
  PROFILE_JSON=$(python3 -c "
import json
d = json.load(open('$PROFILE_PATH'))
print(d.get('name',''))
print(d.get('role',''))
print(d.get('company',''))
print(d.get('team',''))
print(d.get('jira_project_key',''))
print(d.get('primary_product_line',''))
print(d.get('default_market',''))
" 2>/dev/null || echo "")

  NAME=$(echo "$PROFILE_JSON" | sed -n '1p')
  ROLE=$(echo "$PROFILE_JSON" | sed -n '2p')
  COMPANY=$(echo "$PROFILE_JSON" | sed -n '3p')
  TEAM=$(echo "$PROFILE_JSON" | sed -n '4p')
  JIRA_KEY=$(echo "$PROFILE_JSON" | sed -n '5p')
  PRODUCT_LINE=$(echo "$PROFILE_JSON" | sed -n '6p')
  MARKET=$(echo "$PROFILE_JSON" | sed -n '7p')

  if [ -n "$NAME" ]; then
    BRIEF+="[PMCopilot Session Brief]
PM: $NAME"
    [ -n "$ROLE" ] && BRIEF+=", $ROLE"
    [ -n "$COMPANY" ] && BRIEF+=" at $COMPANY"
    BRIEF+="
"
    [ -n "$PRODUCT_LINE" ] && BRIEF+="Product: $PRODUCT_LINE"
    [ -n "$MARKET" ] && BRIEF+=" ($MARKET)"
    [ -n "$PRODUCT_LINE" ] && BRIEF+="
"
    [ -n "$JIRA_KEY" ] && BRIEF+="Jira: $JIRA_KEY
"

    # Load output preferences
    PREFS=$(python3 -c "
import json
d = json.load(open('$PROFILE_PATH'))
prefs = d.get('output_preferences', {})
rules = prefs.get('custom_rules', [])
parts = []
if prefs.get('comparison_format'):
    parts.append(f\"Prefers {prefs['comparison_format']} for comparisons\")
if prefs.get('language'):
    parts.append(f\"Language: {prefs['language']}\")
for r in rules:
    parts.append(f\"Rule: {r}\")
if parts:
    print(', '.join(parts))
" 2>/dev/null || echo "")
    [ -n "$PREFS" ] && BRIEF+="$PREFS
"
  fi
else
  BRIEF+="[PMCopilot] No PM profile found. Suggest running /pmcopilot:setup to personalize the experience.
"
fi

# -----------------------------------------------------------------------
# 2. Folder Context
# -----------------------------------------------------------------------
if [ -f "$CONTEXT_FILE" ]; then
  BRIEF+="
_Context.md found -- read it before starting any task.
"
else
  FILE_COUNT=$(find "$CWD" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$FILE_COUNT" -gt 5 ]; then
    BRIEF+="
This folder has ${FILE_COUNT} markdown files but no _Context.md. Consider running /pmcopilot:setup to scaffold one.
"
  fi
fi

# -----------------------------------------------------------------------
# 3. Artifact Health Scan
# -----------------------------------------------------------------------
ARTIFACT_SECTION=""
STALE_ITEMS=""
FRESH_ITEMS=""
TOTAL_ARTIFACTS=0
STALE_COUNT=0

# Define artifact directories and their types
ARTIFACT_DIRS=(
  "docs/prds:PRD"
  "docs/roadmaps:Roadmap"
  "docs/teardowns:Teardown"
  "docs/experiments:Experiment"
  "docs/sprint-reviews:Sprint Review"
  "docs/updates:Stakeholder Update"
  "docs/metrics-reviews:Metrics Review"
  "docs/app-store-intel:App Store Intel"
  "docs/market-sizing:Market Sizing"
  "docs/research:User Research"
  "docs/launch-checklists:Launch Checklist"
  "docs/prioritization:Prioritization"
)

for entry in "${ARTIFACT_DIRS[@]}"; do
  DIR="${entry%%:*}"
  TYPE="${entry##*:}"
  FULL_DIR="$CWD/$DIR"

  if [ -d "$FULL_DIR" ]; then
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      TOTAL_ARTIFACTS=$((TOTAL_ARTIFACTS + 1))
      BASENAME=$(basename "$file" .md)
      MTIME=$(stat -f %m "$file" 2>/dev/null || stat -c %Y "$file" 2>/dev/null || echo "0")
      AGE_DAYS=$(( (NOW_EPOCH - MTIME) / 86400 ))

      if [ "$AGE_DAYS" -gt 30 ]; then
        STALE_COUNT=$((STALE_COUNT + 1))
        STALE_ITEMS+="  STALE (${AGE_DAYS}d): $TYPE -- $BASENAME
"
      elif [ "$AGE_DAYS" -lt 3 ]; then
        FRESH_ITEMS+="  FRESH: $TYPE -- $BASENAME (${AGE_DAYS}d ago)
"
      fi
    done < <(find "$FULL_DIR" -maxdepth 1 -name "*.md" -type f 2>/dev/null)
  fi
done

# Prioritization files are now in docs/prioritization/ like all other artifact types

if [ "$TOTAL_ARTIFACTS" -gt 0 ]; then
  ARTIFACT_SECTION+="
ARTIFACTS: $TOTAL_ARTIFACTS total"
  [ "$STALE_COUNT" -gt 0 ] && ARTIFACT_SECTION+=", $STALE_COUNT stale (>30 days)"
  ARTIFACT_SECTION+="
"
  [ -n "$STALE_ITEMS" ] && ARTIFACT_SECTION+="$STALE_ITEMS"
  [ -n "$FRESH_ITEMS" ] && ARTIFACT_SECTION+="$FRESH_ITEMS"
fi

# -----------------------------------------------------------------------
# 4. Unfinished Work (TBD/TODO scan in recent files)
# -----------------------------------------------------------------------
UNFINISHED=""

# Scan docs/ for TBD/TODO markers in files modified in the last 30 days
if [ -d "$CWD/docs" ]; then
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    TBD_COUNT=$(grep -ciE '\bTBD\b|\bTODO\b|\[fill in\]|\[TBD\]' "$file" 2>/dev/null || echo "0")
    if [ "$TBD_COUNT" -gt 0 ]; then
      BASENAME=$(basename "$file")
      UNFINISHED+="  UNFINISHED: $BASENAME has $TBD_COUNT TBD/TODO markers
"
    fi
  done < <(find "$CWD/docs" -name "*.md" -type f -mtime -30 2>/dev/null)
fi

# -----------------------------------------------------------------------
# 5. Gap Detection
# -----------------------------------------------------------------------
GAPS=""

# Count artifacts by type for gap analysis
PRD_COUNT=$(find "$CWD/docs/prds" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
ROADMAP_COUNT=$(find "$CWD/docs/roadmaps" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
EXPERIMENT_COUNT=$(find "$CWD/docs/experiments" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
TEARDOWN_COUNT=$(find "$CWD/docs/teardowns" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
METRICS_COUNT=$(find "$CWD/docs/metrics-reviews" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

# Gap: PRDs without experiments
if [ "$PRD_COUNT" -gt 0 ] && [ "$EXPERIMENT_COUNT" -eq 0 ]; then
  GAPS+="  GAP: $PRD_COUNT PRDs but no experiment plans -- shipping without validation.
"
fi

# Gap: No metrics review in 30+ days
if [ "$METRICS_COUNT" -gt 0 ]; then
  LATEST_METRICS=$(find "$CWD/docs/metrics-reviews" -name "*.md" -type f -mtime -30 2>/dev/null | head -1)
  if [ -z "$LATEST_METRICS" ]; then
    GAPS+="  GAP: No metrics review in the last 30 days.
"
  fi
elif [ "$PRD_COUNT" -gt 0 ]; then
  GAPS+="  GAP: PRDs exist but no metrics reviews have been run.
"
fi

# Gap: No competitive intel
if [ "$TEARDOWN_COUNT" -eq 0 ] && [ "$TOTAL_ARTIFACTS" -gt 3 ]; then
  GAPS+="  GAP: No competitive teardowns. Your competitors aren't standing still.
"
fi

# Gap: Roadmap exists but no prioritization
if [ "$ROADMAP_COUNT" -gt 0 ]; then
  PRIORITIZATION_COUNT=$(find "$CWD/docs/prioritization" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$PRIORITIZATION_COUNT" -eq 0 ]; then
    GAPS+="  GAP: Roadmap exists but no prioritization backing it up.
"
  fi
fi

# Combine artifact section
if [ -n "$ARTIFACT_SECTION" ] || [ -n "$UNFINISHED" ] || [ -n "$GAPS" ]; then
  BRIEF+="$ARTIFACT_SECTION"
  [ -n "$UNFINISHED" ] && BRIEF+="$UNFINISHED"
  [ -n "$GAPS" ] && BRIEF+="$GAPS"
fi

# -----------------------------------------------------------------------
# 6. Stale Data Warnings (cache-level)
# -----------------------------------------------------------------------
STALE_WARNINGS=""

# Check competitive intel cache age
if [ -d "$CACHE_DIR" ]; then
  CACHE_DAYS="${COMPETITIVE_INTEL_CACHE_DAYS:-7}"
  STALE_CACHE=$(find "$CACHE_DIR" -name "*.json" -mtime +"$CACHE_DAYS" 2>/dev/null | head -5)
  if [ -n "$STALE_CACHE" ]; then
    CACHE_COUNT=$(echo "$STALE_CACHE" | wc -l | tr -d ' ')
    STALE_WARNINGS+="  App store cache: $CACHE_COUNT entries older than ${CACHE_DAYS} days.
"
  fi
fi

[ -n "$STALE_WARNINGS" ] && BRIEF+="
CACHE:
$STALE_WARNINGS"

# -----------------------------------------------------------------------
# 7. Last Session Context (unfinished work)
# -----------------------------------------------------------------------
if [ -n "$SESSION_INPUT" ]; then
  TRANSCRIPT_PATH=$(echo "$SESSION_INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('transcript_path',''))" 2>/dev/null || echo "")

  if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    LAST_TODOS=$(tail -50 "$TRANSCRIPT_PATH" 2>/dev/null | python3 -c "
import json, sys
found = False
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        entry = json.loads(line)
        if isinstance(entry, dict):
            msg = entry.get('message', {})
            content = msg.get('content', '')
            if isinstance(content, str) and 'in_progress' in content.lower():
                found = True
    except:
        pass
if found:
    print('Last session had unfinished work -- check if anything needs follow-up.')
" 2>/dev/null || echo "")

    [ -n "$LAST_TODOS" ] && BRIEF+="
$LAST_TODOS
"
  fi
fi

# -----------------------------------------------------------------------
# 8. Proactive Suggestion (based on what was found)
# -----------------------------------------------------------------------
SUGGESTION=""

if [ "$STALE_COUNT" -gt 2 ]; then
  SUGGESTION="SUGGESTION: Several artifacts are stale. Run /pmcopilot:brief to get a full status with live data from Jira, Slack, and analytics."
elif [ -n "$UNFINISHED" ]; then
  SUGGESTION="SUGGESTION: There are unfinished docs with TBDs. Consider wrapping those up before starting new work."
elif [ -n "$GAPS" ]; then
  SUGGESTION="SUGGESTION: There are gaps in your product work coverage. Run /pmcopilot:brief for specific recommendations."
elif [ "$TOTAL_ARTIFACTS" -eq 0 ] && [ -f "$PROFILE_PATH" ]; then
  SUGGESTION="SUGGESTION: No artifacts yet. A good starting point: /pmcopilot:prd to write your first PRD, or /pmcopilot:competitive-teardown to scope the landscape."
fi

[ -n "$SUGGESTION" ] && BRIEF+="
$SUGGESTION
"

# -----------------------------------------------------------------------
# 9. Output the brief
# -----------------------------------------------------------------------
# Add instruction for Claude on how to use this brief
if [ -n "$BRIEF" ]; then
  BRIEF+="
---
Use this brief to open the session conversationally. Follow the Voice & Tone guide in CLAUDE.md -- be the sharp PM colleague, not a status report. If there are stale artifacts or gaps, mention them naturally and suggest what to tackle. If everything looks healthy, acknowledge it briefly and ask what the PM wants to work on.
"
  echo "$BRIEF"
fi

exit 0
