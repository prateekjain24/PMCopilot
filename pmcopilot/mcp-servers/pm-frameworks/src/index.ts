#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { riceScoreTool, riceBatchTool, iceScoreTool } from "./tools/index.js";

const server = new FastMCP({
  name: "pm-frameworks",
  version: "0.1.0",
});

// Register all tools
server.addTool(riceScoreTool);
server.addTool(riceBatchTool);
server.addTool(iceScoreTool);

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
