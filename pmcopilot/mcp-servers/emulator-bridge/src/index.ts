#!/usr/bin/env node

import fs from "node:fs";
import { FastMCP } from "fastmcp";
import { loadConfig } from "./config.js";

// Tools will be imported here as they are implemented (PMC-081..085)
// import { ... } from "./tools/index.js";

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

// Tools will be registered here as they are implemented (PMC-081..085)
// server.addTool(...);

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
