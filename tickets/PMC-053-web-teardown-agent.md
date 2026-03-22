---
id: PMC-053
title: Create web-teardown agent definition
phase: 3 - Web Teardown Engine
status: done
type: agent
estimate: 1
dependencies: [PMC-005]
---

## Description

Create the web-teardown agent at `agents/web-teardown.md`. This is the core agent for Phase 3, responsible for performing comprehensive product teardowns of competitor or benchmark websites. The agent navigates live websites using Chrome MCP tools, extracts structured data across multiple dimensions, and produces a detailed teardown report.

Agent configuration:
- **model**: opus
- **tools**: Read, Write, Bash, Glob, plus all Chrome MCP tools (`mcp__Claude_in_Chrome__*` and `mcp__Control_Chrome__*`)
- **maxTurns**: 40
- **permissionMode**: acceptEdits
- **memory**: project
- **background**: true

Available Chrome MCP tools the agent should leverage:
- `navigate`, `read_page`, `get_page_text` -- page navigation and content reading
- `computer`, `form_input`, `find` -- UI interaction and element discovery
- `javascript_tool` -- execute custom JS extraction scripts
- `gif_creator` -- capture visual walkthroughs
- `read_console_messages`, `read_network_requests` -- technical analysis
- `tabs_create`, `tabs_close`, `tabs_context` -- multi-tab management
- `resize_window` -- responsive testing

The agent runs through six analysis phases in sequence:

1. **Landing page analysis** -- Navigate to homepage, extract hero copy, CTAs, value proposition, navigation structure, above-the-fold content
2. **Pricing analysis** -- Find and navigate to pricing page, extract tier structure, pricing models, feature comparison, enterprise CTA
3. **Features analysis** -- Catalog feature pages, extract feature descriptions, screenshots, competitive differentiators
4. **Signup flow analysis** -- Walk through the signup/onboarding flow, document steps, friction points, social proof elements
5. **Technical analysis** -- Inspect network requests, console logs, detect tech stack, measure load performance
6. **Content strategy analysis** -- Evaluate blog/resources presence, SEO structure, content themes, lead magnets

Each phase uses dedicated JS extraction scripts (defined in subsequent tickets) injected via `javascript_tool`. The agent writes intermediate findings to `docs/teardowns/{domain}/` and produces a final consolidated teardown report.

## Acceptance Criteria

- [ ] Agent file created at `agents/web-teardown.md` with valid YAML frontmatter
- [ ] Model set to `opus`
- [ ] Tools include: Read, Write, Bash, Glob, `mcp__Claude_in_Chrome__*`, `mcp__Control_Chrome__*`
- [ ] maxTurns set to 40
- [ ] permissionMode set to `acceptEdits`
- [ ] memory set to `project`
- [ ] background set to `true`
- [ ] Agent prompt defines all six analysis phases with clear instructions for each
- [ ] Agent prompt specifies output directory structure: `docs/teardowns/{domain}/`
- [ ] Agent prompt instructs use of `javascript_tool` for running extraction scripts
- [ ] Agent prompt includes instructions for graceful handling of pages that fail to load or require auth
- [ ] Smoke test: agent can be invoked with a URL and begins the teardown sequence

## Files to Create/Modify

- `agents/web-teardown.md` (create)
