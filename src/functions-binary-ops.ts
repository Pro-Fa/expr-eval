import contains from './contains';

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

export function concat(a: any[] | string | undefined, b: any[] | string | undefined): any[] | string | undefined {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  } else if (typeof a === 'string' && typeof b === 'string') {
    return '' + a + b;
  } else {
    return undefined;
  }
}

export function equal(a: any, b: any): boolean {
  return a === b;
}

export function notEqual(a: any, b: any): boolean {
  return a !== b;
}

export function greaterThan(a: any, b: any): boolean {
  return a > b;
}

export function lessThan(a: any, b: any): boolean {
  return a < b;
}

export function greaterThanEqual(a: any, b: any): boolean {
  return a >= b;
}

export function lessThanEqual(a: any, b: any): boolean {
  return a <= b;
}

export function setVar(name: string, value: any, variables: Record<string, any> | undefined): any {
  if (variables) {
    variables[name] = value;
  }
  return value;
}

export function arrayIndexOrProperty(parent: any, index: number | string | undefined): any {
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

export function coalesce(a: any, b: any): any {
  return a === undefined || a === null || a === Infinity || isNaN(a) ? b : a;
}

export function asOperator(a: any, b: string | undefined): any {
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
