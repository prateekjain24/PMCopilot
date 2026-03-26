import { z } from "zod";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

export const searchPlayStoreTool = {
  name: "search_play_store",
  description:
    "Search the Google Play Store for apps by keyword. Returns normalized app metadata " +
    "including name, developer, rating, install count, and category. " +
    "Requires the google-play-scraper package to be installed for live data.",
  parameters: z.object({
    query: z.string().describe("Search query (app name, keyword, or developer)"),
    country: z
      .string()
      .length(2)
      .default("us")
      .describe("Two-letter country code (default: us)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(250)
      .default(25)
      .describe("Maximum number of results to return (1-250, default: 25)"),
  }),
  execute: async (params: { query: string; country: string; limit: number }) => {
    const { query, country, limit } = params;

    const cacheKey = buildCacheKey("search_play_store", { query, country, limit });
    const cached = get<unknown[]>(cacheKey);
    if (cached) {
      return JSON.stringify(
        { source: "cache", count: cached.length, results: cached },
        null,
        2
      );
    }

    try {
      const raw = await playStore.search(query, country, limit);

      const results = raw.map((app) => ({
        app_id: app.appId,
        name: app.title,
        developer: app.developer,
        price: app.price,
        free: app.free,
        rating: app.score ? parseFloat(app.score.toFixed(2)) : null,
        rating_count: app.ratings ?? 0,
        icon_url: app.icon,
        description_snippet: (app.summary || app.description || "").substring(0, 200),
        category: app.genre,
        installs: app.installs ?? "N/A",
      }));

      set(cacheKey, results);

      return JSON.stringify(
        { source: "live", count: results.length, results },
        null,
        2
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return JSON.stringify(
        {
          error: true,
          message,
          hint: "The google-play-scraper package may not be installed. Run: bun add google-play-scraper",
        },
        null,
        2
      );
    }
  },
};
