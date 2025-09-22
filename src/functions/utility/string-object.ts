/**
 * String and object manipulation utility functions
 */

import { Value } from '../../types/values.js';

/**
 * Converts a value to JSON string representation
 * @param content - The value to stringify
 * @returns JSON string representation
 */
export function json(content: Value): string | undefined {
  if (content === undefined) {
    return undefined;
  }
  return JSON.stringify(content);
}
