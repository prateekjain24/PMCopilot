/**
 * Robots.txt Parser (PMC-060)
 *
 * Parses and caches robots.txt rules per domain to ensure web teardown
 * crawling respects site policies.
 *
 * Supported directives: User-agent, Allow, Disallow, Crawl-delay.
 * Defaults to "allowed" when robots.txt is missing or unparseable.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RobotsRule {
  type: "allow" | "disallow";
  path: string;
}

interface RobotsGroup {
  userAgents: string[];
  rules: RobotsRule[];
  crawlDelay: number | null;
}

interface ParsedRobots {
  groups: RobotsGroup[];
  fetchedAt: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Cache parsed robots.txt for 7 days */
const ROBOTS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_USER_AGENT = "*";

// ---------------------------------------------------------------------------
// RobotsParser
// ---------------------------------------------------------------------------

export class RobotsParser {
  /** Cached parsed robots per domain */
  private cache: Map<string, ParsedRobots> = new Map();

  /**
   * Fetch and parse robots.txt for the given domain.
   * On failure (404, network error, etc.) the domain is marked as
   * fully allowed.
   */
  async fetch(domain: string): Promise<void> {
    const url = `https://${domain}/robots.txt`;

    try {
      const response = await globalThis.fetch(url, {
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        // Treat missing or error responses as "allow everything"
        this.cache.set(domain, { groups: [], fetchedAt: Date.now() });
        return;
      }

      const text = await response.text();
      const groups = this.parse(text);
      this.cache.set(domain, { groups, fetchedAt: Date.now() });
    } catch {
      // Network failure -- default to allowed
      this.cache.set(domain, { groups: [], fetchedAt: Date.now() });
    }
  }

  /**
   * Check whether the given URL is allowed for crawling.
   *
   * If robots.txt has not been fetched for the domain, returns `true`
   * (default allow). Call `fetch(domain)` first for accurate results.
   */
  isAllowed(url: string, userAgent?: string): boolean {
    const domain = this.extractDomain(url);
    const parsed = this.cache.get(domain);

    // No data available -- default to allowed
    if (!parsed) return true;

    // Check if cache has expired
    if (Date.now() - parsed.fetchedAt > ROBOTS_TTL_MS) {
      this.cache.delete(domain);
      return true;
    }

    // No rules at all -- everything is allowed
    if (parsed.groups.length === 0) return true;

    const pathname = this.extractPath(url);
    const agent = (userAgent ?? DEFAULT_USER_AGENT).toLowerCase();

    // Find the most specific matching group
    const matchingGroup = this.findMatchingGroup(parsed.groups, agent);
    if (!matchingGroup) return true;

    return this.evaluateRules(matchingGroup.rules, pathname);
  }

  /**
   * Get the crawl delay (in seconds) for a domain, if specified.
   * Returns null if no crawl-delay directive exists.
   */
  getCrawlDelay(domain: string, userAgent?: string): number | null {
    const parsed = this.cache.get(domain);
    if (!parsed) return null;

    const agent = (userAgent ?? DEFAULT_USER_AGENT).toLowerCase();
    const group = this.findMatchingGroup(parsed.groups, agent);
    return group?.crawlDelay ?? null;
  }

  // -------------------------------------------------------------------------
  // Parsing
  // -------------------------------------------------------------------------

  private parse(text: string): RobotsGroup[] {
    const groups: RobotsGroup[] = [];
    let currentGroup: RobotsGroup | null = null;

    const lines = text.split(/\r?\n/);

    for (const rawLine of lines) {
      // Strip comments and trim
      const line = rawLine.replace(/#.*$/, "").trim();
      if (line === "") continue;

      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;

      const directive = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim();

      switch (directive) {
        case "user-agent": {
          if (
            currentGroup &&
            currentGroup.rules.length === 0 &&
            currentGroup.crawlDelay === null
          ) {
            // Still collecting user-agents for the same group
            currentGroup.userAgents.push(value.toLowerCase());
          } else {
            // Start a new group
            currentGroup = {
              userAgents: [value.toLowerCase()],
              rules: [],
              crawlDelay: null,
            };
            groups.push(currentGroup);
          }
          break;
        }

        case "allow": {
          if (!currentGroup) {
            currentGroup = {
              userAgents: ["*"],
              rules: [],
              crawlDelay: null,
            };
            groups.push(currentGroup);
          }
          currentGroup.rules.push({ type: "allow", path: value });
          break;
        }

        case "disallow": {
          if (!currentGroup) {
            currentGroup = {
              userAgents: ["*"],
              rules: [],
              crawlDelay: null,
            };
            groups.push(currentGroup);
          }
          if (value === "") {
            // Empty Disallow means allow everything
            currentGroup.rules.push({ type: "allow", path: "/" });
          } else {
            currentGroup.rules.push({ type: "disallow", path: value });
          }
          break;
        }

        case "crawl-delay": {
          const delay = parseFloat(value);
          if (!isNaN(delay) && currentGroup) {
            currentGroup.crawlDelay = delay;
          }
          break;
        }

        default:
          // Ignore unknown directives (Sitemap, Host, etc.)
          break;
      }
    }

    return groups;
  }

  // -------------------------------------------------------------------------
  // Rule evaluation
  // -------------------------------------------------------------------------

  private findMatchingGroup(
    groups: RobotsGroup[],
    userAgent: string
  ): RobotsGroup | null {
    // First, try to find a group with a specific user-agent match
    for (const group of groups) {
      if (group.userAgents.some((ua) => ua === userAgent)) {
        return group;
      }
    }

    // Fall back to the wildcard group
    for (const group of groups) {
      if (group.userAgents.includes("*")) {
        return group;
      }
    }

    return null;
  }

  private evaluateRules(rules: RobotsRule[], pathname: string): boolean {
    // Find the longest matching rule -- that takes precedence
    let bestMatch: RobotsRule | null = null;
    let bestLength = -1;

    for (const rule of rules) {
      if (this.pathMatches(pathname, rule.path)) {
        if (rule.path.length > bestLength) {
          bestLength = rule.path.length;
          bestMatch = rule;
        }
      }
    }

    if (!bestMatch) return true; // No matching rule -- allowed

    return bestMatch.type === "allow";
  }

  /**
   * Simple path prefix matching. Supports trailing wildcards (*) and
   * end-of-path anchors ($).
   */
  private pathMatches(pathname: string, pattern: string): boolean {
    // Handle end-of-path anchor
    if (pattern.endsWith("$")) {
      const prefix = pattern.slice(0, -1);
      return pathname === prefix;
    }

    // Handle wildcards by converting to regex-safe prefix match
    if (pattern.includes("*")) {
      const regexStr = pattern
        .split("*")
        .map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*");
      try {
        return new RegExp(`^${regexStr}`).test(pathname);
      } catch {
        return pathname.startsWith(pattern.replace(/\*/g, ""));
      }
    }

    // Simple prefix match
    return pathname.startsWith(pattern);
  }

  // -------------------------------------------------------------------------
  // URL helpers
  // -------------------------------------------------------------------------

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      // If URL parsing fails, try a basic extraction
      const match = url.match(/^(?:https?:\/\/)?([^/]+)/);
      return match?.[1] ?? url;
    }
  }

  private extractPath(url: string): string {
    try {
      return new URL(url).pathname;
    } catch {
      const match = url.match(/^(?:https?:\/\/)?[^/]+(\/.*)/);
      return match?.[1] ?? "/";
    }
  }
}
