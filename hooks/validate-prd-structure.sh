#!/bin/bash
# PMCopilot Hook: PostToolUse (Write/Edit)
# After a PRD file is written or edited, validates that it contains
# all required sections per the selected template format.
# Exit 0 = valid (or not a PRD file), Exit 2 = validation failed (reason on stderr)

# Read JSON input from stdin (hook receives tool_input as JSON)
INPUT=$(cat)

# Extract file_path from the JSON tool_input
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    # Navigate to tool_input.file_path -- handle nested structures
    if isinstance(data, dict):
        tool_input = data.get('tool_input', data)
        if isinstance(tool_input, dict):
            print(tool_input.get('file_path', ''))
        else:
            print('')
    else:
        print('')
except:
    print('')
" 2>/dev/null)

# If we could not extract a file path, allow the operation
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# EARLY EXIT: Exclude plugin infrastructure files
# Only validate actual PRD output documents in workspace directories
# Exclude: agents/, commands/, hooks/, skills/, mcp-servers/, src/, templates/, marketplace/, docs/, scripts/
if echo "$FILE_PATH" | grep -qE '/(agents|commands|hooks|skills|mcp-servers|src|templates|marketplace|docs|scripts)/'; then
  exit 0
fi

# Exclude common config file extensions
if echo "$FILE_PATH" | grep -qE '\.(sh|json|yaml|yml|config|lock)$'; then
  exit 0
fi

# Check if the filename matches PRD output patterns
# Only match files actually named for PRD outputs, not agent/command config files
BASENAME=$(basename "$FILE_PATH" | tr '[:upper:]' '[:lower:]')

case "$BASENAME" in
  *prd* | *product-requirements* | *product_requirements*)
    # Additional check: exclude files ending in -writer, -agent, -config
    if echo "$BASENAME" | grep -qE '(-writer|-agent|-config)\.md$'; then
      exit 0
    fi
    # This is likely a PRD output file -- proceed with validation
    ;;
  *)
    # Not a PRD file -- allow silently
    exit 0
    ;;
esac

# Verify the file exists and is readable
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Define required sections for a valid PRD
REQUIRED_SECTIONS=(
  "Problem Statement"
  "Goals"
  "Non-Goals"
  "User Stories"
  "Success Metrics"
  "Scope"
  "Timeline"
  "Risks"
  "Open Questions"
)

# Read file content
FILE_CONTENT=$(cat "$FILE_PATH")

# Track missing sections
MISSING=()

for section in "${REQUIRED_SECTIONS[@]}"; do
  # Case-insensitive search for the section heading
  # Match as a markdown heading (## or ###) or as a standalone line
  if ! echo "$FILE_CONTENT" | grep -qi "^\#*[[:space:]]*${section}"; then
    MISSING+=("$section")
  fi
done

# Report results
if [ ${#MISSING[@]} -eq 0 ]; then
  echo "PRD validation passed: all ${#REQUIRED_SECTIONS[@]} required sections present in $(basename "$FILE_PATH")"
  exit 0
else
  MISSING_LIST=$(printf ", %s" "${MISSING[@]}")
  MISSING_LIST=${MISSING_LIST:2}  # Remove leading ", "
  echo "PRD validation failed for $(basename "$FILE_PATH"): missing ${#MISSING[@]} of ${#REQUIRED_SECTIONS[@]} required sections." >&2
  echo "Missing sections: ${MISSING_LIST}" >&2
  echo "" >&2
  echo "Required sections: Problem Statement, Goals, Non-Goals, User Stories, Success Metrics, Scope, Timeline, Risks, Open Questions" >&2
  exit 2
fi
