import { describe, test, expect } from "bun:test";
import { skipIfNoSimulator } from "./setup.js";
import { installAppTool } from "../src/tools/install-app.js";
import { launchAppTool } from "../src/tools/launch-app.js";

describe("simulator-bridge: app management", () => {
  test("install_app with invalid path (not .app) throws error", async () => {
    await expect(
      installAppTool.execute({
        device_id: "test-device",
        app_path: "/tmp/not-an-app.zip",
      })
    ).rejects.toThrow("must end with .app");
  });

  test("install_app with nonexistent .app path throws error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      installAppTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
        app_path: "/tmp/nonexistent.app",
      })
    ).rejects.toThrow();
  });

  test("launch_app with invalid bundle ID throws error", async () => {
    if (skipIfNoSimulator()) return;

    await expect(
      launchAppTool.execute({
        device_id: "00000000-0000-0000-0000-000000000000",
        bundle_id: "com.nonexistent.fake.app",
      })
    ).rejects.toThrow();
  });
});
