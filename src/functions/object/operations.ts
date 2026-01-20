/**
 * Object manipulation functions
 * Provides comprehensive object operations for the expression parser
 */

import { Value, ValueObject } from '../../types/values.js';

/**
 * Merges two or more objects together.
 * Duplicate keys will be overwritten by later arguments.
 * @param objects - Objects to merge
 * @returns Merged object or undefined if any argument is undefined
 */
export function merge(...objects: (ValueObject | undefined)[]): ValueObject | undefined {
  if (objects.length === 0) {
    return {};
  }

  for (const obj of objects) {
    if (obj === undefined) {
      return undefined;
    }
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      throw new Error('Arguments to merge must be objects');
    }
  }

  return Object.assign({}, ...objects);
}

/**
 * Returns an array of the keys of an object.
 * @param obj - The object to get keys from
 * @returns Array of string keys or undefined if input is undefined
 */
export function keys(obj: ValueObject | undefined): string[] | undefined {
  if (obj === undefined) {
    return undefined;
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('Argument to keys must be an object');
  }
  return Object.keys(obj);
}

/**
 * Returns an array of the values of an object.
 * @param obj - The object to get values from
 * @returns Array of values or undefined if input is undefined
 */
export function values(obj: ValueObject | undefined): Value[] | undefined {
  if (obj === undefined) {
    return undefined;
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('Argument to values must be an object');
  }
  return Object.values(obj);
}

/**
 * Flattens a nested object's keys using underscore as separator.
 * For example: { foo: { bar: 1 } } becomes { foo_bar: 1 }
 * @param obj - The object to flatten
 * @param separator - The separator to use (default: '_')
 * @returns Flattened object or undefined if input is undefined
 */
export function flatten(
  obj: ValueObject | undefined,
  separator: string = '_'
): ValueObject | undefined {
  if (obj === undefined) {
    return undefined;
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('First argument to flatten must be an object');
  }
  if (typeof separator !== 'string') {
    throw new Error('Second argument to flatten must be a string');
  }

  const result: ValueObject = {};

  function flattenHelper(current: Value, prefix: string): void {
    if (
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current)
    ) {
      for (const key of Object.keys(current as ValueObject)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        flattenHelper((current as ValueObject)[key], newKey);
      }
    } else {
      result[prefix] = current;
    }
  }

  flattenHelper(obj, '');

  return result;
}
