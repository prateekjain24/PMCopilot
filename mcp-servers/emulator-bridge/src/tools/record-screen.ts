import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { adb, adbShell } from "../helpers/adb.js";
import { loadConfig } from "../config.js";

/**
 * record_screen tool definition for FastMCP.
 * Records the screen of a connected Android device/emulator for a specified duration.
 */
export const recordScreenTool = {
  name: "record_screen",
  description:
    "Record the screen of a connected Android device or emulator. " +
    "Runs screenrecord on the device for the specified duration, then pulls the video to the host. " +
    "Default duration is 30 seconds, maximum is 180 seconds.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    time_limit: z
      .number()
      .int()
      .min(1)
      .max(180)
      .optional()
      .default(30)
      .describe("Recording duration in seconds (default: 30, max: 180)"),
    output_path: z
      .string()
      .optional()
      .describe(
        "Optional host file path for the video. If omitted, auto-generates a timestamped filename."
      ),
  }),
  execute: async (params: {
    device_id: string;
    time_limit?: number;
    output_path?: string;
  }) => {
    const { device_id, time_limit = 30 } = params;
    const { videoDir } = loadConfig();

    // Ensure video directory exists
    fs.mkdirSync(videoDir, { recursive: true });

    let outputPath = params.output_path;
    if (!outputPath) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      outputPath = path.join(
        videoDir,
        `recording-${device_id.replace(/[^a-zA-Z0-9]/g, "_")}-${timestamp}.mp4`
      );
    }

    const devicePath = "/sdcard/emulator_bridge_recording.mp4";

    try {
      // Record screen on device -- this command blocks for the duration.
      // Use adb directly with a timeout that exceeds the recording duration
      // (add 10s buffer for startup/teardown overhead).
      await adb(
        ["-s", device_id, "shell", `screenrecord --time-limit ${time_limit} ${devicePath}`],
        { timeout: (time_limit + 10) * 1000 }
      );

      // Small delay to let the file finalize
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Pull to host
      await adb(["-s", device_id, "pull", devicePath, outputPath], {
        timeout: 60_000,
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
        duration_seconds: time_limit,
        message: `Screen recording saved to ${outputPath} (${stats.size} bytes, ${time_limit}s).`,
      },
      null,
      2
    );
  },
};
