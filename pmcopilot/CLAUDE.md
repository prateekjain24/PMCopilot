# PMCopilot Plugin Root

This is the Claude Code plugin directory. Everything Claude needs to load PMCopilot lives here.

## Directory Layout

| Path | Purpose |
|------|---------|
| `.claude-plugin/plugin.json` | Plugin manifest (name, version, entry points) |
| `.mcp.json` | MCP server registrations (4 custom + 3 HTTP stubs) |
| `settings.json` | Default configuration (templates, frameworks, cache TTLs) |
| `agents/` | 7 agent definitions (plain `.md` with YAML frontmatter) |
| `skills/` | 12+ skill directories (each has `SKILL.md`) |
| `mcp-servers/` | 4 custom TypeScript MCP servers |
| `hooks/` | Lifecycle hook scripts + `hooks.json` config |
| `src/` | Shared TypeScript utilities (cache, comparison, templates) |
| `scripts/` | Browser-injectable extraction scripts for web teardown |
| `templates/` | Document templates (PRD, roadmap, research, communication) |
| `docs/` | Setup guides: `integration-setup.md`, `troubleshooting.md`, `agent-memory.md` |
| `marketplace/` | Distribution metadata: `listing.md`, `examples/` |

## Connected External MCP Servers

Already connected and referenced in skill/agent definitions:
- **Atlassian (Jira + Confluence)**: Sprint data, ticket management, Confluence publishing
- **Slack**: Post updates, search discussions, create canvases
- **Gmail**: Draft stakeholder emails, search feedback
- **Google Calendar**: Meeting context, scheduling
- **Granola**: Meeting transcripts for user research analysis
- **Perplexity** (via n8n): Web research for market sizing
- **Chrome** (Claude in Chrome + Control Chrome): Web teardown automation

Not yet connected: Amplitude, Mixpanel, Figma, Linear, Notion.

## How to Add a New Skill

1. Create `skills/<name>/SKILL.md` with required YAML frontmatter (see `skills/CLAUDE.md`)
2. Add templates in `skills/<name>/templates/` if needed
3. Skills auto-discover from `./skills/` — no manifest changes needed
4. Update root `CLAUDE.md` component inventory

## How to Add a New Agent

1. Create `agents/<name>.md` with YAML frontmatter (see `agents/CLAUDE.md`)
2. Reference it in skill `allowed-tools` as `Agent(<name>)`
3. Update root `CLAUDE.md` component inventory

## How to Add a New MCP Server

1. Create `mcp-servers/<name>/` with TypeScript project (see `mcp-servers/CLAUDE.md`)
2. Register in `.mcp.json` with `command: "node"`, `args: ["mcp-servers/<name>/dist/index.js"]`
3. Reference tools as `mcp__<name>__*` in skill/agent definitions
4. Update root `CLAUDE.md` component inventory

## Development

```bash
claude --plugin-dir ./pmcopilot    # Load plugin in dev mode
```
