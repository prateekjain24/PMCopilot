# 02 - MCP Servers

PMCopilot ships with 4 custom MCP servers and connects to several external ones. This document covers every MCP server in the ecosystem.

---

## Custom MCP Servers (Bundled with Plugin)

### 1. simulator-bridge (iOS Simulator Control)

**Purpose**: Programmatically control iOS Simulator for competitor app teardowns.

**Transport**: STDIO (local subprocess)

**Tech Stack**: TypeScript + Node.js, wrapping `xcrun simctl` and optionally `idb` (iOS Development Bridge)

**Tools Exposed**:

| Tool | Description | Parameters |
|------|------------|------------|
| `list_simulators` | List all available iOS simulators | `--filter <device_type>` |
| `boot_simulator` | Boot a specific simulator device | `device_id` |
| `shutdown_simulator` | Shut down a running simulator | `device_id` |
| `install_app` | Install an .app or .ipa on simulator | `device_id`, `app_path` |
| `launch_app` | Launch an installed app | `device_id`, `bundle_id` |
| `take_screenshot` | Capture current simulator screen | `device_id`, `output_path`, `format` |
| `record_video` | Start/stop video recording | `device_id`, `action`, `output_path` |
| `tap` | Simulate a tap at coordinates | `device_id`, `x`, `y` |
| `swipe` | Simulate a swipe gesture | `device_id`, `x1`, `y1`, `x2`, `y2`, `duration` |
| `type_text` | Type text into focused field | `device_id`, `text` |
| `press_button` | Press a hardware button | `device_id`, `button` (home, lock, etc.) |
| `get_accessibility_tree` | Dump accessibility hierarchy | `device_id` |
| `open_url` | Open a URL in the simulator | `device_id`, `url` |
| `get_app_container` | Get the filesystem path for an app | `device_id`, `bundle_id` |
| `terminate_app` | Force-quit an app | `device_id`, `bundle_id` |

**Configuration in .mcp.json**:
```json
{
  "mcpServers": {
    "simulator-bridge": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/simulator-bridge/dist/index.js"],
      "env": {
        "SCREENSHOT_DIR": "${CLAUDE_PLUGIN_DATA}/screenshots/ios",
        "VIDEO_DIR": "${CLAUDE_PLUGIN_DATA}/videos/ios"
      }
    }
  }
}
```

**How It Works Under the Hood**:
```
Agent request: "Take a screenshot of the Gojek home screen"
    |
    v
simulator-bridge MCP server
    |
    +--> xcrun simctl io booted screenshot /tmp/screenshot.png
    +--> OR idb screenshot --udid <device> /tmp/screenshot.png
    |
    v
Returns: { screenshot_path: "/path/to/screenshot.png", dimensions: "1284x2778" }
```

**Key Implementation Details**:
- Uses `xcrun simctl` for basic operations (boot, screenshot, install)
- Falls back to Facebook's `idb` for advanced input simulation (tap, swipe, gestures)
- `idb` provides more reliable coordinate-based interaction than simctl
- Accessibility tree inspection via `idb ui describe-all` for understanding screen content
- Screenshots saved to `${CLAUDE_PLUGIN_DATA}/screenshots/ios/` with timestamps

---

### 2. emulator-bridge (Android Emulator Control)

**Purpose**: Programmatically control Android Emulator for competitor app teardowns.

**Transport**: STDIO (local subprocess)

**Tech Stack**: TypeScript + Node.js, wrapping `adb` (Android Debug Bridge) and `emulator` CLI

**Tools Exposed**:

| Tool | Description | Parameters |
|------|------------|------------|
| `list_emulators` | List available AVDs | none |
| `list_devices` | List connected devices/emulators | none |
| `start_emulator` | Launch an AVD | `avd_name`, `options` |
| `install_apk` | Install APK on device | `device_id`, `apk_path` |
| `launch_app` | Start an activity | `device_id`, `package`, `activity` |
| `take_screenshot` | Capture current screen | `device_id`, `output_path` |
| `record_screen` | Record screen video | `device_id`, `output_path`, `time_limit` |
| `tap` | Simulate tap | `device_id`, `x`, `y` |
| `swipe` | Simulate swipe | `device_id`, `x1`, `y1`, `x2`, `y2`, `duration_ms` |
| `type_text` | Input text | `device_id`, `text` |
| `press_key` | Press a key event | `device_id`, `keycode` |
| `dump_ui` | Dump UI hierarchy (XML) | `device_id` |
| `get_current_activity` | Get foreground activity | `device_id` |
| `grant_permission` | Grant runtime permission | `device_id`, `package`, `permission` |
| `clear_app_data` | Clear app data | `device_id`, `package` |
| `get_logcat` | Get filtered log output | `device_id`, `tag`, `lines` |

**Configuration in .mcp.json**:
```json
{
  "mcpServers": {
    "emulator-bridge": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/emulator-bridge/dist/index.js"],
      "env": {
        "ANDROID_HOME": "/Users/$USER/Library/Android/sdk",
        "SCREENSHOT_DIR": "${CLAUDE_PLUGIN_DATA}/screenshots/android",
        "VIDEO_DIR": "${CLAUDE_PLUGIN_DATA}/videos/android"
      }
    }
  }
}
```

**How It Works Under the Hood**:
```
Agent request: "Tap the 'Sign Up' button on Gojek Android app"
    |
    v
emulator-bridge MCP server
    |
    +--> adb shell uiautomator dump /sdcard/ui.xml
    +--> adb pull /sdcard/ui.xml /tmp/ui.xml
    +--> Parse XML to find "Sign Up" button bounds
    +--> Calculate center coordinates
    +--> adb shell input tap <x> <y>
    +--> adb shell screencap -p /sdcard/screenshot.png
    +--> adb pull /sdcard/screenshot.png
    |
    v
Returns: { action: "tap", target: "Sign Up", screenshot_after: "/path/to/screenshot.png" }
```

**Key Implementation Details**:
- `adb shell input` commands for all touch/keyboard input (works without source code -- true black-box testing)
- `uiautomator dump` for accessibility tree (element bounds, text, class names)
- Screenshots via `adb shell screencap` + `adb pull`
- Screen recording via `adb shell screenrecord` (max 3 minutes per segment)
- Supports multiple simultaneous emulators via device serial targeting

---

### 3. app-store-intel (App Store + Play Store Intelligence)

**Purpose**: Extract competitive intelligence from app stores -- reviews, ratings, version history, ASO data, category rankings.

**Transport**: STDIO (local subprocess)

**Tech Stack**: TypeScript + Node.js, using web scraping and public APIs

**Tools Exposed**:

| Tool | Description | Parameters |
|------|------------|------------|
| `search_app_store` | Search iOS App Store | `query`, `country`, `limit` |
| `search_play_store` | Search Google Play Store | `query`, `country`, `limit` |
| `get_app_details` | Get detailed app metadata | `store`, `app_id` |
| `get_app_reviews` | Fetch recent reviews | `store`, `app_id`, `count`, `sort`, `rating_filter` |
| `get_version_history` | Get app version/changelog history | `store`, `app_id` |
| `get_category_rankings` | Get top apps in a category | `store`, `category`, `country`, `type` (free/paid/grossing) |
| `compare_apps` | Side-by-side comparison | `app_ids[]`, `metrics[]` |
| `get_review_sentiment` | Analyze review sentiment distribution | `store`, `app_id`, `sample_size` |
| `get_similar_apps` | Get "similar apps" recommendations | `store`, `app_id` |
| `track_rating_history` | Track rating changes over time | `store`, `app_id`, `period` |

**Data Sources**:
- iTunes Search API (official, for iOS)
- Google Play unofficial scraping (google-play-scraper npm package patterns)
- App Annie / Sensor Tower public data (where available)
- Review RSS feeds

**Configuration in .mcp.json**:
```json
{
  "mcpServers": {
    "app-store-intel": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/app-store-intel/dist/index.js"],
      "env": {
        "CACHE_DIR": "${CLAUDE_PLUGIN_DATA}/app-store-cache",
        "CACHE_TTL_HOURS": "24"
      }
    }
  }
}
```

---

### 4. pm-frameworks (Prioritization and Analysis Calculators)

**Purpose**: Structured calculation engines for PM frameworks -- RICE scoring, ICE scoring, Kano analysis, TAM/SAM/SOM, and more.

**Transport**: STDIO (local subprocess)

**Tech Stack**: TypeScript + Node.js

**Tools Exposed**:

| Tool | Description | Parameters |
|------|------------|------------|
| `rice_score` | Calculate RICE score | `reach`, `impact`, `confidence`, `effort` |
| `rice_batch` | Score multiple features at once | `features[]` with RICE params |
| `ice_score` | Calculate ICE score | `impact`, `confidence`, `ease` |
| `kano_classify` | Classify feature using Kano model | `functional_answer`, `dysfunctional_answer` |
| `kano_batch` | Batch Kano classification | `survey_responses[]` |
| `moscow_sort` | Sort features into MoSCoW buckets | `features[]`, `constraints` |
| `tam_sam_som` | Calculate market sizing | `total_market`, `serviceable_pct`, `obtainable_pct`, `methodology` |
| `weighted_score` | Custom weighted scoring model | `features[]`, `criteria[]`, `weights[]` |
| `opportunity_score` | Opportunity scoring (importance vs satisfaction) | `features[]` with importance + satisfaction |
| `cost_of_delay` | Calculate CD3 (Cost of Delay / Duration) | `features[]` with delay_cost + duration |
| `sample_size_calc` | A/B test sample size calculator | `baseline_rate`, `mde`, `significance`, `power` |
| `significance_test` | Check A/B test statistical significance | `control_visitors`, `control_conversions`, `variant_visitors`, `variant_conversions` |

**Configuration in .mcp.json**:
```json
{
  "mcpServers": {
    "pm-frameworks": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/pm-frameworks/dist/index.js"]
    }
  }
}
```

---

## External MCP Servers (Connected via .mcp.json)

These are third-party MCP servers that PMCopilot connects to for tool integrations:

### Project Management
```json
{
  "jira": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-jira"],
    "env": { "JIRA_URL": "", "JIRA_TOKEN": "" }
  },
  "linear": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-linear"],
    "env": { "LINEAR_API_KEY": "" }
  },
  "asana": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-asana"],
    "env": { "ASANA_TOKEN": "" }
  }
}
```

### Design
```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-figma"],
    "env": { "FIGMA_TOKEN": "" }
  }
}
```

### Communication
```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-slack"],
    "env": { "SLACK_TOKEN": "" }
  }
}
```

### Analytics
```json
{
  "amplitude": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-amplitude"],
    "env": { "AMPLITUDE_API_KEY": "", "AMPLITUDE_SECRET_KEY": "" }
  },
  "mixpanel": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-mixpanel"],
    "env": { "MIXPANEL_TOKEN": "" }
  }
}
```

### Documentation
```json
{
  "confluence": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-confluence"],
    "env": { "CONFLUENCE_URL": "", "CONFLUENCE_TOKEN": "" }
  },
  "notion": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-notion"],
    "env": { "NOTION_API_KEY": "" }
  }
}
```

### Browser Automation
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-playwright"],
    "env": {}
  }
}
```

---

## Complete .mcp.json

```json
{
  "mcpServers": {
    "simulator-bridge": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/simulator-bridge/dist/index.js"],
      "env": {
        "SCREENSHOT_DIR": "${CLAUDE_PLUGIN_DATA}/screenshots/ios",
        "VIDEO_DIR": "${CLAUDE_PLUGIN_DATA}/videos/ios"
      }
    },
    "emulator-bridge": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/emulator-bridge/dist/index.js"],
      "env": {
        "ANDROID_HOME": "/Users/$USER/Library/Android/sdk",
        "SCREENSHOT_DIR": "${CLAUDE_PLUGIN_DATA}/screenshots/android",
        "VIDEO_DIR": "${CLAUDE_PLUGIN_DATA}/videos/android"
      }
    },
    "app-store-intel": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/app-store-intel/dist/index.js"],
      "env": {
        "CACHE_DIR": "${CLAUDE_PLUGIN_DATA}/app-store-cache",
        "CACHE_TTL_HOURS": "24"
      }
    },
    "pm-frameworks": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/pm-frameworks/dist/index.js"]
    }
  }
}
```

---

## MCP Server Design Principles for PMCopilot

1. **5-8 tools per server** -- keeps context window lean and tool selection accurate
2. **High-level operations** -- `take_screenshot_of_screen` not `execute_shell_command`
3. **Accessibility-first navigation** -- use UI element names, not raw coordinates when possible
4. **Built-in caching** -- competitive intel doesn't change hourly; cache aggressively
5. **Graceful degradation** -- if simulator isn't running, return helpful error, don't crash
6. **Screenshot-as-data** -- every interaction returns a screenshot so the LLM can verify state
7. **Structured output** -- return JSON, not raw text, so agents can parse reliably
