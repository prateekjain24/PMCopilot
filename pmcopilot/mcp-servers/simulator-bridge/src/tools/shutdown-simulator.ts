import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * shutdown_simulator tool definition for FastMCP.
 * Shuts down an iOS Simulator device by UDID.
 */
export const shutdownSimulatorTool = {
  name: "shutdown_simulator",
  description:
    "Shut down a running iOS Simulator device by its UDID. If the simulator is already " +
    "shut down, this is handled gracefully and reported as success.",
  parameters: z.object({
    device_id: z.string().describe("UDID of the simulator device to shut down"),
  }),
  execute: async (params: { device_id: string }) => {
    const { device_id } = params;

    try {
      await exec("xcrun", ["simctl", "shutdown", device_id]);
      return JSON.stringify(
        {
          device_id,
          state: "Shutdown",
          message: `Simulator ${device_id} has been shut down successfully.`,
        },
        null,
        2
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle "already shutdown" gracefully
      if (
        errorMessage.includes("Unable to shutdown device in current state: Shutdown") ||
        errorMessage.includes("current state: Shutdown")
      ) {
        return JSON.stringify(
          {
            device_id,
            state: "Shutdown",
            message: `Simulator ${device_id} is already shut down.`,
          },
          null,
          2
        );
      }

      throw new Error(
        `Failed to shut down simulator ${device_id}: ${errorMessage}`
      );
    }
  },
};
