import { z } from "zod";
import { exec, isToolAvailable } from "../utils/exec.js";

/**
 * type_text tool definition for FastMCP.
 * Types text into the currently focused field on the simulator.
 */
export const typeTextTool = {
  name: "type_text",
  description:
    "Type text into the currently focused input field on a booted simulator device. " +
    "Requires idb (Facebook iOS Development Bridge) to be installed. " +
    "A text field must be focused before calling this tool.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    text: z
      .string()
      .describe("Text to type into the focused field"),
  }),
  execute: async (params: { device_id: string; text: string }) => {
    const { device_id, text } = params;

    if (!(await isToolAvailable("idb"))) {
      throw new Error(
        "idb (iOS Development Bridge) is not installed or not on PATH. " +
          "Install it with: brew install idb-companion && pip install fb-idb"
      );
    }

    await exec("idb", ["ui", "text", "--udid", device_id, text]);

    return JSON.stringify(
      {
        device_id,
        text,
        message: `Typed "${text}" on simulator ${device_id}.`,
      },
      null,
      2
    );
  },
};
