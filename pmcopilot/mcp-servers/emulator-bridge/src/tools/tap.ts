import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * tap tool definition for FastMCP.
 * Performs a tap gesture at specific coordinates on an Android device/emulator.
 */
export const tapTool = {
  name: "tap",
  description:
    "Perform a tap gesture at specific screen coordinates on a connected Android device or emulator. " +
    "Coordinates are in pixels relative to the device screen.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    x: z.number().int().describe("X coordinate of the tap point (pixels)"),
    y: z.number().int().describe("Y coordinate of the tap point (pixels)"),
  }),
  execute: async (params: { device_id: string; x: number; y: number }) => {
    const { device_id, x, y } = params;

    await adbShell(device_id, `input tap ${x} ${y}`);

    return JSON.stringify(
      {
        device_id,
        x,
        y,
        message: `Tapped at (${x}, ${y}) on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
