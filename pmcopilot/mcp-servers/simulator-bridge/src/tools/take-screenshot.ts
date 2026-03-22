import { z } from "zod";
import path from "node:path";
import { exec } from "../utils/exec.js";

/**
 * take_screenshot tool definition for FastMCP.
 * Captures a screenshot of the simulator screen.
 */
export const takeScreenshotTool = {
  name: "take_screenshot",
  description:
    "Capture a screenshot of a booted simulator device. " +
    "If no output_path is provided, a timestamped filename is generated in the SCREENSHOT_DIR directory. " +
    "Supports png and jpeg formats (default: png).",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device to screenshot"),
    output_path: z
      .string()
      .optional()
      .describe(
        "Optional file path for the screenshot. If omitted, auto-generates a timestamped filename."
      ),
    format: z
      .enum(["png", "jpeg"])
      .optional()
      .default("png")
      .describe("Image format: png or jpeg (default: png)"),
  }),
  execute: async (params: {
    device_id: string;
    output_path?: string;
    format?: "png" | "jpeg";
  }) => {
    const { device_id, format = "png" } = params;

    const screenshotDir =
      process.env.SCREENSHOT_DIR ??
      path.join(process.cwd(), "screenshots");

    let outputPath = params.output_path;
    if (!outputPath) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");
      outputPath = path.join(
        screenshotDir,
        `screenshot-${device_id.slice(0, 8)}-${timestamp}.${format}`
      );
    }

    const args = [
      "simctl",
      "io",
      device_id,
      "screenshot",
      "--type",
      format,
      outputPath,
    ];

    await exec("xcrun", args);

    return JSON.stringify(
      {
        device_id,
        output_path: outputPath,
        format,
        message: `Screenshot saved to ${outputPath}.`,
      },
      null,
      2
    );
  },
};
