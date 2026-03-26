#!/bin/bash
# PMCopilot Hook: SubagentStop (app-teardown/web-teardown)
# When a teardown agent finishes, collects its screenshots,
# flow maps, and analysis into the teardown results directory.
# Exit 0 = success (always, never blocks)

# Read JSON input from stdin
INPUT=$(cat)

# Extract session_id and agent name using python3
PARSED=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    session_id = data.get('session_id', 'unknown')
    # Agent name may come from tool_name, agent_name, or matcher fields
    agent_name = data.get('agent_name', '')
    if not agent_name:
        agent_name = data.get('tool_name', '')
    if not agent_name:
        matcher = data.get('matcher', '')
        agent_name = matcher
    print(session_id)
    print(agent_name)
except Exception:
    print('unknown')
    print('unknown')
" 2>/dev/null)

SESSION_ID=$(echo "$PARSED" | head -1)
AGENT_NAME=$(echo "$PARSED" | tail -1)

# Normalize agent name for directory naming
AGENT_TYPE="unknown"
if echo "$AGENT_NAME" | grep -q "app-teardown"; then
  AGENT_TYPE="app-teardown"
elif echo "$AGENT_NAME" | grep -q "web-teardown"; then
  AGENT_TYPE="web-teardown"
else
  AGENT_TYPE=$(echo "$AGENT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
fi

# Define directories
DATA_DIR="${CLAUDE_PLUGIN_DATA:-/tmp}"
RESULTS_DIR="${DATA_DIR}/teardowns/${SESSION_ID}"
SCREENSHOT_DIR="${DATA_DIR}/screenshots/${SESSION_ID}"

# Create results directory
mkdir -p "$RESULTS_DIR" 2>/dev/null

# Collect artifacts
ARTIFACTS="[]"

python3 -c "
import os, json, glob
from datetime import datetime

results_dir = '$RESULTS_DIR'
screenshot_dir = '$SCREENSHOT_DIR'
agent_type = '$AGENT_TYPE'
session_id = '$SESSION_ID'

artifacts = []

# Collect screenshots if the directory exists
if os.path.isdir(screenshot_dir):
    screenshots = sorted(glob.glob(os.path.join(screenshot_dir, '*.png')))
    for s in screenshots:
        rel_path = os.path.relpath(s, results_dir)
        artifacts.append({
            'type': 'screenshot',
            'path': rel_path,
            'filename': os.path.basename(s),
            'size_bytes': os.path.getsize(s) if os.path.exists(s) else 0
        })

# Collect any data files in the results directory itself (from prior steps)
for ext in ['*.md', '*.json', '*.csv', '*.txt', '*.html']:
    for f in glob.glob(os.path.join(results_dir, ext)):
        basename = os.path.basename(f)
        if basename == 'results.json':
            continue  # skip the manifest itself
        rel_path = os.path.relpath(f, results_dir)
        artifacts.append({
            'type': 'data',
            'path': rel_path,
            'filename': basename,
            'size_bytes': os.path.getsize(f) if os.path.exists(f) else 0
        })

# Also check for agent-specific subdirectories
agent_dir = os.path.join(results_dir, agent_type)
if os.path.isdir(agent_dir):
    for root, dirs, files in os.walk(agent_dir):
        for f in files:
            full = os.path.join(root, f)
            rel_path = os.path.relpath(full, results_dir)
            artifacts.append({
                'type': 'data',
                'path': rel_path,
                'filename': f,
                'size_bytes': os.path.getsize(full) if os.path.exists(full) else 0
            })

# Build the results manifest
manifest = {
    'timestamp': datetime.utcnow().isoformat() + 'Z',
    'agent_type': agent_type,
    'session_id': session_id,
    'artifacts_count': len(artifacts),
    'artifacts': artifacts
}

# Write the results.json manifest
manifest_path = os.path.join(results_dir, 'results.json')
with open(manifest_path, 'w') as fp:
    json.dump(manifest, fp, indent=2)

print(manifest_path)
" 2>/dev/null

RESULT=$?

if [ $RESULT -eq 0 ]; then
  # python3 already printed the manifest path to stdout
  :
else
  echo "Warning: Failed to collect teardown results for session $SESSION_ID" >&2
  echo "${RESULTS_DIR}/results.json"
fi

# Always exit 0 -- never block the workflow
exit 0
