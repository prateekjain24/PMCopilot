---
id: PMC-105
title: Prepare marketplace listing
phase: 5 - Polish and Distribution
status: todo
type: docs
estimate: 1
dependencies: [PMC-001, PMC-100]
---

## Description

Prepare all materials needed to list PMCopilot on the Claude Code plugin marketplace. This includes the listing metadata, promotional copy, category tags, screenshots/examples, and any marketplace-specific configuration files.

The listing must clearly communicate PMCopilot&apos;s value to Product Managers browsing the marketplace, differentiate it from generic productivity plugins, and set accurate expectations about what integrations are required vs. optional.

Key elements:

- **Listing title and tagline**: Concise, searchable, PM-audience-targeted.
- **Description**: Expanded value proposition covering all skill categories, agent capabilities, and integration ecosystem.
- **Category and tags**: Proper categorization for marketplace discovery (e.g., "Product Management", "Frameworks", "Analytics", "Competitive Analysis").
- **Screenshots/examples**: Representative output examples showing PRDs, prioritization matrices, teardown reports, and sprint analytics.
- **Version and compatibility**: Minimum Claude Code version, OS requirements, optional dependencies.
- **Changelog**: Initial release notes covering all Phase 0-5 capabilities.

## Acceptance Criteria

- [ ] Plugin manifest (`package.json` or equivalent) contains all marketplace-required fields: name, version, description, author, license, keywords, repository
- [ ] A `marketplace/` directory contains listing assets
- [ ] `marketplace/listing.md` contains the full marketplace description with feature highlights, use cases, and integration list
- [ ] `marketplace/examples/` contains at least 3 representative output examples (PRD, prioritization, teardown report)
- [ ] Description clearly states that all external integrations (Jira, Slack, Amplitude, etc.) are optional
- [ ] Keywords/tags include: product-management, prd, prioritization, rice, kano, moscow, roadmap, sprint-review, competitive-analysis, app-teardown, market-sizing
- [ ] Version follows semver (1.0.0 for initial release)
- [ ] Minimum Claude Code version is specified
- [ ] A CHANGELOG.md exists with the initial release entry covering all phases
- [ ] Listing links to README, integration setup guide, and troubleshooting guide
- [ ] Listing has been reviewed for accuracy -- no references to features that do not exist

## Files to Create/Modify

- `package.json` -- ensure all marketplace-required metadata fields are present
- `marketplace/listing.md` -- full marketplace description
- `marketplace/examples/` -- example output files
- `CHANGELOG.md` -- initial release changelog
