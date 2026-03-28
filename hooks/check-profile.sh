#!/usr/bin/env bash
# -----------------------------------------------------------------------
# SessionStart hook: check if pm-profile.json exists
# Prints a friendly reminder if the user hasn't run /pmcopilot:setup yet.
# Exit code 0 always -- never blocks the session.
# -----------------------------------------------------------------------

PLUGIN_DATA="${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/pmcopilot}"
PROFILE_PATH="$PLUGIN_DATA/pm-profile.json"

if [ ! -f "$PROFILE_PATH" ]; then
  echo "[PMCopilot] You haven't set up your PM profile yet. Run /pmcopilot:setup to personalize your experience -- it takes about 5 minutes." >&2
fi

exit 0
