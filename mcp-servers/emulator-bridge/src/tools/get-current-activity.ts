import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * get_current_activity tool definition for FastMCP.
 * Gets the currently focused activity on an Android device/emulator.
 */
export const getCurrentActivityTool = {
  name: "get_current_activity",
  description:
    "Get the currently focused activity (package and activity name) on a connected " +
    "Android device or emulator. Uses dumpsys window to determine what is on screen.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
  }),
  execute: async (params: { device_id: string }) => {
    const { device_id } = params;

    const output = await adbShell(
      device_id,
      "dumpsys window displays | grep -E 'mCurrentFocus|mFocusedApp'"
    );

    let packageName = "";
    let activity = "";

    // Parse mCurrentFocus or mFocusedApp output
    // Typical format: "mCurrentFocus=Window{...hash u0 com.example.app/com.example.app.MainActivity}"
    // or: "mFocusedApp=ActivityRecord{...hash u0 com.example.app/.MainActivity t123}"
    const lines = output.split("\n");
    for (const line of lines) {
      // Try to extract component from mCurrentFocus
      const focusMatch = line.match(
        /mCurrentFocus=.*\s+([^\s/}]+)\/([^\s}]+)/
      );
      if (focusMatch) {
        packageName = focusMatch[1];
        activity = focusMatch[2];
        // If activity starts with a dot, prepend the package name
        if (activity.startsWith(".")) {
          activity = packageName + activity;
        }
        break;
      }

      // Try to extract from mFocusedApp
      const appMatch = line.match(
        /mFocusedApp=.*\s+([^\s/}]+)\/([^\s}]+)/
      );
      if (appMatch) {
        packageName = appMatch[1];
        activity = appMatch[2];
        if (activity.startsWith(".")) {
          activity = packageName + activity;
        }
        break;
      }
    }

    if (!packageName) {
      return JSON.stringify(
        {
          device_id,
          package: null,
          activity: null,
          raw_output: output,
          message: "Could not determine the current activity. The raw output is included for inspection.",
        },
        null,
        2
      );
    }

    return JSON.stringify(
      {
        device_id,
        package: packageName,
        activity,
        message: `Current activity: ${packageName}/${activity} on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
