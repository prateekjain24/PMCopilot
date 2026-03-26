import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * type_text tool definition for FastMCP.
 * Types text into the currently focused field on an Android device/emulator.
 */
export const typeTextTool = {
  name: "type_text",
  description:
    "Type text into the currently focused input field on a connected Android device or emulator. " +
    "A text field must be focused before calling this tool. " +
    "Special characters and spaces are escaped automatically for the adb shell input text command.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    text: z
      .string()
      .describe("Text to type into the focused field"),
  }),
  execute: async (params: { device_id: string; text: string }) => {
    const { device_id, text } = params;

    // adb shell input text requires escaping:
    // - spaces become %s
    // - special shell characters need escaping
    const escaped = text
      .replace(/\\/g, "\\\\")
      .replace(/ /g, "%s")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/&/g, "\\&")
      .replace(/</g, "\\<")
      .replace(/>/g, "\\>")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\|/g, "\\|")
      .replace(/;/g, "\\;")
      .replace(/\$/g, "\\$")
      .replace(/`/g, "\\`");

    await adbShell(device_id, `input text "${escaped}"`);

    return JSON.stringify(
      {
        device_id,
        text,
        message: `Typed "${text}" on device ${device_id}.`,
      },
      null,
      2
    );
  },
};
