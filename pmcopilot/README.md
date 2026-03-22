# PMCopilot

AI-powered copilot for Product Managers -- PRD generation, prioritization frameworks, competitive teardowns, sprint analytics, and more.

Built as a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin.

---

## Getting Started

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 18+ and [Bun](https://bun.sh/) (for building MCP servers)
- macOS recommended (required for iOS Simulator features)

### 1. Install the plugin

Clone the repository and load PMCopilot as a Claude Code plugin:

```bash
git clone https://github.com/prateekjain24/PMCopilot.git
cd PMCopilot
claude --plugin-dir ./pmcopilot
```

Once loaded, all PMCopilot skills appear under the `/pmcopilot:` namespace.

### 2. Run your first skill

Generate a PRD for a feature idea:

```
/pmcopilot:prd-generator "User onboarding flow redesign" --template google
```

Or prioritize a set of features:

```
/pmcopilot:prioritize rice
```

Then type your feature list when prompted. PMCopilot guides you through scoring each feature and produces a ranked output.

### 3. Build the MCP servers (optional)

The custom MCP servers provide framework calculations, simulator control, and app store data. Build them to enable those features:

```bash
# PM Frameworks (RICE, ICE, Kano, MoSCoW, sample size, etc.)
cd pmcopilot/mcp-servers/pm-frameworks && bun install && bun run build && cd ../../..

# Simulator Bridge (iOS Simulator control)
cd pmcopilot/mcp-servers/simulator-bridge && bun install && bun run build && cd ../../..

# Emulator Bridge (Android Emulator control)
cd pmcopilot/mcp-servers/emulator-bridge && bun install && bun run build && cd ../../..

# App Store Intel (App Store + Play Store data)
cd pmcopilot/mcp-servers/app-store-intel && bun install && bun run build && cd ../../..
```

### 4. Connect external integrations (optional)

PMCopilot works without any external integrations -- you can always provide data manually. To unlock richer workflows, connect your PM tools:

```bash
# Jira/Confluence (sprint review, PRD publishing)
# Already available via Claude Code Atlassian MCP -- connect in Claude Code settings

# Amplitude (metrics review)
claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"

# Mixpanel (metrics review)
claude mcp add -t http Mixpanel "https://mcp.mixpanel.com/mcp"

# Figma (UX review, design references in PRDs)
claude mcp add -t http Figma "https://mcp.figma.com/mcp"
```

See the [Integration Setup Guide](docs/integration-setup.md) for step-by-step instructions for all 9 integrations.

### 5. Example workflows

**Write a PRD, then prioritize and plan:**
```
/pmcopilot:prd-generator "Search improvements"
/pmcopilot:prioritize rice --from-jira PROJECT_KEY
/pmcopilot:roadmap now-next-later
```

**Run a competitive teardown:**
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
/pmcopilot:experiment-design "Simplified checkout flow reduces cart abandonment"
/pmcopilot:metrics-review aarrr --product "E-commerce app"
```

### 6. Configuration

PMCopilot reads defaults from `settings.json` in the plugin root:

| Setting | Default | Purpose |
|---------|---------|---------|
| `default_prd_template` | `google` | PRD template (google, amazon-prfaq, stripe) |
| `default_prioritization` | `rice` | Prioritization framework |
| `default_roadmap_format` | `now-next-later` | Roadmap format |
| `analytics_platform` | `amplitude` | Preferred analytics backend |
| `jira_project_key` | (empty) | Default Jira project for sprint data |
| `competitive_intel_cache_days` | `7` | Days to cache competitive data |

Edit `pmcopilot/settings.json` to customize for your team.

---

## Skills

PMCopilot ships with 12 user-facing skills, each invoked as a slash command.

| Skill | Command | Description |
|-------|---------|-------------|
| PRD Generator | `/pmcopilot:prd-generator` | Generate PRDs in Google, Amazon PRFAQ, or Stripe formats |
| Prioritize | `/pmcopilot:prioritize` | Score features using RICE, ICE, MoSCoW, Kano, or Cost of Delay |
| Roadmap | `/pmcopilot:roadmap` | Generate roadmaps in Now/Next/Later or outcome-based format |
| Sprint Review | `/pmcopilot:sprint-review` | Analyze sprint performance with velocity trends and talking points |
| Competitive Teardown | `/pmcopilot:competitive-teardown` | Full competitive analysis via app, web, and market research |
| Market Sizing | `/pmcopilot:market-sizing` | TAM/SAM/SOM estimation with web research |
| User Research | `/pmcopilot:user-research` | Create personas, interview guides, JTBD canvases |
| Experiment Design | `/pmcopilot:experiment-design` | Design A/B tests with sample size calculations |
| Stakeholder Update | `/pmcopilot:stakeholder-update` | Generate weekly, monthly, or exec-summary updates |
| App Store Intel | `/pmcopilot:app-store-intel` | Ratings, reviews, sentiment, version cadence analysis |
| Launch Checklist | `/pmcopilot:launch-checklist` | Launch readiness checklists for soft, hard, or beta launches |
| Metrics Review | `/pmcopilot:metrics-review` | North Star Metric or AARRR Pirate Metrics analysis |

---

## Agents

Seven autonomous agents handle specialized tasks on behalf of skills.

| Agent | Model | Role | Memory |
|-------|-------|------|--------|
| prd-writer | Opus | Write comprehensive PRDs | Project |
| sprint-analyst | Sonnet | Analyze Jira sprint data and velocity | Project |
| data-analyst | Sonnet | Query analytics, build funnels, detect anomalies | -- |
| research-synthesizer | Opus | Orchestrate competitive research | Project |
| app-teardown | Opus | Navigate mobile apps on simulators/emulators | Project |
| web-teardown | Opus | Browse competitor websites via Chrome | Project |
| ux-reviewer | Opus | Evaluate UX against Nielsen heuristics | -- |

---

## Custom MCP Servers

Four TypeScript MCP servers ship with the plugin and run over STDIO transport.

| Server | Tools | Purpose |
|--------|-------|---------|
| pm-frameworks | 12 | RICE, ICE, Kano, MoSCoW, TAM/SAM/SOM, sample size, significance test |
| simulator-bridge | 15 | iOS Simulator control via xcrun simctl + idb |
| emulator-bridge | 16 | Android Emulator control via adb |
| app-store-intel | 10 | App Store + Play Store data extraction |

---

## Integration Matrix

PMCopilot connects to external tools through Claude Code MCP integrations. **All integrations are optional.** PMCopilot works in local-only mode with manual data input when integrations are unavailable.

| Integration | Used By | Required |
|-------------|---------|----------|
| Jira/Confluence | Sprint review, Prioritize, PRD | Optional |
| Slack | Stakeholder update, Research synthesizer | Optional |
| Amplitude | Metrics review | Optional |
| Mixpanel | Metrics review | Optional |
| Figma | UX reviewer, PRD | Optional |
| Granola | User research | Optional |
| Gmail | Stakeholder update | Optional |
| Google Calendar | Sprint review | Optional |

---

## Requirements

- Claude Code 2.1+
- macOS (iOS Simulator features require Xcode)
- Android SDK (Android Emulator features require `ANDROID_HOME`)

---

## Documentation

- [Integration Setup Guide](docs/integration-setup.md)
- [Troubleshooting Guide](docs/troubleshooting.md)
- [Agent Memory Documentation](docs/agent-memory.md)
