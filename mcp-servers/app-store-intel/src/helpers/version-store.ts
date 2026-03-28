import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config.js";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

export interface VersionEntry {
  version: string;
  release_date: string;
  release_notes: string;
}

interface VersionFile {
  store: string;
  app_id: string;
  versions: VersionEntry[];
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function filePath(store: string, appId: string): string {
  const safeId = appId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return join(config.cacheDir, `version_history_${store}_${safeId}.json`);
}

function loadFile(store: string, appId: string): VersionFile {
  const fp = filePath(store, appId);
  if (!existsSync(fp)) {
    return { store, app_id: appId, versions: [] };
  }
  try {
    const raw = readFileSync(fp, "utf-8");
    return JSON.parse(raw) as VersionFile;
  } catch {
    return { store, app_id: appId, versions: [] };
  }
}

function saveFile(data: VersionFile): void {
  const fp = filePath(data.store, data.app_id);
  writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Record a version entry if it has not been seen before.
 * Returns the full accumulated version list sorted newest first.
 * Unlike the cache module, this storage never expires -- version
 * history is permanent.
 */
export function recordVersion(
  store: string,
  appId: string,
  entry: VersionEntry
): VersionEntry[] {
  const data = loadFile(store, appId);

  const alreadyRecorded = data.versions.some(
    (e) => e.version === entry.version
  );

  if (!alreadyRecorded) {
    data.versions.unshift(entry);
  }

  // Sort newest first by release date
  data.versions.sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
    const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
    return dateB - dateA;
  });

  saveFile(data);

  return data.versions;
}

/**
 * Get all accumulated version entries for an app.
 */
export function getVersions(store: string, appId: string): VersionEntry[] {
  const data = loadFile(store, appId);
  return data.versions;
}
