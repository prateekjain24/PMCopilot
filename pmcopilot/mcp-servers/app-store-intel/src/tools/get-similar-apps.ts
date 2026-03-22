import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

interface SimilarApp {
  app_id: string;
  name: string;
  developer: string;
  rating: number | null;
  icon_url: string;
}

export const getSimilarAppsTool = {
  name: "get_similar_apps",
  description:
    "Find apps similar to a given app. For the Play Store, uses the platform similar-apps " +
    "endpoint. For the App Store, uses a category + keyword heuristic by searching for " +
    "apps in the same category. Useful for competitive landscape mapping.",
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

    const cacheKey = buildCacheKey("similar_apps", { store, app_id });
    const cached = get<SimilarApp[]>(cacheKey);
    if (cached) {
      return JSON.stringify(
        { source: "cache", store, app_id, count: cached.length, similar_apps: cached },
        null,
        2
      );
    }

    let similarApps: SimilarApp[] = [];

    if (store === "play_store") {
      try {
        const apps = await playStore.similar(app_id);
        similarApps = apps.map((app) => ({
          app_id: app.appId,
          name: app.title,
          developer: app.developer,
          rating: app.score ? parseFloat(app.score.toFixed(2)) : null,
          icon_url: app.icon,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return JSON.stringify({ error: true, message }, null, 2);
      }
    } else {
      // App Store: category + keyword heuristic
      // First look up the target app to get its category and name
      const targetApp = await appStore.lookup(app_id);
      if (!targetApp) {
        return JSON.stringify(
          { error: true, message: `App not found: ${app_id}` },
          null,
          2
        );
      }

      // Search by category keyword to find similar apps
      const categoryQuery = targetApp.primaryGenreName ?? "";
      const nameWords = (targetApp.trackName ?? "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 2);
      const searchTerms = [categoryQuery, ...nameWords].filter(Boolean);

      // Try searching with category first, then with name keywords
      const results: appStore.iTunesResult[] = [];
      for (const term of searchTerms) {
        const batch = await appStore.search(term, "us", 20);
        results.push(...batch);
      }

      // Deduplicate by trackId and exclude the target app itself
      const seen = new Set<number>();
      const targetId = targetApp.trackId;

      for (const app of results) {
        if (app.trackId === targetId || seen.has(app.trackId)) continue;
        seen.add(app.trackId);

        similarApps.push({
          app_id: String(app.trackId),
          name: app.trackName,
          developer: app.artistName,
          rating: app.averageUserRating
            ? parseFloat(app.averageUserRating.toFixed(2))
            : null,
          icon_url: app.artworkUrl100,
        });
      }

      // Limit to top 20 results
      similarApps = similarApps.slice(0, 20);
    }

    if (similarApps.length > 0) {
      set(cacheKey, similarApps);
    }

    return JSON.stringify(
      { source: "live", store, app_id, count: similarApps.length, similar_apps: similarApps },
      null,
      2
    );
  },
};
