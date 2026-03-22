---
id: PMC-054
title: Create homepage data extraction JS script
phase: 3 - Web Teardown Engine
status: done
type: script
estimate: 1
dependencies: [PMC-053]
---

## Description

Create a JavaScript extraction script that the web-teardown agent injects via `javascript_tool` to extract structured homepage data from any website. This script runs in the browser context on the target landing page and returns a JSON object with all key homepage elements.

The script must extract the following fields:

- **title** -- `document.title`
- **metaDescription** -- content of the `<meta name="description">` tag
- **ogTitle** -- content of the `<meta property="og:title">` tag
- **h1** -- text content of the first `<h1>` element (primary headline)
- **h2s** -- array of all `<h2>` text contents (section headings, value propositions)
- **ctaButtons** -- array of objects for prominent CTA buttons, each with `{text, href, position}` (above/below fold)
- **navLinks** -- array of objects for top-level navigation links, each with `{text, href}`

The script should be robust against missing elements (return `null` for missing fields, empty arrays for missing collections). It should be a self-contained IIFE that returns a JSON-serializable object, suitable for injection via Chrome MCP `javascript_tool`.

The agent prompt in PMC-053 should reference this script by path so the teardown agent reads and injects it during the landing page analysis phase.

## Acceptance Criteria

- [ ] Script file created at `scripts/extraction/homepage.js`
- [ ] Script is a self-contained IIFE returning a JSON object
- [ ] Extracts: title, metaDescription, ogTitle, h1, h2s, ctaButtons, navLinks
- [ ] ctaButtons includes text, href, and position (above/below fold detection)
- [ ] navLinks includes text and href for top-level navigation items
- [ ] Handles missing elements gracefully (null for missing scalars, empty arrays for missing collections)
- [ ] Script can be read by the web-teardown agent and injected via `javascript_tool`
- [ ] Output is valid JSON-serializable (no circular references, no DOM nodes)
- [ ] Smoke test: script returns correct structured data when run on a sample website

## Files to Create/Modify

- `scripts/extraction/homepage.js` (create)
