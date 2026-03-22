import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { adb, adbShell } from "../helpers/adb.js";
import { loadConfig } from "../config.js";

/**
 * take_screenshot tool definition for FastMCP.
 * Captures a screenshot from a connected Android device/emulator.
 */
export const takeScreenshotTool = {
  name: "take_screenshot",
  description:
    "Capture a screenshot from a connected Android device or emulator. " +
    "Runs screencap on the device, pulls the file to the host, and cleans up the device copy. " +
    "If no output_path is provided, a timestamped filename is auto-generated.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    output_path: z
      .string()
      .optional()
      .describe(
        "Optional host file path for the screenshot. If omitted, auto-generates a timestamped filename."
      ),
  }),
  execute: async (params: { device_id: string; output_path?: string }) => {
    const { device_id } = params;
    const { screenshotDir } = loadConfig();

    // Ensure screenshot directory exists
    fs.mkdirSync(screenshotDir, { recursive: true });

    let outputPath = params.output_path;
    if (!outputPath) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      outputPath = path.join(
        screenshotDir,
        `screenshot-${device_id.replace(/[^a-zA-Z0-9]/g, "_")}-${timestamp}.png`
      );
    }

    const devicePath = "/sdcard/emulator_bridge_screenshot.png";

    try {
      // Capture screenshot on device
      await adbShell(device_id, `screencap -p ${devicePath}`);

      // Pull to host
      await adb(["-s", device_id, "pull", devicePath, outputPath], {
        timeout: 30_000,
      });

      // Clean up device file
      await adbShell(device_id, `rm -f ${devicePath}`);
    } catch (error) {
      // Attempt cleanup even on failure
      try {
        await adbShell(device_id, `rm -f ${devicePath}`);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }

    const stats = fs.statSync(outputPath);

    return JSON.stringify(
      {
        path: outputPath,
        size_bytes: stats.size,
        message: `Screenshot saved to ${outputPath} (${stats.size} bytes).`,
      },
      null,
      2
    );
  },
};
