#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { FastMCP } from "fastmcp";
import {
  listSimulatorsTool,
  bootSimulatorTool,
  shutdownSimulatorTool,
  installAppTool,
  launchAppTool,
  terminateAppTool,
  getAppContainerTool,
  takeScreenshotTool,
  recordVideoTool,
  tapTool,
  swipeTool,
  typeTextTool,
  pressButtonTool,
  getAccessibilityTreeTool,
  openUrlTool,
} from "./tools/index.js";

// Read output directories from env with defaults
const screenshotDir =
  process.env.SCREENSHOT_DIR ?? path.join(process.cwd(), "screenshots");
const videoDir =
  process.env.VIDEO_DIR ?? path.join(process.cwd(), "videos");

// Create output directories if they do not exist
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const server = new FastMCP({
  name: "simulator-bridge",
  version: "0.1.0",
});

// Register all 15 tools

// Simulator lifecycle (PMC-075)
server.addTool(listSimulatorsTool);
server.addTool(bootSimulatorTool);
server.addTool(shutdownSimulatorTool);

// App management (PMC-076)
server.addTool(installAppTool);
server.addTool(launchAppTool);
server.addTool(terminateAppTool);
server.addTool(getAppContainerTool);

// Screen capture (PMC-077)
server.addTool(takeScreenshotTool);
server.addTool(recordVideoTool);

// Input interaction (PMC-078)
server.addTool(tapTool);
server.addTool(swipeTool);
server.addTool(typeTextTool);
server.addTool(pressButtonTool);

// Introspection (PMC-079)
server.addTool(getAccessibilityTreeTool);
server.addTool(openUrlTool);

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
