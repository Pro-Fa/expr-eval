/**
 * Binary arithmetic operators
 * Handles basic mathematical operations: +, -, *, /, %, ^
 */

export function add(a: any, b: any): any {
  // If either value is undefined then the sum is undefined.
  if (a === undefined || b === undefined) {
    return undefined;
  }

  // If both values are numbers then we want to add the numbers.
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  // If both values are booleans or numbers (and at least one is boolean), convert to numbers and add.
  if (
    (typeof a === 'boolean' || typeof a === 'number') &&
    (typeof b === 'boolean' || typeof b === 'number') &&
    (typeof a === 'boolean' || typeof b === 'boolean')
  ) {
    return Number(a) + Number(b);
  }

  // If one of the values is a string and both are either string or number, try to add or else concatenate.
  if (
    (typeof a === 'string' || typeof b === 'string') &&
    (typeof a === 'string' || typeof a === 'number') &&
    (typeof b === 'string' || typeof b === 'number')
  ) {
    const numA = Number(a);
    const numB = Number(b);

    if (isNaN(numA) || isNaN(numB)) {
      return `${a}${b}`;
    }

    // If both values can be converted to numbers then we want to add the numbers.
    return numA + numB;
  }

  // If both values are arrays then we want to concatenate the arrays.
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }

  // If both values are objects then we want to merge the objects.
  if (
    typeof a === 'object' &&
    typeof b === 'object' &&
    !Array.isArray(a) &&
    !Array.isArray(b)
  ) {
    return { ...a, ...b };
  }

  // Otherwise return an error indicating that the values of mixed types cannot be added.
  throw new Error(`Cannot add values of incompatible types: ${typeof a} and ${typeof b}`);
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
