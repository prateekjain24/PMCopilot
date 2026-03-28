# PMCopilot

AI-powered copilot for Product Managers -- PRD generation, prioritization frameworks, competitive teardowns, sprint analytics, and more.

Built as a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin. Works with both **Claude Code CLI** and **Cowork** (Claude Desktop).

---

## What You Can Do

### Research and Discovery

- **Competitive Teardown** -- Launch parallel app, web, and market research agents that navigate real apps on simulators/emulators, browse competitor websites via Chrome, and synthesize findings into an 8-section intelligence report.
- **App Store Intel** -- Pull ratings, reviews, version history, and sentiment analysis from the App Store and Play Store. Compare multiple apps side by side.
- **Market Sizing** -- Generate TAM/SAM/SOM estimates using top-down and bottom-up methodologies with web research and cross-validation.

### Strategy and Planning

- **PRD Generator** -- Write comprehensive PRDs using Google, Amazon PRFAQ, or Stripe templates. Optionally publishes to Confluence and links to Jira epics.
- **Prioritize** -- Score features using RICE, ICE, MoSCoW, Kano, or Cost of Delay. Can read directly from your Jira backlog.
- **Roadmap** -- Generate roadmaps in Now/Next/Later, Timeline, or Outcome-based formats grounded in your backlog and prior prioritization.

### Execution and Measurement

- **Sprint Review** -- Analyze sprint performance with velocity trends, ticket breakdowns, and talking points. Pulls from Jira and correlates with calendar load.
- **Experiment Design** -- Design rigorous A/B tests with hypothesis formulation, sample size calculation, and rollout planning.
- **Metrics Review** -- North Star Metric or AARRR Pirate Metrics analysis with data from Amplitude or Mixpanel.

### Communication

- **Stakeholder Update** -- Generate weekly, monthly, or executive summary updates. Post to Slack channels or draft emails via Gmail.
- **User Research** -- Create personas, interview guides, JTBD canvases, and affinity maps. Synthesize meeting transcripts from Granola.
- **Launch Checklist** -- Comprehensive launch readiness checklists tailored for soft, hard, or beta launches.

---

## Getting Started

### Option A: Cowork (Claude Desktop)

If you are using Cowork, PMCopilot is available as a plugin. Install it from the plugin marketplace or load it manually:

1. Open Cowork and go to Settings > Plugins.
2. Search for "PMCopilot" or point to the plugin directory.
3. All commands appear under the `/pmcopilot:` namespace.
4. External integrations (Jira, Slack, Figma, etc.) connect through Cowork's built-in MCP connectors. Go to Settings > Connectors to enable the ones you need.

### Option B: Claude Code CLI

Clone the repository and load it as a plugin:

```bash
git clone https://github.com/prateekjain24/PMCopilot.git
cd PMCopilot
claude --plugin-dir .
```

Once loaded, all commands are available as `/pmcopilot:<command>`. For example:

```
/pmcopilot:prd "User onboarding flow redesign" --template google
/pmcopilot:prioritize rice
```

---

## Setup Tiers

PMCopilot is designed to work at every level of setup. You do not need all integrations to get value -- start with Tier 0 and add capabilities as you need them.

| Tier | What You Need | What You Unlock |
|------|--------------|-----------------|
| **0 -- Zero Setup** | Just the plugin | PRD generation, prioritization, roadmaps, experiment design, launch checklists, market sizing (with manual data input) |
| **1 -- Analytics** | Amplitude or Mixpanel MCP | Metrics review with live data, anomaly detection, retention curves, funnel analysis |
| **2 -- PM Tools** | Jira, Slack, Gmail, Google Calendar, Granola, Figma MCPs | Sprint review from Jira, stakeholder updates via Slack/Gmail, user research from meeting transcripts, UX review from Figma |
| **3 -- Mobile Testing** | Xcode (iOS) or Android SDK + built MCP servers | App teardowns on real simulators/emulators, screenshot-driven competitive analysis |
| **4 -- Full Stack** | Chrome MCP + all of the above | End-to-end competitive teardowns combining app, web, and market research |

---

## Building the Custom MCP Servers

PMCopilot ships with four custom MCP servers that run locally over STDIO transport. Two of these -- simulator-bridge and emulator-bridge -- power the mobile app teardown capabilities and require platform-specific prerequisites. The other two (pm-frameworks, app-store-intel) work on any platform.

### PM Frameworks Server

Provides calculators for RICE, ICE, Kano, MoSCoW, TAM/SAM/SOM, sample size, and statistical significance. No special prerequisites.

```bash
cd mcp-servers/pm-frameworks
bun install && bun run build
cd ../..
```

### App Store Intel Server

Extracts data from the App Store and Google Play Store -- search, app details, reviews, sentiment analysis, category rankings, version tracking, and competitive comparison across 10 tools.

**How it works:**

The server has two adapters. The App Store adapter uses three free, unauthenticated Apple APIs: the iTunes Search API for keyword search, the iTunes Lookup API for app-by-ID metadata, and the Apple RSS feed for top-app rankings and user reviews. No API keys or auth needed -- these are public endpoints.

The Play Store adapter uses the `google-play-scraper` npm package, which scrapes Play Store web pages. This package is listed as an optional dependency. If not installed, all Play Store functions return a descriptive error telling you how to install it. App Store features work regardless.

All responses are cached locally as JSON files (default TTL: 24 hours, configurable via `CACHE_TTL_HOURS` env var). Version history and rating history use separate persistent storage that never expires, so they accumulate data across calls.

**Prerequisites:**

- Node.js 18+ and Bun (required)
- Network access to `itunes.apple.com` and `rss.applemarketingtools.com` (required for App Store)
- `google-play-scraper` package (optional, for Play Store support)

**Build:**

```bash
cd mcp-servers/app-store-intel
bun install && bun run build
cd ../..
```

To enable Play Store features:

```bash
cd mcp-servers/app-store-intel
bun add google-play-scraper
bun run build
cd ../..
```

**What the 10 tools do:**

| Category | Tools | Description |
|----------|-------|-------------|
| Search | `search_app_store`, `search_play_store` | Keyword search returning normalized app metadata (name, developer, rating, category) |
| Details | `get_app_details` | Full metadata for one app: description, version, size, ratings, screenshots, release notes |
| Reviews | `get_app_reviews`, `get_review_sentiment` | Fetch reviews with pagination/sorting/star filtering; keyword-based sentiment analysis with theme extraction |
| Rankings | `get_category_rankings` | Top free/paid/grossing apps by category (mapped to Apple genre IDs) |
| Comparison | `compare_apps`, `get_similar_apps` | Side-by-side comparison of 2-10 apps; find competitor apps (Play Store native, App Store heuristic) |
| Tracking | `get_version_history`, `track_rating_history` | Accumulate version and rating data over time for trend analysis |

**Known limitations:**

- Sentiment analysis uses keyword matching, not NLP. Negation ("not great") is not handled -- the word "great" counts as positive regardless of context. Good enough for directional signal at scale, but not for individual review accuracy.
- Version history for both stores only captures the current version on each call. Neither Apple nor Google provide historical version APIs. The data gets richer over time as you call the tool periodically.
- The `google-play-scraper` package is a web scraper, not an official API. Google can change their page structure and break it. If Play Store tools start returning errors after working previously, check for a newer version of the package.

### Simulator Bridge (iOS)

Wraps `xcrun simctl` and `idb` to give PMCopilot full control over iOS Simulators. This is what powers the `app-teardown` agent when it navigates iOS apps, takes screenshots of every screen, and maps user flows.

**Prerequisites:**

- macOS (required -- iOS Simulator only runs on Mac)
- Xcode installed with at least one simulator runtime (e.g. iPhone 15, iOS 17)
- Command Line Tools: run `xcode-select --install` if not already set up
- [idb](https://fbidb.io/) (optional but recommended for richer interaction): `brew install idb-companion`

**Build:**

```bash
cd mcp-servers/simulator-bridge
bun install && bun run build
cd ../..
```

**Verify it works:**

```bash
# Check that Xcode simulators are available
xcrun simctl list devices available

# You should see at least one device like:
# iPhone 15 (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) (Shutdown)
```

**What the 15 tools do:**

| Category | Tools | Description |
|----------|-------|-------------|
| Simulator lifecycle | `list_simulators`, `boot_simulator`, `shutdown_simulator` | Discover, start, and stop simulator instances |
| App management | `install_app`, `launch_app`, `terminate_app`, `get_app_container` | Install .app bundles, launch/kill apps, find app data paths |
| Screen capture | `take_screenshot`, `record_video` | Capture PNG screenshots and record MP4 video of the simulator screen |
| Input interaction | `tap`, `swipe`, `type_text`, `press_button` | Simulate touch gestures and text entry |
| Introspection | `get_accessibility_tree`, `open_url` | Read the UI hierarchy for element discovery, open URLs in the simulator |

**How the app-teardown agent uses it:**

When you run `/pmcopilot:competitive-teardown "Notion"`, the `app-teardown` agent boots a simulator, installs the target app, and systematically navigates every screen. It uses `get_accessibility_tree` to discover tappable elements, `tap` and `swipe` to navigate, and `take_screenshot` to capture each screen. The result is a complete visual map of the app's user flows, which the `research-synthesizer` agent then incorporates into the final competitive report.

Screenshots are saved to `~/.claude/plugins/data/pmcopilot/screenshots/ios/`.

### Emulator Bridge (Android)

Wraps `adb` to give PMCopilot control over Android Emulators. Works the same way as the simulator bridge but for Android apps.

**Prerequisites:**

- Android SDK with `ANDROID_HOME` environment variable set (typically `~/Library/Android/sdk` on macOS or `~/Android/Sdk` on Linux)
- At least one AVD (Android Virtual Device) created via Android Studio or `avdmanager`
- `adb` available on your PATH (comes with the Android SDK platform-tools)

**Build:**

```bash
cd mcp-servers/emulator-bridge
bun install && bun run build
cd ../..
```

**Verify it works:**

```bash
# Check that ANDROID_HOME is set
echo $ANDROID_HOME

# List available AVDs
$ANDROID_HOME/emulator/emulator -list-avds

# You should see at least one AVD name like:
# Pixel_7_API_34
```

**What the 16 tools do:**

| Category | Tools | Description |
|----------|-------|-------------|
| Device management | `list_emulators`, `list_devices`, `start_emulator` | Discover AVDs, list running devices, boot emulators |
| App management | `install_apk`, `launch_app`, `grant_permission`, `clear_app_data` | Install APKs, launch apps, manage runtime permissions, reset app state |
| Screen capture | `take_screenshot`, `record_screen` | Capture PNG screenshots and record MP4 video |
| Input interaction | `tap`, `swipe`, `type_text`, `press_key` | Simulate touch gestures, text entry, and hardware key presses |
| Introspection | `dump_ui`, `get_current_activity`, `get_logcat` | Read the UI hierarchy, identify the foreground activity, stream device logs |

Screenshots are saved to `~/.claude/plugins/data/pmcopilot/screenshots/android/`.

---

## Connecting External Integrations

All integrations are optional. PMCopilot gracefully degrades when integrations are unavailable -- skills that depend on an integration fall back to manual data input.

### Cowork Users

Cowork manages MCP connectors for you. Go to **Settings > Connectors** and enable the services you use:

- **Jira / Confluence** -- for sprint review, prioritization, PRD publishing
- **Slack** -- for stakeholder updates, research context
- **Gmail** -- for email-based stakeholder updates
- **Google Calendar** -- for meeting load analysis in sprint reviews
- **Figma** -- for UX review and design references in PRDs
- **Granola** -- for meeting transcript analysis in user research

No manual configuration is needed. Once a connector is enabled in Cowork, PMCopilot detects and uses it automatically.

### Claude Code CLI Users

Some integrations are built into Claude Code (Jira, Slack, Gmail, Google Calendar, Granola). Check if they are enabled:

```bash
claude mcp list
```

For integrations not built in, add them manually:

```bash
# Amplitude (metrics review)
claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"

# Mixpanel (metrics review)
claude mcp add -t http Mixpanel "https://mcp.mixpanel.com/mcp"

# Figma (UX review, design references)
claude mcp add -t http Figma "https://mcp.figma.com/mcp"
```

You will be prompted to authenticate via OAuth on first use.

See the [Integration Setup Guide](docs/integration-setup.md) for detailed instructions, verification steps, and troubleshooting for all 9 integrations.

---

## Configuration

PMCopilot reads defaults from `settings.json` in the plugin root:

| Setting | Default | Purpose |
|---------|---------|---------|
| `default_prd_template` | `google` | PRD template: google, amazon-prfaq, stripe |
| `default_prioritization` | `rice` | Default scoring framework |
| `default_roadmap_format` | `now-next-later` | Roadmap layout |
| `analytics_platform` | `amplitude` | Preferred analytics backend |
| `jira_project_key` | (empty) | Default Jira project for sprint data |
| `figma_team_id` | (empty) | Default Figma team for design references |
| `competitive_intel_cache_days` | `7` | Days to cache competitive research data |
| `preferred_frameworks` | `[rice, moscow, kano]` | Frameworks shown first in prioritization |

Edit `settings.json` to customize for your team.

---

## Architecture

PMCopilot follows a stacking pattern where commands orchestrate agents, and agents use MCP tools:

```
/pmcopilot:competitive-teardown "Grab vs Gojek"
  -> competitive-teardown skill (orchestrator)
    -> app-teardown agent (parallel) -> simulator-bridge MCP -> xcrun simctl
    -> web-teardown agent (parallel) -> Chrome MCP -> browser automation
    -> app-store-intel MCP -> App Store / Play Store APIs
  -> research-synthesizer agent -> unified 8-section report
```

```
/pmcopilot:sprint-review "current sprint"
  -> sprint-review skill -> sprint-analyst agent
    -> Jira MCP -> sprint data, velocity, ticket status
    -> Google Calendar MCP -> meeting load correlation
    -> Slack MCP -> team discussion context
  -> formatted review with talking points
```

---

## Reference

### Commands (12)

| Command | Description |
|---------|-------------|
| `/pmcopilot:prd` | Generate PRDs in Google, Amazon PRFAQ, or Stripe formats |
| `/pmcopilot:prioritize` | Score features using RICE, ICE, MoSCoW, Kano, or Cost of Delay |
| `/pmcopilot:roadmap` | Generate roadmaps in Now/Next/Later or outcome-based format |
| `/pmcopilot:sprint-review` | Analyze sprint performance with velocity trends and talking points |
| `/pmcopilot:competitive-teardown` | Full competitive analysis via app, web, and market research |
| `/pmcopilot:market-sizing` | TAM/SAM/SOM estimation with web research |
| `/pmcopilot:user-research` | Create personas, interview guides, JTBD canvases |
| `/pmcopilot:experiment` | Design A/B tests with sample size calculations |
| `/pmcopilot:stakeholder-update` | Generate weekly, monthly, or exec-summary updates |
| `/pmcopilot:app-store-intel` | Ratings, reviews, sentiment, version cadence analysis |
| `/pmcopilot:launch-checklist` | Launch readiness checklists for soft, hard, or beta launches |
| `/pmcopilot:metrics-review` | North Star Metric or AARRR Pirate Metrics analysis |

### Agents (7)

| Agent | Model | Role |
|-------|-------|------|
| prd-writer | Opus | Write comprehensive PRDs following best-practice templates |
| sprint-analyst | Sonnet | Analyze Jira sprint data, compute velocity, identify risks |
| data-analyst | Sonnet | Query analytics platforms, build funnels, detect anomalies |
| research-synthesizer | Opus | Orchestrate competitive research across multiple agents |
| app-teardown | Opus | Navigate mobile apps on simulators/emulators, capture every screen |
| web-teardown | Opus | Browse competitor websites via Chrome automation |
| ux-reviewer | Opus | Evaluate UI designs against Nielsen usability heuristics |

### Custom MCP Servers (4)

| Server | Tools | Purpose |
|--------|-------|---------|
| pm-frameworks | 12 | RICE, ICE, Kano, MoSCoW, TAM/SAM/SOM, sample size, significance test |
| simulator-bridge | 15 | iOS Simulator control via xcrun simctl + idb |
| emulator-bridge | 16 | Android Emulator control via adb |
| app-store-intel | 10 | App Store + Play Store data extraction |

### External Integrations (9)

| Integration | Used By | Transport |
|-------------|---------|-----------|
| Jira / Confluence | Sprint review, Prioritize, PRD | SSE |
| Slack | Stakeholder update, Research synthesizer | HTTP |
| Gmail | Stakeholder update | HTTP |
| Google Calendar | Sprint review | HTTP |
| Figma | UX reviewer, PRD | HTTP |
| Granola | User research | HTTP |
| Amplitude | Metrics review | HTTP |
| Mixpanel | Metrics review | HTTP |
| Chrome | Web teardown, Competitive teardown | Local |

---

## Example Workflows

**Write a PRD, then prioritize and plan:**

```
/pmcopilot:prd "Search improvements" --template google
/pmcopilot:prioritize rice --from-jira PROJECT_KEY
/pmcopilot:roadmap now-next-later
```

**Run a full competitive teardown:**

```
/pmcopilot:competitive-teardown "Notion" --vs "Our Product" --platform all
```

This launches app-teardown, web-teardown, and research-synthesizer agents in parallel, producing an 8-section competitive intelligence report.

**Sprint review to stakeholder update:**

```
/pmcopilot:sprint-review current --project PROJ
/pmcopilot:stakeholder-update weekly --slack-channel #product-updates
```

**Design and validate an experiment:**

```
/pmcopilot:experiment "Simplified checkout flow reduces cart abandonment"
/pmcopilot:metrics-review aarrr --product "E-commerce app"
```

---

## Requirements

- Claude Code 2.1+ (CLI) or Cowork with plugin support
- Node.js 18+ and [Bun](https://bun.sh/) (for building MCP servers)
- macOS required for iOS Simulator features (Xcode + simulator runtimes)
- Android SDK required for Android Emulator features (`ANDROID_HOME` must be set)

---

## Documentation

- [Integration Setup Guide](docs/integration-setup.md) -- step-by-step setup, verification, and troubleshooting for all 9 integrations
- [Troubleshooting Guide](docs/troubleshooting.md) -- common issues and fixes for plugin loading, MCP servers, simulators, and agents
- [Agent Memory Documentation](docs/agent-memory.md) -- how agents persist context across sessions

---

## License

MIT
