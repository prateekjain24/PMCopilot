#!/usr/bin/env node

import fs from "node:fs";
import { FastMCP } from "fastmcp";
import { loadConfig } from "./config.js";
import {
  listEmulatorsTool,
  listDevicesTool,
  startEmulatorTool,
  installApkTool,
  launchAppTool,
  grantPermissionTool,
  clearAppDataTool,
  takeScreenshotTool,
  recordScreenTool,
  tapTool,
  swipeTool,
  typeTextTool,
  pressKeyTool,
  dumpUiTool,
  getCurrentActivityTool,
  getLogcatTool,
} from "./tools/index.js";

let config;
try {
  config = loadConfig();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[emulator-bridge] Configuration error: ${message}`);
  process.exit(1);
}

// Ensure screenshot and video directories exist
fs.mkdirSync(config.screenshotDir, { recursive: true });
fs.mkdirSync(config.videoDir, { recursive: true });

const server = new FastMCP({
  name: "emulator-bridge",
  version: "0.1.0",
});

// PMC-081: Device management (3 tools)
server.addTool(listEmulatorsTool);
server.addTool(listDevicesTool);
server.addTool(startEmulatorTool);

// PMC-082: App management (4 tools)
server.addTool(installApkTool);
server.addTool(launchAppTool);
server.addTool(grantPermissionTool);
server.addTool(clearAppDataTool);

// PMC-083: Screenshot/video (2 tools)
server.addTool(takeScreenshotTool);
server.addTool(recordScreenTool);

// PMC-084: Input (4 tools)
server.addTool(tapTool);
server.addTool(swipeTool);
server.addTool(typeTextTool);
server.addTool(pressKeyTool);

// PMC-085: UI dump/logcat (3 tools)
server.addTool(dumpUiTool);
server.addTool(getCurrentActivityTool);
server.addTool(getLogcatTool);

// Graceful shutdown
const shutdown = () => {
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server on STDIO transport
server.start({
  transportType: "stdio",
});
