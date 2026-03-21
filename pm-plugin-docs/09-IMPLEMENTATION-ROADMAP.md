# 09 - Implementation Roadmap

PMCopilot itself follows a Now/Next/Later roadmap. This document outlines the phased implementation plan.

---

## Phase 0: Foundation (Weeks 1-2)

**Goal**: Get the plugin skeleton working with basic skills.

### Tasks

1. **Plugin scaffold** (Claude Code plugin format)
   - Create directory structure: `.claude-plugin/plugin.json`, `skills/`, `agents/`, `hooks/`
   - Write `.claude-plugin/plugin.json` manifest (name, version, description, author, keywords)
   - Write `.mcp.json` for custom MCP server configs
   - Set up `settings.json` with defaults
   - Test: `claude --plugin-dir ./pmcopilot` loads without errors
   - Verify: `/pmcopilot:` autocomplete shows in Claude Code

2. **First skill: /pmcopilot:prd**
   - Write `skills/prd/SKILL.md` with YAML frontmatter (`disable-model-invocation: false`, `user-invocable: true`, `allowed-tools`, `context: fork`)
   - Include `skills/prd/templates/` with Google PRD, Amazon PRFAQ, Stripe templates
   - Test: generates a complete PRD from a one-line feature description
   - No external integrations yet (pure LLM generation)

3. **First agent: prd-writer**
   - Write `agents/prd-writer.md` with YAML frontmatter (`tools`, `model: opus`, `maxTurns: 20`, `permissionMode: acceptEdits`, `memory: project`)
   - Configure tools: `Read, Write, Bash, Grep, Glob`
   - Test: produces quality PRDs with proper structure

4. **pm-frameworks MCP server**
   - Implement in TypeScript using FastMCP SDK
   - Follow mcp-builder skill best practices
   - Tools: `rice_score`, `rice_batch`, `ice_score`, `sample_size_calc`
   - Register in `.mcp.json` as `pm-frameworks` (STDIO transport)
   - Test: `mcp__pm-frameworks__rice_score` callable from Claude Code

**Exit criteria**: `claude --plugin-dir ./pmcopilot` loads, `/pmcopilot:prd` generates quality output, `mcp__pm-frameworks__rice_score` returns correct calculations.

---

## Phase 1: Core Skills (Weeks 3-5)

**Goal**: Build out the PM skill suite without external integrations.

### Tasks

5. **Prioritization skill**
   - SKILL.md for `/pmcopilot:prioritize`
   - All frameworks: RICE, ICE, MoSCoW, Kano, Weighted, CoD
   - Works with manual feature input (no Jira integration yet)

6. **Roadmap skill**
   - SKILL.md for `/pmcopilot:roadmap`
   - Now/Next/Later, timeline, and outcome-based formats
   - Generates markdown output

7. **Experiment design skill**
   - SKILL.md for `/pmcopilot:experiment`
   - Sample size calculator via pm-frameworks MCP
   - Full experiment plan template

8. **User research skill**
   - SKILL.md for `/pmcopilot:user-research`
   - Persona, interview guide, JTBD canvas generators
   - Transcript analysis capability

9. **Stakeholder update skill**
   - SKILL.md for `/pmcopilot:stakeholder-update`
   - Weekly, monthly, exec summary templates
   - Pure generation (no Slack/Jira integration yet)

10. **Launch checklist skill**
    - SKILL.md for `/pmcopilot:launch-checklist`
    - Soft, hard, and beta launch templates

**Exit criteria**: All core skills generate quality output from natural language input.

---

## Phase 2: Tool Integrations (Weeks 6-9)

**Goal**: Connect skills to real PM tools.

### Tasks

**Already-connected MCPs (just wire into skills/agents)**:

11. **Jira + Confluence integration** (MCP ID: `43470b8f...`, ALREADY CONNECTED)
    - Wire `mcp__43470b8f...__searchJiraIssuesUsingJql` into sprint-review, prioritize, roadmap skills
    - Wire `mcp__43470b8f...__createJiraIssue` into prd-generator skill
    - Wire `mcp__43470b8f...__createConfluencePage` into prd-generator for publishing
    - Update agent `allowed-tools` / `tools` to include Jira MCP wildcards

12. **Slack integration** (MCP ID: `0d3ccbd5...`, ALREADY CONNECTED)
    - Wire `mcp__0d3ccbd5...__slack_send_message` into stakeholder-update skill
    - Wire `mcp__0d3ccbd5...__slack_search_public` into research-synthesizer agent
    - Wire `mcp__0d3ccbd5...__slack_create_canvas` for rich report sharing

13. **Granola integration** (MCP ID: `3053a93d...`, ALREADY CONNECTED)
    - Wire `mcp__3053a93d...__get_meeting_transcript` into user-research skill
    - Enable transcript analysis for customer interview insights

14. **Gmail + GCal integration** (ALREADY CONNECTED)
    - Wire Gmail draft creation into stakeholder-update skill
    - Wire GCal meeting context into sprint-review (know what was discussed)

**New MCPs to connect**:

15. **Analytics integration (Amplitude / Mixpanel)**
    - Add MCP servers to `.mcp.json`
    - Metrics review skill queries real data via `mcp__amplitude__*`
    - Data analyst agent configured with analytics MCP access
    - Sprint review cross-references releases with metrics

16. **Figma integration**
    - Add Figma MCP to `.mcp.json`
    - UX reviewer agent can pull Figma frames
    - PRD skill references Figma designs

17. **Sprint review skill (fully integrated)**
    - Pulls from Jira (mcp__43470b8f...), Slack (mcp__0d3ccbd5...), Granola (mcp__3053a93d...)
    - Generates complete sprint review with velocity trends
    - Posts to Slack channel on completion

**Exit criteria**: Skills produce output grounded in real data from connected tools. Sprint review pulls from 3+ sources automatically.

---

## Phase 3: Web Teardown Engine (Weeks 10-12)

**Goal**: Chrome-based competitive web research.

### Tasks

18. **Web teardown agent**
    - Agent definition with Chrome/Playwright MCP access
    - Systematic navigation algorithm
    - Screenshot capture at each step

19. **Data extraction pipeline**
    - Pricing page extraction (structured JSON)
    - Feature page inventory
    - SEO metadata extraction
    - Tech stack detection scripts

20. **Comparison engine**
    - Multi-competitor comparison matrix
    - Feature-by-feature comparison
    - Pricing comparison tables
    - Positioning analysis

21. **Competitive intel cache**
    - Store extracted data in `${CLAUDE_PLUGIN_DATA}`
    - TTL-based cache invalidation
    - Historical comparison (track changes over time)

22. **Market sizing skill (integrated)**
    - Uses web research for market data
    - Combines with pm-frameworks MCP for calculations
    - Cross-validates top-down and bottom-up estimates

**Exit criteria**: Can produce a comprehensive web-based competitive teardown for 3+ competitors.

---

## Phase 4: App Teardown Engine (Weeks 13-18)

**Goal**: The differentiator. Simulator/emulator-based app teardowns.

### Tasks

23. **simulator-bridge MCP server**
    - Build TypeScript MCP wrapping `xcrun simctl` and `idb`
    - Tools: boot, install, screenshot, tap, swipe, type, accessibility tree
    - Test on iOS Simulator with a sample app

24. **emulator-bridge MCP server**
    - Build TypeScript MCP wrapping `adb`
    - Tools: start, install, screenshot, tap, swipe, type, UI dump
    - Test on Android Emulator with a sample APK

25. **app-store-intel MCP server**
    - Build TypeScript MCP for App Store + Play Store data
    - Tools: search, details, reviews, version history, rankings
    - Caching layer for rate limiting

26. **App teardown agent**
    - Agent definition with simulator-bridge + emulator-bridge MCP access
    - Systematic navigation algorithm (accessibility-tree-driven)
    - Screen deduplication logic
    - Flow mapping output

27. **App store intelligence skill**
    - Standalone skill for app store research
    - Review sentiment analysis
    - Version history analysis (shipping cadence)

28. **Competitive teardown skill (fully integrated)**
    - Orchestrates web teardown + app teardown + app store intel
    - Produces unified competitive report
    - Screenshot gallery organized by flow

29. **UX reviewer agent**
    - Reviews screenshots against heuristics
    - Compares competitor UX patterns
    - Generates UX audit report

**Exit criteria**: Can autonomously install a competitor's Android APK, navigate the app, screenshot every screen, and produce a structured teardown report.

---

## Phase 5: Polish and Distribution (Weeks 19-22)

**Goal**: Production readiness and marketplace distribution.

### Tasks

30. **Memory and learning**
    - Enable `memory: project` for key agents
    - prd-writer learns team's writing style
    - sprint-analyst accumulates velocity data
    - app-teardown agent remembers previously analyzed apps

31. **Hooks for quality**
    - PRD structure validation hook
    - Simulator health check hook
    - Analytics query validation hook

32. **Error handling and graceful degradation**
    - Skills work with partial integrations (no Jira? use manual input)
    - Agent handles simulator crashes gracefully
    - Clear error messages for missing dependencies

33. **Documentation**
    - README with setup guide
    - Per-skill usage examples
    - Integration setup guides
    - Troubleshooting guide

34. **Marketplace listing**
    - Plugin description and keywords
    - Screenshots and demo GIFs
    - Changelog

35. **Testing**
    - Skill output quality testing
    - MCP server unit tests
    - Integration tests for common workflows
    - Agent behavior tests

**Exit criteria**: Plugin is installable from marketplace and works reliably for common PM workflows.

---

## Phase 6: Advanced Capabilities (Ongoing)

### Future Roadmap

36. **Appium integration** -- cross-platform mobile testing framework as alternative to simctl/adb

37. **Figma-to-PRD** -- generate PRD sections directly from Figma mockups

38. **Auto-competitive monitoring** -- scheduled tasks that re-run competitive teardowns weekly and flag changes

39. **Team dashboard** -- aggregate metrics, sprint data, and roadmap into a living team dashboard

40. **Meeting prep agent** -- pulls context from calendar, Jira, analytics, and past meeting notes to prepare for upcoming meetings

41. **Customer interview agent** -- connects to Granola, extracts insights, updates persona documents

42. **Release notes generator** -- reads git commits and Jira tickets, generates user-facing release notes

43. **Board presentation generator** -- creates quarterly board-level presentation from metrics, roadmap, and competitive data

44. **Multi-product support** -- manage multiple product lines within one plugin instance

45. **Custom framework builder** -- let PMs define their own prioritization criteria and scoring models

---

## Resource Estimates

| Phase | Duration | Skills Delivered | MCP Servers | Agents |
|-------|----------|-----------------|-------------|--------|
| 0: Foundation | 2 weeks | 1 (PRD) | 1 (pm-frameworks) | 1 (prd-writer) |
| 1: Core Skills | 3 weeks | 6 (all core) | 0 | 0 |
| 2: Integrations | 4 weeks | 2 (sprint-review, metrics) | 0 (external) | 2 (data-analyst, sprint-analyst) |
| 3: Web Teardown | 3 weeks | 2 (competitive, market-sizing) | 0 (uses Chrome) | 2 (web-teardown, research-synthesizer) |
| 4: App Teardown | 6 weeks | 1 (app-store-intel) | 3 (simulator, emulator, app-store) | 2 (app-teardown, ux-reviewer) |
| 5: Polish | 4 weeks | 0 | 0 | 0 |
| **Total** | **22 weeks** | **12 skills** | **4 custom MCP servers** | **7 agents** |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| iOS apps can't be installed on simulator (encryption) | High | High | Focus on Android for competitor apps; use iOS for own app |
| App Store scraping gets rate-limited | Medium | Medium | Aggressive caching, fallback to manual search |
| Competitor websites block automation | Low | Medium | Use realistic user agent, respect robots.txt, add delays |
| LLM misinterprets accessibility tree | Medium | Medium | Fallback to coordinate-based interaction; human-in-the-loop |
| Analytics APIs have limited query capabilities | Medium | Low | Use what's available; supplement with manual data |
| Plugin size too large for marketplace | Low | Low | Lazy-load MCP servers; defer heavy dependencies |
| Simulator/emulator not installed on user's machine | High | Medium | Graceful degradation; clear setup instructions; skills work without simulators |

---

## Success Metrics for PMCopilot

| Metric | Target (6 months) | How to Measure |
|--------|-------------------|---------------|
| Plugin installs | 500+ | Marketplace analytics |
| Weekly active users | 100+ | Plugin telemetry (opt-in) |
| Skills invoked per user per week | 5+ | Plugin telemetry |
| Time saved per competitive teardown | 4+ hours | User survey |
| PRD quality rating | 4.0/5.0 | User feedback |
| NPS among PM users | 50+ | Quarterly survey |
| Community contributions (skills/templates) | 10+ | GitHub PRs |
