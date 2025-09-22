/**
 * Random number generation functions
 */

/**
 * Generates a random number between 0 and the specified maximum
 * @param a - The maximum value (default: 1)
 * @returns A random number between 0 and a
 */
export function random(a?: number): number {
  return Math.random() * (a || 1);
}
