# Commands Directory

12 user-facing slash commands invoked as `/pmcopilot:<name>`. Each is a Markdown file with YAML frontmatter that orchestrates agents and MCP tools.

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes | One-line summary shown in command picker |
| `argument-hint` | Yes | Usage hint with positional args and flags |
| `allowed-tools` | Yes | Tools, agents, and MCP wildcards the command may use |
| `model` | No | Model override (`opus` or `sonnet`; defaults to `opus`) |

## Agent and MCP References in `allowed-tools`

- Agent: `Agent(agent-name)` or `Agent(agent1, agent2)` for multiple
- MCP specific tool: `mcp__server-name__tool_name`
- MCP wildcard: `mcp__server-name__*`

## Commands

| Command | Description |
|---------|-------------|
| `competitive-teardown` | Comprehensive competitive teardown with app, web, and strategic analysis |
| `prd` | Generate PRDs using Amazon PRFAQ, Google PRD, or Stripe PRD templates |
| `sprint-review` | Analyze sprint performance with velocity trends and work breakdown |
| `market-sizing` | Rigorous TAM/SAM/SOM analysis with top-down and bottom-up methodology |
| `prioritize` | Prioritize features using RICE, ICE, MoSCoW, Kano, or Cost of Delay |
| `user-research` | Generate personas, interview guides, JTBD canvases, or affinity maps |
| `roadmap` | Generate roadmaps in Now/Next/Later, Timeline, or Outcome-based format |
| `experiment` | Design A/B tests with hypothesis, metrics, sample size, and rollout plan |
| `stakeholder-update` | Generate stakeholder updates from Jira and Slack data |
| `app-store-intel` | App store ratings, reviews, version history, and sentiment analysis |
| `launch-checklist` | Comprehensive categorized launch checklist for soft, hard, or beta launches |
| `metrics-review` | Review product metrics using North Star or AARRR Pirate Metrics frameworks |

## Conventions

- Commands produce output in `${CLAUDE_PLUGIN_DATA}/<command-name>/` (e.g., teardown reports, PRDs)
- Commands that need multiple agents run them in parallel where possible
- The `$ARGUMENTS` array provides parsed user input (positional args and flags)
