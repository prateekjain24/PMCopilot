/**
 * Competitive Cache Manager (PMC-060)
 *
 * Manages cached competitive intelligence data with type-aware TTL policies.
 * Cache structure on disk:
 *
 *   <cacheRoot>/
 *     html/           -- cached HTML pages (7-day TTL)
 *     screenshots/    -- captured screenshots (never expire)
 *     pricing/        -- pricing snapshots (7-day TTL)
 *     blog/           -- blog/content scrapes (1-day TTL)
 *     metadata.json   -- index of all cache entries
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CacheType = "html" | "screenshots" | "pricing" | "blog";

export interface CacheEntry {
  key: string;
  type: CacheType;
  timestamp: number;
  ttl: number;
  filePath: string;
  size: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSizeBytes: number;
  entriesByType: Record<CacheType, number>;
  expiredEntries: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** TTL policies in milliseconds */
const TTL_POLICIES: Record<CacheType, number> = {
  html: 7 * 24 * 60 * 60 * 1000, // 7 days
  screenshots: Infinity, // never expire
  pricing: 7 * 24 * 60 * 60 * 1000, // 7 days
  blog: 1 * 24 * 60 * 60 * 1000, // 1 day
};

const CACHE_DIRS: CacheType[] = ["html", "screenshots", "pricing", "blog"];
const METADATA_FILE = "metadata.json";

// ---------------------------------------------------------------------------
// CacheManager
// ---------------------------------------------------------------------------

export class CacheManager {
  private cacheRoot: string;
  private entries: Map<string, CacheEntry> = new Map();
  private initialized = false;

  constructor(cacheRoot: string) {
    this.cacheRoot = cacheRoot;
  }

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------

  /**
   * Ensures cache directories exist and loads the metadata index.
   * Called lazily on first operation.
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    // Create directory structure
    for (const dir of CACHE_DIRS) {
      await fs.mkdir(path.join(this.cacheRoot, dir), { recursive: true });
    }

    // Load existing metadata
    await this.loadMetadata();
    this.initialized = true;
  }

  private async loadMetadata(): Promise<void> {
    const metaPath = path.join(this.cacheRoot, METADATA_FILE);
    try {
      const raw = await fs.readFile(metaPath, "utf-8");
      const parsed: CacheEntry[] = JSON.parse(raw);
      this.entries.clear();
      for (const entry of parsed) {
        this.entries.set(this.compositeKey(entry.key, entry.type), entry);
      }
    } catch {
      // Metadata file does not exist or is corrupt -- start fresh
      this.entries.clear();
    }
  }

  private async saveMetadata(): Promise<void> {
    const metaPath = path.join(this.cacheRoot, METADATA_FILE);
    const entries = Array.from(this.entries.values());
    try {
      await fs.writeFile(metaPath, JSON.stringify(entries, null, 2), "utf-8");
    } catch (err) {
      console.error("CacheManager: failed to persist metadata", err);
    }
  }

  // -------------------------------------------------------------------------
  // Key helpers
  // -------------------------------------------------------------------------

  private compositeKey(key: string, type: CacheType): string {
    return `${type}::${key}`;
  }

  /** Deterministic, filesystem-safe filename derived from the cache key */
  private fileNameForKey(key: string): string {
    const hash = crypto.createHash("sha256").update(key).digest("hex");
    return hash.slice(0, 16);
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Retrieve cached data. Returns null if the entry does not exist or is
   * expired.
   */
  async get(key: string, type: CacheType): Promise<Buffer | null> {
    await this.ensureInitialized();

    if (!this.isValid(key, type)) {
      return null;
    }

    const entry = this.entries.get(this.compositeKey(key, type));
    if (!entry) return null;

    try {
      return await fs.readFile(entry.filePath);
    } catch {
      // File was deleted externally -- clean up the index entry
      this.entries.delete(this.compositeKey(key, type));
      await this.saveMetadata();
      return null;
    }
  }

  /**
   * Store data in the cache. Overwrites any existing entry with the same
   * key and type.
   */
  async set(
    key: string,
    type: CacheType,
    data: Buffer | string
  ): Promise<void> {
    await this.ensureInitialized();

    const fileName = this.fileNameForKey(key);
    const filePath = path.join(this.cacheRoot, type, fileName);

    try {
      const buf = typeof data === "string" ? Buffer.from(data, "utf-8") : data;
      await fs.writeFile(filePath, buf);

      const entry: CacheEntry = {
        key,
        type,
        timestamp: Date.now(),
        ttl: TTL_POLICIES[type],
        filePath,
        size: buf.length,
      };

      this.entries.set(this.compositeKey(key, type), entry);
      await this.saveMetadata();
    } catch (err) {
      console.error(`CacheManager: failed to write cache entry [${type}/${key}]`, err);
    }
  }

  /**
   * Check whether a cached entry exists and has not expired.
   */
  isValid(key: string, type: CacheType): boolean {
    const entry = this.entries.get(this.compositeKey(key, type));
    if (!entry) return false;

    // Screenshots never expire
    if (entry.ttl === Infinity) return true;

    const age = Date.now() - entry.timestamp;
    return age < entry.ttl;
  }

  /**
   * Remove a specific cache entry.
   */
  async invalidate(key: string, type: CacheType): Promise<void> {
    await this.ensureInitialized();

    const cKey = this.compositeKey(key, type);
    const entry = this.entries.get(cKey);
    if (!entry) return;

    try {
      await fs.unlink(entry.filePath);
    } catch {
      // File may already be gone -- that is fine
    }

    this.entries.delete(cKey);
    await this.saveMetadata();
  }

  /**
   * Remove all expired entries from the cache, freeing disk space.
   * Returns the number of entries pruned.
   */
  async pruneExpired(): Promise<number> {
    await this.ensureInitialized();

    let pruned = 0;
    const now = Date.now();

    for (const [cKey, entry] of this.entries) {
      if (entry.ttl === Infinity) continue;

      const age = now - entry.timestamp;
      if (age >= entry.ttl) {
        try {
          await fs.unlink(entry.filePath);
        } catch {
          // File already gone
        }
        this.entries.delete(cKey);
        pruned++;
      }
    }

    if (pruned > 0) {
      await this.saveMetadata();
    }

    return pruned;
  }

  /**
   * Return summary statistics about the cache.
   */
  async getCacheStats(): Promise<CacheStats> {
    await this.ensureInitialized();

    const stats: CacheStats = {
      totalEntries: 0,
      totalSizeBytes: 0,
      entriesByType: { html: 0, screenshots: 0, pricing: 0, blog: 0 },
      expiredEntries: 0,
    };

    const now = Date.now();

    for (const entry of this.entries.values()) {
      stats.totalEntries++;
      stats.totalSizeBytes += entry.size;
      stats.entriesByType[entry.type]++;

      if (entry.ttl !== Infinity) {
        const age = now - entry.timestamp;
        if (age >= entry.ttl) {
          stats.expiredEntries++;
        }
      }
    }

    return stats;
  }
}
