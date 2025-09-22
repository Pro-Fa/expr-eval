/**
 * Binary logical operators
 * Handles logical operations: &&, ||, and, or
 */
import contains from '../../core/contains.js';

export function andOperator(a: any, b: any): boolean {
  return Boolean(a && b);
}

export function orOperator(a: any, b: any): boolean {
  return Boolean(a || b);
}

export function inOperator(a: any, b: any[] | undefined): boolean {
  return b === undefined ? false : contains(b, a);
}

export function notInOperator(a: any, b: any[] | undefined): boolean {
  return !inOperator(a, b);
}
