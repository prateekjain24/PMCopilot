import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";

/**
 * Simple string hash (djb2 algorithm).
 * Deterministic and fast -- not cryptographic.
 */
function hashKey(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

interface CacheEntry<T = unknown> {
  data: T;
  createdAt: number; // epoch ms
}

function cacheFilePath(key: string): string {
  return join(config.cacheDir, `${key}.json`);
}

/**
 * Build a cache key from arbitrary request params.
 */
export function buildCacheKey(prefix: string, params: Record<string, unknown>): string {
  const raw = JSON.stringify(params, Object.keys(params).sort());
  return `${prefix}_${hashKey(raw)}`;
}

/**
 * Check whether a cached entry exists and is still within the TTL window.
 */
export function isValid(key: string): boolean {
  const filePath = cacheFilePath(key);
  if (!existsSync(filePath)) return false;

  try {
    const raw = readFileSync(filePath, "utf-8");
    const entry: CacheEntry = JSON.parse(raw);
    const ageMs = Date.now() - entry.createdAt;
    const ttlMs = config.cacheTtlHours * 60 * 60 * 1000;
    return ageMs < ttlMs;
  } catch {
    return false;
  }
}

/**
 * Retrieve cached data. Returns undefined when missing or expired.
 */
export function get<T = unknown>(key: string): T | undefined {
  if (!isValid(key)) return undefined;

  const filePath = cacheFilePath(key);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch {
    return undefined;
  }
}

/**
 * Persist data under the given key.
 */
export function set<T = unknown>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    createdAt: Date.now(),
  };
  writeFileSync(cacheFilePath(key), JSON.stringify(entry, null, 2), "utf-8");
}

/**
 * Remove all cached entries from the cache directory.
 */
export function clear(): void {
  const files = readdirSync(config.cacheDir);
  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        unlinkSync(join(config.cacheDir, file));
      } catch {
        // best-effort
      }
    }
  }
}
