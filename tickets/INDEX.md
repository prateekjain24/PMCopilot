# PMCopilot Implementation Tickets

## Summary

| Metric | Count |
|--------|-------|
| **Total tickets** | 105 |
| **Phase 0 - Foundation** | 7 |
| **Phase 1 - Core Skills** | 28 |
| **Phase 2 - Tool Integrations** | 17 |
| **Phase 3 - Web Teardown Engine** | 10 |
| **Phase 4 - App Teardown Engine** | 31 |
| **Phase 5 - Polish and Distribution** | 12 |

### By Type

| Type | Count |
|------|-------|
| infra | 8 |
| config | 4 |
| skill | 14 |
| agent | 7 |
| template | 15 |
| reference | 4 |
| integration | 14 |
| mcp | 5 |
| tool | 22 |
| script | 5 |
| hook | 4 |
| docs | 4 |
| test | 2 |
| orchestration | 1 |

---

## Phase 0 - Foundation

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-001 | Create plugin manifest | infra | -- | done |
| PMC-002 | Create MCP server config | config | -- | done |
| PMC-003 | Create settings.json defaults | config | -- | done |
| PMC-004 | Create hooks.json skeleton | config | -- | done |
| PMC-005 | Create directory scaffold | infra | -- | done |
| PMC-006 | Write PRD skill | skill | -- | done |
| PMC-007 | Write prd-writer agent | agent | -- | done |

---

## Phase 1 - Core Skills

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-008 | Create Google PRD template | template | PMC-006 | done |
| PMC-009 | Create Amazon PRFAQ template | template | PMC-006 | done |
| PMC-010 | Create Stripe PRD template | template | PMC-006 | done |
| PMC-011 | Write prioritize skill | skill | -- | done |
| PMC-012 | Create RICE framework reference | reference | PMC-011 | done |
| PMC-013 | Create ICE framework reference | reference | PMC-011 | done |
| PMC-014 | Create Kano framework reference | reference | PMC-011 | done |
| PMC-015 | Create MoSCoW framework reference | reference | PMC-011 | done |
| PMC-016 | Write roadmap skill | skill | -- | done |
| PMC-017 | Create Now/Next/Later template | template | PMC-016 | done |
| PMC-018 | Create outcome-based roadmap template | template | PMC-016 | done |
| PMC-019 | Write experiment-design skill | skill | -- | done |
| PMC-020 | Create A/B test plan template | template | PMC-019 | done |
| PMC-021 | Write user-research skill | skill | -- | done |
| PMC-022 | Create persona template | template | PMC-021 | done |
| PMC-023 | Create interview guide template | template | PMC-021 | done |
| PMC-024 | Create JTBD canvas template | template | PMC-021 | done |
| PMC-025 | Write stakeholder-update skill | skill | -- | done |
| PMC-026 | Create weekly update template | template | PMC-025 | todo |
| PMC-027 | Create executive summary template | template | PMC-025 | todo |
| PMC-028 | Write launch-checklist skill | skill | -- | todo |
| PMC-029 | Create launch checklist template | template | PMC-028 | todo |
| PMC-030 | Write market-sizing skill | skill | -- | todo |
| PMC-031 | Create TAM/SAM/SOM template | template | PMC-030 | todo |
| PMC-032 | Write sprint-review skill | skill | -- | todo |
| PMC-033 | Write app-store-intel skill | skill | -- | todo |
| PMC-034 | Write metrics-review skill | skill | -- | todo |
| PMC-035 | Write competitive-teardown skill | skill | -- | todo |

---

## Phase 2 - Tool Integrations

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-036 | Write sprint-analyst agent | agent | PMC-032 | todo |
| PMC-037 | Write data-analyst agent | agent | PMC-034 | todo |
| PMC-038 | Write research-synthesizer agent | agent | PMC-021 | todo |
| PMC-039 | Wire Jira into sprint-review | integration | PMC-032 | todo |
| PMC-040 | Wire Jira into prioritize | integration | PMC-011 | todo |
| PMC-041 | Wire Jira/Confluence into PRD | integration | PMC-006 | todo |
| PMC-042 | Wire Slack into stakeholder-update | integration | PMC-025 | todo |
| PMC-043 | Wire Slack into research-synthesizer | integration | PMC-038 | todo |
| PMC-044 | Wire Granola into user-research | integration | PMC-021 | todo |
| PMC-045 | Wire Gmail into stakeholder-update | integration | PMC-025 | todo |
| PMC-046 | Wire GCal into sprint-review | integration | PMC-032 | todo |
| PMC-047 | Add Amplitude MCP config | config | PMC-002 | todo |
| PMC-048 | Add Mixpanel MCP config | mcp | PMC-002 | todo |
| PMC-049 | Add Figma MCP config | mcp | PMC-002 | todo |
| PMC-050 | Wire analytics into metrics-review | integration | PMC-034, PMC-047, PMC-048 | todo |
| PMC-051 | Wire Figma into ux-reviewer/PRD | integration | PMC-049, PMC-006 | todo |
| PMC-052 | Integrate multi-source sprint review | integration | PMC-039, PMC-046, PMC-036 | todo |

---

## Phase 3 - Web Teardown Engine

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-053 | Write web-teardown agent | agent | PMC-035 | todo |
| PMC-054 | Create homepage extraction script | script | PMC-053 | todo |
| PMC-055 | Create pricing extraction script | script | PMC-053 | todo |
| PMC-056 | Create SEO extraction script | script | PMC-053 | todo |
| PMC-057 | Create tech stack detection script | script | PMC-053 | todo |
| PMC-058 | Create teardown report template | template | PMC-053 | todo |
| PMC-059 | Create feature matrix template | template | PMC-053 | todo |
| PMC-060 | Set up competitive intel cache | infra | PMC-053 | todo |
| PMC-061 | Integrate web research into market-sizing | integration | PMC-030, PMC-053 | todo |
| PMC-062 | Build multi-competitor comparison | integration | PMC-053, PMC-058 | todo |

---

## Phase 4 - App Teardown Engine

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-063 | Scaffold pm-frameworks MCP server | mcp | PMC-002 | todo |
| PMC-064 | Implement RICE score tools | tool | PMC-063 | todo |
| PMC-065 | Implement ICE score tool | tool | PMC-063 | todo |
| PMC-066 | Implement Kano classify tools | tool | PMC-063 | todo |
| PMC-067 | Implement MoSCoW sort tool | tool | PMC-063 | todo |
| PMC-068 | Implement TAM/SAM/SOM tool | tool | PMC-063 | todo |
| PMC-069 | Implement weighted score tool | tool | PMC-063 | todo |
| PMC-070 | Implement opportunity score tool | tool | PMC-063 | todo |
| PMC-071 | Implement cost of delay tool | tool | PMC-063 | todo |
| PMC-072 | Implement sample size calculator | tool | PMC-063 | todo |
| PMC-073 | Implement significance test tool | tool | PMC-063 | todo |
| PMC-074 | Scaffold simulator-bridge MCP server | mcp | PMC-002 | todo |
| PMC-075 | Implement simulator device management tools | tool | PMC-074 | todo |
| PMC-076 | Implement simulator app management tools | tool | PMC-074 | todo |
| PMC-077 | Implement simulator screenshot/video tools | tool | PMC-074 | todo |
| PMC-078 | Implement simulator input tools | tool | PMC-074 | todo |
| PMC-079 | Implement simulator accessibility tools | tool | PMC-074 | todo |
| PMC-080 | Scaffold emulator-bridge MCP server | mcp | PMC-002 | todo |
| PMC-081 | Implement emulator device management tools | tool | PMC-080 | todo |
| PMC-082 | Implement emulator app management tools | tool | PMC-080 | todo |
| PMC-083 | Implement emulator screenshot/video tools | tool | PMC-080 | todo |
| PMC-084 | Implement emulator input tools | tool | PMC-080 | todo |
| PMC-085 | Implement emulator UI dump tools | tool | PMC-080 | todo |
| PMC-086 | Scaffold app-store-intel MCP server | infra | PMC-002 | todo |
| PMC-087 | Implement app store search tools | tool | PMC-086 | todo |
| PMC-088 | Implement app store details tools | tool | PMC-086 | todo |
| PMC-089 | Implement app store reviews tools | tool | PMC-086 | todo |
| PMC-090 | Implement app store rankings tools | tool | PMC-086 | todo |
| PMC-091 | Write app-teardown agent | agent | PMC-074, PMC-080, PMC-086 | todo |
| PMC-092 | Write ux-reviewer agent | agent | PMC-074, PMC-080 | todo |
| PMC-093 | Wire competitive-teardown orchestration | orchestration | PMC-053, PMC-091, PMC-035 | todo |

---

## Phase 5 - Polish and Distribution

| ID | Title | Type | Dependencies | Status |
|----|-------|------|--------------|--------|
| PMC-094 | Enable agent memory config | infra | PMC-007, PMC-036, PMC-091 | todo |
| PMC-095 | Create PRD validation hook | hook | PMC-004 | todo |
| PMC-096 | Create simulator health check hook | hook | PMC-004, PMC-074, PMC-080 | todo |
| PMC-097 | Create auto-screenshot hook | hook | PMC-004, PMC-074, PMC-080 | todo |
| PMC-098 | Create teardown results hook | hook | PMC-004, PMC-091, PMC-053 | todo |
| PMC-099 | Add graceful degradation | infra | PMC-006, PMC-011, PMC-032, PMC-035 | todo |
| PMC-100 | Write README | docs | PMC-001 | todo |
| PMC-101 | Write integration setup guide | docs | PMC-047, PMC-048, PMC-049 | todo |
| PMC-102 | Write troubleshooting guide | docs | PMC-074, PMC-080 | todo |
| PMC-103 | Write pm-frameworks unit tests | test | PMC-064, PMC-065, PMC-066, PMC-067, PMC-068, PMC-069, PMC-070, PMC-071, PMC-072, PMC-073 | todo |
| PMC-104 | Write simulator/emulator integration tests | test | PMC-075, PMC-076, PMC-077, PMC-078, PMC-079, PMC-081, PMC-082, PMC-083, PMC-084, PMC-085 | todo |
| PMC-105 | Prepare marketplace listing | docs | PMC-001, PMC-100 | todo |
