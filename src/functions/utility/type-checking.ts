/**
 * Type checking utility functions
 * Provides functions to check the type of values
 */

/**
 * Checks if a value is an array
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Checks if a value is an object (and not null or array)
 * @param value - The value to check
 * @returns True if the value is an object (excluding null and arrays), false otherwise
 */
export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is a number
 * @param value - The value to check
 * @returns True if the value is a number, false otherwise
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number';
}

/**
 * Checks if a value is a string
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 */
export function isString(value: any): boolean {
  return typeof value === 'string';
}

/**
 * Checks if a value is a boolean
 * @param value - The value to check
 * @returns True if the value is a boolean, false otherwise
 */
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is null
 * @param value - The value to check
 * @returns True if the value is null, false otherwise
 */
export function isNull(value: any): boolean {
  return value === null;
}

/**
 * Checks if a value is undefined
 * @param value - The value to check
 * @returns True if the value is undefined, false otherwise
 */
export function isUndefined(value: any): boolean {
  return value === undefined;
}

/**
 * Checks if a value is a function
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 */
export function isFunctionValue(value: any): boolean {
  return typeof value === 'function';
}

