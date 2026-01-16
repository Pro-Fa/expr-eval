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

The `|` (pipe) operator concatenates arrays or strings.

| Operator | Description |
|:-------- |:----------- |
| a \| b   | Concatenates arrays or strings. Both operands must be of the same type. |

### Array Concatenation

```js
const parser = new Parser();

parser.evaluate('[1, 2] | [3, 4]');           // [1, 2, 3, 4]
parser.evaluate('[1] | [2] | [3]');           // [1, 2, 3]
parser.evaluate('["a", "b"] | ["c", "d"]');   // ["a", "b", "c", "d"]
```

### String Concatenation

```js
const parser = new Parser();

parser.evaluate('"hello" | " " | "world"');   // "hello world"
parser.evaluate('"a" | "b" | "c"');           // "abc"
```

> **Note:** Both operands must be of the same type (both arrays or both strings). Mixing types will return `undefined`.

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

| Function      | Description |
|:------------- |:----------- |
| random(n)     | Get a random number in the range [0, n). If n is zero, or not provided, it defaults to 1. |
| fac(n)        | n! (factorial of n: "n * (n-1) * (n-2) * … * 2 * 1") Deprecated. Use the ! operator instead. |
| min(a,b,…)    | Get the smallest (minimum) number in the list. |
| max(a,b,…)    | Get the largest (maximum) number in the list. |
| hypot(a,b)    | Hypotenuse, i.e. the square root of the sum of squares of its arguments. |
| pyt(a, b)     | Alias for hypot. |
| pow(x, y)     | Equivalent to x^y. For consistency with JavaScript's Math object. |
| atan2(y, x)   | Arc tangent of x/y. i.e. the angle between (0, 0) and (x, y) in radians. |
| roundTo(x, n) | Rounds x to n places after the decimal point. |
| map(f, a)     | Array map: Pass each element of `a` the function `f`, and return an array of the results. |
| fold(f, y, a) | Array fold: Fold/reduce array `a` into a single value, `y` by setting `y = f(y, x, index)` for each element `x` of the array. |
| filter(f, a)  | Array filter: Return an array containing only the values from `a` where `f(x, index)` is `true`. |
| indexOf(x, a) | Return the first index of string or array `a` matching the value `x`, or `-1` if not found. |
| join(sep, a)  | Concatenate the elements of `a`, separated by `sep`. |
| if(c, a, b)   | Function form of c ? a : b. Note: This always evaluates both `a` and `b`, regardless of whether `c` is `true` or not. Use `c ? a : b` instead if there are side effects, or if evaluating the branches could be expensive. |

## String Manipulation Functions

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
| trim(str)        | Removes whitespace from both ends of a string. |
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

### String Manipulation

| Function                    | Description |
|:--------------------------- |:----------- |
| replace(str, old, new)      | Replaces all occurrences of `old` with `new` in `str`. |
| replaceFirst(str, old, new) | Replaces only the first occurrence of `old` with `new` in `str`. |

### String/Array Sorting

| Function         | Description |
|:---------------- |:----------- |
| naturalSort(arr) | Sorts an array of strings using natural sort order (alphanumeric-aware). For example, `["file10", "file2", "file1"]` becomes `["file1", "file2", "file10"]`. |

### Type Conversion

| Function         | Description |
|:---------------- |:----------- |
| toNumber(str)    | Converts a string to a number. Throws an error if the string cannot be converted. |
| toBoolean(str)   | Converts a string to a boolean. Recognizes `"true"`, `"1"`, `"yes"`, `"on"` as `true` (case-insensitive), and `"false"`, `"0"`, `"no"`, `"off"`, `""` as `false`. |

### String Padding

| Function              | Description |
|:--------------------- |:----------- |
| padLeft(str, len)     | Pads a string on the left with spaces to reach the target length. |
| padRight(str, len)    | Pads a string on the right with spaces to reach the target length. |

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
parser.evaluate('padRight("5", 3)'); // "5  "

// Complex string operations
parser.evaluate('toUpper(trim(left("  hello world  ", 10)))'); // "HELLO WOR"
```

> **Note:** All string functions return `undefined` if any of their required arguments are `undefined`, allowing for safe chaining and conditional logic.

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
name(u) = u.name; map(name, users)
add(a, b) = a+b; fold(add, 0, [1, 2, 3])
```

You can also define the functions inline:

```js
filter(isEven(x) = x % 2 == 0, [1, 2, 3, 4, 5])
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
