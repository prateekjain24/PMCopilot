import { z } from "zod";
import { exec, isToolAvailable } from "../utils/exec.js";

/**
 * swipe tool definition for FastMCP.
 * Performs a swipe gesture between two points on the simulator screen.
 */
export const swipeTool = {
  name: "swipe",
  description:
    "Perform a swipe gesture from one point to another on a booted simulator device. " +
    "Requires idb (Facebook iOS Development Bridge) to be installed.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    x1: z.number().describe("Starting X coordinate"),
    y1: z.number().describe("Starting Y coordinate"),
    x2: z.number().describe("Ending X coordinate"),
    y2: z.number().describe("Ending Y coordinate"),
    duration: z
      .number()
      .optional()
      .default(0.5)
      .describe("Duration of the swipe in seconds (default: 0.5)"),
  }),
  execute: async (params: {
    device_id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    duration?: number;
  }) => {
    const { device_id, x1, y1, x2, y2, duration = 0.5 } = params;

    if (!(await isToolAvailable("idb"))) {
      throw new Error(
        "idb (iOS Development Bridge) is not installed or not on PATH. " +
          "Install it with: brew install idb-companion && pip install fb-idb"
      );
    }

    await exec("idb", [
      "ui",
      "swipe",
      "--udid",
      device_id,
      String(x1),
      String(y1),
      String(x2),
      String(y2),
      "--duration",
      String(duration),
    ]);

    return JSON.stringify(
      {
        device_id,
        from: { x: x1, y: y1 },
        to: { x: x2, y: y2 },
        duration,
        message: `Swiped from (${x1}, ${y1}) to (${x2}, ${y2}) over ${duration}s on simulator ${device_id}.`,
      },
      null,
      2
    );
  },
};
