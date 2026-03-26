import { z } from "zod";
import { exec } from "../utils/exec.js";

/**
 * launch_app tool definition for FastMCP.
 * Launches an installed app on a simulator device by bundle ID.
 */
export const launchAppTool = {
  name: "launch_app",
  description:
    "Launch an installed app on a booted simulator device by its bundle identifier. " +
    "Returns the process ID (PID) of the launched app if available.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device to launch the app on"),
    bundle_id: z
      .string()
      .describe("Bundle identifier of the app to launch (e.g. com.example.MyApp)"),
  }),
  execute: async (params: { device_id: string; bundle_id: string }) => {
    const { device_id, bundle_id } = params;

    const { stdout } = await exec("xcrun", [
      "simctl",
      "launch",
      device_id,
      bundle_id,
    ]);

    // xcrun simctl launch outputs something like "com.example.MyApp: 12345"
    let pid: number | null = null;
    const pidMatch = stdout.match(/:\s*(\d+)/);
    if (pidMatch) {
      pid = parseInt(pidMatch[1], 10);
    }

    return JSON.stringify(
      {
        device_id,
        bundle_id,
        pid,
        message: `App ${bundle_id} launched on simulator ${device_id}${pid ? ` with PID ${pid}` : ""}.`,
      },
      null,
      2
    );
  },
};
