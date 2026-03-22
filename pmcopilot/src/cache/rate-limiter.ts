/**
 * Rate Limiter (PMC-060)
 *
 * Domain-aware rate limiting for web teardown crawling.
 * Enforces:
 *   - 2-second minimum delay between requests to the same domain
 *   - 50-page maximum per competitor per session
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimiterStats {
  /** Number of distinct domains tracked */
  trackedDomains: number;
  /** Requests issued per domain */
  requestsPerDomain: Record<string, number>;
  /** Domains that have hit the page limit */
  blockedDomains: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum milliseconds between requests to the same domain */
const MIN_DELAY_MS = 2_000;

/** Maximum pages per competitor (domain) per session */
const MAX_PAGES_PER_DOMAIN = 50;

// ---------------------------------------------------------------------------
// RateLimiter
// ---------------------------------------------------------------------------

export class RateLimiter {
  /** Timestamp of the last request per domain */
  private lastRequestTime: Map<string, number> = new Map();
  /** Request count per domain */
  private requestCount: Map<string, number> = new Map();

  /**
   * Check whether a request to the given domain is currently allowed.
   *
   * Returns `true` if:
   *   1. The domain has not exceeded the per-session page limit.
   *   2. At least 2 seconds have elapsed since the last request to the domain.
   */
  canRequest(domain: string): boolean {
    const count = this.requestCount.get(domain) ?? 0;
    if (count >= MAX_PAGES_PER_DOMAIN) {
      return false;
    }

    const lastTime = this.lastRequestTime.get(domain);
    if (lastTime === undefined) {
      return true;
    }

    const elapsed = Date.now() - lastTime;
    return elapsed >= MIN_DELAY_MS;
  }

  /**
   * Record that a request has been made to the given domain.
   * Should be called immediately after successfully issuing a request.
   */
  recordRequest(domain: string): void {
    this.lastRequestTime.set(domain, Date.now());
    const count = this.requestCount.get(domain) ?? 0;
    this.requestCount.set(domain, count + 1);
  }

  /**
   * Return the number of milliseconds the caller should wait before the next
   * request to the given domain is allowed.  Returns 0 if a request can be
   * made immediately, or -1 if the domain has hit the page limit.
   */
  waitTime(domain: string): number {
    const count = this.requestCount.get(domain) ?? 0;
    if (count >= MAX_PAGES_PER_DOMAIN) {
      return -1;
    }

    const lastTime = this.lastRequestTime.get(domain);
    if (lastTime === undefined) {
      return 0;
    }

    const elapsed = Date.now() - lastTime;
    if (elapsed >= MIN_DELAY_MS) {
      return 0;
    }

    return MIN_DELAY_MS - elapsed;
  }

  /**
   * Return summary statistics about the current session.
   */
  getStats(): RateLimiterStats {
    const requestsPerDomain: Record<string, number> = {};
    const blockedDomains: string[] = [];

    for (const [domain, count] of this.requestCount) {
      requestsPerDomain[domain] = count;
      if (count >= MAX_PAGES_PER_DOMAIN) {
        blockedDomains.push(domain);
      }
    }

    return {
      trackedDomains: this.requestCount.size,
      requestsPerDomain,
      blockedDomains,
    };
  }

  /**
   * Reset all tracking state. Useful when starting a new session.
   */
  reset(): void {
    this.lastRequestTime.clear();
    this.requestCount.clear();
  }
}
