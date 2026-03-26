import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * swipe tool definition for FastMCP.
 * Performs a swipe gesture between two points on an Android device/emulator.
 */
export const swipeTool = {
  name: "swipe",
  description:
    "Perform a swipe gesture from one point to another on a connected Android device or emulator. " +
    "Coordinates are in pixels. Duration controls swipe speed (longer = slower).",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    x1: z.number().int().describe("Starting X coordinate (pixels)"),
    y1: z.number().int().describe("Starting Y coordinate (pixels)"),
    x2: z.number().int().describe("Ending X coordinate (pixels)"),
    y2: z.number().int().describe("Ending Y coordinate (pixels)"),
    duration_ms: z
      .number()
      .int()
      .optional()
      .default(300)
      .describe("Duration of the swipe in milliseconds (default: 300)"),
  }),
  execute: async (params: {
    device_id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    duration_ms?: number;
  }) => {
    const { device_id, x1, y1, x2, y2, duration_ms = 300 } = params;

    await adbShell(
      device_id,
      `input swipe ${x1} ${y1} ${x2} ${y2} ${duration_ms}`
    );

    return JSON.stringify(
      {
        device_id,
        from: { x: x1, y: y1 },
        to: { x: x2, y: y2 },
        duration_ms,
        message: `Swiped from (${x1}, ${y1}) to (${x2}, ${y2}) over ${duration_ms}ms on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
