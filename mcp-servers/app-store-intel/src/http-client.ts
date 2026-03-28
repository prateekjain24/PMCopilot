const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

// ---------- Per-host rate limiter ----------
// Apple's APIs throttle aggressively when hit in rapid succession.
// This ensures a minimum gap between requests to the same host.
const MIN_REQUEST_GAP_MS = 350; // milliseconds between requests to same host
const lastRequestTime = new Map<string, number>();

function getHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

async function throttle(url: string): Promise<void> {
  const host = getHost(url);
  const last = lastRequestTime.get(host) ?? 0;
  const elapsed = Date.now() - last;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    await sleep(MIN_REQUEST_GAP_MS - elapsed);
  }
  lastRequestTime.set(host, Date.now());
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "HttpError";
  }
}

/**
 * Fetch wrapper with retry, exponential backoff, and timeout.
 * Automatically retries on 429, 500, 502, 503, 504 responses.
 */
export async function fetchJson<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await throttle(url);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return (await response.json()) as T;
      }

      const body = await response.text();

      // Retry on rate-limit or server errors
      if ([429, 500, 502, 503, 504].includes(response.status)) {
        lastError = new HttpError(response.status, response.statusText, body);

        // Respect Retry-After header for 429s
        const retryAfter = response.headers.get("Retry-After");
        const backoffMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : INITIAL_BACKOFF_MS * Math.pow(2, attempt);

        await sleep(backoffMs);
        continue;
      }

      throw new HttpError(response.status, response.statusText, body);
    } catch (err) {
      if (err instanceof HttpError) throw err;

      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES - 1) {
        await sleep(INITIAL_BACKOFF_MS * Math.pow(2, attempt));
        continue;
      }
    }
  }

  throw lastError ?? new Error("All fetch retries exhausted");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
