# Integration Setup Guide

All integrations are optional. PMCopilot gracefully degrades when integrations are unavailable -- skills that depend on an integration will fall back to manual data input or skip the integration-dependent step entirely.

---

## Table of Contents

1. [Jira / Confluence (Atlassian)](#jira--confluence-atlassian)
2. [Slack](#slack)
3. [Amplitude](#amplitude)
4. [Mixpanel](#mixpanel)
5. [Figma](#figma)
6. [Granola](#granola)
7. [Gmail](#gmail)
8. [Google Calendar](#google-calendar)
9. [Chrome](#chrome)

---

## Jira / Confluence (Atlassian)

### What it enables

- **sprint-review**: Pulls sprint data, velocity charts, and ticket status directly from Jira.
- **prioritize**: Reads backlog items and writes priority scores back as custom fields.
- **prd**: Publishes finished PRDs to Confluence and links them to Jira epics.

### Prerequisites

- An Atlassian Cloud account with access to the relevant Jira project(s).
- At minimum, read access to boards, sprints, and issues. Write access is needed to update fields or publish to Confluence.

### Setup steps

Jira/Confluence is already connected via the Claude Code Atlassian MCP. No additional setup is required if you see it listed when you run:

```bash
claude mcp list
```

If it is not listed, re-enable it from the Claude Code integrations menu in Settings.

### Verify it works

```bash
/pmcopilot:sprint-review "current sprint"
```

The skill should return sprint velocity data and ticket summaries pulled from Jira. If it asks you to paste data manually instead, the integration is not connected.

### Troubleshooting

- **"Atlassian MCP not found"**: Open Claude Code settings and confirm the Atlassian integration is enabled.
- **403 errors**: Your Atlassian account may lack permissions for the target project. Ask your Jira admin to grant at least Browse Projects permission.
- **Stale data**: Jira MCP caches board metadata. Restart Claude Code if you recently changed board configurations.

---

## Slack

### What it enables

- **stakeholder-update**: Posts formatted updates to Slack channels and creates Slack canvases.
- **research-synthesizer**: Searches Slack discussions for qualitative user feedback and product context.

### Prerequisites

- A Slack workspace where you have permission to post messages and read channel history.
- The Claude Code Slack MCP must be authorized to the workspace.

### Setup steps

Slack is already connected via the Claude Code Slack MCP. Verify by running:

```bash
claude mcp list
```

If it is not listed, re-enable it from the Claude Code integrations menu in Settings and complete the OAuth flow for your workspace.

### Verify it works

```bash
/pmcopilot:stakeholder-update "weekly update for #product-team"
```

The skill should offer to post the generated update to the specified Slack channel. If it only outputs text locally, the integration is not connected.

### Troubleshooting

- **"Channel not found"**: Confirm the channel name is correct and that the Slack MCP bot has been invited to the channel.
- **"missing_scope" errors**: The Slack app may need additional OAuth scopes. Reconnect the integration from Claude Code settings.
- **Rate limiting**: Slack enforces per-workspace rate limits. If you see 429 errors, wait a few minutes and retry.

---

## Amplitude

### What it enables

- **metrics-review**: Queries Amplitude for North Star Metrics, AARRR funnel data, retention curves, and anomaly detection.
- **data-analyst** agent: Builds custom event queries and segment comparisons.

### Prerequisites

- An Amplitude organization with API access.
- A project with event data flowing in.

### Setup steps

Amplitude provides a remote HTTP MCP server. Connect it with:

```bash
claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"
```

You will be prompted to authenticate via OAuth during the first tool call.

### Verify it works

```bash
/pmcopilot:metrics-review "weekly active users trend"
```

The skill should return event data and charts sourced from Amplitude. If it asks you to paste CSV data instead, the integration is not connected or authentication failed.

### Troubleshooting

- **Authentication loop**: Remove and re-add the MCP server, then retry.
  ```bash
  claude mcp remove Amplitude
  claude mcp add -t http Amplitude "https://mcp.amplitude.com/mcp"
  ```
- **No data returned**: Confirm the project has recent event data and that your API credentials have read access to the target project.
- **Timeout errors**: Amplitude queries on large datasets can be slow. Try narrowing the date range.

---

## Mixpanel

### What it enables

- **metrics-review**: Queries Mixpanel for funnel analysis, retention, and event trends.
- **data-analyst** agent: Runs JQL queries and builds segment-level reports.

### Prerequisites

- A Mixpanel project with event data.
- API access enabled for your Mixpanel account.

### Setup steps

Mixpanel provides a remote HTTP MCP server. Connect it with:

```bash
claude mcp add -t http Mixpanel "https://mcp.mixpanel.com/mcp"
```

You will be prompted to authenticate via OAuth during the first tool call.

### Verify it works

```bash
/pmcopilot:metrics-review "signup funnel conversion"
```

The skill should return funnel data from Mixpanel. If it asks for manual input, the integration is not connected.

### Troubleshooting

- **Authentication failures**: Remove and re-add the MCP server.
  ```bash
  claude mcp remove Mixpanel
  claude mcp add -t http Mixpanel "https://mcp.mixpanel.com/mcp"
  ```
- **"Project not found"**: Ensure your API credentials are scoped to the correct Mixpanel project.
- **Empty results**: Verify that the events you are querying exist in your Mixpanel taxonomy.

---

## Figma

### What it enables

- **ux-reviewer** agent: Pulls design frames from Figma for heuristic evaluation against Nielsen usability principles.
- **prd**: Embeds Figma links and frame previews in generated PRDs.

### Prerequisites

- A Figma account with at least Viewer access to the target files.
- Files must not be in a draft-only state (they need to be saved to a Figma project or team).

### Setup steps

Figma provides a remote HTTP MCP server. Connect it with:

```bash
claude mcp add -t http Figma "https://mcp.figma.com/mcp"
```

You will be prompted to authenticate via OAuth during the first tool call.

### Verify it works

Provide a Figma file URL to the UX reviewer:

```bash
/pmcopilot:competitive-teardown "Review UX of https://www.figma.com/file/<file-id>"
```

If the agent fetches frames and renders analysis, the integration is working.

### Troubleshooting

- **"File not found"**: Confirm the Figma file URL is correct and that your account has access.
- **OAuth errors**: Remove and re-add the MCP server.
  ```bash
  claude mcp remove Figma
  claude mcp add -t http Figma "https://mcp.figma.com/mcp"
  ```
- **Large files timing out**: Figma files with hundreds of frames may exceed response limits. Try linking to a specific page or frame URL instead of the entire file.

---

## Granola

### What it enables

- **user-research**: Pulls meeting transcripts from Granola to extract user pain points, feature requests, and Jobs-to-be-Done insights.

### Prerequisites

- A Granola account with recorded meetings.
- The Claude Code Granola MCP must be authorized.

### Setup steps

Granola is already connected via the Claude Code Granola MCP. Verify by running:

```bash
claude mcp list
```

If it is not listed, re-enable it from the Claude Code integrations menu in Settings.

### Verify it works

```bash
/pmcopilot:user-research "synthesize last 5 customer interviews"
```

The skill should pull transcripts from Granola and generate a synthesis. If it asks you to paste transcripts manually, the integration is not connected.

### Troubleshooting

- **No meetings found**: Confirm that meetings have been recorded in Granola and are not archived.
- **Partial transcripts**: Granola may truncate very long meetings. If key content is missing, try querying a specific meeting by name.
- **Authentication expired**: Reconnect the Granola integration from Claude Code settings.

---

## Gmail

### What it enables

- **stakeholder-update**: Drafts and sends stakeholder emails directly from Gmail.
- Can also search email threads for feedback and context.

### Prerequisites

- A Gmail or Google Workspace account.
- The Claude Code Gmail MCP must be authorized with send and read permissions.

### Setup steps

Gmail is already connected via the Claude Code Gmail MCP. Verify by running:

```bash
claude mcp list
```

If it is not listed, re-enable it from the Claude Code integrations menu in Settings and complete the OAuth flow.

### Verify it works

```bash
/pmcopilot:stakeholder-update "draft monthly update email to leadership"
```

The skill should offer to create a Gmail draft. If it only outputs text, the integration is not connected.

### Troubleshooting

- **"Insufficient permissions"**: The Gmail MCP may need additional OAuth scopes. Reconnect from Claude Code settings.
- **Draft not appearing**: Check the Drafts folder in Gmail. There may be a short delay before it appears.
- **Wrong sender account**: If you have multiple Google accounts, ensure the correct one is authorized in Claude Code.

---

## Google Calendar

### What it enables

- **sprint-review**: Reads calendar events to correlate meeting load with sprint velocity and identify scheduling patterns.

### Prerequisites

- A Google Calendar account (personal or Workspace).
- The Claude Code Google Calendar MCP must be authorized with read access.

### Setup steps

Google Calendar is already connected via the Claude Code Google Calendar MCP. Verify by running:

```bash
claude mcp list
```

If it is not listed, re-enable it from the Claude Code integrations menu in Settings.

### Verify it works

```bash
/pmcopilot:sprint-review "last sprint"
```

If the skill includes meeting load analysis alongside sprint data, the Google Calendar integration is working.

### Troubleshooting

- **No events returned**: Confirm that the authorized Google account has events on the calendar for the queried time range.
- **Wrong calendar**: If you have multiple calendars, the MCP reads from the primary calendar by default. Shared or secondary calendars may not be included.
- **Authentication expired**: Reconnect from Claude Code settings and re-authorize.

---

## Chrome

### What it enables

- **web-teardown** agent: Automates Chrome to browse competitor websites, capture screenshots, and extract page structure for competitive analysis.
- **competitive-teardown** skill: Uses the web-teardown agent for the web research portion of a full competitive analysis.

### Prerequisites

- Google Chrome installed on your machine.
- The Claude Code Chrome MCP (Claude in Chrome / Control Chrome) must be enabled.

### Setup steps

Chrome is already connected via the Claude Code Chrome MCP. Verify by running:

```bash
claude mcp list
```

If it is not listed, install the Claude Code Chrome extension and enable the Control Chrome MCP from Claude Code settings.

### Verify it works

```bash
/pmcopilot:competitive-teardown "web teardown of competitor.com"
```

The web-teardown agent should open Chrome, navigate to the target site, and capture screenshots. If it only performs text-based analysis, the integration is not connected.

### Troubleshooting

- **Chrome not opening**: Ensure Chrome is installed and not blocked by security software. The MCP requires Chrome to be launchable from the command line.
- **Extension not detected**: Reinstall the Claude Code Chrome extension and restart Chrome.
- **Pages not loading**: Some sites block automated browsers. The web-teardown agent respects robots.txt and enforces a 2-second delay between navigations. If a site blocks access, results will be limited.
- **Too many tabs**: The web-teardown agent caps at 50 pages per competitor. If Chrome becomes unresponsive, close excess tabs and restart the teardown.
