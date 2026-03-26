import fs from "node:fs";
import path from "node:path";

export interface EmulatorConfig {
  androidHome: string;
  screenshotDir: string;
  videoDir: string;
  adbPath: string;
  emulatorPath: string;
}

export function loadConfig(): EmulatorConfig {
  const androidHome = process.env.ANDROID_HOME;
  if (!androidHome) {
    throw new Error(
      "ANDROID_HOME environment variable is not set. " +
        "Set it to your Android SDK root (e.g. ~/Library/Android/sdk)."
    );
  }

  const pluginData =
    process.env.CLAUDE_PLUGIN_DATA ||
    path.join(
      process.env.HOME || process.env.USERPROFILE || "/tmp",
      ".claude",
      "plugins",
      "data",
      "pmcopilot"
    );

  const screenshotDir =
    process.env.SCREENSHOT_DIR ||
    path.join(pluginData, "screenshots", "android");

  const videoDir =
    process.env.VIDEO_DIR || path.join(pluginData, "videos", "android");

  const adbPath = path.join(androidHome, "platform-tools", "adb");
  const emulatorPath = path.join(androidHome, "emulator", "emulator");

  if (!fs.existsSync(adbPath)) {
    throw new Error(
      `adb binary not found at ${adbPath}. ` +
        "Ensure Android SDK platform-tools are installed."
    );
  }

  if (!fs.existsSync(emulatorPath)) {
    throw new Error(
      `emulator binary not found at ${emulatorPath}. ` +
        "Ensure Android SDK emulator package is installed."
    );
  }

  return {
    androidHome,
    screenshotDir,
    videoDir,
    adbPath,
    emulatorPath,
  };
}
