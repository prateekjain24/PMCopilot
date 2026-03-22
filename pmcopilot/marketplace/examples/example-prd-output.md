# Example: PRD Output

Below is a sample of what `/pmcopilot:prd-generator "Mobile checkout redesign"` produces. Only key sections are shown for brevity.

---

## Product Requirements Document: Mobile Checkout Redesign

### Problem Statement

Our mobile checkout flow currently has a 68% cart abandonment rate, significantly above the industry average of 55%. User research shows that a multi-step form requiring 14 taps to complete purchase is the primary friction point. Reducing checkout steps from 5 to 2 could recover an estimated $2.4M in annual lost revenue.

### Goals and Success Metrics

| Metric | Current | Target | Measurement |
|---|---|---|---|
| Cart abandonment rate | 68% | 52% | Analytics (Amplitude) |
| Checkout completion time | 94s | 35s | Session recording |
| Payment error rate | 4.2% | 1.5% | Backend logs |
| Mobile conversion rate | 2.1% | 3.0% | Analytics (Amplitude) |

### User Stories

**As a returning customer**, I want to complete checkout with a single tap using my saved payment method, so that I do not have to re-enter my card details every time.

**As a first-time buyer**, I want to see a clear cost breakdown (subtotal, shipping, tax, total) on a single screen before confirming, so that I am not surprised by hidden fees.

**As a mobile user on a slow connection**, I want the checkout page to load in under 2 seconds with a minimal payload, so that I can complete my purchase without frustration.

### Technical Approach

- Implement a single-page checkout with collapsible sections (shipping, payment, review)
- Adopt Stripe Payment Element for PCI-compliant card capture with Apple Pay and Google Pay support
- Cache shipping address and payment tokens for returning users via encrypted local storage
- Use optimistic UI updates with server-side validation to reduce perceived latency

---

*Full PRD includes: scope and non-goals, detailed requirements, edge cases, rollout plan, risks, dependencies, and appendices.*
