import { execFile } from "node:child_process";

/**
 * Check whether the iOS Simulator toolchain (xcrun simctl) is available on this machine.
 */
export function isSimulatorAvailable(): boolean {
  try {
    const result = Bun.spawnSync(["xcrun", "simctl", "list", "devices", "--json"]);
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Returns true if the test should be skipped because the simulator toolchain
 * is not present. Logs a message when skipping.
 */
export function skipIfNoSimulator(): boolean {
  if (!isSimulatorAvailable()) {
    console.log("Skipping: iOS Simulator not available");
    return true;
  }
  return false;
}

/**
 * Check whether idb (Facebook iOS Development Bridge) is available on PATH.
 */
export function isIdbAvailable(): boolean {
  try {
    const result = Bun.spawnSync(["which", "idb"]);
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Returns true if the test should be skipped because idb is not installed.
 */
export function skipIfNoIdb(): boolean {
  if (!isIdbAvailable()) {
    console.log("Skipping: idb (iOS Development Bridge) not available");
    return true;
  }
  return false;
}
