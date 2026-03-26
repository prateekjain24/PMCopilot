import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * install_app tool definition for FastMCP.
 * Installs an app (.app bundle) onto a simulator device.
 */
export const installAppTool = {
  name: "install_app",
  description:
    "Install an iOS app (.app bundle) onto a booted simulator device. " +
    "The app_path must point to a valid .app directory.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device to install the app on"),
    app_path: z
      .string()
      .describe("Filesystem path to the .app bundle to install"),
  }),
  execute: async (params: { device_id: string; app_path: string }) => {
    const { device_id, app_path } = params;

    // Validate .app extension
    if (!app_path.endsWith(".app")) {
      throw new Error(
        `Invalid app path: "${app_path}". Path must end with .app extension.`
      );
    }

    await exec("xcrun", ["simctl", "install", device_id, app_path], {
      timeout: 60000,
    });

    return JSON.stringify(
      {
        device_id,
        app_path,
        message: `App installed successfully on simulator ${device_id} from ${app_path}.`,
      },
      null,
      2
    );
  },
};
