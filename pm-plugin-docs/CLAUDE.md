# Design Documentation

This directory contains the complete design corpus for PMCopilot (11 files, 00-10). These documents capture the "why" behind architectural decisions. The code captures the "what."

**Rule: Check the relevant design doc before modifying a component.**

## Document Index

| File | Topic | Consult When... |
|------|-------|-----------------|
| `00-OVERVIEW.md` | Project scope, vision, target persona | Understanding PMCopilot's purpose or goals |
| `01-PLUGIN-ARCHITECTURE.md` | Skills, agents, MCP server patterns | Adding or restructuring any component type |
| `02-MCP-SERVERS.md` | Custom server specs (4 servers) | Building or modifying an MCP server |
| `03-SKILLS-AND-COMMANDS.md` | 12 skill definitions and UX | Creating or updating a skill |
| `04-SUBAGENTS.md` | 7 agent system prompts and behavior | Creating or modifying an agent |
| `05-APP-TEARDOWN-ENGINE.md` | Simulator/emulator integration | Working on app-teardown agent or simulator/emulator bridges |
| `06-WEB-TEARDOWN-ENGINE.md` | Chrome automation, robots.txt | Working on web-teardown agent or extraction scripts |
| `07-PM-FRAMEWORKS.md` | RICE, ICE, Kano, MoSCoW formulas | Modifying pm-frameworks MCP tools |
| `08-INTEGRATIONS.md` | Jira, Figma, Slack, Gmail wiring | Connecting or updating external MCP integrations |
| `09-IMPLEMENTATION-ROADMAP.md` | 6-phase, 22-week plan | Understanding project phases or ticket context |
| `10-CLAUDE-CODE-DELTA.md` | Claude Code-specific plugin features | Understanding plugin runtime capabilities |

## Usage

- Design docs are the source of truth for requirements and rationale
- If code contradicts a design doc, investigate before changing either
- These docs are read-only reference — do not modify without explicit approval
