import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";
import { recordRating } from "../helpers/rating-store.js";

export const getAppDetailsTool = {
  name: "get_app_details",
  description:
    "Get comprehensive metadata for a specific app from the App Store or Play Store. " +
    "Returns full details including description, version, size, ratings breakdown, " +
    "screenshots, release notes, and more. Also records a rating snapshot for tracking. " +
    "TIP: For region-specific apps, pass the correct `country` to get localized ratings and metadata.",
  parameters: z.object({
    store: z
      .enum(["app_store", "play_store"])
      .describe("Which store to query: app_store or play_store"),
    app_id: z
      .string()
      .describe("App identifier (numeric ID for App Store, package name for Play Store)"),
    country: z
      .string()
      .min(2)
      .max(2)
      .default("us")
      .describe("Two-letter country code (default: us). Use the app's primary market for accurate ratings."),
  }),
  execute: async (params: { store: "app_store" | "play_store"; app_id: string; country: string }) => {
    const { store, app_id, country } = params;

    const cacheKey = buildCacheKey("app_details", { store, app_id, country });
    const cached = get<Record<string, unknown>>(cacheKey);
    if (cached) {
      return JSON.stringify({ source: "cache", ...cached }, null, 2);
    }

    if (store === "app_store") {
      const app = await appStore.lookup(app_id, country);
      if (!app) {
        return JSON.stringify({ error: true, message: `App not found: ${app_id}` }, null, 2);
      }

      const result = {
        app_id: String(app.trackId),
        name: app.trackName,
        developer: app.artistName,
        seller: app.sellerName,
        description: app.description,
        whats_new: app.releaseNotes ?? "",
        version: app.version,
        size: app.fileSizeBytes
          ? `${(parseInt(app.fileSizeBytes, 10) / (1024 * 1024)).toFixed(1)} MB`
          : "Unknown",
        rating: app.averageUserRating ? parseFloat(app.averageUserRating.toFixed(2)) : null,
        rating_count: app.userRatingCount ?? 0,
        ratings_breakdown: null as Record<string, number> | null,
        price: app.price,
        free: app.price === 0,
        category: app.primaryGenreName,
        genres: app.genres ?? [],
        screenshots: app.screenshotUrls ?? [],
        icon_url: app.artworkUrl512 ?? app.artworkUrl100,
        release_date: app.releaseDate,
        last_updated: app.currentVersionReleaseDate,
        content_rating: app.contentAdvisoryRating ?? app.trackContentRating,
        minimum_os: app.minimumOsVersion,
        languages: app.languageCodesISO2A ?? [],
        url: app.trackViewUrl,
      };

      // Record rating snapshot for historical tracking
      if (result.rating !== null) {
        recordRating(store, app_id, result.rating, result.rating_count);
      }

      set(cacheKey, result);
      return JSON.stringify({ source: "live", ...result }, null, 2);
    }

    // Play Store
    try {
      const app = await playStore.lookup(app_id);
      if (!app) {
        return JSON.stringify({ error: true, message: `App not found: ${app_id}` }, null, 2);
      }

      const result = {
        app_id: app.appId,
        name: app.title,
        developer: app.developer,
        description: app.description,
        whats_new: app.recentChanges ?? "",
        version: app.version,
        size: "N/A",
        rating: app.score ? parseFloat(app.score.toFixed(2)) : null,
        rating_count: app.ratings ?? 0,
        ratings_breakdown: app.histogram ?? null,
        price: app.price,
        free: app.free,
        category: app.genre,
        screenshots: app.screenshots ?? [],
        icon_url: app.icon,
        installs: app.installs,
        min_installs: app.minInstalls,
        max_installs: app.maxInstalls,
        release_date: app.released,
        last_updated: app.updated
          ? new Date(app.updated).toISOString()
          : "",
        url: app.url,
      };

      if (result.rating !== null) {
        recordRating(store, app_id, result.rating, result.rating_count);
      }

      set(cacheKey, result);
      return JSON.stringify({ source: "live", ...result }, null, 2);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return JSON.stringify({ error: true, message }, null, 2);
    }
  },
};
