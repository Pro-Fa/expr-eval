# Expression Syntax

The parser accepts a pretty basic grammar. It's similar to normal JavaScript expressions, but is more math-oriented. For example, the `^` operator is exponentiation, not xor.

## Operator Precedence

| Operator                 | Associativity | Description |
|:------------------------ |:------------- |:----------- |
| (...)                    | None          | Grouping |
| f(), x.y, a[i]           | Left          | Function call, property access, array indexing |
| !                        | Left          | Factorial |
| ^                        | Right         | Exponentiation |
| +, -, not, sqrt, etc.    | Right         | Unary prefix operators (see below for the full list) |
| \*, /, %                 | Left          | Multiplication, division, remainder |
| +, -, \|                 | Left          | Addition, subtraction, array/string concatenation |
| ==, !=, >=, <=, >, <, in | Left          | Equals, not equals, etc. "in" means "is the left operand included in the right array operand?" |
| and                      | Left          | Logical AND |
| or                       | Left          | Logical OR |
| x ? y : z                | Right         | Ternary conditional (if x then y else z) |
| =>                       | Right         | Arrow function (e.g., x => x * 2) |
| =                        | Right         | Variable assignment |
| ;                        | Left          | Expression separator |

```js
const parser = new Parser({
  operators: {
    'in': true,
    'assignment': true
  }
});
// Now parser supports 'x in array' and 'y = 2*x' expressions
```

## Concatenation Operator

The `|` (pipe) operator concatenates arrays or strings:
- If both operands are arrays, they are concatenated as arrays
- If both operands are strings, they are concatenated as strings
- If operands are of different types, the result is `undefined`

| Operator | Description |
|:-------- |:----------- |
| a \| b   | Concatenates `a` and `b` if both are arrays or both are strings; otherwise returns `undefined`. |

### Array Concatenation

When both operands are arrays, the `|` operator returns a new array containing all elements from both arrays:

```js
const parser = new Parser();

parser.evaluate('[1, 2] | [3, 4]');           // [1, 2, 3, 4]
parser.evaluate('[1] | [2] | [3]');           // [1, 2, 3]
parser.evaluate('["a", "b"] | ["c", "d"]');   // ["a", "b", "c", "d"]
```

### String Concatenation

When both operands are strings, the `|` operator returns a new string combining both:

```js
const parser = new Parser();

parser.evaluate('"hello" | " " | "world"');   // "hello world"
parser.evaluate('"a" | "b" | "c"');           // "abc"
```

> **Note:** Mixing types (e.g., an array with a string) will return `undefined`.

## Unary Operators

The parser has several built-in "functions" that are actually unary operators. The primary difference between these and functions are that they can only accept exactly one argument, and parentheses are optional. With parentheses, they have the same precedence as function calls, but without parentheses, they keep their normal precedence (just below `^`). For example, `sin(x)^2` is equivalent to `(sin x)^2`, and `sin x^2` is equivalent to `sin(x^2)`.

The unary `+` and `-` operators are an exception, and always have their normal precedence.

| Operator | Description |
|:-------- |:----------- |
| -x       | Negation |
| +x       | Unary plus. This converts it's operand to a number, but has no other effect. |
| x!       | Factorial (x * (x-1) * (x-2) * … * 2 * 1). gamma(x + 1) for non-integers. |
| abs x    | Absolute value (magnitude) of x |
| acos x   | Arc cosine of x (in radians) |
| acosh x  | Hyperbolic arc cosine of x (in radians) |
| asin x   | Arc sine of x (in radians) |
| asinh x  | Hyperbolic arc sine of x (in radians) |
| atan x   | Arc tangent of x (in radians) |
| atanh x  | Hyperbolic arc tangent of x (in radians) |
| cbrt x   | Cube root of x |
| ceil x   | Ceiling of x — the smallest integer that's >= x |
| cos x    | Cosine of x (x is in radians) |
| cosh x   | Hyperbolic cosine of x (x is in radians) |
| exp x    | e^x (exponential/antilogarithm function with base e) |
| expm1 x  | e^x - 1 |
| floor x  | Floor of x — the largest integer that's <= x |
| length x | String or array length of x |
| ln x     | Natural logarithm of x |
| log x    | Natural logarithm of x (synonym for ln, not base-10) |
| log10 x  | Base-10 logarithm of x |
| log2 x   | Base-2 logarithm of x |
| log1p x  | Natural logarithm of (1 + x) |
| not x    | Logical NOT operator |
| round x  | X, rounded to the nearest integer, using "grade-school rounding" |
| sign x   | Sign of x (-1, 0, or 1 for negative, zero, or positive respectively) |
| sin x    | Sine of x (x is in radians) |
| sinh x   | Hyperbolic sine of x (x is in radians) |
| sqrt x   | Square root of x. Result is NaN (Not a Number) if x is negative. |
| tan x    | Tangent of x (x is in radians) |
| tanh x   | Hyperbolic tangent of x (x is in radians) |
| trunc x  | Integral part of a X, looks like floor(x) unless for negative number |

## Pre-defined Functions

Besides the "operator" functions, there are several pre-defined functions. You can provide your own, by binding variables to normal JavaScript functions. These are not evaluated by simplify.

### Numeric Functions

| Function      | Description |
|:------------- |:----------- |
| random(n)     | Get a random number in the range [0, n). If n is zero, or not provided, it defaults to 1. |
| fac(n)        | n! (factorial of n: "n * (n-1) * (n-2) * … * 2 * 1") Deprecated. Use the ! operator instead. |
| min(a,b,…)    | Get the smallest (minimum) number in the list. |
| max(a,b,…)    | Get the largest (maximum) number in the list. |
| clamp(x, min, max) | Clamps x to be within the range [min, max]. Returns min if x < min, max if x > max, otherwise x. |
| hypot(a,b)    | Hypotenuse, i.e. the square root of the sum of squares of its arguments. |
| pyt(a, b)     | Alias for hypot. |
| pow(x, y)     | Equivalent to x^y. For consistency with JavaScript's Math object. |
| atan2(y, x)   | Arc tangent of x/y. i.e. the angle between (0, 0) and (x, y) in radians. |
| roundTo(x, n) | Rounds x to n places after the decimal point. |

### Array Functions

| Function      | Description |
|:------------- |:----------- |
| count(a)      | Returns the number of items in an array. |
| map(a, f)     | Array map: Pass each element of `a` to the function `f`, and return an array of the results. |
| fold(a, y, f) | Array fold: Fold/reduce array `a` into a single value, `y` by setting `y = f(y, x, index)` for each element `x` of the array. |
| reduce(a, y, f) | Alias for `fold`. Reduces array `a` into a single value using function `f` starting with accumulator `y`. |
| filter(a, f)  | Array filter: Return an array containing only the values from `a` where `f(x, index)` is `true`. |
| find(a, f)    | Returns the first element in array `a` where `f(x, index)` is `true`, or `undefined` if not found. |
| some(a, f)    | Returns `true` if at least one element in array `a` satisfies `f(x, index)`, `false` otherwise. |
| every(a, f)   | Returns `true` if all elements in array `a` satisfy `f(x, index)`. Returns `true` for empty arrays. |
| unique(a)     | Returns a new array with duplicate values removed from array `a`. |
| distinct(a)   | Alias for `unique`. Returns a new array with duplicate values removed. |
| indexOf(x, a) | Return the first index of string or array `a` matching the value `x`, or `-1` if not found. |
| join(sep, a)  | Concatenate the elements of `a`, separated by `sep`. |
| naturalSort(arr) | Sorts an array of strings using natural sort order (alphanumeric-aware). For example, `["file10", "file2", "file1"]` becomes `["file1", "file2", "file10"]`. |

### Utility Functions

| Function      | Description |
|:------------- |:----------- |
| if(c, a, b)   | Function form of c ? a : b. Note: This always evaluates both `a` and `b`, regardless of whether `c` is `true` or not. Use `c ? a : b` instead if there are side effects, or if evaluating the branches could be expensive. |
| coalesce(a, b, ...)   | Returns the first non-null and non-empty string value from the arguments. Numbers and booleans (including 0 and false) are considered valid values. |

### Type Checking Functions

| Function      | Description |
|:------------- |:----------- |
| isArray(v)    | Returns `true` if `v` is an array, `false` otherwise. |
| isObject(v)   | Returns `true` if `v` is an object (excluding null and arrays), `false` otherwise. |
| isNumber(v)   | Returns `true` if `v` is a number, `false` otherwise. |
| isString(v)   | Returns `true` if `v` is a string, `false` otherwise. |
| isBoolean(v)  | Returns `true` if `v` is a boolean, `false` otherwise. |
| isNull(v)     | Returns `true` if `v` is null, `false` otherwise. |
| isUndefined(v)| Returns `true` if `v` is undefined, `false` otherwise. |
| isFunction(v) | Returns `true` if `v` is a function, `false` otherwise. |

## String Functions

The parser includes comprehensive string manipulation capabilities.

### String Inspection

| Function               | Description |
|:---------------------- |:----------- |
| length(str)            | Returns the length of a string. Also works as unary operator for numbers. |
| isEmpty(str)           | Returns `true` if the string is empty (length === 0), `false` otherwise. |
| contains(str, substr)  | Returns `true` if `str` contains `substr`, `false` otherwise. |
| startsWith(str, substr)| Returns `true` if `str` starts with `substr`, `false` otherwise. |
| endsWith(str, substr)  | Returns `true` if `str` ends with `substr`, `false` otherwise. |
| searchCount(str, substr)| Returns the count of non-overlapping occurrences of `substr` in `str`. |

### String Transformation

| Function         | Description |
|:---------------- |:----------- |
| trim(str, chars?)| Removes whitespace (or specified characters) from both ends of a string. |
| toUpper(str)     | Converts a string to uppercase. |
| toLower(str)     | Converts a string to lowercase. |
| toTitle(str)     | Converts a string to title case (capitalizes first letter of each word). |
| repeat(str, n)   | Repeats a string `n` times. `n` must be a non-negative integer. |
| reverse(str)     | Reverses a string. |

### String Extraction

| Function         | Description |
|:---------------- |:----------- |
| left(str, n)     | Returns the leftmost `n` characters from a string. |
| right(str, n)    | Returns the rightmost `n` characters from a string. |
| split(str, delim)| Splits a string by delimiter and returns an array. |

### String Replacement

| Function                    | Description |
|:--------------------------- |:----------- |
| replace(str, old, new)      | Replaces all occurrences of `old` with `new` in `str`. |
| replaceFirst(str, old, new) | Replaces only the first occurrence of `old` with `new` in `str`. |

### Type Conversion

| Function         | Description |
|:---------------- |:----------- |
| toNumber(str)    | Converts a string to a number. Throws an error if the string cannot be converted. |
| toBoolean(str)   | Converts a string to a boolean. Recognizes `"true"`, `"1"`, `"yes"`, `"on"` as `true` (case-insensitive), and `"false"`, `"0"`, `"no"`, `"off"`, `""` as `false`. |

### String Padding

| Function              | Description |
|:--------------------- |:----------- |
| padLeft(str, len, padChar?)     | Pads a string on the left with spaces (or optional padding character) to reach the target length. |
| padRight(str, len, padChar?)    | Pads a string on the right with spaces (or optional padding character) to reach the target length. |
| padBoth(str, len, padChar?)     | Pads a string on both sides with spaces (or optional padding character) to reach the target length. If an odd number of padding characters is needed, the extra character is added on the right. |

### Slicing and Encoding

| Function              | Description |
|:--------------------- |:----------- |
| slice(s, start, end?) | Extracts a portion of a string or array. Supports negative indices (e.g., -1 for last element). |
| urlEncode(str)        | URL-encodes a string using `encodeURIComponent`. |
| base64Encode(str)     | Base64-encodes a string with proper UTF-8 support. |
| base64Decode(str)     | Base64-decodes a string with proper UTF-8 support. |

### String Function Examples

```js
const parser = new Parser();

// String inspection
parser.evaluate('length("hello")'); // 5
parser.evaluate('isEmpty("")'); // true
parser.evaluate('contains("hello world", "world")'); // true
parser.evaluate('startsWith("hello", "he")'); // true
parser.evaluate('endsWith("hello", "lo")'); // true
parser.evaluate('searchCount("hello hello", "hello")'); // 2

// String transformation
parser.evaluate('trim("  hello  ")'); // "hello"
parser.evaluate('trim("**hello**", "*")'); // "hello"
parser.evaluate('toUpper("hello")'); // "HELLO"
parser.evaluate('toLower("HELLO")'); // "hello"
parser.evaluate('toTitle("hello world")'); // "Hello World"
parser.evaluate('repeat("ha", 3)'); // "hahaha"
parser.evaluate('reverse("hello")'); // "olleh"

// String extraction
parser.evaluate('left("hello", 3)'); // "hel"
parser.evaluate('right("hello", 3)'); // "llo"
parser.evaluate('split("a,b,c", ",")'); // ["a", "b", "c"]

// String manipulation
parser.evaluate('replace("hello hello", "hello", "hi")'); // "hi hi"
parser.evaluate('replaceFirst("hello hello", "hello", "hi")'); // "hi hello"

// Natural sorting
parser.evaluate('naturalSort(["file10", "file2", "file1"])'); // ["file1", "file2", "file10"]

// Type conversion
parser.evaluate('toNumber("123")'); // 123
parser.evaluate('toBoolean("true")'); // true
parser.evaluate('toBoolean("yes")'); // true
parser.evaluate('toBoolean("0")'); // false

// Padding
parser.evaluate('padLeft("5", 3)'); // "  5"
parser.evaluate('padLeft("5", 3, "0")'); // "005"
parser.evaluate('padRight("5", 3)'); // "5  "
parser.evaluate('padRight("5", 3, "0")'); // "500"
parser.evaluate('padBoth("hi", 6)'); // "  hi  "
parser.evaluate('padBoth("hi", 6, "-")'); // "--hi--"

// Slicing
parser.evaluate('slice("hello world", 0, 5)'); // "hello"
parser.evaluate('slice("hello world", -5)'); // "world"
parser.evaluate('slice([1, 2, 3, 4, 5], -2)'); // [4, 5]

// Encoding
parser.evaluate('urlEncode("foo=bar&baz")'); // "foo%3Dbar%26baz"
parser.evaluate('base64Encode("hello")'); // "aGVsbG8="
parser.evaluate('base64Decode("aGVsbG8=")'); // "hello"

// Coalesce
parser.evaluate('coalesce("", null, "found")'); // "found"
parser.evaluate('coalesce(null, 0, 42)'); // 0

// Complex string operations
parser.evaluate('toUpper(trim(left("  hello world  ", 10)))'); // "HELLO WOR"
```

> **Note:** All string functions return `undefined` if any of their required arguments are `undefined`, allowing for safe chaining and conditional logic.

## Object Functions

The parser includes functions for working with objects.

| Function              | Description |
|:--------------------- |:----------- |
| merge(obj1, obj2, ...)| Merges two or more objects together. Duplicate keys are overwritten by later arguments. |
| keys(obj)             | Returns an array of strings containing the keys of the object. |
| values(obj)           | Returns an array containing the values of the object. |
| flatten(obj, sep?)    | Flattens a nested object's keys using an optional separator (default: `_`). For example, `{foo: {bar: 1}}` becomes `{foo_bar: 1}`. |

### Object Function Examples

```js
const parser = new Parser();

// Merge objects
parser.evaluate('merge({a: 1}, {b: 2})'); // {a: 1, b: 2}
parser.evaluate('merge({a: 1, b: 2}, {b: 3, c: 4})'); // {a: 1, b: 3, c: 4}
parser.evaluate('merge({a: 1}, {b: 2}, {c: 3})'); // {a: 1, b: 2, c: 3}

// Get keys
parser.evaluate('keys({a: 1, b: 2, c: 3})'); // ["a", "b", "c"]

// Get values
parser.evaluate('values({a: 1, b: 2, c: 3})'); // [1, 2, 3]

// Flatten nested objects
parser.evaluate('flatten(obj)', { obj: { foo: { bar: 1 } } }); // {foo_bar: 1}
parser.evaluate('flatten(obj)', { obj: { a: { b: { c: 1 } } } }); // {a_b_c: 1}
parser.evaluate('flatten(obj, ".")', { obj: { foo: { bar: 1 } } }); // {"foo.bar": 1}

// Mixed nested and flat keys
parser.evaluate('flatten(obj)', { obj: { a: 1, b: { c: 2 } } }); // {a: 1, b_c: 2}
```

> **Note:** All object functions return `undefined` if any of their required arguments are `undefined`, allowing for safe chaining and conditional logic.

## Array Literals

Arrays can be created by including the elements inside square `[]` brackets, separated by commas. For example:

```
[ 1, 2, 3, 2+2, 10/2, 3! ]
```

## Function Definitions

You can define functions using the syntax `name(params) = expression`. When it's evaluated, the name will be added to the passed in scope as a function. You can call it later in the expression, or make it available to other expressions by re-using the same scope object. Functions can support multiple parameters, separated by commas.

Examples:

```js
square(x) = x*x
add(a, b) = a + b
factorial(x) = x < 2 ? 1 : x * factorial(x - 1)
```

These functions can than be used in other functions that require a function argument, such as `map`, `filter` or `fold`:

```js
name(u) = u.name; map(users, name)
add(a, b) = a+b; fold([1, 2, 3], 0, add)
```

You can also define the functions inline:

```js
filter([1, 2, 3, 4, 5], isEven(x) = x % 2 == 0)
```

### Arrow Functions

Arrow functions provide a concise syntax for inline functions, similar to JavaScript arrow functions. They are particularly useful when passing functions to higher-order functions like `map`, `filter`, and `fold`.

**Single parameter (no parentheses required):**

```js
map([1, 2, 3], x => x * 2)           // [2, 4, 6]
filter([1, 2, 3, 4], x => x > 2)     // [3, 4]
map(users, x => x.name)              // Extract property from objects
```

**Multiple parameters (parentheses required):**

```js
fold([1, 2, 3, 4, 5], 0, (acc, x) => acc + x)    // 15 (sum)
fold([1, 2, 3, 4, 5], 1, (acc, x) => acc * x)    // 120 (product)
map([10, 20, 30], (val, idx) => val + idx)       // [10, 21, 32]
filter([10, 20, 30], (x, i) => i >= 1)           // [20, 30]
```

**Zero parameters:**

```js
(() => 42)()                         // 42
```

**Assignment to variable:**

Arrow functions can be assigned to variables for reuse:

```js
fn = x => x * 2; map([1, 2, 3], fn)  // [2, 4, 6]
double = x => x * 2; triple = x => x * 3; map(map([1, 2], triple), double)  // [6, 12]
```

**Nested arrow functions:**

```js
map([[1, 2], [3, 4]], row => map(row, x => x * 2))  // [[2, 4], [6, 8]]
```

**With member access and complex expressions:**

```js
filter(users, x => x.age > 25)                     // Filter objects by property
map(items, x => x.value * 2 + 1)                   // Complex transformations
filter(numbers, x => x > 0 and x < 10)             // Using logical operators
map([3, 7, 2, 9], x => x > 5 ? "high" : "low")     // Using ternary operator
```

> **Note:** Arrow functions share the same `fndef` operator flag as traditional function definitions. If function definitions are disabled via parser options, arrow functions will also be disabled.

### Examples of New Array Functions

The new array utility functions provide additional ways to work with arrays:

**Using reduce (alias for fold):**

```js
reduce([1, 2, 3, 4], 0, (acc, x) => acc + x)    // 10 (sum using reduce)
reduce([2, 3, 4], 1, (acc, x) => acc * x)       // 24 (product)
```

**Using find:**

```js
find([1, 3, 7, 2, 9], x => x > 5)               // 7 (first element > 5)
find([1, 2, 3], x => x < 0)                     // undefined (not found)
find(users, x => x.age > 18)                    // First user over 18
```

**Using some and every:**

```js
some([1, 5, 15, 3], x => x > 10)                // true (at least one > 10)
every([1, 2, 3, 4], x => x > 0)                 // true (all positive)
every([2, 4, 5, 6], x => x % 2 == 0)            // false (not all even)
some([1, 2, 3], x => x < 0)                     // false (none negative)
```

**Using unique/distinct:**

```js
unique([1, 2, 2, 3, 3, 3, 4])                   // [1, 2, 3, 4]
distinct(["a", "b", "a", "c", "b"])             // ["a", "b", "c"]
unique([])                                      // []
```

**Combining array functions:**

```js
// Filter positive numbers, remove duplicates, then double each
unique(filter([1, -2, 3, 3, -4, 5, 1], x => x > 0))  // [1, 3, 5]
map(unique([1, 2, 2, 3]), x => x * 2)           // [2, 4, 6]

// Find first even number greater than 5
find(filter([3, 7, 8, 9, 10], x => x > 5), x => x % 2 == 0)  // 8
```

### Examples of Type Checking Functions

Type checking functions are useful for validating data types and conditional logic:

**Basic type checking:**

```js
isArray([1, 2, 3])                              // true
isNumber(42)                                    // true
isString("hello")                               // true
isBoolean(true)                                 // true
isNull(null)                                    // true
isUndefined(undefined)                          // true
isObject({a: 1})                                // true
isFunction(abs)                                 // true
```

**Using with conditionals:**

```js
if(isArray(x), count(x), 0)                     // Get array length or 0
if(isNumber(x), x * 2, x)                       // Double if number
if(isString(x), toUpper(x), x)                  // Uppercase if string
```

**Using with filter:**

```js
filter([1, "a", 2, "b", 3], isNumber)           // [1, 2, 3]
filter([1, "a", 2, "b", 3], isString)           // ["a", "b"]
```

**Using with some/every:**

```js
some([1, 2, "hello", 3], isString)              // true (has at least one string)
every([1, 2, 3, 4], isNumber)                   // true (all are numbers)
every([1, "a", 3], isNumber)                    // false (not all numbers)
```

**Practical examples:**

```js
// Count how many strings are in an array
count(filter([1, "a", 2, "b", 3], isString))    // 2

// Get the first number in a mixed array
find(["a", "b", 3, "c", 5], isNumber)           // 3

// Check if any value is null or undefined
some(data, x => isNull(x) or isUndefined(x))    // true/false
```

## Custom JavaScript Functions

If you need additional functions that aren't supported out of the box, you can easily add them in your own code. Instances of the `Parser` class have a property called `functions` that's simply an object with all the functions that are in scope. You can add, replace, or delete any of the properties to customize what's available in the expressions. For example:

```js
const parser = new Parser();

// Add a new function
parser.functions.customAddFunction = function (arg1, arg2) {
  return arg1 + arg2;
};

// Remove the factorial function
delete parser.functions.fac;

parser.evaluate('customAddFunction(2, 4) == 6'); // true
//parser.evaluate('fac(3)'); // This will fail
```

## Constants

The parser also includes a number of pre-defined constants that can be used in expressions. These are shown in the table below:

| Constant     | Description |
|:------------ |:----------- |
| E            | The value of `Math.E` from your JavaScript runtime |
| PI           | The value of `Math.PI` from your JavaScript runtime |
| true         | Logical `true` value |
| false        | Logical `false` value |

Pre-defined constants are stored in `parser.consts`. You can make changes to this property to customise the constants available to your expressions. For example:

```js
const parser = new Parser();
parser.consts.R = 1.234;

console.log(parser.parse('A+B/R').toString());  // ((A + B) / 1.234)
```

To disable the pre-defined constants, you can replace or delete `parser.consts`:

```js
const parser = new Parser();
parser.consts = {};
```
