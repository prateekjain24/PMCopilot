---
id: PMC-003
title: Create settings.json with default configuration values
phase: 0 - Foundation
status: done
type: setup
estimate: 1
dependencies:
  - PMC-001
---

## Description

Create the `settings.json` file at the plugin root that holds all default configuration values for PMCopilot. This file provides sensible out-of-the-box defaults that users can override for their specific organization and workflow. Skills and agents read from this file to determine templates, formats, integrations, and behavioral preferences.

The following default fields must be present with sensible values:

| Field | Default Value | Purpose |
|---|---|---|
| `default_prd_template` | `"google"` | Which PRD template to use when none is specified (google, amazon-prfaq, stripe) |
| `default_roadmap_format` | `"now-next-later"` | Default roadmap visualization format |
| `default_prioritization` | `"rice"` | Default prioritization framework |
| `competitive_intel_cache_days` | `7` | How many days to cache competitive intelligence data before refreshing |
| `auto_screenshot_resolution` | `"1280x720"` | Default resolution for automated simulator screenshots |
| `default_market` | `"us"` | Default market/region for app store intelligence queries |
| `jira_project_key` | `""` | Jira project key for issue sync (empty = not configured) |
| `figma_team_id` | `""` | Figma team ID for design asset linking (empty = not configured) |
| `analytics_platform` | `"amplitude"` | Default analytics platform for metrics integration |
| `preferred_frameworks` | `["rice", "moscow", "kano"]` | Ordered list of preferred PM frameworks |

## Acceptance Criteria

- [ ] File exists at `settings.json` in the plugin root
- [ ] File is valid JSON
- [ ] All 10 default fields are present: `default_prd_template`, `default_roadmap_format`, `default_prioritization`, `competitive_intel_cache_days`, `auto_screenshot_resolution`, `default_market`, `jira_project_key`, `figma_team_id`, `analytics_platform`, `preferred_frameworks`
- [ ] Defaults are sensible and documented (inline comments not possible in JSON, so values should be self-explanatory)
- [ ] String fields that require user configuration are set to empty strings (jira_project_key, figma_team_id)
- [ ] Numeric fields use appropriate types (not strings)
- [ ] Array fields use proper JSON arrays

## Files to Create/Modify

- `settings.json`
