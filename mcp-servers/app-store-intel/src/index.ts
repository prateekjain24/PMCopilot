#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
  searchAppStoreTool,
  searchPlayStoreTool,
  getAppDetailsTool,
  getVersionHistoryTool,
  getAppReviewsTool,
  getReviewSentimentTool,
  getCategoryRankingsTool,
  compareAppsTool,
  getSimilarAppsTool,
  trackRatingHistoryTool,
} from "./tools/index.js";

const server = new FastMCP({
  name: "app-store-intel",
  version: "0.1.0",
});

// Search tools (PMC-087)
server.addTool(searchAppStoreTool);
server.addTool(searchPlayStoreTool);

// Details tools (PMC-088)
server.addTool(getAppDetailsTool);
server.addTool(getVersionHistoryTool);

// Reviews tools (PMC-089)
server.addTool(getAppReviewsTool);
server.addTool(getReviewSentimentTool);

// Rankings tools (PMC-090)
server.addTool(getCategoryRankingsTool);
server.addTool(compareAppsTool);
server.addTool(getSimilarAppsTool);
server.addTool(trackRatingHistoryTool);

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
