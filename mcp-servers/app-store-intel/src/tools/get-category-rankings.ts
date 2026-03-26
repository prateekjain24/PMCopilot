import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

interface RankedApp {
  rank: number;
  app_id: string;
  name: string;
  developer: string;
  rating: number | null;
  icon_url: string;
}

export const getCategoryRankingsTool = {
  name: "get_category_rankings",
  description:
    "Get top app rankings for a specific category in the App Store or Play Store. " +
    "Returns a ranked list of apps with their position, name, developer, and rating. " +
    "For the App Store, uses the RSS feed from rss.applemarketingtools.com. " +
    "For the Play Store, uses the scraper list endpoint.",
  parameters: z.object({
    store: z
      .enum(["app_store", "play_store"])
      .describe("Which store to query: app_store or play_store"),
    category: z
      .string()
      .describe(
        "App category (e.g., 'games', 'productivity', 'social-networking' for App Store; " +
        "'GAME', 'PRODUCTIVITY', 'SOCIAL' for Play Store)"
      ),
    country: z
      .string()
      .length(2)
      .default("us")
      .describe("Two-letter country code (default: us)"),
    type: z
      .enum(["free", "paid", "grossing"])
      .default("free")
      .describe("Ranking type: free, paid, or grossing (default: free)"),
  }),
  execute: async (params: {
    store: "app_store" | "play_store";
    category: string;
    country: string;
    type: "free" | "paid" | "grossing";
  }) => {
    const { store, category, country, type } = params;

    const cacheKey = buildCacheKey("category_rankings", { store, category, country, type });
    const cached = get<RankedApp[]>(cacheKey);
    if (cached) {
      return JSON.stringify(
        { source: "cache", store, category, type, count: cached.length, rankings: cached },
        null,
        2
      );
    }

    let rankings: RankedApp[] = [];

    if (store === "app_store") {
      const entries = await appStore.getTopApps(category, country, type);

      rankings = entries.map((entry, index) => ({
        rank: index + 1,
        app_id: entry.id,
        name: entry.name,
        developer: entry.artistName,
        rating: null, // RSS feed does not include ratings
        icon_url: entry.artworkUrl100,
      }));
    } else {
      try {
        const apps = await playStore.getTopApps(category, country, type);

        rankings = apps.map((app, index) => ({
          rank: index + 1,
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
    }

    if (rankings.length > 0) {
      set(cacheKey, rankings);
    }

    return JSON.stringify(
      { source: "live", store, category, type, count: rankings.length, rankings },
      null,
      2
    );
  },
};
