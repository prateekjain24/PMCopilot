import { z } from "zod";
import * as appStore from "../adapters/app-store.js";
import * as playStore from "../adapters/play-store.js";
import { buildCacheKey, get, set } from "../cache.js";

interface NormalizedReview {
  review_id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  version: string;
  helpful_count: number;
}

export const getAppReviewsTool = {
  name: "get_app_reviews",
  description:
    "Fetch user reviews for a specific app from the App Store or Play Store. " +
    "Returns normalized review data including author, rating, text, version, and date. " +
    "Useful for understanding user sentiment, common complaints, and feature requests. " +
    "IMPORTANT: Set `country` to the app's primary market (e.g., 'sg' for Grab, 'br' for iFood, 'id' for Gojek). " +
    "Using 'us' for a region-specific app will return few or no reviews. " +
    "If unsure, first call get_app_details or search_app_store with the target country to confirm the app exists there.",
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
      .describe("Two-letter country code (default: us). Use the country where the app is popular for best results."),
    count: z
      .number()
      .int()
      .min(1)
      .max(500)
      .default(50)
      .describe("Number of reviews to fetch (1-500, default: 50)"),
    sort: z
      .enum(["most_recent", "most_helpful"])
      .default("most_recent")
      .describe("Sort order for reviews (default: most_recent)"),
    rating_filter: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .describe("Filter to only include reviews with this star rating (1-5)"),
  }),
  execute: async (params: {
    store: "app_store" | "play_store";
    app_id: string;
    country: string;
    count: number;
    sort: "most_recent" | "most_helpful";
    rating_filter?: number;
  }) => {
    const { store, app_id, country, count, sort, rating_filter } = params;

    const cacheKey = buildCacheKey("app_reviews", { store, app_id, country, count, sort, rating_filter });
    const cached = get<NormalizedReview[]>(cacheKey);
    if (cached) {
      return JSON.stringify(
        { source: "cache", count: cached.length, reviews: cached },
        null,
        2
      );
    }

    let reviews: NormalizedReview[] = [];

    if (store === "app_store") {
      const sortBy = sort === "most_helpful" ? "mostHelpful" : "mostRecent";
      // App Store RSS returns up to 50 per page; fetch multiple pages if needed
      const pages = Math.ceil(count / 50);

      for (let page = 1; page <= Math.min(pages, 10); page++) {
        const pageReviews = await appStore.getReviews(app_id, country, page, sortBy as "mostRecent" | "mostHelpful");
        reviews.push(...pageReviews);
        if (pageReviews.length < 50) break;
      }
    } else {
      // Play Store
      try {
        const sortMap: Record<string, "newest" | "helpfulness"> = {
          most_recent: "newest",
          most_helpful: "helpfulness",
        };
        const playReviews = await playStore.getReviews(
          app_id,
          "us",
          count,
          sortMap[sort] ?? "newest"
        );
        reviews = playReviews;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return JSON.stringify({ error: true, message }, null, 2);
      }
    }

    // Apply rating filter if specified
    if (rating_filter !== undefined) {
      reviews = reviews.filter((r) => r.rating === rating_filter);
    }

    // Trim to requested count
    reviews = reviews.slice(0, count);

    set(cacheKey, reviews);

    return JSON.stringify(
      { source: "live", count: reviews.length, reviews },
      null,
      2
    );
  },
};
