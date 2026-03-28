import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

interface AppComparison {
  store: string;
  app_id: string;
  name: string;
  developer: string;
  rating: number | null;
  rating_count: number;
  price: number;
  free: boolean;
  category: string;
  version: string;
  last_updated: string;
  description_snippet: string;
}

export const compareAppsTool = {
  name: "compare_apps",
  description:
    "Compare multiple apps side-by-side across the App Store and/or Play Store. " +
    "Fetches detailed metadata for each app and returns a comparison table. " +
    "Useful for competitive analysis, identifying strengths and weaknesses, " +
    "and understanding market positioning.",
  parameters: z.object({
    app_ids: z
      .array(
        z.object({
          store: z.enum(["app_store", "play_store"]).describe("Store for this app"),
          app_id: z.string().describe("App identifier"),
        })
      )
      .min(2)
      .max(10)
      .describe("Array of apps to compare (2-10 apps, each with store and app_id)"),
    metrics: z
      .array(z.string())
      .optional()
      .describe(
        "Optional list of specific metrics to include in comparison " +
        "(e.g., ['rating', 'price', 'category']). If omitted, all metrics are included."
      ),
  }),
  execute: async (params: {
    app_ids: Array<{ store: "app_store" | "play_store"; app_id: string }>;
    metrics?: string[];
  }) => {
    const { app_ids, metrics } = params;

    const cacheKey = buildCacheKey("compare_apps", { app_ids, metrics });
    const cached = get<unknown>(cacheKey);
    if (cached) {
      return JSON.stringify({ source: "cache", ...(cached as Record<string, unknown>) }, null, 2);
    }

    const comparisons: AppComparison[] = [];
    const errors: Array<{ store: string; app_id: string; error: string }> = [];

    // Fetch details for all apps
    for (const { store, app_id } of app_ids) {
      try {
        if (store === "app_store") {
          const app = await appStore.lookup(app_id);
          if (!app) {
            errors.push({ store, app_id, error: "App not found" });
            continue;
          }

          comparisons.push({
            store,
            app_id: String(app.trackId),
            name: app.trackName,
            developer: app.artistName,
            rating: app.averageUserRating
              ? parseFloat(app.averageUserRating.toFixed(2))
              : null,
            rating_count: app.userRatingCount ?? 0,
            price: app.price,
            free: app.price === 0,
            category: app.primaryGenreName,
            version: app.version,
            last_updated: app.currentVersionReleaseDate ?? "",
            description_snippet: (app.description ?? "").substring(0, 300),
          });
        } else {
          const app = await playStore.lookup(app_id);
          if (!app) {
            errors.push({ store, app_id, error: "App not found" });
            continue;
          }

          comparisons.push({
            store,
            app_id: app.appId,
            name: app.title,
            developer: app.developer,
            rating: app.score ? parseFloat(app.score.toFixed(2)) : null,
            rating_count: app.ratings ?? 0,
            price: app.price,
            free: app.free,
            category: app.genre,
            version: app.version,
            last_updated: app.updated ? new Date(app.updated).toISOString() : "",
            description_snippet: (app.summary || app.description || "").substring(0, 300),
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ store, app_id, error: message });
      }
    }

    // Filter to requested metrics if specified
    let filteredComparisons: Record<string, unknown>[] = comparisons as unknown as Record<string, unknown>[];
    if (metrics && metrics.length > 0) {
      const metricSet = new Set(["store", "app_id", "name", ...metrics]);
      filteredComparisons = comparisons.map((c) => {
        const filtered: Record<string, unknown> = {};
        for (const key of Object.keys(c)) {
          if (metricSet.has(key)) {
            filtered[key] = (c as unknown as Record<string, unknown>)[key];
          }
        }
        return filtered;
      });
    }

    // Build summary
    const ratedApps = comparisons.filter((c) => c.rating !== null);
    const bestRated = ratedApps.length > 0
      ? ratedApps.reduce((a, b) => ((a.rating ?? 0) >= (b.rating ?? 0) ? a : b))
      : null;
    const mostReviewed = comparisons.length > 0
      ? comparisons.reduce((a, b) => (a.rating_count >= b.rating_count ? a : b))
      : null;

    const result = {
      app_count: comparisons.length,
      comparison: filteredComparisons,
      summary: {
        highest_rated: bestRated
          ? { name: bestRated.name, rating: bestRated.rating }
          : null,
        most_reviewed: mostReviewed
          ? { name: mostReviewed.name, rating_count: mostReviewed.rating_count }
          : null,
      },
      ...(errors.length > 0 ? { errors } : {}),
    };

    set(cacheKey, result);

    return JSON.stringify({ source: "live", ...result }, null, 2);
  },
};
