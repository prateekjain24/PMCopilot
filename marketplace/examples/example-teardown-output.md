# Example: Competitive Teardown Output

Below is a sample of the executive summary produced by `/pmcopilot:competitive-teardown "Notion vs Coda"`. The full report includes detailed screen-by-screen analysis, UX heuristic scores, and feature matrices.

---

## Competitive Teardown: Notion vs Coda

### Executive Summary

This analysis covers the web and mobile experiences of Notion and Coda, based on automated app teardowns (47 screens captured for Notion, 39 for Coda), web crawl analysis (32 pages per product), and App Store / Play Store intelligence.

### Key Findings

**Onboarding**: Notion requires 6 steps to reach a blank workspace, while Coda drops users into a pre-populated template gallery in 3 steps. Coda offers a stronger guided experience for new users, though Notion provides more flexibility for power users to customize their setup.

**Information Architecture**: Notion uses a sidebar-first navigation model with nested pages up to 5 levels deep. Coda uses a doc-centric model where each document contains pages, tables, and automations. Notion is better suited for wiki-style knowledge bases; Coda excels at workflow-heavy use cases.

**Mobile Experience**: Notion mobile (4.6 stars, 245K ratings) offers near feature-parity with desktop, including offline editing. Coda mobile (4.3 stars, 18K ratings) is limited to viewing and basic editing -- formula and automation creation requires desktop. This is a significant gap for teams with mobile-heavy workflows.

**Collaboration**: Both offer real-time co-editing. Notion provides inline comments with thread resolution. Coda adds row-level commenting in tables and built-in reaction buttons, making it stronger for structured feedback loops.

### Feature Comparison Matrix

| Capability | Notion | Coda |
|---|---|---|
| Nested pages | Yes (unlimited depth) | Yes (within docs) |
| Database views | 6 view types | 8 view types |
| Formulas | Basic | Advanced (Turing-complete) |
| Automations | Limited (buttons, recurring) | Extensive (cross-doc packs) |
| API access | Public API | Public API + Packs SDK |
| Offline support | Full (mobile + desktop) | View only |
| Templates | 10,000+ community | 400+ curated |
| Free tier limit | 1,000 blocks (team) | Row/object limits |

### Strategic Opportunities

1. **Offline-first mobile editing** is an unmet need in the Coda ecosystem. Building strong offline support would differentiate against Coda for mobile-heavy teams.
2. **Automation depth** is Coda's strongest moat. Competing on automations requires significant investment; consider partnering with Zapier/Make instead.
3. **Template marketplace** is a low-effort differentiator. Notion's community template volume creates discovery challenges; a curated, quality-over-quantity approach may resonate better.

---

*Full teardown report includes: screen-by-screen UX annotations, accessibility audit results, performance benchmarks, app store review sentiment analysis, and a 12-month feature trajectory comparison.*
