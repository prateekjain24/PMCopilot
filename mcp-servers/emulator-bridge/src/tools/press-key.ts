import { z } from "zod";
import { adbShell } from "../helpers/adb.js";

/**
 * press_key tool definition for FastMCP.
 * Sends a key event to an Android device/emulator.
 */
export const pressKeyTool = {
  name: "press_key",
  description:
    "Send a key event to a connected Android device or emulator. " +
    "Accepts either a keycode name (e.g. KEYCODE_BACK) or a numeric keycode (e.g. 4). " +
    "Common keycodes: " +
    "KEYCODE_HOME (3), KEYCODE_BACK (4), KEYCODE_CALL (5), KEYCODE_ENDCALL (6), " +
    "KEYCODE_VOLUME_UP (24), KEYCODE_VOLUME_DOWN (25), KEYCODE_POWER (26), " +
    "KEYCODE_CAMERA (27), KEYCODE_MENU (82), KEYCODE_SEARCH (84), " +
    "KEYCODE_ENTER (66), KEYCODE_DEL (67), KEYCODE_TAB (61), " +
    "KEYCODE_DPAD_UP (19), KEYCODE_DPAD_DOWN (20), KEYCODE_DPAD_LEFT (21), KEYCODE_DPAD_RIGHT (22), " +
    "KEYCODE_DPAD_CENTER (23), KEYCODE_APP_SWITCH (187).",
  parameters: z.object({
    device_id: z
      .string()
      .describe("Device/emulator ID from list_devices"),
    keycode: z
      .union([z.string(), z.number()])
      .describe(
        "Keycode name (e.g. KEYCODE_BACK) or numeric keycode (e.g. 4)"
      ),
  }),
  execute: async (params: {
    device_id: string;
    keycode: string | number;
  }) => {
    const { device_id, keycode } = params;

    const keycodeStr = String(keycode);

    await adbShell(device_id, `input keyevent ${keycodeStr}`);

    return JSON.stringify(
      {
        device_id,
        keycode: keycodeStr,
        message: `Key event ${keycodeStr} sent to device ${device_id}.`,
      },
      null,
      2
    );
  },
};
