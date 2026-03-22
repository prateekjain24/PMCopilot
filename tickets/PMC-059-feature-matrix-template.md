---
id: PMC-059
title: Feature Matrix Template
phase: 3 - Web Teardown Engine
status: done
type: template
estimate: 1
dependencies: [PMC-035]
---

## Description
Create a reusable feature comparison matrix template that renders a structured table with competitor columns and feature rows. Each cell captures three dimensions of information: availability (yes/no/partial), tier (which pricing plan includes it), and notes (free-text observations like limitations or differentiators).

This template is used both as a standalone output for quick feature comparisons and as an embedded section within the full teardown report (PMC-058). It must support an arbitrary number of competitors and features, handle missing data gracefully, and produce clean markdown tables that are readable in terminal output.

The data model uses competitor names as columns and feature names as rows. Each cell is a `FeatureCell` containing:
- `availability`: `"yes"` | `"no"` | `"partial"` | `"unknown"`
- `tier`: string indicating the pricing tier (e.g., "Free", "Pro", "Enterprise") or null if not applicable
- `notes`: optional free-text string for qualifiers

## Acceptance Criteria
- [ ] TypeScript interface `FeatureCell` with `availability`, `tier`, and `notes` fields
- [ ] TypeScript interface `FeatureMatrixData` with `competitors: string[]`, `features: string[]`, and `matrix: Record<string, Record<string, FeatureCell>>` (feature -> competitor -> cell)
- [ ] `generateFeatureMatrix(data: FeatureMatrixData): string` function produces a markdown table
- [ ] Availability renders as visual indicators in markdown (e.g., checkmark, X, tilde for partial)
- [ ] Tier info renders inline in the cell when present
- [ ] Notes render as parenthetical or footnote when present
- [ ] Matrix handles up to 10 competitors and 50+ features without layout breakage
- [ ] Empty/unknown cells render gracefully with a dash or "unknown" indicator
- [ ] Function can be imported and used independently or composed into the teardown report template
- [ ] Unit tests cover: basic matrix, partial availability, missing data, large matrix, single competitor edge case

## Files to Create/Modify
- `src/templates/feature-matrix.ts` - Feature matrix interfaces and generation function
- `src/templates/feature-matrix.test.ts` - Unit tests for the feature matrix template
