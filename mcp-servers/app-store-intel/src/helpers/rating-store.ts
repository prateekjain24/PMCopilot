import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config.js";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface RatingSnapshot {
  timestamp: number; // epoch ms
  rating: number;
  rating_count: number;
}

interface RatingFile {
  store: string;
  app_id: string;
  snapshots: RatingSnapshot[];
}

export interface RatingDataPoint {
  date: string;
  rating: number;
  rating_count: number;
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function filePath(store: string, appId: string): string {
  const safeId = appId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return join(config.cacheDir, `rating_history_${store}_${safeId}.json`);
}

function loadFile(store: string, appId: string): RatingFile {
  const fp = filePath(store, appId);
  if (!existsSync(fp)) {
    return { store, app_id: appId, snapshots: [] };
  }
  try {
    const raw = readFileSync(fp, "utf-8");
    return JSON.parse(raw) as RatingFile;
  } catch {
    return { store, app_id: appId, snapshots: [] };
  }
}

function saveFile(data: RatingFile): void {
  const fp = filePath(data.store, data.app_id);
  writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Record a rating snapshot for tracking over time.
 */
export function recordRating(
  store: string,
  appId: string,
  rating: number,
  ratingCount: number
): void {
  const data = loadFile(store, appId);

  data.snapshots.push({
    timestamp: Date.now(),
    rating,
    rating_count: ratingCount,
  });

  saveFile(data);
}

/**
 * Get rating history for a given period.
 */
export function getRatingHistory(
  store: string,
  appId: string,
  period: "7d" | "30d" | "90d" | "all" = "30d"
): RatingDataPoint[] {
  const data = loadFile(store, appId);
  if (data.snapshots.length === 0) return [];

  const now = Date.now();
  const periodMs: Record<string, number> = {
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
    all: Infinity,
  };

  const cutoff = now - (periodMs[period] ?? periodMs["30d"]);

  return data.snapshots
    .filter((s) => s.timestamp >= cutoff)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((s) => ({
      date: new Date(s.timestamp).toISOString(),
      rating: s.rating,
      rating_count: s.rating_count,
    }));
}
