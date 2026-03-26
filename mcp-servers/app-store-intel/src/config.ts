import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_CACHE_DIR = resolve(
  process.env.CLAUDE_PLUGIN_DATA ?? resolve(process.env.HOME ?? "~", ".claude/plugins/data/pmcopilot"),
  "cache/app-store-intel"
);

export const config = {
  cacheDir: process.env.CACHE_DIR ?? DEFAULT_CACHE_DIR,
  cacheTtlHours: Number(process.env.CACHE_TTL_HOURS) || 24,
} as const;

// Auto-create the cache directory on import
mkdirSync(config.cacheDir, { recursive: true });
