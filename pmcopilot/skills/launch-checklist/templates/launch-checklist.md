# Launch Checklist

| Field                    | Value                              |
|--------------------------|------------------------------------|
| **Product**              | {{product_name}}                   |
| **Launch Type**          | {{hard / soft / beta}}             |
| **Target Date**          | {{target_launch_date}}             |
| **Overall Readiness**    | {{readiness_score}}% ({{x}}/{{y}} items complete) |

---

<!-- LAUNCH TYPE APPLICABILITY KEY
     [H] = Hard launch only
     [H][S] = Hard and Soft launch
     [H][S][B] = All launch types
     Items marked "Required" must be complete before launch. Items marked "Recommended" are strongly encouraged but will not block the launch.
-->

## 1. Engineering Readiness
<!-- Applies to: Hard, Soft, Beta -->
<!-- Progress: 0/5 complete -->

- [ ] **Feature complete and code merged** -- All feature branches merged to the release branch. No open PRs blocking launch.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **Dependencies resolved** -- All third-party services, APIs, and internal dependencies confirmed operational and version-compatible.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **Performance benchmarks met** -- Load testing complete. P95 latency, throughput, and error rate within acceptable thresholds.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Rollback plan documented** -- Step-by-step rollback procedure written, reviewed, and tested in staging.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Infrastructure scaled** -- Production infrastructure provisioned for expected launch traffic. Auto-scaling rules verified.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

---

## 2. QA
<!-- Applies to: Hard, Soft, Beta -->
<!-- Progress: 0/5 complete -->

- [ ] **Test plan executed** -- All test cases in the launch test plan have been run and results documented.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Regression suite green** -- Full regression suite passing on the release candidate build. No P0/P1 failures.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

- [ ] **Edge cases covered** -- Identified edge cases (empty states, error states, boundary inputs, concurrency) tested and verified.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Device and browser matrix validated** -- Tested across the target device/browser matrix. Issues documented with severity ratings.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

- [ ] **Known issues triaged** -- All known issues categorized by severity. P0 issues resolved. P1 issues have workarounds or are accepted risks.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 1 day}}
  - Status: not started

---

## 3. Design Sign-off
<!-- Applies to: Hard, Soft -->
<!-- Progress: 0/4 complete -->

- [ ] **Final designs approved** -- Design lead has signed off on all screens and flows in the release candidate.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **Pixel-level QA complete** -- Visual comparison between implemented UI and design specs completed. All discrepancies resolved or accepted.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Accessibility audit passed** -- WCAG 2.1 AA compliance verified. Screen reader, keyboard navigation, and color contrast tested.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Responsive and dark mode verified** -- All breakpoints and dark mode states reviewed. No layout breaks or unreadable text.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

---

## 4. Analytics
<!-- Applies to: Hard, Soft, Beta -->
<!-- Progress: 0/5 complete -->

- [ ] **Events instrumented** -- All launch-critical events are firing correctly in staging. Event names and properties match the tracking plan.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **Dashboards built** -- Launch dashboard with key metrics (adoption, activation, errors, performance) is live and pulling data correctly.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Success metrics defined** -- Clear success criteria documented: what metrics, what thresholds, measured over what time window.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **A/B test configuration** -- If applicable: experiment set up, audiences defined, holdout configured, statistical plan documented.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Data pipeline validated** -- End-to-end data flow verified from event emission through warehouse to dashboard. No dropped events.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

---

## 5. Marketing
<!-- Applies to: Hard only -->
<!-- Progress: 0/5 complete -->

- [ ] **Launch messaging finalized** -- Positioning, value props, and key messages approved by marketing and product leadership.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 7 days}}
  - Status: not started

- [ ] **Landing page live** -- Marketing landing page deployed, reviewed, and accessible at the target URL.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Campaigns scheduled** -- Email, social media, and paid campaigns scheduled with correct targeting and timing.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

- [ ] **Press and analyst briefings done** -- Embargo briefings completed. Press materials distributed. Analyst calls scheduled.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **App store listing updated** -- Screenshots, description, release notes, and metadata updated in App Store / Play Store.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

---

## 6. Support
<!-- Applies to: Hard, Soft -->
<!-- Progress: 0/4 complete -->

- [ ] **Help docs and FAQs published** -- User-facing documentation live in the help center. Covers new features, changed workflows, and known limitations.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Support team trained** -- Support agents have completed training on the new feature. Practice tickets resolved.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Escalation paths defined** -- Clear escalation matrix documented: who to page, when to escalate, SLAs for each severity level.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

- [ ] **Known-issue runbook ready** -- Runbook for anticipated issues: symptoms, diagnosis steps, workarounds, and fix timelines.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date - 1 day}}
  - Status: not started

---

## 7. Legal / Compliance
<!-- Applies to: Hard only -->
<!-- Progress: 0/4 complete -->

- [ ] **Privacy review complete** -- Data collection, storage, and processing reviewed against privacy policies and applicable regulations (GDPR, CCPA, etc.).
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 10 days}}
  - Status: not started

- [ ] **Terms of service updated** -- ToS and privacy policy reflect any changes introduced by this launch. Legal has signed off.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 7 days}}
  - Status: not started

- [ ] **Regulatory requirements met** -- All industry-specific regulatory requirements identified and satisfied (e.g., financial, healthcare, children's data).
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 7 days}}
  - Status: not started

- [ ] **Data processing agreements in place** -- DPAs signed with all third-party processors handling user data introduced by this feature.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 10 days}}
  - Status: not started

---

## 8. Rollout Plan
<!-- Applies to: Hard, Soft, Beta -->
<!-- Progress: 0/4 complete -->

- [ ] **Rollout stages defined** -- Percentage ramp or geographic sequence documented. Each stage has entry and exit criteria.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 5 days}}
  - Status: not started

- [ ] **Feature flags configured** -- Feature flags set up and tested. Kill switch verified in staging. Flag ownership assigned.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 3 days}}
  - Status: not started

- [ ] **Monitoring alerts set** -- Alerts configured for error rate spikes, latency degradation, and key business metric anomalies.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

- [ ] **Rollback criteria documented** -- Clear, measurable criteria that trigger an automatic rollback. On-call team briefed on the procedure.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 2 days}}
  - Status: not started

---

## 9. Post-Launch
<!-- Applies to: Hard, Soft -->
<!-- Progress: 0/5 complete -->

- [ ] **War room schedule set** -- War room staffed for the first {{N}} hours post-launch. Rotation and handoff plan documented.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 1 day}}
  - Status: not started

- [ ] **Monitoring rotation assigned** -- Named individuals assigned to monitor dashboards for Day 1, Day 2, and Day 3.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date - 1 day}}
  - Status: not started

- [ ] **Day 1/3/7 review cadence** -- Review meetings scheduled for Day 1, Day 3, and Day 7 post-launch with clear agendas.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date}}
  - Status: not started

- [ ] **Retrospective scheduled** -- Post-launch retro scheduled within 2 weeks of launch. All key stakeholders invited.
  - Priority: Recommended
  - Owner: {{owner}}
  - Due: {{target_date + 3 days}}
  - Status: not started

- [ ] **Success criteria evaluation date set** -- Date identified for formal go/no-go assessment against the success metrics defined in Analytics.
  - Priority: Required
  - Owner: {{owner}}
  - Due: {{target_date + 7 days}}
  - Status: not started
