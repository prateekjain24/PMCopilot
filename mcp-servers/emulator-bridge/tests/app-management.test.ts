import { describe, test, expect } from "bun:test";
import { skipIfNoEmulator } from "./setup.js";
import { installApkTool } from "../src/tools/install-apk.js";
import { launchAppTool } from "../src/tools/launch-app.js";

describe("emulator-bridge: app management", () => {
  test("install_apk with invalid path (not .apk) throws error", async () => {
    await expect(
      installApkTool.execute({
        device_id: "emulator-5554",
        apk_path: "/tmp/not-an-apk.zip",
      })
    ).rejects.toThrow("must end with .apk");
  });

  test("install_apk validates .apk extension via schema", () => {
    const parsed = installApkTool.parameters.safeParse({
      device_id: "emulator-5554",
      apk_path: "/path/to/app.apk",
    });

    expect(parsed.success).toBe(true);
  });

  test("launch_app with invalid device throws error", async () => {
    if (skipIfNoEmulator()) return;

    await expect(
      launchAppTool.execute({
        device_id: "nonexistent-device-000",
        package: "com.nonexistent.fake",
        activity: "com.nonexistent.fake.MainActivity",
      })
    ).rejects.toThrow();
  });

  test("launch_app parameter schema validates required fields", () => {
    const parsed = launchAppTool.parameters.safeParse({
      device_id: "emulator-5554",
      package: "com.example.app",
      activity: "com.example.app.MainActivity",
    });

    expect(parsed.success).toBe(true);

    const incomplete = launchAppTool.parameters.safeParse({
      device_id: "emulator-5554",
      package: "com.example.app",
      // missing activity
    });

    expect(incomplete.success).toBe(false);
  });
});
