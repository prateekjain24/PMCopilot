import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { recordVersion, type VersionEntry } from "../helpers/version-store.js";

export const getVersionHistoryTool = {
  name: "get_version_history",
  description:
    "Get version history for a specific app. Returns an array of version entries " +
    "sorted newest first, each with version number, release date, and release notes. " +
    "Note: the App Store and Play Store APIs only return the current version. " +
    "Historical data accumulates permanently as this tool is called over time -- " +
    "the more often you call it, the richer the history becomes.",
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

      // Record and get full accumulated history (never expires)
      const versions = recordVersion(store, app_id, currentEntry);

      return JSON.stringify(
        {
          store,
          app_id,
          app_name: app.trackName,
          version_count: versions.length,
          versions,
          note: versions.length <= 1
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

      const versions = recordVersion(store, app_id, currentEntry);

      return JSON.stringify(
        {
          store,
          app_id,
          app_name: app.title,
          version_count: versions.length,
          versions,
          note: versions.length <= 1
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
