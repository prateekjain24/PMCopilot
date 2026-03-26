import { fetchJson } from "../http-client.js";

const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
const ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup";
const RSS_TOP_APPS_URL = "https://rss.applemarketingtools.com/api/v2";

// -------------------------------------------------------------------
// Types returned by the iTunes API
// -------------------------------------------------------------------

export interface iTunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  bundleId: string;
  price: number;
  formattedPrice: string;
  averageUserRating: number;
  userRatingCount: number;
  artworkUrl100: string;
  artworkUrl512: string;
  description: string;
  primaryGenreName: string;
  releaseDate: string;
  currentVersionReleaseDate: string;
  version: string;
  fileSizeBytes: string;
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  releaseNotes: string;
  trackViewUrl: string;
  minimumOsVersion: string;
  contentAdvisoryRating: string;
  genres: string[];
  sellerName: string;
  languageCodesISO2A: string[];
  trackContentRating: string;
  userRatingCountForCurrentVersion: number;
  averageUserRatingForCurrentVersion: number;
}

interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesResult[];
}

interface RssFeedEntry {
  id: string;
  name: string;
  artistName: string;
  artworkUrl100: string;
  url: string;
  genres: Array<{ genreId: string; name: string; url: string }>;
}

interface RssFeedResponse {
  feed: {
    title: string;
    results: RssFeedEntry[];
  };
}

// -------------------------------------------------------------------
// Public adapter functions
// -------------------------------------------------------------------

/**
 * Search the App Store via the iTunes Search API.
 */
export async function search(
  query: string,
  country: string = "us",
  limit: number = 25
): Promise<iTunesResult[]> {
  const params = new URLSearchParams({
    term: query,
    country,
    entity: "software",
    limit: String(Math.min(limit, 200)),
  });

  const response = await fetchJson<iTunesSearchResponse>(
    `${ITUNES_SEARCH_URL}?${params.toString()}`
  );

  return response.results;
}

/**
 * Look up a specific app by its App Store ID.
 */
export async function lookup(
  appId: string | number,
  country: string = "us"
): Promise<iTunesResult | undefined> {
  const params = new URLSearchParams({
    id: String(appId),
    country,
  });

  const response = await fetchJson<iTunesSearchResponse>(
    `${ITUNES_LOOKUP_URL}?${params.toString()}`
  );

  return response.results[0];
}

/**
 * Fetch top apps from the App Store RSS feed.
 */
export async function getTopApps(
  category: string,
  country: string = "us",
  type: "free" | "paid" | "grossing" = "free",
  limit: number = 100
): Promise<RssFeedEntry[]> {
  const typeMap: Record<string, string> = {
    free: "top-free",
    paid: "top-paid",
    grossing: "top-grossing",
  };

  const feedType = typeMap[type] ?? "top-free";
  const url = `${RSS_TOP_APPS_URL}/${country}/apps/${feedType}/${Math.min(limit, 200)}/apps.json`;

  try {
    const response = await fetchJson<RssFeedResponse>(url);
    return response.feed.results;
  } catch {
    // RSS feed may not support all category filters; return empty
    return [];
  }
}

/**
 * Get reviews for an app from the App Store RSS feed.
 * Note: The App Store RSS reviews feed returns up to 50 most recent reviews per page.
 */
export async function getReviews(
  appId: string | number,
  country: string = "us",
  page: number = 1,
  sortBy: "mostRecent" | "mostHelpful" = "mostRecent"
): Promise<AppStoreReview[]> {
  const sortMap: Record<string, string> = {
    mostRecent: "mostRecent",
    mostHelpful: "mostHelpful",
  };

  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${appId}/sortBy=${sortMap[sortBy]}/json`;

  try {
    const response = await fetchJson<AppStoreReviewResponse>(url);
    const entries = response.feed?.entry;
    if (!entries || !Array.isArray(entries)) return [];

    return entries
      .filter((e) => e["im:rating"])
      .map((entry) => ({
        review_id: entry.id?.label ?? "",
        author: entry.author?.name?.label ?? "Unknown",
        rating: parseInt(entry["im:rating"]?.label ?? "0", 10),
        title: entry.title?.label ?? "",
        text: entry.content?.label ?? "",
        date: "",
        version: entry["im:version"]?.label ?? "",
        helpful_count: parseInt(entry["im:voteSum"]?.label ?? "0", 10),
      }));
  } catch {
    return [];
  }
}

// -------------------------------------------------------------------
// Review types
// -------------------------------------------------------------------

export interface AppStoreReview {
  review_id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  version: string;
  helpful_count: number;
}

interface AppStoreReviewEntry {
  id?: { label: string };
  author?: { name?: { label: string } };
  title?: { label: string };
  content?: { label: string };
  "im:rating"?: { label: string };
  "im:version"?: { label: string };
  "im:voteSum"?: { label: string };
  "im:voteCount"?: { label: string };
}

interface AppStoreReviewResponse {
  feed?: {
    entry?: AppStoreReviewEntry[];
  };
}
