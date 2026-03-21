# 08 - Third-Party Integrations

PMCopilot connects to the tools PMs use daily via MCP servers. This document covers every integration, what data it provides, and how skills use it.

---

## Integration Architecture

```
+---------------------------+
|       PMCopilot Skills    |
|  (prd, sprint-review, etc)|
+---------------------------+
            |
            v
+---------------------------+
|     Claude Code Host      |
|   (MCP Client Manager)    |
+---------------------------+
     |    |    |    |    |    |    |    |
     v    v    v    v    v    v    v    v
  Jira/ Slack Gmail GCal Granola Chrome Perplexity GDrive
  Confl
  MCP   MCP  MCP  MCP   MCP    MCP    MCP       MCP
```

Each integration is an MCP server that runs as a subprocess (STDIO) or connects to a remote endpoint (HTTP).

**NOTE**: The following integrations are **already connected** in your current setup. The MCP server IDs shown below are your actual connected instances.

---

## Project Management

### Jira + Confluence (Atlassian)

**MCP Server ID**: `43470b8f-a656-4653-8dba-c593836b1597` (ALREADY CONNECTED)

**Key Jira Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__43470b8f...__searchJiraIssuesUsingJql` | sprint-review, prioritize | Query tickets with JQL |
| `mcp__43470b8f...__getJiraIssue` | sprint-review | Get full ticket details |
| `mcp__43470b8f...__createJiraIssue` | prd-generator | Create tickets from PRD requirements |
| `mcp__43470b8f...__editJiraIssue` | prioritize | Update priority, labels, story points |
| `mcp__43470b8f...__getTransitionsForJiraIssue` | sprint-review | Check ticket workflow state |
| `mcp__43470b8f...__transitionJiraIssue` | sprint-review | Move tickets between columns |
| `mcp__43470b8f...__addCommentToJiraIssue` | stakeholder-update | Post analysis as ticket comments |
| `mcp__43470b8f...__getVisibleJiraProjects` | onboarding | Discover available projects |
| `mcp__43470b8f...__getJiraIssueTypeMetaWithFields` | prd-generator | Know valid fields for ticket creation |

**Key Confluence Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__43470b8f...__getConfluencePage` | prd-generator | Pull existing docs for context |
| `mcp__43470b8f...__createConfluencePage` | prd-generator | Publish PRDs to Confluence |
| `mcp__43470b8f...__updateConfluencePage` | stakeholder-update | Update living documents |
| `mcp__43470b8f...__searchConfluenceUsingCql` | research-synthesizer | Find related internal docs |
| `mcp__43470b8f...__getConfluenceSpaces` | onboarding | Discover team spaces |
| `mcp__43470b8f...__getPagesInConfluenceSpace` | research-synthesizer | Browse space contents |

**Data Flow Examples**:
```
/pmcopilot:sprint-review "Sprint 23"
  --> mcp__43470b8f...__searchJiraIssuesUsingJql("sprint = 'Sprint 23'")
  --> For each issue: mcp__43470b8f...__getJiraIssue(key)
  --> Calculate: completed points, carry-over, velocity
  --> Generate sprint review report

/pmcopilot:prioritize rice --from-jira GRAB
  --> mcp__43470b8f...__searchJiraIssuesUsingJql("project = GRAB AND type = Story AND status = Backlog")
  --> Extract features with descriptions
  --> Estimate RICE parameters using LLM + historical data
  --> Output ranked list with scores

/pmcopilot:prd "notifications overhaul"
  --> mcp__43470b8f...__searchConfluenceUsingCql("text ~ 'notifications'")
  --> Pulls relevant context into PRD
  --> mcp__43470b8f...__createConfluencePage in team space
  --> mcp__43470b8f...__createJiraIssue for each requirement
```

---

### Linear

**MCP Server**: `@anthropic/mcp-linear`

**Key Tools**:

| Tool | Used By | Description |
|------|---------|------------|
| `list_issues` | sprint-review | Get cycle/sprint issues |
| `create_issue` | prd-generator | Create issues from requirements |
| `update_issue` | prioritize | Update priority and labels |
| `list_projects` | onboarding | Discover projects |
| `list_cycles` | sprint-review | Get sprint/cycle data |
| `search_issues` | various | Full-text search across issues |

**Why Linear**: Popular with modern product teams (especially startups). Faster API, better developer experience than Jira.

---

### Asana

**MCP Server**: `@anthropic/mcp-asana`

**Key Tools**:

| Tool | Used By | Description |
|------|---------|------------|
| `search_tasks` | sprint-review | Find tasks by criteria |
| `get_task` | sprint-review | Full task details |
| `create_task` | prd-generator | Create tasks from PRD |
| `update_task` | prioritize | Update priority fields |
| `get_project` | onboarding | Project structure |
| `get_section_tasks` | sprint-review | Tasks by board section |

---

## Design

### Figma

**MCP Server**: `@anthropic/mcp-figma`

**Key Tools**:

| Tool | Used By | Description |
|------|---------|------------|
| `get_file` | ux-reviewer | Fetch Figma file structure |
| `get_file_nodes` | ux-reviewer | Get specific frame/component data |
| `get_images` | competitive-teardown | Export frames as images |
| `get_comments` | prd-generator | Pull design feedback |
| `get_team_projects` | onboarding | Discover team's design files |
| `get_file_versions` | stakeholder-update | Track design iteration history |

**Use Cases**:
```
/pmcopilot:prd "checkout redesign"
  --> Pulls current checkout design from Figma
  --> References specific frames in PRD
  --> Links to Figma comments as open questions

ux-reviewer agent:
  --> Fetches competitor app screenshots
  --> Fetches our Figma mocks
  --> Compares side-by-side with analysis
```

---

## Communication

### Slack

**MCP Server ID**: `0d3ccbd5-2c59-4d74-aa42-4830ee6d1e48` (ALREADY CONNECTED)

**Key Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__0d3ccbd5...__slack_search_public` | research-synthesizer | Find past discussions about competitors |
| `mcp__0d3ccbd5...__slack_search_public_and_private` | research-synthesizer | Search all channels |
| `mcp__0d3ccbd5...__slack_send_message` | stakeholder-update | Post updates to channels |
| `mcp__0d3ccbd5...__slack_read_channel` | sprint-review | Pull recent team discussions |
| `mcp__0d3ccbd5...__slack_read_thread` | user-research | Read feedback threads |
| `mcp__0d3ccbd5...__slack_create_canvas` | stakeholder-update | Create Slack canvases for reports |
| `mcp__0d3ccbd5...__slack_update_canvas` | stakeholder-update | Update existing canvases |
| `mcp__0d3ccbd5...__slack_search_channels` | onboarding | Find relevant channels |
| `mcp__0d3ccbd5...__slack_search_users` | stakeholder-update | Find team members |
| `mcp__0d3ccbd5...__slack_schedule_message` | stakeholder-update | Schedule weekly updates |
| `mcp__0d3ccbd5...__slack_send_message_draft` | stakeholder-update | Draft before sending |

**Use Cases**:
```
/pmcopilot:stakeholder-update weekly
  --> Pulls sprint data from Jira
  --> mcp__0d3ccbd5...__slack_search_public("decisions this week")
  --> Drafts update
  --> mcp__0d3ccbd5...__slack_send_message_draft to #product-updates (for user review)
  --> On approval: mcp__0d3ccbd5...__slack_send_message
```

---

### Gmail

**MCP Server ID**: `b504e51d-4881-4f6f-aee3-552af7b5ffcd` (ALREADY CONNECTED)

**Key Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__b504e51d...__gmail_search_messages` | research-synthesizer | Find competitor mentions in email |
| `mcp__b504e51d...__gmail_create_draft` | stakeholder-update | Draft update emails |
| `mcp__b504e51d...__gmail_read_message` | user-research | Read customer feedback emails |
| `mcp__b504e51d...__gmail_read_thread` | user-research | Full email thread context |
| `mcp__b504e51d...__gmail_list_drafts` | stakeholder-update | Review pending drafts |
| `mcp__b504e51d...__gmail_get_profile` | onboarding | Get user identity |

---

## Analytics

### Amplitude / Mixpanel

**Status**: NOT currently connected. These are custom MCP servers to add in Phase 2.

**Configuration to add to `.mcp.json`**:
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

**Expected Tools (once connected)**:

| Tool | Used By | Description |
|------|---------|------------|
| `mcp__amplitude__query_events` | metrics-review, data-analyst | Query event data |
| `mcp__amplitude__get_retention` | metrics-review | Retention curves |
| `mcp__amplitude__get_funnel` | metrics-review | Conversion funnels |
| `mcp__amplitude__get_revenue` | metrics-review | Revenue metrics |

**Note**: Until analytics MCPs are connected, the `data-analyst` agent and `metrics-review` skill will work with manually provided data or CSV exports.

---

## Documentation

### Confluence

**NOTE**: Confluence tools are part of the Atlassian MCP server (same as Jira above, ID: `43470b8f-a656-4653-8dba-c593836b1597`). See the Jira section for full Confluence tool list.

---

### Google Drive

**MCP Server ID**: `c1fc4002-5f49-5f9d-a4e5-93c4ef5d6a75` (ALREADY CONNECTED)

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__c1fc4002...__google_drive_search` | research-synthesizer | Search docs across Drive |
| `mcp__c1fc4002...__google_drive_fetch` | prd-generator | Fetch document content |

---

### Notion

**MCP Server**: Not currently connected. Can be added via `.mcp.json`:

```json
{
  "notion": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-notion"],
    "env": { "NOTION_API_KEY": "${NOTION_TOKEN}" }
  }
}
```

---

## Calendar and Meetings

### Google Calendar

**MCP Server ID**: `d5c1cc85-a409-49e0-9524-f68853313121` (ALREADY CONNECTED)

**Key Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__d5c1cc85...__gcal_list_events` | stakeholder-update | Check meeting context |
| `mcp__d5c1cc85...__gcal_create_event` | sprint-review | Schedule review meetings |
| `mcp__d5c1cc85...__gcal_find_meeting_times` | experiment-design | Schedule experiment reviews |
| `mcp__d5c1cc85...__gcal_find_my_free_time` | various | Find available slots |
| `mcp__d5c1cc85...__gcal_get_event` | various | Get event details |
| `mcp__d5c1cc85...__gcal_update_event` | various | Update meeting details |

---

### Granola (Meeting Transcripts)

**MCP Server ID**: `3053a93d-10f6-40f2-893b-fcd0bb589fb8` (ALREADY CONNECTED)

**Key Tools**:

| MCP Tool | Used By | Description |
|------|---------|------------|
| `mcp__3053a93d...__list_meetings` | user-research | Find recent research interviews |
| `mcp__3053a93d...__get_meeting_transcript` | user-research | Pull full transcript |
| `mcp__3053a93d...__query_granola_meetings` | research-synthesizer | Search across all meetings |
| `mcp__3053a93d...__get_meetings` | stakeholder-update | Get specific meeting details |

**Use Cases**:
```
/pmcopilot:user-research analyze-transcript
  --> mcp__3053a93d...__list_meetings (filter: "user interview")
  --> mcp__3053a93d...__get_meeting_transcript for each
  --> Extract: quotes, pain points, feature requests, themes
  --> Generate insight report with evidence
```

---

## AI and Research

### Perplexity (Web Research)

**MCP Server**: `pm_content_n8n_mcp` (ALREADY CONNECTED)

**Key Tool**: `mcp__pm_content_n8n_mcp__perplexity_search`

**Used By**: market-sizing, competitive-teardown, research-synthesizer

**Use Cases**:
```
/pmcopilot:market-sizing "ride-hailing in Southeast Asia"
  --> mcp__pm_content_n8n_mcp__perplexity_search("ride hailing market size SEA 2025 2026")
  --> mcp__pm_content_n8n_mcp__perplexity_search("Grab Gojek market share SEA")
  --> mcp__pm_content_n8n_mcp__perplexity_search("super app TAM Southeast Asia")
  --> Synthesize into TAM/SAM/SOM analysis
```

---

### Context7 (Library Documentation)

**MCP Server**: Context7 (ALREADY CONNECTED)

**Tools**: `mcp__Context7__resolve-library-id`, `mcp__Context7__query-docs`

**Used By**: prd-generator (for technical PRDs that reference specific APIs/libraries)

---

### Replicate (AI/ML Models)

**MCP Server**: Replicate (ALREADY CONNECTED)

**Tools**: `mcp__replicate__list_api_endpoints`, `mcp__replicate__get_api_endpoint_schema`, `mcp__replicate__invoke_api_endpoint`

**Used By**: Could be used for image analysis of competitor screenshots, generating design mockups, or running ML models as part of research.

---

### Sequential Thinking

**MCP Server**: `sequential-thinking` (ALREADY CONNECTED)

**Tool**: `mcp__sequential-thinking__sequentialthinking`

**Used By**: Complex multi-step reasoning during research synthesis, prioritization, and market sizing. The orchestrator agents can use this for structured analytical thinking.

---

## Integration Priority Matrix

| Integration | Impact on PM Workflow | Status | Priority |
|-------------|----------------------|--------|----------|
| Jira / Confluence | Very High | CONNECTED | P0 |
| Slack | Very High | CONNECTED | P0 |
| Chrome (Claude in Chrome + Control Chrome) | Very High | CONNECTED | P0 |
| Perplexity | High | CONNECTED | P0 |
| Gmail | Medium | CONNECTED | P1 |
| Google Calendar | Medium | CONNECTED | P1 |
| Granola (meeting transcripts) | High | CONNECTED | P1 |
| Google Drive | Medium | CONNECTED | P1 |
| Sequential Thinking | Medium | CONNECTED | P1 |
| Context7 | Low | CONNECTED | P2 |
| Replicate | Low | CONNECTED | P2 |
| Amplitude / Mixpanel | High | TO CONNECT | P0 (Phase 2) |
| Figma | Medium | TO CONNECT | P1 (Phase 2) |
| Linear | Medium | TO CONNECT | P1 (Phase 2) |
| Notion | Medium | TO CONNECT | P2 |
| iOS Simulator | High | TO BUILD (custom MCP) | P1 (Phase 4) |
| Android Emulator | High | TO BUILD (custom MCP) | P1 (Phase 4) |
| App Store Intel | Medium | TO BUILD (custom MCP) | P1 (Phase 4) |
| PM Frameworks (RICE, etc.) | High | TO BUILD (custom MCP) | P0 (Phase 0) |

---

## Integration Composition Examples

### Full Quarterly Planning Workflow

```
1. /pmcopilot:metrics-review aarrr --period 90d
   Uses: mcp__amplitude__* (once connected, else manual CSV)

2. /pmcopilot:competitive-teardown "Gojek, Uber, Bolt"
   Uses: mcp__simulator-bridge__*, mcp__emulator-bridge__*,
         mcp__Claude_in_Chrome__*, mcp__app-store-intel__*,
         mcp__pm_content_n8n_mcp__perplexity_search

3. /pmcopilot:prioritize rice --from-jira TRANSPORT
   Uses: mcp__43470b8f...__searchJiraIssuesUsingJql, mcp__pm-frameworks__rice_batch

4. /pmcopilot:roadmap now-next-later --quarters 4
   Uses: mcp__43470b8f...__searchJiraIssuesUsingJql (backlog), results from steps 1-3

5. /pmcopilot:stakeholder-update exec-summary
   Uses: mcp__0d3ccbd5...__slack_send_message,
         mcp__b504e51d...__gmail_create_draft, all data from above
```

### Customer Feedback Loop

```
1. mcp__3053a93d...__list_meetings --> get user interview transcripts
2. mcp__app-store-intel__get_app_reviews --> get App Store reviews
3. mcp__0d3ccbd5...__slack_search_public --> search #feedback channel
4. /pmcopilot:user-research affinity-map
   --> Synthesize all sources into themed insights
5. /pmcopilot:prd
   --> Write PRD grounded in customer evidence
6. mcp__43470b8f...__createJiraIssue --> create tickets from PRD requirements
```
