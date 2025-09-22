/**
 * Binary arithmetic operators
 * Handles basic mathematical operations: +, -, *, /, %, ^
 */

export function add(a: any, b: any): any {
  // If either value is undefined then the sum is undefined.
  if (a === undefined || b === undefined) {
    return undefined;
  }
  // If both values are strings and at least one of them in a non-number
  // then we want to concatenate the strings.
  if (typeof a === 'string' && typeof b === 'string') {
    const numA = Number(a);
    const numB = Number(b);
    if (isNaN(numA) || isNaN(numB)) {
      return a + b;
    }
  }

  // Add the numeric values.
  return Number(a) + Number(b);
}

export function sub(a: number | undefined, b: number | undefined): number | undefined {
  return a === undefined || b === undefined ? undefined : a - b;
}

export function mul(a: number | undefined, b: number | undefined): number | undefined {
  return a === undefined || b === undefined ? undefined : a * b;
}

export function div(a: number | undefined, b: number | undefined): number | undefined {
  return a === undefined || b === undefined ? undefined : a / b;
}

export function mod(a: number | undefined, b: number | undefined): number | undefined {
  return a === undefined || b === undefined ? undefined : a % b;
}

export function pow(a: number | undefined, b: number | undefined): number | undefined {
  return a === undefined || b === undefined ? undefined : Math.pow(a, b);
}
