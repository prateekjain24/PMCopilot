import { ValidationError } from "../types.js";

/**
 * Validates that a number falls within [min, max].
 * Throws ValidationError if out of range.
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  field: string
): number {
  if (value < min || value > max) {
    throw new ValidationError(
      field,
      `must be between ${min} and ${max}, got ${value}`
    );
  }
  return value;
}

/**
 * Validates that a number is strictly positive (> 0).
 * Throws ValidationError if <= 0.
 */
export function validatePositive(value: number, field: string): number {
  if (value <= 0) {
    throw new ValidationError(field, `must be greater than 0, got ${value}`);
  }
  return value;
}

/**
 * Checks if a value is in an expected scale.
 * Logs a warning if the value is not in the scale but still returns it.
 */
export function validateScale(
  value: number,
  scale: number[],
  field: string
): number {
  if (!scale.includes(value)) {
    console.error(
      `[warn] ${field} value ${value} is not in the standard scale [${scale.join(", ")}]. Proceeding with calculation.`
    );
  }
  return value;
}

/**
 * Rounds a number to N decimal places.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
