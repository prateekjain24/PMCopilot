---
id: PMC-035
title: Competitive Teardown Skill
phase: 1 - Core Skills
status: done
type: skill
estimate: 1
dependencies: [PMC-005]
---

## Description

Implement the competitive teardown skill at `skills/competitive-teardown/SKILL.md`. This is **the flagship skill** of PMCopilot -- the most comprehensive, highest-effort analysis in the toolkit. It produces a full competitive intelligence report by orchestrating multiple parallel sub-agents, each specializing in a different dimension of competitive analysis.

The skill must use model `opus` with `effort: max` to ensure the deepest possible analysis. It orchestrates three parallel agents that work simultaneously:

- **`app-teardown`** - Analyzes the competitor&apos;s product directly: feature inventory, UX flows, information architecture, onboarding experience, and pricing model
- **`web-teardown`** - Researches the competitor&apos;s public positioning: website messaging, SEO strategy, content marketing, social presence, job postings (as signals), and press coverage
- **`research-synthesizer`** - Pulls together market context: analyst reports, funding history, market share estimates, strategic direction, and partnership ecosystem

The main skill orchestrates these agents in parallel, then synthesizes their outputs into a cohesive competitive intelligence report.

Allowed tools: `Read`, `Write`, `Bash`, `Grep`, `Glob`, `Agent(app-teardown, web-teardown, research-synthesizer)`.

### Output Structure

The final report includes the following sections:

1. **Executive Summary** - 1-page overview of competitive positioning, key threats, and strategic opportunities
2. **Feature Matrix** - Side-by-side comparison table of capabilities across your product and the competitor(s), with parity/gap/advantage ratings
3. **UX Analysis** - Walkthrough of key user flows with qualitative assessment of usability, design quality, and friction points
4. **Pricing Comparison** - Plan/tier comparison, pricing model analysis (per-seat, usage-based, flat), and value-per-dollar assessment
5. **App Store Performance** - Ratings, review sentiment, download estimates, and version cadence comparison
6. **SWOT Analysis** - Structured Strengths, Weaknesses, Opportunities, and Threats for the competitor relative to your product
7. **Strategic Recommendations** - Prioritized list of actions: features to build, positioning to adopt, markets to target, and threats to mitigate
8. **Screenshot Gallery** - Organized collection of competitor product screenshots with annotations

## Acceptance Criteria

- [ ] `skills/competitive-teardown/SKILL.md` exists and follows the standard skill schema
- [ ] Model is set to `opus` with `effort: max`
- [ ] Allowed tools list includes `Read`, `Write`, `Bash`, `Grep`, `Glob`, `Agent(app-teardown, web-teardown, research-synthesizer)`
- [ ] Skill defines all three sub-agents with clear responsibilities, tool access, and expected output format
- [ ] Sub-agents are configured to run in parallel for maximum throughput
- [ ] Skill includes a synthesis step that merges all sub-agent outputs into a unified report
- [ ] Output contains all eight sections: Executive Summary, Feature Matrix, UX Analysis, Pricing Comparison, App Store Performance, SWOT, Strategic Recommendations, Screenshot Gallery
- [ ] Feature matrix supports multi-competitor comparison (not just 1:1)
- [ ] SWOT analysis is structured with actionable items, not just observations
- [ ] Strategic recommendations are prioritized by impact and effort
- [ ] Skill prompts the user for: competitor name(s), your product name, specific areas of focus (optional), and output format preferences
- [ ] Skill handles partial data gracefully (e.g., if app store data is unavailable, that section notes the gap and proceeds)
- [ ] Skill includes estimated completion time guidance (this is a long-running analysis)

## Files to Create/Modify

- `skills/competitive-teardown/SKILL.md`
