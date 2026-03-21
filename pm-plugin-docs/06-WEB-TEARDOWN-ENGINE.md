# 06 - Web Teardown Engine

The Web Teardown Engine uses Chrome browser automation to conduct systematic competitive research on competitor websites -- extracting pricing, features, UX patterns, technical stack, and content strategy.

---

## Architecture

```
/pmcopilot:competitive-teardown "notion.so, linear.app, asana.com"
         |
         v
+------------------+
| research-        |
| synthesizer      |
+--------+---------+
         |
   +-----+-----+-----+
   |           |       |
   v           v       v
+--------+ +--------+ +--------+
|web-tear| |web-tear| |web-tear|
|down    | |down    | |down    |
|agent   | |agent   | |agent   |
|(notion)| |(linear)| |(asana) |
+---+----+ +---+----+ +---+----+
    |          |           |
    v          v           v
  Chrome     Chrome      Chrome
  (Playwright / Claude in Chrome)
```

---

## Browser Automation Options

### Option 1: Claude in Chrome MCP (Preferred for PMCopilot)

Already connected in your setup. Uses `mcp__Claude_in_Chrome__*` namespaced tools:

| MCP Tool Name | Description |
|------|------------|
| `mcp__Claude_in_Chrome__navigate` | Go to a URL |
| `mcp__Claude_in_Chrome__read_page` | Read visible page content with element references |
| `mcp__Claude_in_Chrome__get_page_text` | Extract all text from the page |
| `mcp__Claude_in_Chrome__computer` | Click, type, scroll, screenshot (computer-use style) |
| `mcp__Claude_in_Chrome__form_input` | Fill form fields |
| `mcp__Claude_in_Chrome__find` | Search for text on page |
| `mcp__Claude_in_Chrome__javascript_tool` | Execute arbitrary JS for data extraction |
| `mcp__Claude_in_Chrome__gif_creator` | Create GIF recordings of interactions |
| `mcp__Claude_in_Chrome__upload_image` | Upload screenshots for analysis |
| `mcp__Claude_in_Chrome__read_console_messages` | Read browser console output |
| `mcp__Claude_in_Chrome__read_network_requests` | Inspect network traffic |
| `mcp__Claude_in_Chrome__tabs_create_mcp` | Open new tabs |
| `mcp__Claude_in_Chrome__tabs_close_mcp` | Close tabs |
| `mcp__Claude_in_Chrome__tabs_context_mcp` | Get context of all tabs |
| `mcp__Claude_in_Chrome__resize_window` | Resize for responsive testing |

**Advantages**:
- Native integration with Claude Code
- Visual understanding (Claude sees the page)
- No additional setup required
- Supports complex interactions
- `read_network_requests` can reveal API endpoints competitors use

### Option 2: Control Chrome MCP (Simpler alternative)

Also already connected. Uses `mcp__Control_Chrome__*` tools:

| MCP Tool Name | Description |
|------|------------|
| `mcp__Control_Chrome__open_url` | Navigate to URL |
| `mcp__Control_Chrome__get_page_content` | Extract page HTML/text |
| `mcp__Control_Chrome__execute_javascript` | Run JS on page |
| `mcp__Control_Chrome__list_tabs` | List open tabs |
| `mcp__Control_Chrome__switch_to_tab` | Switch between tabs |
| `mcp__Control_Chrome__go_back` / `go_forward` | Navigation |
| `mcp__Control_Chrome__close_tab` | Close tab |
| `mcp__Control_Chrome__reload_tab` | Reload current page |

**Advantages**:
- Simpler API surface
- Good for pure data extraction (no visual needed)
- Can run multiple tabs for parallel competitor crawling

---

## Teardown Methodology

### Phase 1: Homepage and Value Proposition

**What to capture**:
- Full-page screenshot (above and below the fold)
- Hero headline and subheadline text
- Primary CTA text and placement
- Navigation menu structure
- Social proof elements (logos, stats, testimonials)
- Footer links (reveals product ecosystem)

**Extraction script** (via `javascript_tool`):
```javascript
// Extract key homepage elements
const data = {
  title: document.title,
  metaDescription: document.querySelector('meta[name="description"]')?.content,
  ogTitle: document.querySelector('meta[property="og:title"]')?.content,
  h1: document.querySelector('h1')?.textContent?.trim(),
  h2s: [...document.querySelectorAll('h2')].map(h => h.textContent.trim()),
  ctaButtons: [...document.querySelectorAll('a[href*="signup"], a[href*="start"], button')]
    .map(b => ({ text: b.textContent.trim(), href: b.href })),
  navLinks: [...document.querySelectorAll('nav a')]
    .map(a => ({ text: a.textContent.trim(), href: a.href }))
};
JSON.stringify(data, null, 2);
```

---

### Phase 2: Pricing Page Analysis

**What to capture**:
- Full pricing page screenshot
- Each pricing tier: name, price, feature list
- Toggle state: monthly vs annual pricing
- Enterprise / custom pricing CTA
- FAQ section (reveals objection handling)

**Extraction approach**:
1. Navigate to pricing page (usually `/pricing` or linked from nav)
2. Screenshot in both monthly and annual toggle states
3. Extract structured pricing data via JS
4. Capture any comparison tables

**Structured output format**:
```json
{
  "pricing_url": "https://notion.so/pricing",
  "currency": "USD",
  "billing_options": ["monthly", "annual"],
  "annual_discount_pct": 20,
  "tiers": [
    {
      "name": "Free",
      "monthly_price": 0,
      "annual_price": 0,
      "features": ["Unlimited pages", "Share with 5 guests", "7 day page history"],
      "cta": "Get started",
      "highlighted": false
    },
    {
      "name": "Plus",
      "monthly_price": 10,
      "annual_price": 8,
      "per": "user/month",
      "features": ["Everything in Free", "Unlimited file uploads", "30 day page history"],
      "cta": "Start free trial",
      "highlighted": true
    }
  ],
  "enterprise_cta": true,
  "free_trial_days": 14
}
```

---

### Phase 3: Feature Pages

**What to capture per feature page**:
- Feature name and description
- Key benefits (usually 3-4 bullet points)
- Screenshot or demo video URL
- Integration mentions
- Use case examples
- CTA on the feature page

**Crawl strategy**:
1. Extract all links from main navigation under "Product" or "Features"
2. Visit each feature page
3. Extract structured data
4. Screenshot each page

---

### Phase 4: Sign-up and Onboarding Flow

**What to capture**:
- Number of steps in sign-up flow
- Required fields at each step
- Social login options (Google, GitHub, SSO)
- Email verification requirements
- Onboarding questionnaire (if any)
- First-run experience / empty states
- Time to first value (how quickly can user do something useful?)

**Process**:
1. Click "Sign Up" or "Get Started" CTA
2. Screenshot each step
3. Note but do NOT complete payment flows
4. Document progressive disclosure patterns

---

### Phase 5: Technical Analysis

**Performance metrics** (via Lighthouse-style checks):
```javascript
// Basic performance metrics
const perf = performance.getEntriesByType('navigation')[0];
const data = {
  dns_lookup_ms: perf.domainLookupEnd - perf.domainLookupStart,
  tcp_connect_ms: perf.connectEnd - perf.connectStart,
  ttfb_ms: perf.responseStart - perf.requestStart,
  dom_load_ms: perf.domContentLoadedEventEnd - perf.navigationStart,
  full_load_ms: perf.loadEventEnd - perf.navigationStart,
  transfer_size_kb: perf.transferSize / 1024
};
JSON.stringify(data, null, 2);
```

**Tech stack detection**:
```javascript
const techStack = {
  framework: {
    react: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
    vue: !!window.__VUE__,
    angular: !!window.ng,
    nextjs: !!window.__NEXT_DATA__,
    nuxt: !!window.__NUXT__
  },
  analytics: {
    ga4: !!window.gtag,
    segment: !!window.analytics,
    amplitude: !!window.amplitude,
    mixpanel: !!window.mixpanel,
    hotjar: !!window.hj,
    fullstory: !!window.FS
  },
  chat: {
    intercom: !!window.Intercom,
    zendesk: !!window.zE,
    drift: !!window.drift,
    crisp: !!window.$crisp
  },
  featureFlags: {
    launchdarkly: !!window.LDClient,
    optimizely: !!window.optimizely,
    statsig: !!window.statsig
  }
};
JSON.stringify(techStack, null, 2);
```

**SEO metadata**:
```javascript
const seo = {
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  robots: document.querySelector('meta[name="robots"]')?.content,
  og: {
    title: document.querySelector('meta[property="og:title"]')?.content,
    description: document.querySelector('meta[property="og:description"]')?.content,
    image: document.querySelector('meta[property="og:image"]')?.content,
    type: document.querySelector('meta[property="og:type"]')?.content
  },
  twitter: {
    card: document.querySelector('meta[name="twitter:card"]')?.content,
    site: document.querySelector('meta[name="twitter:site"]')?.content
  },
  structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => JSON.parse(s.textContent))
};
JSON.stringify(seo, null, 2);
```

---

### Phase 6: Content Strategy

**What to analyze**:
- Blog: publishing cadence, topic themes, author diversity
- Resources: whitepapers, templates, webinars, case studies
- Documentation: quality, comprehensiveness, developer focus
- Community: forum, Slack/Discord, social media presence
- Changelog: update frequency, communication style

**Crawl the blog**:
1. Navigate to `/blog` or resources page
2. Extract recent 20 posts: title, date, category, author
3. Analyze publishing frequency
4. Identify content themes
5. Note gating strategy (ungated vs email-gated)

---

## Output Format

The web-teardown agent produces a structured report:

```markdown
# Web Teardown: [Competitor Name]

## Company Overview
- URL: https://...
- Founded: YYYY
- Category: [SaaS / Marketplace / Platform]
- Target audience: [based on messaging analysis]

## Homepage Analysis
- Value proposition: "..."
- Primary CTA: "..." (links to /signup)
- Social proof: X customers, Y logos displayed
- [Screenshot: homepage_full.png]

## Pricing
| Tier | Monthly | Annual | Key Features |
|------|---------|--------|-------------|
| Free | $0 | $0 | ... |
| Pro | $X | $Y | ... |
| Team | $X | $Y | ... |
| Enterprise | Custom | Custom | ... |

- Annual discount: X%
- Free trial: X days
- [Screenshot: pricing_page.png]

## Features Inventory
| Feature | Available | Tier | Notes |
|---------|-----------|------|-------|
| Feature 1 | Yes | Pro+ | ... |
| Feature 2 | Yes | All | ... |

## Sign-up Flow
- Steps: X
- Required: email, password
- Social: Google, GitHub
- Time to value: ~X minutes
- [Screenshots: signup_step1.png, signup_step2.png, ...]

## Technical Profile
- Framework: Next.js / React
- Analytics: Segment + Amplitude
- Chat: Intercom
- CDN: Cloudflare
- Performance: TTFB Xms, Full load Xs

## Content Strategy
- Blog cadence: X posts/month
- Top themes: ...
- Resources: X whitepapers, Y templates
- Community: Slack (X members)

## Strategic Takeaways
1. ...
2. ...
3. ...
```

---

## Multi-Competitor Comparison

When analyzing multiple competitors, the web-teardown produces a comparison matrix:

```markdown
## Feature Comparison Matrix

| Feature | Notion | Linear | Asana | Our Product |
|---------|--------|--------|-------|-------------|
| Pricing (Pro) | $10/user/mo | $8/user/mo | $13.49/user/mo | ? |
| Free tier | Yes (limited) | Yes (limited) | Yes (limited) | ? |
| API | Yes | Yes | Yes | ? |
| Integrations | 100+ | 50+ | 200+ | ? |
| Mobile app | Yes | Yes | Yes | ? |
| Offline | Limited | No | No | ? |

## Positioning Map

                    Enterprise-grade
                         |
            Asana -------+------- Notion
                         |
          Simple --------+---------- Complex
                         |
            Linear ------+
                         |
                    Consumer-grade
```

---

## Caching and Rate Limiting

**Cache strategy**:
- HTML snapshots cached for 7 days (configurable)
- Screenshots cached indefinitely (competitor sites change slowly)
- Pricing data refreshed weekly
- Blog data refreshed daily

**Rate limiting**:
- 2-second delay between page navigations (be a good citizen)
- Maximum 50 pages per competitor per session
- Respect robots.txt for public pages
- No authenticated/private area access without explicit permission

---

## Use Cases Beyond Competitive Analysis

The web teardown engine can also be used for:

1. **Landing page review** -- analyze your own landing pages for improvement
2. **Design inspiration** -- collect UX patterns from best-in-class products
3. **Market research** -- survey pricing across an entire category
4. **Partnership research** -- analyze potential partner/integration products
5. **Due diligence** -- evaluate acquisition targets' product maturity
