#!/usr/bin/env bash
# -----------------------------------------------------------------------
# PostToolUse hook: Update Artifact Index
#
# Fires after Write/Edit to docs/ directories. Maintains a lightweight
# JSON index at docs/.artifact-index.json that the session-start hook
# reads for its brief. Zero LLM cost -- pure shell.
#
# Input: JSON on stdin with tool_name, tool_input
# Output: none (writes to artifact index file)
# Exit code: 0 always -- never blocks.
# -----------------------------------------------------------------------

set -euo pipefail

CWD="${CLAUDE_PROJECT_DIR:-.}"
INDEX_FILE="$CWD/docs/.artifact-index.json"

# Read hook input from stdin
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat)
fi

[ -z "$INPUT" ] && exit 0

# Extract the file path from tool_input
FILE_PATH=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    tool_input = data.get('tool_input', {})
    # Write tool uses file_path, Edit tool also uses file_path
    path = tool_input.get('file_path', '')
    print(path)
except:
    print('')
" 2>/dev/null || echo "")

[ -z "$FILE_PATH" ] && exit 0

# Only index files in docs/ subdirectories
case "$FILE_PATH" in
  */docs/prds/*|*/docs/roadmaps/*|*/docs/teardowns/*|*/docs/experiments/*|\
  */docs/sprint-reviews/*|*/docs/updates/*|*/docs/metrics-reviews/*|\
  */docs/app-store-intel/*|*/docs/market-sizing/*|*/docs/research/*|\
  */docs/launch-checklists/*|*/docs/prioritization-*)
    ;;
  *)
    exit 0
    ;;
esac

# Only index markdown files
case "$FILE_PATH" in
  *.md) ;;
  *) exit 0 ;;
esac

# Determine artifact type from path
TYPE=$(echo "$FILE_PATH" | python3 -c "
import sys
path = sys.stdin.read().strip()
type_map = {
    '/docs/prds/': 'prd',
    '/docs/roadmaps/': 'roadmap',
    '/docs/teardowns/': 'teardown',
    '/docs/experiments/': 'experiment',
    '/docs/sprint-reviews/': 'sprint-review',
    '/docs/updates/': 'stakeholder-update',
    '/docs/metrics-reviews/': 'metrics-review',
    '/docs/app-store-intel/': 'app-store-intel',
    '/docs/market-sizing/': 'market-sizing',
    '/docs/research/': 'user-research',
    '/docs/launch-checklists/': 'launch-checklist',
    '/docs/prioritization': 'prioritization',
}
for pattern, t in type_map.items():
    if pattern in path:
        print(t)
        break
else:
    print('unknown')
" 2>/dev/null || echo "unknown")

# Extract title from file (first H1 or filename)
TITLE=""
if [ -f "$FILE_PATH" ]; then
  TITLE=$(grep -m1 '^# ' "$FILE_PATH" 2>/dev/null | sed 's/^# //' || echo "")
fi
[ -z "$TITLE" ] && TITLE=$(basename "$FILE_PATH" .md)

# Check for TBD/TODO markers
HAS_TBD="false"
if [ -f "$FILE_PATH" ]; then
  TBD_COUNT=$(grep -ciE '\bTBD\b|\bTODO\b|\[fill in\]' "$FILE_PATH" 2>/dev/null || echo "0")
  [ "$TBD_COUNT" -gt 0 ] && HAS_TBD="true"
fi

TODAY=$(date +%Y-%m-%d)

# Ensure docs/ directory exists
mkdir -p "$(dirname "$INDEX_FILE")"

# Initialize index file if it doesn't exist
if [ ! -f "$INDEX_FILE" ]; then
  echo "[]" > "$INDEX_FILE"
fi

# Update or append entry
python3 -c "
import json, sys, os

index_file = '$INDEX_FILE'
file_path = '$FILE_PATH'
artifact_type = '$TYPE'
title = '''$TITLE'''
has_tbd = $HAS_TBD
today = '$TODAY'

# Load existing index
try:
    with open(index_file, 'r') as f:
        index = json.load(f)
except:
    index = []

# Find existing entry by file path
found = False
for entry in index:
    if entry.get('file') == file_path:
        entry['updated'] = today
        entry['title'] = title
        entry['has_tbd'] = has_tbd
        found = True
        break

if not found:
    index.append({
        'type': artifact_type,
        'file': file_path,
        'title': title,
        'created': today,
        'updated': today,
        'has_tbd': has_tbd
    })

# Write back
with open(index_file, 'w') as f:
    json.dump(index, f, indent=2)
" 2>/dev/null

exit 0
