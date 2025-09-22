/**
 * Unary logical operators
 * Handles logical negation and utility operations
 */

export function not(a: any): boolean {
  return !a;
}

export function length(s: any[] | string | number | undefined): number | undefined {
  if (s === undefined) {
    return undefined;
  }

  if (Array.isArray(s)) {
    return s.length;
  }

  return String(s).length;
}
