import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * boot_simulator tool definition for FastMCP.
 * Boots an iOS Simulator device by UDID.
 */
export const bootSimulatorTool = {
  name: "boot_simulator",
  description:
    "Boot an iOS Simulator device by its UDID. If the simulator is already booted, " +
    "this is handled gracefully and reported as success.",
  parameters: z.object({
    device_id: z.string().describe("UDID of the simulator device to boot"),
  }),
  execute: async (params: { device_id: string }) => {
    const { device_id } = params;

    try {
      await exec("xcrun", ["simctl", "boot", device_id]);
      return JSON.stringify(
        {
          device_id,
          state: "Booted",
          message: `Simulator ${device_id} has been booted successfully.`,
        },
        null,
        2
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Handle "already booted" gracefully
      if (
        errorMessage.includes("Unable to boot device in current state: Booted") ||
        errorMessage.includes("already booted")
      ) {
        return JSON.stringify(
          {
            device_id,
            state: "Booted",
            message: `Simulator ${device_id} is already booted.`,
          },
          null,
          2
        );
      }

      throw new Error(`Failed to boot simulator ${device_id}: ${errorMessage}`);
    }
  },
};
