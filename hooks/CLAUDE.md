# Hooks Directory

Hooks are bash scripts triggered by Claude Code lifecycle events. They automate validation and data collection during plugin operation.

## Configuration

`hooks.json` maps events to scripts:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-simulators.sh"
          },
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-profile.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__simulator-bridge__*|mcp__emulator-bridge__*",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-simulator-running.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "mcp__simulator-bridge__tap|mcp__simulator-bridge__swipe|mcp__emulator-bridge__tap|mcp__emulator-bridge__swipe",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/auto-screenshot.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": "app-teardown|web-teardown",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/collect-teardown-results.sh"
          }
        ]
      }
    ]
  }
}
```

## Events and Scripts

| Event | Script | Purpose |
|-------|--------|---------|
| SessionStart | `check-simulators.sh` | Verify iOS Simulator / Android Emulator availability |
| SessionStart | `check-profile.sh` | Check for pm-profile.json; suggest `/pmcopilot:setup` if missing |
| PreToolUse | `check-simulator-running.sh` | Block device tools if no simulator/emulator is booted |
| PostToolUse | `auto-screenshot.sh` | Auto-capture screenshot after tap/swipe actions |
| SubagentStop | `collect-teardown-results.sh` | Collect and organize teardown data when agents finish |

Also present: `check-dependencies.sh` (validates `bun`, `node`, `adb`, `xcrun` are available).

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Allow — proceed normally |
| 2 | Block — halt the action (reason printed to stderr) |

Any other exit code is treated as an error.

## Conventions

- Scripts must be executable (`chmod +x`)
- Use `${CLAUDE_PLUGIN_ROOT}` for paths relative to plugin root
- Be defensive: check if commands exist before calling them
- Keep scripts fast — they run synchronously and block the action
- Write clear error messages to stderr when blocking (exit 2)
