---
id: PMC-056
title: Create SEO metadata extraction JS script
phase: 3 - Web Teardown Engine
status: todo
type: script
estimate: 1
dependencies: [PMC-053]
---

## Description

Create a JavaScript extraction script that the web-teardown agent injects via `javascript_tool` to extract comprehensive SEO metadata from any webpage. This script runs in the browser context and returns a JSON object with all SEO-relevant tags and structured data.

The script must extract the following fields:

- **title** -- `document.title`
- **description** -- content of `<meta name="description">`
- **canonical** -- href of `<link rel="canonical">`
- **robots** -- content of `<meta name="robots">` (index/noindex, follow/nofollow directives)
- **ogTags** -- object containing all Open Graph tags:
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`
- **twitterCards** -- object containing all Twitter Card tags:
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`
- **structuredData** -- array of all JSON-LD scripts parsed from `<script type="application/ld+json">` blocks (parsed JSON objects, not raw strings)
- **hreflang** -- array of `{lang, href}` objects from `<link rel="alternate" hreflang="...">` tags
- **headings** -- object with `{h1: [...], h2: [...], h3: [...]}` containing text content of all heading elements

The script should be robust against malformed or missing tags. JSON-LD blocks that fail to parse should be skipped with a note in the output. The script must be a self-contained IIFE returning a JSON-serializable object.

## Acceptance Criteria

- [ ] Script file created at `scripts/extraction/seo.js`
- [ ] Script is a self-contained IIFE returning a JSON object
- [ ] Extracts: title, description, canonical, robots
- [ ] Extracts all standard Open Graph tags into an ogTags object
- [ ] Extracts all standard Twitter Card tags into a twitterCards object
- [ ] Parses all JSON-LD structured data blocks into a structuredData array
- [ ] Extracts hreflang alternate links
- [ ] Extracts heading hierarchy (h1, h2, h3)
- [ ] Handles malformed JSON-LD gracefully (skip with error note, do not throw)
- [ ] Handles missing meta tags gracefully (null values)
- [ ] Output is valid JSON-serializable
- [ ] Smoke test: script returns correct structured data when run on a sample website

## Files to Create/Modify

- `scripts/extraction/seo.js` (create)
