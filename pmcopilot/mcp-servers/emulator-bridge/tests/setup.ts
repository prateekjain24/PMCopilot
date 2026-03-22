import fs from "node:fs";
import path from "node:path";

/**
 * Check whether adb is available on this machine by looking for ANDROID_HOME
 * and the adb binary in platform-tools.
 */
export function isEmulatorAvailable(): boolean {
  const androidHome = process.env.ANDROID_HOME;
  if (!androidHome) {
    return false;
  }

  const adbPath = path.join(androidHome, "platform-tools", "adb");
  try {
    return fs.existsSync(adbPath);
  } catch {
    return false;
  }
}

/**
 * Returns true if the test should be skipped because the Android SDK / adb
 * is not present. Logs a message when skipping.
 */
export function skipIfNoEmulator(): boolean {
  if (!isEmulatorAvailable()) {
    console.log("Skipping: Android SDK / adb not available (ANDROID_HOME not set or adb not found)");
    return true;
  }
  return false;
}

/**
 * Check whether the Android emulator binary is available.
 */
export function isEmulatorBinaryAvailable(): boolean {
  const androidHome = process.env.ANDROID_HOME;
  if (!androidHome) {
    return false;
  }

  const emulatorPath = path.join(androidHome, "emulator", "emulator");
  try {
    return fs.existsSync(emulatorPath);
  } catch {
    return false;
  }
}

/**
 * Returns true if the test should be skipped because the emulator binary
 * is not installed.
 */
export function skipIfNoEmulatorBinary(): boolean {
  if (!isEmulatorBinaryAvailable()) {
    console.log("Skipping: Android emulator binary not available");
    return true;
  }
  return false;
}
