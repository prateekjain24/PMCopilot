#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
  riceScoreTool,
  riceBatchTool,
  iceScoreTool,
  kanoClassifyTool,
  kanoBatchTool,
  moscowSortTool,
  tamSamSomTool,
  weightedScoreTool,
  opportunityScoreTool,
  costOfDelayTool,
  sampleSizeCalcTool,
  significanceTestTool,
} from "./tools/index.js";

const server = new FastMCP({
  name: "pm-frameworks",
  version: "0.1.0",
});

// Register all tools
server.addTool(riceScoreTool);
server.addTool(riceBatchTool);
server.addTool(iceScoreTool);
server.addTool(kanoClassifyTool);
server.addTool(kanoBatchTool);
server.addTool(moscowSortTool);
server.addTool(tamSamSomTool);
server.addTool(weightedScoreTool);
server.addTool(opportunityScoreTool);
server.addTool(costOfDelayTool);
server.addTool(sampleSizeCalcTool);
server.addTool(significanceTestTool);

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
