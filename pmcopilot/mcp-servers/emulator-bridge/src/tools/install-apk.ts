import { z } from "zod";
import { adb } from "../helpers/adb.js";

/**
 * install_apk tool definition for FastMCP.
 * Installs an APK file onto a connected Android device/emulator.
 */
export const installApkTool = {
  name: "install_apk",
  description:
    "Install an APK file onto a connected Android device or emulator. " +
    "The apk_path must point to a valid .apk file on the host filesystem.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    apk_path: z
      .string()
      .describe("Absolute path to the .apk file on the host machine"),
  }),
  execute: async (params: { device_id: string; apk_path: string }) => {
    const { device_id, apk_path } = params;

    if (!apk_path.endsWith(".apk")) {
      throw new Error(
        `Invalid APK path: "${apk_path}". Path must end with .apk extension.`
      );
    }

    const { stdout } = await adb(["-s", device_id, "install", apk_path], {
      timeout: 120_000,
    });

    const success = stdout.includes("Success");

    if (!success) {
      throw new Error(
        `APK installation failed on device ${device_id}. Output: ${stdout.trim()}`
      );
    }

    return JSON.stringify(
      {
        device_id,
        apk_path,
        success: true,
        message: `APK installed successfully on device ${device_id} from ${apk_path}.`,
      },
      null,
      2
    );
  },
};
