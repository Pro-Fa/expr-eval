/**
 * Array operation functions
 * Handles array manipulation and processing operations
 */

/**
 * Get a user-friendly type name for a value
 */
function getTypeName(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export function filter(arg1: Function | any[] | undefined, arg2: Function | any[] | undefined): any[] | undefined {
  // Support both filter(array, fn) and filter(fn, array) for backwards compatibility
  // Early return for undefined first argument
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg2 === 'function') {
    // array-first: filter(array, fn)
    a = arg1;
    f = arg2;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg2) || arg2 === undefined)) {
    // function-first: filter(fn, array)
    f = arg1;
    a = arg2 as any[] | undefined;
  } else {
    throw new Error(
      `filter(array, predicate) expects an array and a function.\n` +
      'Example: filter([1, -2, 3], x => x > 0)'
    );
  }

  if (a === undefined) {
    return undefined;
  }
  return a.filter(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function fold(arg1: Function | any[] | undefined, arg2: any, arg3: Function | any[] | undefined): any {
  // Support both fold(array, initial, fn) and fold(fn, initial, array) for backwards compatibility
  // Early return for undefined arguments
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let init: any;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg3 === 'function') {
    // array-first: fold(array, initial, fn)
    a = arg1;
    init = arg2;
    f = arg3;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg3) || arg3 === undefined)) {
    // function-first: fold(fn, initial, array)
    f = arg1;
    init = arg2;
    a = arg3 as any[] | undefined;
  } else if (arg3 === undefined) {
    return undefined;
  } else {
    throw new Error(
      `fold(array, initial, reducer) expects an array, initial value, and a function.\n` +
      'Example: fold([1, 2, 3], 0, (acc, x) => acc + x)'
    );
  }

  if (a === undefined) {
    return undefined;
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
    throw new Error(
      `indexOf(target, arrayOrString) expects a string or array as second argument, got ${getTypeName(s)}.\n` +
      'Example: indexOf("b", ["a", "b", "c"]) or indexOf("o", "hello")'
    );
  }

  return s.indexOf(target);
}

export function join(sep: string | undefined, a: any[] | undefined): string | undefined {
  if (sep === undefined || a === undefined) {
    return undefined;
  }
  if (!Array.isArray(a)) {
    throw new Error(
      `join(separator, array) expects an array as second argument, got ${getTypeName(a)}.\n` +
      'Example: join(", ", ["a", "b", "c"])'
    );
  }

  return a.join(sep);
}

export function map(arg1: Function | any[] | undefined, arg2: Function | any[] | undefined): any[] | undefined {
  // Support both map(array, fn) and map(fn, array) for backwards compatibility
  // Early return for undefined first argument
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg2 === 'function') {
    // array-first: map(array, fn)
    a = arg1;
    f = arg2;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg2) || arg2 === undefined)) {
    // function-first: map(fn, array)
    f = arg1;
    a = arg2 as any[] | undefined;
  } else {
    throw new Error(
      `map(array, mapper) expects an array and a function.\n` +
      'Example: map([1, 2, 3], x => x * 2)'
    );
  }

  if (a === undefined) {
    return undefined;
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
    throw new Error(
      `sum(array) expects an array as argument, got ${getTypeName(array)}.\n` +
      'Example: sum([1, 2, 3, 4])'
    );
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
    throw new Error(
      `count(array) expects an array as argument, got ${getTypeName(array)}.\n` +
      'Example: count([1, 2, 3, 4])'
    );
  }
  return array.length;
}

export function reduce(arg1: Function | any[] | undefined, arg2: any, arg3: Function | any[] | undefined): any {
  // reduce is an alias for fold - supports both argument orders
  return fold(arg1, arg2, arg3);
}

export function find(arg1: Function | any[] | undefined, arg2: Function | any[] | undefined): any {
  // Support both find(array, fn) and find(fn, array) for backwards compatibility
  // Early return for undefined first argument
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg2 === 'function') {
    // array-first: find(array, fn)
    a = arg1;
    f = arg2;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg2) || arg2 === undefined)) {
    // function-first: find(fn, array)
    f = arg1;
    a = arg2 as any[] | undefined;
  } else {
    throw new Error(
      `find(array, predicate) expects an array and a function.\n` +
      'Example: find([1, 2, 3, 4], x => x > 2)'
    );
  }

  if (a === undefined) {
    return undefined;
  }
  return a.find(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function some(arg1: Function | any[] | undefined, arg2: Function | any[] | undefined): boolean | undefined {
  // Support both some(array, fn) and some(fn, array) for backwards compatibility
  // Early return for undefined first argument
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg2 === 'function') {
    // array-first: some(array, fn)
    a = arg1;
    f = arg2;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg2) || arg2 === undefined)) {
    // function-first: some(fn, array)
    f = arg1;
    a = arg2 as any[] | undefined;
  } else {
    throw new Error(
      `some(array, predicate) expects an array and a function.\n` +
      'Example: some([1, 2, 3, 4], x => x > 2)'
    );
  }

  if (a === undefined) {
    return undefined;
  }
  return a.some(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function every(arg1: Function | any[] | undefined, arg2: Function | any[] | undefined): boolean | undefined {
  // Support both every(array, fn) and every(fn, array) for backwards compatibility
  // Early return for undefined first argument
  if (arg1 === undefined) {
    return undefined;
  }
  
  let f: Function;
  let a: any[] | undefined;
  
  if (Array.isArray(arg1) && typeof arg2 === 'function') {
    // array-first: every(array, fn)
    a = arg1;
    f = arg2;
  } else if (typeof arg1 === 'function' && (Array.isArray(arg2) || arg2 === undefined)) {
    // function-first: every(fn, array)
    f = arg1;
    a = arg2 as any[] | undefined;
  } else {
    throw new Error(
      `every(array, predicate) expects an array and a function.\n` +
      'Example: every([1, 2, 3, 4], x => x > 0)'
    );
  }

  if (a === undefined) {
    return undefined;
  }
  return a.every(function (x: any, i: number): any {
    return f(x, i);
  });
}

export function unique(a: any[] | undefined): any[] | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (!Array.isArray(a)) {
    throw new Error(
      `unique(array) expects an array as argument, got ${getTypeName(a)}.\n` +
      'Example: unique([1, 2, 2, 3, 3, 3])'
    );
  }
  // Use Set to remove duplicates, then convert back to array
  return Array.from(new Set(a));
}

export function distinct(a: any[] | undefined): any[] | undefined {
  // distinct is an alias for unique
  return unique(a);
}
