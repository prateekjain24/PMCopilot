# PMCopilot

**An AI-powered copilot for Product Managers, built as a Claude Code plugin.**

PMCopilot brings the full PM toolkit into your terminal. It connects to the tools you already use -- Jira, Slack, Amplitude, Figma, app stores -- and orchestrates AI agents to do the heavy lifting: competitive teardowns, PRD drafts, sprint analysis, market sizing, and more.

---

## Who is it for?

PMCopilot is designed for Product Managers, Product Leads, and Founders who want to:

- Automate repetitive PM workflows (status updates, sprint reviews, PRDs)
- Run competitive analysis that goes beyond surface-level screenshots
- Make data-driven prioritization decisions using proven frameworks
- Generate stakeholder-ready artifacts in minutes instead of hours

---

## Key Capabilities

### Strategy and Research

- **Competitive Teardown** (`/pmcopilot:competitive-teardown`): Run full competitive analyses with parallel agent orchestration. The app-teardown agent navigates competitor apps screen by screen on iOS Simulator or Android Emulator, while the web-teardown agent crawls their websites. Results are synthesized into a unified competitive report.

- **Market Sizing** (`/pmcopilot:market-sizing`): Estimate TAM, SAM, and SOM using top-down, bottom-up, or analogous methodologies. Combines web research with structured PM frameworks for defensible numbers.

- **App Store Intelligence** (`/pmcopilot:app-store-intel`): Pull ratings, reviews, feature lists, and competitive positioning data from the App Store and Google Play Store.

### Planning and Prioritization

- **PRD Generation** (`/pmcopilot:prd-generator`): Generate Product Requirements Documents using Google, Amazon PRFAQ, or Stripe templates. Includes problem statement, user stories, success metrics, and technical considerations.

- **Prioritization** (`/pmcopilot:prioritize`): Score and rank features using RICE, ICE, MoSCoW, Kano, Weighted Scoring, Opportunity Scoring, or Cost of Delay (CD3). Compare frameworks side by side to build conviction.

- **Roadmap Planning** (`/pmcopilot:roadmap`): Build roadmaps in Now/Next/Later or outcome-based formats. Integrates with Jira for real sprint data.

### Experimentation and Analytics

- **Experiment Design** (`/pmcopilot:experiment-design`): Design A/B tests with proper sample size calculations, hypothesis framing, and success criteria. Analyze results with statistical significance testing.

- **Metrics Review** (`/pmcopilot:metrics-review`): Analyze your North Star Metric and AARRR Pirate Metrics. Connects to Amplitude or Mixpanel for live data when configured.

### Execution and Communication

- **Sprint Review** (`/pmcopilot:sprint-review`): Analyze sprint data from Jira with velocity trends, carry-over tracking, and team health indicators.

- **Stakeholder Update** (`/pmcopilot:stakeholder-update`): Generate weekly, monthly, or executive summary updates. Pulls context from Jira, Slack, and meeting transcripts to produce grounded, accurate updates.

- **Launch Checklist** (`/pmcopilot:launch-checklist`): Generate launch readiness checklists for soft launches, hard launches, or beta programs. Tracks dependencies and blockers.

### User Research

- **User Research** (`/pmcopilot:user-research`): Build personas, interview guides, and JTBD canvases. Analyze meeting transcripts from Granola to extract insights and patterns.

---

## Integrations (All Optional)

PMCopilot works standalone, but becomes more powerful when connected to your existing tools:

| Integration | What it provides |
|---|---|
| Jira / Confluence | Sprint data, ticket management, publish to Confluence |
| Slack | Post updates, search team discussions, create canvases |
| Amplitude / Mixpanel | Live product metrics and funnel analysis |
| Figma | Design file references and screen context |
| Granola | Meeting transcripts for research synthesis |
| Gmail | Draft stakeholder emails, search user feedback |
| Google Calendar | Meeting context and scheduling awareness |
| Chrome | Web teardown automation for competitive research |

---

## Getting Started

1. Install the plugin:
   ```bash
   claude plugin install pmcopilot
   ```

2. Run any skill:
   ```bash
   /pmcopilot:prd-generator "Mobile checkout redesign"
   /pmcopilot:prioritize "Q3 feature backlog"
   /pmcopilot:competitive-teardown "Notion vs Coda vs Slite"
   ```

3. (Optional) Connect integrations by adding MCP server credentials for Jira, Slack, Amplitude, etc. through your Claude Code settings.

---

## Requirements

- Claude Code CLI
- Node.js 20+ and Bun runtime
- For app teardowns: Xcode with iOS Simulator (macOS) or Android SDK with emulator
- For web teardowns: Chrome browser

---

## What is included

- 12 user-facing skills (slash commands)
- 7 autonomous AI agents
- 4 custom MCP servers with 53 tools total
- PM framework calculators for RICE, ICE, Kano, MoSCoW, Weighted Scoring, Opportunity Scoring, Cost of Delay, TAM/SAM/SOM, sample size, and significance testing
- Hooks for session lifecycle automation

---

## License

MIT
