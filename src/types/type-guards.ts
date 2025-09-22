/**
 * Type guards and utility functions for value type checking
 */

import type { Value, Primitive, ExpressionFunction, ValueObject, ValueArray } from './values.js';

/**
 * Type guard to check if a value is a primitive type
 */
export function isPrimitive(value: Value): value is Primitive {
  return value === null || value === undefined ||
           typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
}

/**
 * Type guard to check if a value is a function
 */
export function isFunction(value: Value): value is ExpressionFunction {
  return typeof value === 'function';
}

/**
 * Type guard to check if a value is an object (but not array or null)
 */
export function isValueObject(value: Value): value is ValueObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is an array
 */
export function isValueArray(value: Value): value is ValueArray {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is numeric (number or numeric string)
 */
export function isNumeric(value: Value): value is number | string {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'string') {
    return !isNaN(Number(value)) && value.trim() !== '';
  }
  return false;
}
