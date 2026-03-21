---
id: PMC-057
title: Create tech stack detection JS script
phase: 3 - Web Teardown Engine
status: todo
type: script
estimate: 1
dependencies: [PMC-053]
---

## Description

Create a JavaScript detection script that the web-teardown agent injects via `javascript_tool` to identify the technology stack powering a website. This script runs in the browser context and probes for fingerprints of common frameworks, analytics platforms, customer support tools, and experimentation systems.

The script must detect the following categories and specific technologies:

**Frontend frameworks:**
- React -- check for `__REACT_DEVTOOLS_GLOBAL_HOOK__`, `_reactRootContainer`, or `__NEXT_DATA__`
- Vue -- check for `__VUE__`, `__vue__` on elements
- Angular -- check for `ng-version` attribute, `getAllAngularRootElements`
- Next.js -- check for `__NEXT_DATA__` script tag, `_next` in resource paths
- Nuxt -- check for `__NUXT__`, `_nuxt` in resource paths

**Analytics platforms:**
- GA4 -- check for `gtag`, `dataLayer`, `google-analytics.com/g/collect`
- Segment -- check for `analytics` object with Segment-specific methods
- Amplitude -- check for `amplitude` global object
- Mixpanel -- check for `mixpanel` global object

**Session recording / heatmaps:**
- Hotjar -- check for `hj`, `_hjSettings`
- FullStory -- check for `FS`, `_fs_initialized`

**Customer support:**
- Intercom -- check for `Intercom`, `intercomSettings`
- Zendesk -- check for `zE`, `zESettings`

**Feature flags / experimentation:**
- LaunchDarkly -- check for `ldclient`, LaunchDarkly script references
- Optimizely -- check for `optimizely`, Optimizely script references

The script should return a JSON object with a `detected` array of `{name, category, confidence, evidence}` objects where confidence is "high" (global object found) or "medium" (script reference or indirect signal), and evidence is a brief description of how the technology was identified.

The script must be a self-contained IIFE. It should also inspect `document.scripts` src attributes and `performance.getEntriesByType("resource")` for additional signals from loaded scripts and network resources.

## Acceptance Criteria

- [ ] Script file created at `scripts/extraction/techstack.js`
- [ ] Script is a self-contained IIFE returning a JSON object
- [ ] Detects frontend frameworks: React, Vue, Angular, Next.js, Nuxt
- [ ] Detects analytics: GA4, Segment, Amplitude, Mixpanel
- [ ] Detects session recording: Hotjar, FullStory
- [ ] Detects customer support: Intercom, Zendesk
- [ ] Detects experimentation: LaunchDarkly, Optimizely
- [ ] Each detection includes: name, category, confidence level, and evidence string
- [ ] Uses multiple detection strategies: global objects, DOM attributes, script src inspection, resource entries
- [ ] Returns empty `detected` array (not an error) if no technologies are identified
- [ ] Output is valid JSON-serializable
- [ ] Smoke test: script correctly identifies known technologies on a sample website

## Files to Create/Modify

- `scripts/extraction/techstack.js` (create)
