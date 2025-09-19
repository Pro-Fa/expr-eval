import contains from './contains';

export function add(a, b) {
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

export function sub(a, b) {
  return a === undefined || b === undefined ? undefined : a - b;
}

export function mul(a, b) {
  return a === undefined || b === undefined ? undefined : a * b;
}

export function div(a, b) {
  return a === undefined || b === undefined ? undefined : a / b;
}

export function mod(a, b) {
  return a === undefined || b === undefined ? undefined : a % b;
}

export function pow(a) {
  if (a === undefined) return undefined;
  return Math.pow(a);
}

export function concat(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  } else if (typeof a === 'string' && typeof b === 'string') {
    return '' + a + b;
  } else {
    return undefined;
  }
}

export function equal(a, b) {
  return a === b;
}

export function notEqual(a, b) {
  return a !== b;
}

export function greaterThan(a, b) {
  return a > b;
}

export function lessThan(a, b) {
  return a < b;
}

export function greaterThanEqual(a, b) {
  return a >= b;
}

export function lessThanEqual(a, b) {
  return a <= b;
}

export function setVar(name, value, variables) {
  if (variables) variables[name] = value;
  return value;
}

export function arrayIndexOrProperty(parent, index) {
  if (parent === undefined || index === undefined) {
    return undefined;
  }

  if (typeof index !== 'number' && typeof index !== 'string') {
    return undefined;
  }

  // When parent is array and index is not a round number: Throw error.
  if (Array.isArray(parent) && !Number.isInteger(index)) {
    throw new Error(`Array can only be indexed with integers. Received: ${index}`);
  }

  return parent[index];
}

export function andOperator(a, b) {
  return Boolean(a && b);
}

export function orOperator(a, b) {
  return Boolean(a || b);
}

export function inOperator(a, b) {
  return b === undefined ? false : contains(b, a);
}

export function notInOperator(a, b) {
  return !inOperator(a, b);
}

export function coalesce(a, b) {
  return a === undefined || a === null || a === Infinity || isNaN(a) ? b : a;
}

export function asOperator(a, b) {
  if (a === undefined || b === undefined) {
    return undefined;
  }
  if (typeof b === 'string') {
    switch (b.toLowerCase()) {
    case 'boolean':
      return Boolean(a);
    case 'int':
    case 'integer':
      return Math.round(Number(a));
    case 'number':
      return Number(a);
    }
  }
  throw new Error(`unknown type: ${b}`);
}
