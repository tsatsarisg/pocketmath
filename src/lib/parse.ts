// Input sanitization helpers for the calculator delivery layer.
// These normalize the raw string values from text/number inputs before they
// reach the pure tax domain. They live here (not in src/lib/tax) so the domain
// stays free of UI-string concerns.

/** Parse a string to a non-negative float, falling back to `fallback` (default 0). */
export function parseNonNegative(value: string, fallback = 0): number {
  return Math.max(0, parseFloat(value) || fallback);
}

/** Parse a string to a non-negative integer, falling back to `fallback` (default 0). */
export function parseNonNegativeInt(value: string, fallback = 0): number {
  return Math.max(0, parseInt(value, 10) || fallback);
}

/** Parse and clamp an age string into the domain-valid range [16, 120]. */
export function clampAge(value: string, fallback = 35): number {
  return Math.min(120, Math.max(16, parseInt(value, 10) || fallback));
}
