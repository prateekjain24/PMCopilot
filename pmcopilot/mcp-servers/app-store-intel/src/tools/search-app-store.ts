import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import { buildCacheKey, get, set } from "../cache.js";

export const searchAppStoreTool = {
  name: "search_app_store",
  description:
    "Search the Apple App Store for apps by keyword. Returns normalized app metadata " +
    "including name, developer, rating, price, and category. Useful for competitive " +
    "research and market landscape analysis.",
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
      .max(200)
      .default(25)
      .describe("Maximum number of results to return (1-200, default: 25)"),
  }),
  execute: async (params: { query: string; country: string; limit: number }) => {
    const { query, country, limit } = params;

    const cacheKey = buildCacheKey("search_app_store", { query, country, limit });
    const cached = get<unknown[]>(cacheKey);
    if (cached) {
      return JSON.stringify(
        { source: "cache", count: cached.length, results: cached },
        null,
        2
      );
    }

    const raw = await appStore.search(query, country, limit);

    const results = raw.map((app) => ({
      app_id: String(app.trackId),
      name: app.trackName,
      developer: app.artistName,
      bundle_id: app.bundleId,
      price: app.price,
      rating: app.averageUserRating ? parseFloat(app.averageUserRating.toFixed(2)) : null,
      rating_count: app.userRatingCount ?? 0,
      icon_url: app.artworkUrl100,
      description_snippet: app.description?.substring(0, 200) ?? "",
      category: app.primaryGenreName,
      release_date: app.releaseDate,
    }));

    set(cacheKey, results);

    return JSON.stringify(
      { source: "live", count: results.length, results },
      null,
      2
    );
  },
};
