/**
 * Shared types for PM Frameworks MCP server.
 */

export interface ScoreResult {
  score: number;
  summary: string;
  params: Record<string, number>;
}

export interface BatchFeature {
  name: string;
  score: number;
  rank: number;
  params: Record<string, number>;
}

export interface BatchStats {
  mean: number;
  median: number;
  min: number;
  max: number;
}

export interface BatchResult {
  features: BatchFeature[];
  stats: BatchStats;
}

export class ValidationError extends Error {
  field: string;
  constraint: string;

  constructor(field: string, constraint: string) {
    super(`Validation error on "${field}": ${constraint}`);
    this.name = "ValidationError";
    this.field = field;
    this.constraint = constraint;
  }
}
