import { z } from "zod";
import { adb } from "../helpers/adb.js";

/**
 * get_logcat tool definition for FastMCP.
 * Retrieves logcat output from an Android device/emulator.
 */
export const getLogcatTool = {
  name: "get_logcat",
  description:
    "Retrieve recent logcat output from a connected Android device or emulator. " +
    "Returns the most recent log entries. Optionally filter by tag.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    tag: z
      .string()
      .optional()
      .describe(
        "Optional logcat tag filter (e.g. 'ActivityManager'). Only entries with this tag will be returned."
      ),
    lines: z
      .number()
      .int()
      .min(1)
      .max(5000)
      .optional()
      .default(100)
      .describe("Number of recent log lines to return (default: 100, max: 5000)"),
  }),
  execute: async (params: {
    device_id: string;
    tag?: string;
    lines?: number;
  }) => {
    const { device_id, tag, lines = 100 } = params;

    // Build logcat command args
    // -d: dump and exit (don't block)
    // -t: show only last N lines
    const args = ["-s", device_id, "logcat", "-d", "-t", String(lines)];

    // If tag filter is specified, add it as a filter spec
    if (tag) {
      args.push(`${tag}:*`, "*:S");
    }

    const { stdout } = await adb(args, { timeout: 30_000 });

    const logLines = stdout
      .split("\n")
      .filter((line) => line.trim().length > 0);

    return JSON.stringify(
      {
        device_id,
        tag: tag || null,
        line_count: logLines.length,
        entries: logLines,
        message: `Retrieved ${logLines.length} log line(s) from device ${device_id}${tag ? ` (tag: ${tag})` : ""}.`,
      },
      null,
      2
    );
  },
};
