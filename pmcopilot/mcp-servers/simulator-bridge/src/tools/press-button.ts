import { z } from "zod";
import { exec, isToolAvailable } from "../utils/exec.js";

/**
 * press_button tool definition for FastMCP.
 * Presses a hardware button (home or lock) on the simulator.
 */
export const pressButtonTool = {
  name: "press_button",
  description:
    "Press a hardware button on a booted simulator device. " +
    "Supported buttons: home, lock. " +
    "Requires idb (Facebook iOS Development Bridge) to be installed.",
  parameters: z.object({
    device_id: z
      .string()
      .describe("UDID of the simulator device"),
    button: z
      .enum(["home", "lock"])
      .describe("Button to press: home or lock"),
  }),
  execute: async (params: { device_id: string; button: "home" | "lock" }) => {
    const { device_id, button } = params;

    if (!(await isToolAvailable("idb"))) {
      throw new Error(
        "idb (iOS Development Bridge) is not installed or not on PATH. " +
          "Install it with: brew install idb-companion && pip install fb-idb"
      );
    }

    // idb expects the button name in uppercase
    const buttonArg = button.toUpperCase();

    await exec("idb", ["ui", "button", "--udid", device_id, buttonArg]);

    return JSON.stringify(
      {
        device_id,
        button,
        message: `Pressed ${button} button on simulator ${device_id}.`,
      },
      null,
      2
    );
  },
};
