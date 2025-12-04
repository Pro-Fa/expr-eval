// Built-in lightweight docs for known functions and keywords

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
    json: 'json(x): Returns JSON string for x.',
    sum: 'sum(a): Sum of all elements in a.',
    // String functions
    stringLength: 'stringLength(str): Returns the length of a string.',
    isEmpty: 'isEmpty(str): Returns true if the string is empty (length === 0).',
    contains: 'contains(str, substring): Returns true if str contains substring.',
    startsWith: 'startsWith(str, substring): Returns true if str starts with substring.',
    endsWith: 'endsWith(str, substring): Returns true if str ends with substring.',
    searchCount: 'searchCount(str, substring): Counts non-overlapping occurrences of substring in str.',
    trim: 'trim(str): Removes whitespace from both ends of a string.',
    toUpper: 'toUpper(str): Converts a string to uppercase.',
    toLower: 'toLower(str): Converts a string to lowercase.',
    toTitle: 'toTitle(str): Converts a string to title case (first letter of each word capitalized).',
    split: 'split(str, delimiter): Splits a string by a delimiter, returns an array.',
    repeat: 'repeat(str, n): Repeats a string n times.',
    reverse: 'reverse(str): Reverses a string.',
    left: 'left(str, n): Returns the leftmost n characters from a string.',
    right: 'right(str, n): Returns the rightmost n characters from a string.',
    replace: 'replace(str, old, new): Replaces all occurrences of old with new in str.',
    replaceFirst: 'replaceFirst(str, old, new): Replaces the first occurrence of old with new in str.',
    naturalSort: 'naturalSort(arr): Sorts an array of strings using natural sort order (alphanumeric aware).',
    toNumber: 'toNumber(str): Converts a string to a number.',
    toBoolean: 'toBoolean(str): Converts a string to a boolean (recognizes true/false, yes/no, on/off, 1/0).',
    padLeft: 'padLeft(str, length, padStr?): Pads a string on the left to reach the target length.',
    padRight: 'padRight(str, length, padStr?): Pads a string on the right to reach the target length.',
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
