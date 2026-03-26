import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * terminate_app tool definition for FastMCP.
 * Terminates a running app on a simulator device by bundle ID.
 */
export const terminateAppTool = {
  name: "terminate_app",
  description:
    "Terminate a running app on a booted simulator device by its bundle identifier. " +
    "If the app is not currently running, this is handled gracefully.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    bundle_id: z
      .string()
      .describe("Bundle identifier of the app to terminate"),
  }),
  execute: async (params: { device_id: string; bundle_id: string }) => {
    const { device_id, bundle_id } = params;

    try {
      await exec("xcrun", ["simctl", "terminate", device_id, bundle_id]);
      return JSON.stringify(
        {
          device_id,
          bundle_id,
          message: `App ${bundle_id} terminated on simulator ${device_id}.`,
        },
        null,
        2
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle "not running" gracefully
      if (
        errorMessage.includes("not running") ||
        errorMessage.includes("domain not found")
      ) {
        return JSON.stringify(
          {
            device_id,
            bundle_id,
            message: `App ${bundle_id} is not currently running on simulator ${device_id}.`,
          },
          null,
          2
        );
      }

      throw new Error(
        `Failed to terminate app ${bundle_id} on simulator ${device_id}: ${errorMessage}`
      );
    }
  },
};
