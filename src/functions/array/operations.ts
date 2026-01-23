/**
 * Array operation functions
 * Handles array manipulation and processing operations
 */

export function filter(f: Function, a: any[] | undefined): any[] | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (typeof f !== 'function') {
    throw new Error('First argument to filter is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to filter is not an array');
  }
  return a.filter(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function fold(f: Function, init: any, a: any[] | undefined): any {
  if (a === undefined) {
    return undefined;
  }
  if (typeof f !== 'function') {
    throw new Error('First argument to fold is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to fold is not an array');
  }
  return a.reduce(function (acc: any, x: any, i: number): any {
    return f(acc, x, i);
  }, init);
}

export function indexOf(target: any, s: string | any[] | undefined): number | undefined {
  if (s === undefined) {
    return undefined;
  }
  if (!(Array.isArray(s) || typeof s === 'string')) {
    throw new Error('Second argument to indexOf is not a string or array');
  }

  return s.indexOf(target);
}

export function join(sep: string | undefined, a: any[] | undefined): string | undefined {
  if (sep === undefined || a === undefined) {
    return undefined;
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to join is not an array');
  }

  return a.join(sep);
}

export function map(f: Function, a: any[] | undefined): any[] | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (typeof f !== 'function') {
    throw new Error('First argument to map is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to map is not an array');
  }
  return a.map(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function sum(array: (number | undefined)[] | undefined): number | undefined {
  if (array === undefined) {
    return undefined;
  }
  if (!Array.isArray(array)) {
    throw new Error('Sum argument is not an array');
  }
  if (array.includes(undefined)) {
    return undefined;
  }

  return array.reduce(function (total: number, value: number | undefined): number {
    return total + (value === undefined ? 0 : Number(value));
  }, 0);
}

export function count(array: any[] | undefined): number | undefined {
  if (array === undefined) {
    return undefined;
  }
  if (!Array.isArray(array)) {
    throw new Error('Count argument is not an array');
  }
  return array.length;
}
