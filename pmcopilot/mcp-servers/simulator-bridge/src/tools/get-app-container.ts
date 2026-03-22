import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * get_app_container tool definition for FastMCP.
 * Returns the filesystem path to an installed app container on a simulator.
 */
export const getAppContainerTool = {
  name: "get_app_container",
  description:
    "Get the filesystem path to the container of an installed app on a simulator device. " +
    "Useful for inspecting app data, documents, or bundle contents.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    bundle_id: z
      .string()
      .describe("Bundle identifier of the installed app"),
  }),
  execute: async (params: { device_id: string; bundle_id: string }) => {
    const { device_id, bundle_id } = params;

    const { stdout } = await exec("xcrun", [
      "simctl",
      "get_app_container",
      device_id,
      bundle_id,
    ]);

    const containerPath = stdout.trim();

    return JSON.stringify(
      {
        device_id,
        bundle_id,
        container_path: containerPath,
        message: `App container for ${bundle_id} on simulator ${device_id}: ${containerPath}`,
      },
      null,
      2
    );
  },
};
