// Built-in lightweight docs for known functions and keywords

export interface FunctionParamDoc {
    name: string;
    description: string;
    optional?: boolean;
    isVariadic?: boolean;
}

export interface FunctionDoc {
    name: string;
    description: string;
    params?: FunctionParamDoc[];
}

export const BUILTIN_FUNCTION_DOCS: Record<string, FunctionDoc> = {
  random: {
    name: 'random',
    description: 'Get a random number in the range [0, n). Defaults to 1 if n is missing or zero.',
    params: [
      { name: 'n', description: 'Upper bound (exclusive).', optional: true }
    ]
  },
  fac: {
    name: 'fac',
    description: 'Factorial of n. Deprecated; prefer the ! operator.',
    params: [
      { name: 'n', description: 'Non-negative integer.' }
    ]
  },
  min: {
    name: 'min',
    description: 'Smallest number in the list.',
    params: [
      { name: 'values', description: 'Numbers to compare.', isVariadic: true }
    ]
  },
  max: {
    name: 'max',
    description: 'Largest number in the list.',
    params: [
      { name: 'values', description: 'Numbers to compare.', isVariadic: true }
    ]
  },
  hypot: {
    name: 'hypot',
    description: 'Hypotenuse √(a² + b²).',
    params: [
      { name: 'a', description: 'First side.' },
      { name: 'b', description: 'Second side.' }
    ]
  },
  pyt: {
    name: 'pyt',
    description: 'Alias for hypot(a, b).',
    params: [
      { name: 'a', description: 'First side.' },
      { name: 'b', description: 'Second side.' }
    ]
  },
  pow: {
    name: 'pow',
    description: 'Raise x to the power of y.',
    params: [
      { name: 'x', description: 'Base.' },
      { name: 'y', description: 'Exponent.' }
    ]
  },
  atan2: {
    name: 'atan2',
    description: 'Arc tangent of y / x.',
    params: [
      { name: 'y', description: 'Y coordinate.' },
      { name: 'x', description: 'X coordinate.' }
    ]
  },
  roundTo: {
    name: 'roundTo',
    description: 'Round x to n decimal places.',
    params: [
      { name: 'x', description: 'Number to round.' },
      { name: 'n', description: 'Number of decimal places.' }
    ]
  },
  map: {
    name: 'map',
    description: 'Apply function f to each element of array a.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'f', description: 'Mapping function (value, index).' }
    ]
  },
  fold: {
    name: 'fold',
    description: 'Reduce array a using function f, starting with accumulator y.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'y', description: 'Initial accumulator value.' },
      { name: 'f', description: 'Reducer function. Eg: `f(acc, x, i) = acc + x`.' }
    ]
  },
  filter: {
    name: 'filter',
    description: 'Filter array a using predicate f.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'f', description: 'Filter function. Eg:`f(x) = x % 2 == 0`' }
    ]
  },
  indexOf: {
    name: 'indexOf',
    description: 'First index of x in a (array or string), or -1 if not found.',
    params: [
      { name: 'x', description: 'Value to search for.' },
      { name: 'a', description: 'Array or string to search.' }
    ]
  },
  join: {
    name: 'join',
    description: 'Join array a using separator sep.',
    params: [
      { name: 'sep', description: 'Separator string.' },
      { name: 'a', description: 'Array to join.' }
    ]
  },
  if: {
    name: 'if',
    description: 'Conditional expression: condition ? trueValue : falseValue (both branches evaluate).',
    params: [
      { name: 'condition', description: 'A boolean condition.' },
      { name: 'trueValue', description: 'Value if condition is true.' },
      { name: 'falseValue', description: 'Value if condition is false.' }
    ]
  },
  json: {
    name: 'json',
    description: 'Return JSON string representation of x.',
    params: [
      { name: 'x', description: 'Value to stringify.' }
    ]
  },
  sum: {
    name: 'sum',
    description: 'Sum of all elements in an array.',
    params: [
      { name: 'a', description: 'Array of numbers.' }
    ]
  },
  count: {
    name: 'count',
    description: 'Returns the number of items in an array.',
    params: [
      { name: 'a', description: 'Array to count.' }
    ]
  },
  reduce: {
    name: 'reduce',
    description: 'Alias for fold. Reduce array a using function f, starting with accumulator y.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'y', description: 'Initial accumulator value.' },
      { name: 'f', description: 'Reducer function. Eg: `f(acc, x, i) = acc + x`.' }
    ]
  },
  find: {
    name: 'find',
    description: 'Returns the first element in array a that satisfies predicate f, or undefined if not found.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'f', description: 'Predicate function. Eg: `f(x) = x > 5`' }
    ]
  },
  some: {
    name: 'some',
    description: 'Returns true if at least one element in array a satisfies predicate f.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'f', description: 'Predicate function. Eg: `f(x) = x > 5`' }
    ]
  },
  every: {
    name: 'every',
    description: 'Returns true if all elements in array a satisfy predicate f. Returns true for empty arrays.',
    params: [
      { name: 'a', description: 'Input array.' },
      { name: 'f', description: 'Predicate function. Eg: `f(x) = x > 0`' }
    ]
  },
  unique: {
    name: 'unique',
    description: 'Returns a new array with duplicate values removed from array a.',
    params: [
      { name: 'a', description: 'Input array.' }
    ]
  },
  distinct: {
    name: 'distinct',
    description: 'Alias for unique. Returns a new array with duplicate values removed from array a.',
    params: [
      { name: 'a', description: 'Input array.' }
    ]
  },
  clamp: {
    name: 'clamp',
    description: 'Clamps a value between a minimum and maximum.',
    params: [
      { name: 'value', description: 'The value to clamp.' },
      { name: 'min', description: 'Minimum allowed value.' },
      { name: 'max', description: 'Maximum allowed value.' }
    ]
  },
  /**
     * String functions
     */
  stringLength: {
    name: 'stringLength',
    description: 'Return the length of a string.',
    params: [{ name: 'str', description: 'Input string.' }]
  },
  isEmpty: {
    name: 'isEmpty',
    description: 'Return true if the string is empty.',
    params: [{ name: 'str', description: 'Input string.' }]
  },
  contains: {
    name: 'contains',
    description: 'Return true if str contains substring.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'substring', description: 'Substring to search for.' }
    ]
  },
  startsWith: {
    name: 'startsWith',
    description: 'Return true if str starts with substring.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'substring', description: 'Prefix to check.' }
    ]
  },
  endsWith: {
    name: 'endsWith',
    description: 'Return true if str ends with substring.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'substring', description: 'Suffix to check.' }
    ]
  },
  split: {
    name: 'split',
    description: 'Split string by delimiter into an array.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'delimiter', description: 'Delimiter string.' }
    ]
  },
  trim: {
    name: 'trim',
    description: 'Remove whitespace (or specified characters) from both ends of a string.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'chars', description: 'Characters to trim.', optional: true }
    ]
  },
  padLeft: {
    name: 'padLeft',
    description: 'Pad string on the left to reach target length.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'length', description: 'Target length.' },
      { name: 'padStr', description: 'Padding string.', optional: true }
    ]
  },
  padRight: {
    name: 'padRight',
    description: 'Pad string on the right to reach target length.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'length', description: 'Target length.' },
      { name: 'padStr', description: 'Padding string.', optional: true }
    ]
  },
  padBoth: {
    name: 'padBoth',
    description: 'Pad string on both sides to reach target length. Extra padding goes on the right.',
    params: [
      { name: 'str', description: 'Input string.' },
      { name: 'length', description: 'Target length.' },
      { name: 'padStr', description: 'Padding string.', optional: true }
    ]
  },
  slice: {
    name: 'slice',
    description: 'Extract a portion of a string or array. Supports negative indices.',
    params: [
      { name: 's', description: 'Input string or array.' },
      { name: 'start', description: 'Start index (negative counts from end).' },
      { name: 'end', description: 'End index (negative counts from end).', optional: true }
    ]
  },
  urlEncode: {
    name: 'urlEncode',
    description: 'URL-encode a string using encodeURIComponent.',
    params: [
      { name: 'str', description: 'String to encode.' }
    ]
  },
  base64Encode: {
    name: 'base64Encode',
    description: 'Base64-encode a string with UTF-8 support.',
    params: [
      { name: 'str', description: 'String to encode.' }
    ]
  },
  base64Decode: {
    name: 'base64Decode',
    description: 'Base64-decode a string with UTF-8 support.',
    params: [
      { name: 'str', description: 'Base64 string to decode.' }
    ]
  },
  coalesce: {
    name: 'coalesce',
    description: 'Return the first non-null and non-empty string value from the arguments.',
    params: [
      { name: 'values', description: 'Values to check.', isVariadic: true }
    ]
  },
  /**
   * Object functions
   */
  merge: {
    name: 'merge',
    description: 'Merge two or more objects together. Duplicate keys are overwritten by later arguments.',
    params: [
      { name: 'objects', description: 'Objects to merge.', isVariadic: true }
    ]
  },
  keys: {
    name: 'keys',
    description: 'Return an array of strings containing the keys of the object.',
    params: [
      { name: 'obj', description: 'Input object.' }
    ]
  },
  values: {
    name: 'values',
    description: 'Return an array containing the values of the object.',
    params: [
      { name: 'obj', description: 'Input object.' }
    ]
  },
  flatten: {
    name: 'flatten',
    description: 'Flatten a nested object\'s keys using an optional separator (default: _). For example, {foo: {bar: 1}} becomes {foo_bar: 1}.',
    params: [
      { name: 'obj', description: 'Input object.' },
      { name: 'separator', description: 'Key separator (default: _).', optional: true }
    ]
  },
  /**
   * Type checking functions
   */
  isArray: {
    name: 'isArray',
    description: 'Returns true if the value is an array.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isObject: {
    name: 'isObject',
    description: 'Returns true if the value is an object (excluding null and arrays).',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isNumber: {
    name: 'isNumber',
    description: 'Returns true if the value is a number.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isString: {
    name: 'isString',
    description: 'Returns true if the value is a string.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isBoolean: {
    name: 'isBoolean',
    description: 'Returns true if the value is a boolean.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isNull: {
    name: 'isNull',
    description: 'Returns true if the value is null.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isUndefined: {
    name: 'isUndefined',
    description: 'Returns true if the value is undefined.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  },
  isFunction: {
    name: 'isFunction',
    description: 'Returns true if the value is a function.',
    params: [
      { name: 'value', description: 'Value to check.' }
    ]
  }
};

export const BUILTIN_KEYWORD_DOCS: Record<string, string> = {
  undefined: 'Represents an undefined value.',
  case: 'Start of a case-when-then-else-end block.',
  when: 'Case branch condition.',
  then: 'Then branch result.',
  else: 'Else branch result.',
  end: 'End of case block.'
};

export const DEFAULT_CONSTANT_DOCS: Record<string, string> = {
  E: 'Math.E',
  PI: 'Math.PI',
  true: 'Logical true',
  false: 'Logical false',
  null: 'Null value'
};
