import { z } from "zod";
import { exec, isToolAvailable } from "../utils/exec.js";

/**
 * tap tool definition for FastMCP.
 * Performs a tap gesture at specific coordinates on the simulator screen.
 */
export const tapTool = {
  name: "tap",
  description:
    "Perform a tap gesture at specific screen coordinates on a booted simulator device. " +
    "Requires idb (Facebook iOS Development Bridge) to be installed.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    x: z.number().describe("X coordinate of the tap point"),
    y: z.number().describe("Y coordinate of the tap point"),
  }),
  execute: async (params: { device_id: string; x: number; y: number }) => {
    const { device_id, x, y } = params;

    if (!(await isToolAvailable("idb"))) {
      throw new Error(
        "idb (iOS Development Bridge) is not installed or not on PATH. " +
          "Install it with: brew install idb-companion && pip install fb-idb"
      );
    }

    await exec("idb", [
      "ui",
      "tap",
      "--udid",
      device_id,
      String(x),
      String(y),
    ]);

    return JSON.stringify(
      {
        device_id,
        x,
        y,
        message: `Tapped at (${x}, ${y}) on simulator ${device_id}.`,
      },
      null,
      2
    );
  },
};
