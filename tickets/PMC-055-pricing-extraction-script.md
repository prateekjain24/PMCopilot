---
id: PMC-055
title: Create pricing page extraction JS script
phase: 3 - Web Teardown Engine
status: todo
type: script
estimate: 1
dependencies: [PMC-053]
---

## Description

Create a JavaScript extraction script that the web-teardown agent injects via `javascript_tool` to extract structured pricing data from any SaaS pricing page. This script runs in the browser context on the target pricing page and returns a JSON object with the complete pricing structure.

The script must extract the following structured data:

- **tiers** -- array of pricing tier objects, each containing:
  - `name` -- tier name (e.g., "Free", "Pro", "Enterprise")
  - `monthlyPrice` -- monthly price as a number (null if not listed)
  - `annualPrice` -- annual price as a number (null if not listed)
  - `currency` -- detected currency symbol or code
  - `features` -- array of feature strings included in this tier
  - `highlighted` -- boolean indicating if this tier is visually emphasized (recommended/popular)
  - `ctaText` -- text of the tier CTA button (e.g., "Start free trial", "Contact sales")
  - `ctaHref` -- href of the tier CTA button
- **enterpriseCTA** -- object with `{text, href}` for the enterprise/custom pricing call-to-action, if present
- **billingToggle** -- boolean indicating whether a monthly/annual toggle exists
- **freeTrialAvailable** -- boolean indicating if any tier offers a free trial
- **comparisonTable** -- boolean indicating if a detailed feature comparison table exists below the tiers

The script should handle common pricing page patterns: card-based layouts, comparison tables, toggle switches for billing frequency, "most popular" badges. It should be a self-contained IIFE returning a JSON-serializable object.

## Acceptance Criteria

- [ ] Script file created at `scripts/extraction/pricing.js`
- [ ] Script is a self-contained IIFE returning a JSON object
- [ ] Extracts tier array with: name, monthlyPrice, annualPrice, currency, features, highlighted, ctaText, ctaHref
- [ ] Detects enterprise CTA separately from standard tiers
- [ ] Detects billing toggle presence
- [ ] Detects free trial availability
- [ ] Detects feature comparison table presence
- [ ] Handles missing or non-standard pricing structures gracefully (partial data with nulls)
- [ ] Price extraction handles common formats: "$10/mo", "$99/year", "10 USD", comma-separated numbers
- [ ] Output is valid JSON-serializable
- [ ] Smoke test: script returns correct structured data when run on a sample SaaS pricing page

## Files to Create/Modify

- `scripts/extraction/pricing.js` (create)
