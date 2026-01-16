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
      { name: 'f', description: 'Mapping function (value, index).' },
      { name: 'a', description: 'Input array.' }
    ]
  },
  fold: {
    name: 'fold',
    description: 'Reduce array a using function f, starting with accumulator y.',
    params: [
      { name: 'f', description: 'Reducer function. Eg: `f(acc, x, i) = acc + x`.' },
      { name: 'y', description: 'Initial accumulator value.' },
      { name: 'a', description: 'Input array.' }
    ]
  },
  filter: {
    name: 'filter',
    description: 'Filter array a using predicate f.',
    params: [
      { name: 'f', description: 'Filter function. Eg:`f(x) = x % 2 == 0`' },
      { name: 'a', description: 'Input array.' }
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
