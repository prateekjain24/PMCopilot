/**
 * Google Play Store adapter.
 *
 * This is a stub implementation that mirrors the App Store adapter interface.
 * In production, the google-play-scraper npm package would be used to fetch
 * real data. For now, functions throw descriptive errors when called without
 * the scraper dependency, so the tool gracefully reports that Play Store
 * access is not yet configured.
 */

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

export interface PlayStoreApp {
  appId: string;
  title: string;
  developer: string;
  price: number;
  free: boolean;
  score: number;
  ratings: number;
  icon: string;
  description: string;
  descriptionHTML: string;
  summary: string;
  genre: string;
  genreId: string;
  installs: string;
  minInstalls: number;
  maxInstalls: number;
  released: string;
  updated: number;
  version: string;
  recentChanges: string;
  screenshots: string[];
  histogram: Record<string, number>;
  url: string;
}

export interface PlayStoreReview {
  review_id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  version: string;
  helpful_count: number;
}

// -------------------------------------------------------------------
// Stub helpers
// -------------------------------------------------------------------

let scraper: unknown = null;

async function getScraper(): Promise<unknown> {
  if (scraper) return scraper;

  try {
    scraper = await import("google-play-scraper");
    return scraper;
  } catch {
    return null;
  }
}

function stubResult(method: string): string {
  return (
    `Play Store ${method}: google-play-scraper package not installed. ` +
    `Install it with: bun add google-play-scraper`
  );
}

// -------------------------------------------------------------------
// Public adapter functions
// -------------------------------------------------------------------

/**
 * Search the Play Store for apps.
 */
export async function search(
  query: string,
  country: string = "us",
  limit: number = 25
): Promise<PlayStoreApp[]> {
  const gplay = await getScraper() as Record<string, Function> | null;
  if (!gplay?.search) {
    throw new Error(stubResult("search"));
  }

  const results = await gplay.search({
    term: query,
    country,
    num: Math.min(limit, 250),
  });

  return results as PlayStoreApp[];
}

/**
 * Look up a specific app by its Play Store ID (package name).
 */
export async function lookup(
  appId: string,
  country: string = "us"
): Promise<PlayStoreApp | undefined> {
  const gplay = await getScraper() as Record<string, Function> | null;
  if (!gplay?.app) {
    throw new Error(stubResult("lookup"));
  }

  try {
    const result = await gplay.app({ appId, country });
    return result as PlayStoreApp;
  } catch {
    return undefined;
  }
}

/**
 * Get reviews for a Play Store app.
 */
export async function getReviews(
  appId: string,
  country: string = "us",
  count: number = 50,
  sort: "newest" | "rating" | "helpfulness" = "newest"
): Promise<PlayStoreReview[]> {
  const gplay = await getScraper() as Record<string, Function> | null;
  if (!gplay?.reviews) {
    throw new Error(stubResult("reviews"));
  }

  const sortMap: Record<string, number> = {
    newest: 2,
    rating: 1,
    helpfulness: 3,
  };

  const result = await gplay.reviews({
    appId,
    country,
    num: Math.min(count, 500),
    sort: sortMap[sort] ?? 2,
  });

  const data = Array.isArray(result) ? result : (result as { data: unknown[] }).data ?? [];

  return data.map((r: Record<string, unknown>) => ({
    review_id: String(r.id ?? ""),
    author: String(r.userName ?? "Unknown"),
    rating: Number(r.score ?? 0),
    title: String(r.title ?? ""),
    text: String(r.text ?? ""),
    date: r.date ? new Date(r.date as string | number).toISOString() : "",
    version: String(r.version ?? ""),
    helpful_count: Number(r.thumbsUp ?? 0),
  }));
}

/**
 * Get similar apps for a given app.
 */
export async function similar(
  appId: string,
  country: string = "us"
): Promise<PlayStoreApp[]> {
  const gplay = await getScraper() as Record<string, Function> | null;
  if (!gplay?.similar) {
    throw new Error(stubResult("similar"));
  }

  const results = await gplay.similar({ appId, country });
  return results as PlayStoreApp[];
}

/**
 * Get top apps in a category from the Play Store.
 */
export async function getTopApps(
  category: string,
  country: string = "us",
  collection: "free" | "paid" | "grossing" = "free",
  limit: number = 100
): Promise<PlayStoreApp[]> {
  const gplay = await getScraper() as Record<string, Function> | null;
  if (!gplay?.list) {
    throw new Error(stubResult("list"));
  }

  const collectionMap: Record<string, string> = {
    free: "TOP_FREE",
    paid: "TOP_PAID",
    grossing: "TOP_GROSSING",
  };

  const results = await gplay.list({
    category: category.toUpperCase(),
    collection: collectionMap[collection] ?? "TOP_FREE",
    country,
    num: Math.min(limit, 200),
  });

  return results as PlayStoreApp[];
}
