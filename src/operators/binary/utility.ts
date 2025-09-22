/**
 * Binary utility operators
 * Handles special operations: concat, setVar, arrayIndexOrProperty, coalesce, as
 */

export function concat(a: any[] | string | undefined, b: any[] | string | undefined): any[] | string | undefined {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  } else if (typeof a === 'string' && typeof b === 'string') {
    return '' + a + b;
  } else {
    return undefined;
  }
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
