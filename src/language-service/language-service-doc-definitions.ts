// Built-in lightweight docs for well-known functions and keywords taken from README.md

export const BUILTIN_FUNCTION_DOCS: Record<string, string> = {
  random: 'random(n): Get a random number in the range [0, n). If n is zero or missing, defaults to 1.',
  fac: 'fac(n): Factorial of n. Deprecated; prefer the ! operator.',
  min: 'min(a, b, …): Smallest number in the list.',
  max: 'max(a, b, …): Largest number in the list.',
  hypot: 'hypot(a, b): Hypotenuse √(a² + b²).',
  pyt: 'pyt(a, b): Alias for hypot(a, b).',
  pow: 'pow(x, y): Equivalent to x^y.',
  atan2: 'atan2(y, x): Arc tangent of x/y.',
  roundTo: 'roundTo(x, n): Round x to n decimal places.',
  map: 'map(f, a): Array map; returns [f(x,i) for x of a].',
  fold: 'fold(f, y, a): Array reduce; y = f(y, x, i) for each x of a.',
  filter: 'filter(f, a): Array filter.',
  indexOf: 'indexOf(x, a): First index of x in a (array/string), -1 if not found.',
  join: 'join(sep, a): Join array a with separator sep.',
  if: 'if(c, a, b): c ? a : b (both branches evaluate).',
  json: 'json(x): Returns JSON string for x.'
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
  false: 'Logical false'
};
