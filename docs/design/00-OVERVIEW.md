# PMCopilot - Claude Code Plugin for Product Managers

## Vision

PMCopilot is a Claude Code plugin that transforms how Product Managers work by giving them an AI-powered copilot that can actually *use* the tools PMs use daily -- simulators, browsers, Jira, Figma, Slack, analytics platforms -- not just talk about them. It is the first plugin that treats the PM's entire digital workspace as an interactive surface.

The core differentiator: **PMCopilot doesn't just generate docs. It does the research, runs the analysis, interacts with real apps, browses real competitor websites, and produces artifacts grounded in primary observation.**

---

## What Makes This Different

### 1. App Teardown Engine (Simulators)
Most PM tools help you *write about* competitors. PMCopilot can actually **install and navigate competitor apps** on iOS Simulator and Android Emulator, take screenshots of every screen, map user flows, identify UX patterns, and produce a structured competitive teardown -- all autonomously.

### 2. Web Teardown Engine (Chrome)
PMCopilot uses Chrome browser automation to **visit competitor websites**, extract pricing pages, feature matrices, landing page copy, SEO metadata, and performance metrics. It builds a living competitive intelligence database from primary sources.

### 3. Stacked Skills Architecture
Skills compose like building blocks. A `/competitive-landscape` command might internally invoke the App Teardown subagent, Web Teardown subagent, and App Store Intelligence MCP in parallel, then synthesize findings into a single deliverable. PMs don't need to know the plumbing -- they just get answers.

### 4. Native Tool Integration
Direct MCP connections to Jira, Confluence, Figma, Slack, Amplitude, Mixpanel, Linear, Notion, and more. No copy-pasting between tools. PMCopilot reads your sprint board, checks your analytics, and writes the status update for you.

---

## Plugin Architecture at a Glance

```
pmcopilot/
|
|-- .claude-plugin/
|   +-- plugin.json                  # Plugin manifest
|
|-- skills/                          # Slash commands (user-facing)
|   |-- competitive-teardown/        # /pmcopilot:competitive-teardown
|   |-- prd-generator/               # /pmcopilot:prd
|   |-- sprint-review/               # /pmcopilot:sprint-review
|   |-- market-sizing/               # /pmcopilot:market-sizing
|   |-- prioritize/                  # /pmcopilot:prioritize
|   |-- user-research/               # /pmcopilot:user-research
|   |-- roadmap/                     # /pmcopilot:roadmap
|   |-- experiment-design/           # /pmcopilot:experiment
|   |-- stakeholder-update/          # /pmcopilot:stakeholder-update
|   |-- app-store-intel/             # /pmcopilot:app-store-intel
|   |-- launch-checklist/            # /pmcopilot:launch-checklist
|   +-- metrics-review/              # /pmcopilot:metrics-review
|
|-- agents/                          # Subagents (autonomous workers)
|   |-- app-teardown.md              # Navigates iOS/Android apps
|   |-- web-teardown.md              # Browses competitor websites
|   |-- research-synthesizer.md      # Synthesizes multi-source research
|   |-- prd-writer.md                # Writes structured PRDs
|   |-- data-analyst.md              # Queries analytics platforms
|   |-- sprint-analyst.md            # Reads Jira/Linear boards
|   +-- ux-reviewer.md               # Reviews screenshots for UX patterns
|
|-- mcp-servers/                     # Custom MCP servers
|   |-- app-store-intel/             # App Store + Play Store scraper
|   |-- simulator-bridge/            # iOS Simulator control via simctl
|   |-- emulator-bridge/             # Android Emulator control via adb
|   +-- pm-frameworks/               # RICE, ICE, Kano calculators
|
|-- .mcp.json                        # External MCP server configs
|-- hooks/
|   +-- hooks.json                   # Lifecycle hooks
|-- templates/                       # PRD, roadmap, experiment templates
+-- settings.json                    # Default plugin settings
```

---

## How Components Stack Together

```
User Command: /pmcopilot:competitive-teardown "Grab vs Gojek vs Uber"

                         +---------------------------+
                         |  competitive-teardown      |
                         |  (Skill / Orchestrator)    |
                         +---------------------------+
                                    |
                    +---------------+---------------+
                    |               |               |
            +-------v----+  +------v------+  +-----v--------+
            | app-teardown|  |web-teardown |  |app-store-intel|
            | agent       |  |agent        |  |MCP server     |
            +-------+----+  +------+------+  +-----+--------+
                    |               |               |
              +-----v-----+  +-----v-----+   +-----v-----+
              |simulator-  |  |Chrome     |   |App Store  |
              |bridge MCP  |  |browser    |   |Play Store |
              |+ emulator- |  |automation |   |APIs       |
              |bridge MCP  |  |           |   |           |
              +-----------+  +-----------+   +-----------+
                    |               |               |
                    v               v               v
              Screenshots     Pricing data     Reviews, ratings
              User flows      Feature lists    Version history
              UX patterns     SEO metadata     Download trends
                    |               |               |
                    +-------+-------+-------+-------+
                            |               |
                    +-------v-------+       |
                    | research-     |<------+
                    | synthesizer   |
                    | agent         |
                    +-------+-------+
                            |
                            v
                   Final Competitive
                   Teardown Report
                   (Markdown / PPTX)
```

---

## Target Users

- **Head of Product / VP Product** -- strategic competitive intelligence, roadmap planning, board-level summaries
- **Senior PM / Group PM** -- cross-product analysis, market sizing, stakeholder communication
- **IC Product Manager** -- daily PRD writing, sprint review, experiment design, feature prioritization
- **Associate PM / APM** -- competitive research, user research synthesis, metric dashboards

---

## Key Design Principles

1. **Research-first, not template-first** -- PMCopilot gathers real data before generating any document
2. **Composable skills** -- every skill can be used standalone or chained with others
3. **Parallel execution** -- subagents run concurrently when tasks are independent
4. **Grounded in primary sources** -- screenshots, real pricing data, actual app store reviews
5. **Opinionated but flexible** -- ships with best-practice frameworks (RICE, Now/Next/Later) but lets PMs override
6. **Integration-native** -- reads from and writes to the tools PMs already use

---

## Document Index

| # | Document | What It Covers |
|---|----------|---------------|
| 00 | This file | Vision, architecture overview, design principles |
| 01 | PLUGIN-ARCHITECTURE.md | Technical plugin structure, manifest, installation |
| 02 | MCP-SERVERS.md | All MCP servers (simulator-bridge, emulator-bridge, app-store-intel, etc.) |
| 03 | SKILLS-AND-COMMANDS.md | All slash commands and skill definitions |
| 04 | SUBAGENTS.md | All custom subagent definitions and their roles |
| 05 | APP-TEARDOWN-ENGINE.md | iOS/Android simulator-based competitive app research |
| 06 | WEB-TEARDOWN-ENGINE.md | Chrome-based competitive web research |
| 07 | PM-FRAMEWORKS.md | Prioritization, roadmapping, research, and metrics frameworks |
| 08 | INTEGRATIONS.md | Jira, Confluence, Figma, Slack, analytics, and other tool integrations |
| 09 | IMPLEMENTATION-ROADMAP.md | Phased rollout plan with milestones |
| 10 | CLAUDE-CODE-DELTA.md | Architecture corrections for Claude Code plugin system |
