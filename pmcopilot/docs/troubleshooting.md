# Troubleshooting Guide

This guide covers common problems, their likely causes, and fixes. Each entry follows the format: **Symptom**, **Cause**, **Fix**.

---

## Table of Contents

1. [Plugin Installation](#plugin-installation)
2. [Integration Connectivity](#integration-connectivity)
3. [iOS Simulator](#ios-simulator)
4. [Android Emulator](#android-emulator)
5. [Hooks](#hooks)
6. [Agent Memory](#agent-memory)
7. [Performance](#performance)
8. [Diagnostic Checklist](#diagnostic-checklist)

---

## Plugin Installation

### Plugin not loading

**Symptom**: Running `claude --plugin-dir ./pmcopilot` starts Claude Code but none of the `/pmcopilot:*` skills appear.

**Cause**: The plugin manifest at `.claude-plugin/plugin.json` is missing, malformed, or the path is wrong.

**Fix**:
1. Confirm the manifest file exists:
   ```bash
   ls ./pmcopilot/.claude-plugin/plugin.json
   ```
2. Validate the JSON:
   ```bash
   cat ./pmcopilot/.claude-plugin/plugin.json | python3 -m json.tool
   ```
3. Ensure the `--plugin-dir` path points to the directory that **contains** `.claude-plugin/`, not to `.claude-plugin/` itself.
4. Restart Claude Code after fixing.

### Skills not appearing after plugin loads

**Symptom**: The plugin loads (no error on startup) but specific skills are missing from the slash command list.

**Cause**: The skill's `SKILL.md` frontmatter is invalid or the file is not in the expected `skills/<name>/SKILL.md` path.

**Fix**:
1. Check that each skill directory contains a `SKILL.md` file:
   ```bash
   ls ./pmcopilot/skills/*/SKILL.md
   ```
2. Validate that each `SKILL.md` starts with valid YAML frontmatter between `---` delimiters.
3. Ensure `user-invocable: true` is set in the frontmatter for skills you expect to appear.

### Manifest errors

**Symptom**: Claude Code prints a manifest validation error on startup.

**Cause**: The `plugin.json` file has a structural error -- missing required fields, incorrect types, or trailing commas.

**Fix**:
1. Validate the JSON syntax:
   ```bash
   cat ./pmcopilot/.claude-plugin/plugin.json | python3 -m json.tool
   ```
2. Confirm required fields are present: `name`, `version`, `description`.
3. Check for trailing commas (invalid in JSON) or unquoted keys.

---

## Integration Connectivity

### Jira MCP not connecting

**Symptom**: Sprint review or prioritize skills ask for manual data input instead of pulling from Jira.

**Cause**: The Atlassian MCP is not enabled or the OAuth session has expired.

**Fix**:
1. Check if the Atlassian MCP is listed:
   ```bash
   claude mcp list
   ```
2. If missing, re-enable it from Claude Code Settings > Integrations > Atlassian.
3. If listed but failing, the OAuth token may have expired. Disconnect and reconnect the integration.
4. Verify your Atlassian account has Browse Projects permission for the target project.

### Slack MCP not connecting

**Symptom**: Stakeholder update skill outputs text locally instead of offering to post to Slack.

**Cause**: The Slack MCP is not enabled, the bot has not been invited to the target channel, or OAuth scopes are insufficient.

**Fix**:
1. Check if the Slack MCP is listed:
   ```bash
   claude mcp list
   ```
2. If missing, re-enable it from Claude Code Settings > Integrations > Slack.
3. Invite the Slack bot to the target channel:
   ```
   /invite @Claude
   ```
4. If you see "missing_scope" errors, reconnect the integration to re-authorize with the required scopes.

### Analytics MCP not returning data

**Symptom**: Metrics review skill asks for manual CSV input instead of querying Amplitude or Mixpanel.

**Cause**: The analytics MCP server is not configured, authentication failed, or the project has no matching events.

**Fix**:
1. Verify the MCP server is registered:
   ```bash
   claude mcp list
   ```
2. If not registered, add it:
   ```bash
   # For Amplitude
   claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"

   # For Mixpanel
   claude mcp add -t http Mixpanel "https://mcp.mixpanel.com/mcp"
   ```
3. If registered but failing, remove and re-add to reset authentication:
   ```bash
   claude mcp remove Amplitude
   claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"
   ```
4. Confirm the target project contains events for the queried date range.

### Figma MCP authentication failures

**Symptom**: UX reviewer agent cannot fetch Figma frames; errors mention authentication or authorization.

**Cause**: The Figma MCP OAuth token has expired or the account lacks access to the target file.

**Fix**:
1. Remove and re-add the Figma MCP:
   ```bash
   claude mcp remove Figma
   claude mcp add -t http Figma "https://mcp.figma.com/mcp"
   ```
2. On the next tool call, complete the OAuth flow in the browser.
3. Confirm your Figma account has at least Viewer access to the file.
4. If using Figma Organization, check that third-party app access is not blocked by your admin.

---

## iOS Simulator

### Xcode not installed

**Symptom**: The simulator-bridge MCP fails with errors about `xcrun` not being found.

**Cause**: Xcode or Xcode Command Line Tools are not installed.

**Fix**:
1. Install Xcode from the Mac App Store.
2. Accept the license agreement:
   ```bash
   sudo xcodebuild -license accept
   ```
3. Install Command Line Tools if needed:
   ```bash
   xcode-select --install
   ```
4. Verify `xcrun` is available:
   ```bash
   xcrun simctl list devices
   ```

### Simulator not booting

**Symptom**: The app-teardown agent reports that the iOS Simulator failed to boot.

**Cause**: No simulator runtime is installed, or the specified device type is unavailable.

**Fix**:
1. List available runtimes and devices:
   ```bash
   xcrun simctl list
   ```
2. If no runtimes appear, open Xcode > Settings > Platforms and download an iOS runtime.
3. Create a device if none exist:
   ```bash
   xcrun simctl create "PMCopilot-iPhone" "iPhone 15" "iOS-17-5"
   ```
4. Boot it manually to test:
   ```bash
   xcrun simctl boot "PMCopilot-iPhone"
   ```

### Screenshot capture failing

**Symptom**: The simulator-bridge MCP connects and navigates the app but screenshots are blank or missing.

**Cause**: The simulator window may be in the background, or the screenshot output path is not writable.

**Fix**:
1. Ensure the simulator is in the foreground:
   ```bash
   open -a Simulator
   ```
2. Test a manual screenshot:
   ```bash
   xcrun simctl io booted screenshot /tmp/test-screenshot.png
   ```
3. Check that the teardown output directory exists and is writable:
   ```bash
   ls -la ~/.claude/plugins/data/pmcopilot/teardowns/
   ```
4. If the directory does not exist, create it:
   ```bash
   mkdir -p ~/.claude/plugins/data/pmcopilot/teardowns/
   ```

### idb not found

**Symptom**: The simulator-bridge MCP reports that `idb` (iOS Development Bridge) is not installed.

**Cause**: idb is not installed or not on the PATH.

**Fix**:
1. Install idb via pip:
   ```bash
   pip3 install fb-idb
   ```
2. Or install the companion via Homebrew:
   ```bash
   brew install idb-companion
   ```
3. Verify it is available:
   ```bash
   idb list-targets
   ```
4. If installed but not on PATH, add its location to your shell profile.

### App installation failures

**Symptom**: The app-teardown agent fails to install the target app on the iOS Simulator.

**Cause**: The app binary is not compatible with the simulator architecture (arm64 vs x86_64) or the bundle is invalid.

**Fix**:
1. Simulator apps require a `.app` bundle built for the simulator, not a `.ipa` from the App Store.
2. If you built the app yourself, ensure the build target is set to "Any iOS Simulator Device."
3. Test manual installation:
   ```bash
   xcrun simctl install booted /path/to/MyApp.app
   ```
4. For competitor apps, use the Android Emulator path instead -- APKs are easier to obtain and install.

---

## Android Emulator

### ANDROID_HOME not set

**Symptom**: The emulator-bridge MCP fails with "ANDROID_HOME environment variable is not set."

**Cause**: The Android SDK path is not configured in your shell environment.

**Fix**:
1. Locate your Android SDK (typically `~/Library/Android/sdk` on macOS).
2. Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
   ```
3. Reload your shell:
   ```bash
   source ~/.zshrc
   ```
4. Verify:
   ```bash
   echo $ANDROID_HOME
   adb version
   ```

### Emulator not starting

**Symptom**: The emulator-bridge MCP cannot start the Android Emulator or it crashes on launch.

**Cause**: No AVD (Android Virtual Device) is configured, or hardware acceleration is not available.

**Fix**:
1. List available AVDs:
   ```bash
   $ANDROID_HOME/emulator/emulator -list-avds
   ```
2. If none exist, create one via Android Studio > Device Manager or via command line:
   ```bash
   $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "system-images;android-34;google_apis;arm64-v8a"
   $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n PMCopilot-Pixel -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_7
   ```
3. Test launching manually:
   ```bash
   $ANDROID_HOME/emulator/emulator -avd PMCopilot-Pixel
   ```
4. On Apple Silicon Macs, use `arm64-v8a` system images. Intel Macs should use `x86_64`.

### ADB connection issues

**Symptom**: The emulator is running but the emulator-bridge MCP reports "no devices found" or "device offline."

**Cause**: The ADB server is not running or has lost its connection to the emulator.

**Fix**:
1. Restart the ADB server:
   ```bash
   adb kill-server
   adb start-server
   ```
2. Check connected devices:
   ```bash
   adb devices
   ```
3. If the device shows as "offline," restart the emulator.
4. If multiple emulators are running, the MCP may connect to the wrong one. Stop all emulators and start only the target device.

### APK installation failures

**Symptom**: The app-teardown agent fails to install an APK on the emulator.

**Cause**: The APK is incompatible with the emulator ABI, or the app requires Google Play Services not present on the emulator image.

**Fix**:
1. Use a system image with Google APIs (not "Google Play") for better compatibility:
   ```bash
   $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "system-images;android-34;google_apis;arm64-v8a"
   ```
2. Test manual installation:
   ```bash
   adb install /path/to/app.apk
   ```
3. If you get "INSTALL_FAILED_NO_MATCHING_ABIS," the APK architecture does not match the emulator. Download an APK that supports your emulator ABI (arm64-v8a on Apple Silicon).
4. If the app requires Google Play Services, use a "Google Play" system image and sign in with a Google account on the emulator.

---

## Hooks

### Hooks blocking unexpectedly

**Symptom**: A tool call or agent action is blocked with an error message from a hook, even though the action seems legitimate.

**Cause**: A PreToolUse or SubagentStop hook is returning exit code 2 (block) based on its validation logic.

**Fix**:
1. Check the hook script that is blocking. Look at `hooks/hooks.json` to identify which hook is triggered:
   ```bash
   cat ./pmcopilot/hooks/hooks.json
   ```
2. Run the hook script manually with test input to understand its logic.
3. If the hook is overly restrictive, edit its validation conditions.
4. Exit code 0 = allow, exit code 2 = block (reason printed to stderr). Any other exit code is treated as an error.

### Hook scripts not executable

**Symptom**: Hooks fail with "permission denied" errors.

**Cause**: The hook script files do not have the executable bit set.

**Fix**:
```bash
chmod +x ./pmcopilot/hooks/*.sh
```

If hooks are written in another language (Python, Node), ensure the shebang line is correct and the interpreter is available:
```bash
head -1 ./pmcopilot/hooks/my-hook.py
# Should be: #!/usr/bin/env python3
```

### JSON parsing errors in hooks

**Symptom**: Hooks fail with JSON parse errors or produce unexpected behavior.

**Cause**: The hook script receives input as JSON on stdin but is not parsing it correctly, or it outputs malformed JSON.

**Fix**:
1. Hooks receive a JSON object on stdin with context about the event. Test your hook manually:
   ```bash
   echo '{"tool":"mcp__simulator-bridge__take_screenshot","args":{}}' | ./pmcopilot/hooks/my-hook.sh
   echo $?
   ```
2. Ensure the hook script reads all of stdin before processing. In bash:
   ```bash
   INPUT=$(cat)
   ```
3. If the hook outputs JSON, validate it:
   ```bash
   echo '{}' | ./pmcopilot/hooks/my-hook.sh | python3 -m json.tool
   ```

---

## Agent Memory

### Memory corruption / reset

**Symptom**: An agent that previously remembered context from earlier sessions now behaves as if it has no prior context.

**Cause**: The agent memory file was deleted, overwritten, or corrupted.

**Fix**:
1. Agent memory is stored in `~/.claude/plugins/data/pmcopilot/`. Check for the memory file:
   ```bash
   ls -la ~/.claude/plugins/data/pmcopilot/
   ```
2. If the file is missing, the agent will start fresh. Previous memory cannot be recovered unless you have a backup.
3. If the file exists but the agent ignores it, check that the agent definition has `memory: project` in its frontmatter.

### Memory size limits

**Symptom**: Agent responses become slow or the agent fails to load its memory context.

**Cause**: The memory file has grown too large from accumulated context across many sessions.

**Fix**:
1. Check the memory file size:
   ```bash
   du -h ~/.claude/plugins/data/pmcopilot/*.memory.json
   ```
2. If a memory file exceeds 1 MB, consider archiving old entries:
   ```bash
   cp ~/.claude/plugins/data/pmcopilot/prd-writer.memory.json \
      ~/.claude/plugins/data/pmcopilot/prd-writer.memory.backup.json
   ```
3. Edit the memory file to remove outdated or redundant entries while preserving key project context.

### Cross-project contamination

**Symptom**: An agent references projects, features, or context from a different project.

**Cause**: Agents with `memory: project` scope may share memory across projects if the plugin data directory is shared.

**Fix**:
1. Check which project context is stored in the memory file:
   ```bash
   cat ~/.claude/plugins/data/pmcopilot/research-synthesizer.memory.json | python3 -m json.tool | head -50
   ```
2. Remove entries that belong to a different project.
3. For strict isolation, use separate plugin data directories per project by setting `CLAUDE_PLUGIN_DATA` to a project-specific path.

---

## Performance

### Slow MCP responses

**Symptom**: Skills that call MCP tools take a long time to return results or time out.

**Cause**: The MCP server process is overloaded, the network connection to a remote MCP is slow, or the underlying API is rate-limited.

**Fix**:
1. For local MCP servers (simulator-bridge, emulator-bridge, pm-frameworks, app-store-intel), check if the Node.js process is running:
   ```bash
   ps aux | grep "mcp-servers"
   ```
2. Restart the MCP server by restarting Claude Code.
3. For remote MCP servers (Amplitude, Mixpanel, Figma), check your network connection and the service status page.
4. If a specific tool call is slow, try narrowing the query (smaller date range, fewer items).

### Large teardown sessions

**Symptom**: A competitive teardown runs for a very long time or appears to hang.

**Cause**: The app-teardown or web-teardown agent is navigating many screens/pages. Web teardowns are capped at 50 pages per competitor, but app teardowns can explore deeply nested flows.

**Fix**:
1. For web teardowns, the 50-page cap should prevent runaway sessions. If it seems stuck, check Claude Code for agent progress messages.
2. For app teardowns, consider providing a more focused scope:
   ```
   /pmcopilot:competitive-teardown "Grab onboarding flow only"
   ```
3. The 2-second navigation delay is intentional (rate limiting). Do not attempt to remove it.
4. If the agent is truly stuck, cancel it and retry with a narrower scope.

### Screenshot storage growth

**Symptom**: Disk usage grows significantly after running multiple teardown sessions.

**Cause**: Screenshots from app and web teardowns are cached indefinitely in the teardown data directory.

**Fix**:
1. Check storage usage:
   ```bash
   du -sh ~/.claude/plugins/data/pmcopilot/teardowns/
   ```
2. List teardown sessions by date:
   ```bash
   ls -lt ~/.claude/plugins/data/pmcopilot/teardowns/
   ```
3. Remove old teardown sessions that are no longer needed:
   ```bash
   rm -rf ~/.claude/plugins/data/pmcopilot/teardowns/<session-id>/
   ```
4. Competitive intel data (non-screenshot) is cached for 7 days and cleaned up automatically. Screenshots are not auto-cleaned.

---

## Diagnostic Checklist

When something is not working and the sections above do not cover your specific issue, run through this systematic checklist.

### Step 1: Verify plugin loading

```bash
claude --plugin-dir ./pmcopilot
# Type: /pmcopilot:
# Confirm skills appear in autocomplete
```

If skills do not appear, see [Plugin Installation](#plugin-installation).

### Step 2: Check MCP servers

```bash
claude mcp list
```

Confirm that all expected MCP servers are listed (both built-in and external integrations). For any missing server, see [Integration Connectivity](#integration-connectivity).

### Step 3: Validate MCP server health

For each local MCP server, rebuild and verify:

```bash
cd ./pmcopilot/mcp-servers/<server-name>
bun install
bun run build
```

If the build fails, check for TypeScript errors in the server source code.

### Step 4: Test a simple skill

```bash
/pmcopilot:prd "Test Feature"
```

If this basic skill works, the plugin infrastructure is healthy. The problem is likely integration-specific.

### Step 5: Check hooks

```bash
cat ./pmcopilot/hooks/hooks.json
```

Temporarily disable hooks by renaming the hooks file to isolate whether a hook is causing the issue:

```bash
mv ./pmcopilot/hooks/hooks.json ./pmcopilot/hooks/hooks.json.bak
```

Restart Claude Code and test again. If the problem resolves, a hook is the cause. Re-enable and debug individual hooks.

### Step 6: Inspect agent memory

```bash
ls -la ~/.claude/plugins/data/pmcopilot/
```

If memory files are very large or corrupted, back them up and remove them to test with fresh memory.

### Step 7: Check system requirements

```bash
# Claude Code version
claude --version

# macOS version
sw_vers

# Xcode (for iOS Simulator)
xcode-select -p
xcrun simctl list devices

# Android SDK (for Android Emulator)
echo $ANDROID_HOME
adb version
$ANDROID_HOME/emulator/emulator -list-avds

# Node.js / Bun (for MCP server builds)
node --version
bun --version
```

### Step 8: Collect logs

If the issue persists, gather diagnostic information before seeking help:

1. Claude Code version and OS version (from Step 7).
2. The exact error message or unexpected behavior.
3. Which skill, agent, or MCP server is involved.
4. Whether the issue is reproducible or intermittent.
5. Contents of any relevant hook or memory files.
