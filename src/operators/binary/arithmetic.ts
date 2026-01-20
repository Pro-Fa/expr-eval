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

  // If both values are strings and at least one of them is a non-number
  // then we want to concatenate the strings.
  if (typeof a === 'string' && typeof b === 'string') {
    const numA = Number(a);
    const numB = Number(b);

    if (isNaN(numA) || isNaN(numB)) {
      return `${a}${b}`;
    }
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

  // If both values can be converted to numbers then we want to add the numbers.
  if (!isNaN(Number(a)) && !isNaN(Number(b))) {
    return Number(a) + Number(b);
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
