import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

interface VersionEntry {
  version: string;
  release_date: string;
  release_notes: string;
}

export const getVersionHistoryTool = {
  name: "get_version_history",
  description:
    "Get version history for a specific app. Returns an array of version entries " +
    "sorted newest first, each with version number, release date, and release notes. " +
    "Note: the App Store lookup API only returns the current version. " +
    "Historical data accumulates as the tool is called over time.",
  parameters: z.object({
    store: z
      .enum(["app_store", "play_store"])
      .describe("Which store to query: app_store or play_store"),
    app_id: z
      .string()
      .describe("App identifier (numeric ID for App Store, package name for Play Store)"),
  }),
  execute: async (params: { store: "app_store" | "play_store"; app_id: string }) => {
    const { store, app_id } = params;

    // We use a persistent cache key for accumulating version history
    const historyKey = buildCacheKey("version_history_accum", { store, app_id });
    const existingHistory = get<VersionEntry[]>(historyKey) ?? [];

    if (store === "app_store") {
      const app = await appStore.lookup(app_id);
      if (!app) {
        return JSON.stringify({ error: true, message: `App not found: ${app_id}` }, null, 2);
      }

      const currentEntry: VersionEntry = {
        version: app.version ?? "unknown",
        release_date: app.currentVersionReleaseDate ?? app.releaseDate ?? "",
        release_notes: app.releaseNotes ?? "",
      };

      // Add to history if this version is not already recorded
      const alreadyRecorded = existingHistory.some(
        (e) => e.version === currentEntry.version
      );

      if (!alreadyRecorded) {
        existingHistory.unshift(currentEntry);
      }

      // Sort newest first by release date
      existingHistory.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      });

      set(historyKey, existingHistory);

      return JSON.stringify(
        {
          store,
          app_id,
          app_name: app.trackName,
          version_count: existingHistory.length,
          versions: existingHistory,
          note: existingHistory.length <= 1
            ? "Only the current version is available from the App Store API. History accumulates as this tool is called over time when the app updates."
            : undefined,
        },
        null,
        2
      );
    }

    // Play Store
    try {
      const app = await playStore.lookup(app_id);
      if (!app) {
        return JSON.stringify({ error: true, message: `App not found: ${app_id}` }, null, 2);
      }

      const currentEntry: VersionEntry = {
        version: app.version ?? "unknown",
        release_date: app.updated ? new Date(app.updated).toISOString() : "",
        release_notes: app.recentChanges ?? "",
      };

      const alreadyRecorded = existingHistory.some(
        (e) => e.version === currentEntry.version
      );

      if (!alreadyRecorded) {
        existingHistory.unshift(currentEntry);
      }

      existingHistory.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      });

      set(historyKey, existingHistory);

      return JSON.stringify(
        {
          store,
          app_id,
          app_name: app.title,
          version_count: existingHistory.length,
          versions: existingHistory,
          note: existingHistory.length <= 1
            ? "Only the current version is available. History accumulates as this tool is called over time when the app updates."
            : undefined,
        },
        null,
        2
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return JSON.stringify({ error: true, message }, null, 2);
    }
  },
};
