import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * open_url tool definition for FastMCP.
 * Opens a URL on the simulator device (deep links, web URLs, etc.).
 */
export const openUrlTool = {
  name: "open_url",
  description:
    "Open a URL on a booted simulator device. Supports web URLs (http/https), " +
    "deep links (custom schemes), and universal links. " +
    "The URL must include a scheme (e.g. https://, myapp://).",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    url: z
      .string()
      .describe(
        "URL to open on the simulator. Must include a scheme (e.g. https://example.com, myapp://path)"
      ),
  }),
  execute: async (params: { device_id: string; url: string }) => {
    const { device_id, url } = params;

    // Validate that the URL has a scheme
    if (!url.includes("://")) {
      throw new Error(
        `Invalid URL: "${url}". URL must include a scheme (e.g. https://example.com, myapp://path).`
      );
    }

    await exec("xcrun", ["simctl", "openurl", device_id, url]);

    return JSON.stringify(
      {
        device_id,
        url,
        message: `Opened URL "${url}" on simulator ${device_id}.`,
      },
      null,
      2
    );
  },
};
