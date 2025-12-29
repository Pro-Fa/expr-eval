/**
 * Checks if an array contains a specific value
 * Uses strict equality (===) for comparison
 *
 * @param array - The array to search in
 * @param obj - The value to search for
 * @returns true if the array contains the value, false otherwise
 */
export default function contains<T>(array: readonly T[], obj: T): boolean {
  return array.includes(obj);
}
