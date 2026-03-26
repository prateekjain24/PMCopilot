import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * clear_app_data tool definition for FastMCP.
 * Clears all data for an app on a connected Android device/emulator.
 */
export const clearAppDataTool = {
  name: "clear_app_data",
  description:
    "Clear all data (cache, databases, shared preferences) for an app on a connected " +
    "Android device or emulator. This effectively resets the app to a fresh-install state.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    package: z
      .string()
      .describe("Package name of the app to clear (e.g. com.example.app)"),
  }),
  execute: async (params: { device_id: string; package: string }) => {
    const { device_id, package: pkg } = params;

    const output = await adbShell(device_id, `pm clear ${pkg}`);

    const success = output.includes("Success");

    if (!success) {
      throw new Error(
        `Failed to clear data for ${pkg} on device ${device_id}: ${output}`
      );
    }

    return JSON.stringify(
      {
        device_id,
        package: pkg,
        success: true,
        message: `App data cleared for ${pkg} on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
