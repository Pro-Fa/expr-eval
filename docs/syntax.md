# Expression Syntax

> **Audience:** Users writing expressions in applications powered by expr-eval.  
> **For developers:** See [Parser Configuration](parser.md) to learn how to enable/disable operators.

The expression language is similar to JavaScript but more math-oriented. For example, the `^` operator is exponentiation, not xor.

## Operator Precedence

Operators are listed from highest to lowest precedence:

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

> **Note:** Some operators like `in`, `=`, and `;` may be disabled by your application.

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

```
[1, 2] | [3, 4]           → [1, 2, 3, 4]
[1] | [2] | [3]           → [1, 2, 3]
["a", "b"] | ["c", "d"]   → ["a", "b", "c", "d"]
```

### String Concatenation

When both operands are strings, the `|` operator returns a new string combining both:

```
"hello" | " " | "world"   → "hello world"
"a" | "b" | "c"           → "abc"
```

> **Note:** Mixing types (e.g., an array with a string) will return `undefined`.

## Unary Operators

The parser has several built-in "functions" that are actually unary operators. The primary difference between these and functions are that they can only accept exactly one argument, and parentheses are optional. With parentheses, they have the same precedence as function calls, but without parentheses, they keep their normal precedence (just below `^`). For example, `sin(x)^2` is equivalent to `(sin x)^2`, and `sin x^2` is equivalent to `sin(x^2)`.

The unary `+` and `-` operators are an exception, and always have their normal precedence.

| Operator | Description |
|:-------- |:----------- |
| -x       | Negation |
| +x       | Unary plus. This converts its operand to a number, but has no other effect. |
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
| json(value)   | Converts a value to a JSON string representation. |

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

```
// String inspection
length("hello")                          → 5
isEmpty("")                               → true
contains("hello world", "world")         → true
startsWith("hello", "he")                → true
endsWith("hello", "lo")                  → true
searchCount("hello hello", "hello")      → 2

// String transformation
trim("  hello  ")                         → "hello"
trim("**hello**", "*")                   → "hello"
toUpper("hello")                          → "HELLO"
toLower("HELLO")                          → "hello"
toTitle("hello world")                    → "Hello World"
repeat("ha", 3)                           → "hahaha"
reverse("hello")                          → "olleh"

// String extraction
left("hello", 3)                          → "hel"
right("hello", 3)                         → "llo"
split("a,b,c", ",")                       → ["a", "b", "c"]

// String replacement
replace("hello hello", "hello", "hi")    → "hi hi"
replaceFirst("hello hello", "hello", "hi") → "hi hello"

// Natural sorting
naturalSort(["file10", "file2", "file1"]) → ["file1", "file2", "file10"]

// Type conversion
toNumber("123")                           → 123
toBoolean("true")                         → true
toBoolean("yes")                          → true
toBoolean("0")                            → false

// Padding
padLeft("5", 3)                           → "  5"
padLeft("5", 3, "0")                      → "005"
padRight("5", 3)                          → "5  "
padBoth("hi", 6)                          → "  hi  "
padBoth("hi", 6, "-")                     → "--hi--"

// Slicing
slice("hello world", 0, 5)                → "hello"
slice("hello world", -5)                  → "world"
slice([1, 2, 3, 4, 5], -2)                → [4, 5]

// Encoding
urlEncode("foo=bar&baz")                  → "foo%3Dbar%26baz"
base64Encode("hello")                     → "aGVsbG8="
base64Decode("aGVsbG8=")                  → "hello"

// Coalesce
coalesce("", null, "found")               → "found"
coalesce(null, 0, 42)                     → 0
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

```
// Merge objects
merge({a: 1}, {b: 2})                     → {a: 1, b: 2}
merge({a: 1, b: 2}, {b: 3, c: 4})         → {a: 1, b: 3, c: 4}

// Get keys
keys({a: 1, b: 2, c: 3})                  → ["a", "b", "c"]

// Get values
values({a: 1, b: 2, c: 3})                → [1, 2, 3]

// Flatten nested objects (using a variable `obj`)
flatten(obj)    // where obj = {foo: {bar: 1}} → {foo_bar: 1}
flatten(obj, ".")  // custom separator      → {"foo.bar": 1}
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

```
square(x) = x*x
add(a, b) = a + b
factorial(x) = x < 2 ? 1 : x * factorial(x - 1)
```

These functions can then be used in other functions that require a function argument, such as `map`, `filter` or `fold`:

```
name(u) = u.name; map(users, name)
add(a, b) = a+b; fold([1, 2, 3], 0, add)
```

You can also define the functions inline:

```
filter([1, 2, 3, 4, 5], isEven(x) = x % 2 == 0)
```

### Arrow Functions

Arrow functions provide a concise syntax for inline functions, similar to JavaScript arrow functions. They are particularly useful when passing functions to higher-order functions like `map`, `filter`, and `fold`.

**Single parameter (no parentheses required):**

```
map([1, 2, 3], x => x * 2)           → [2, 4, 6]
filter([1, 2, 3, 4], x => x > 2)     → [3, 4]
map(users, x => x.name)              → Extract property from objects
```

**Multiple parameters (parentheses required):**

```
fold([1, 2, 3, 4, 5], 0, (acc, x) => acc + x)    → 15 (sum)
fold([1, 2, 3, 4, 5], 1, (acc, x) => acc * x)    → 120 (product)
map([10, 20, 30], (val, idx) => val + idx)       → [10, 21, 32]
filter([10, 20, 30], (x, i) => i >= 1)           → [20, 30]
```

**Zero parameters:**

```
(() => 42)()                         → 42
```

**Assignment to variable:**

Arrow functions can be assigned to variables for reuse:

```
fn = x => x * 2; map([1, 2, 3], fn)  → [2, 4, 6]
double = x => x * 2; triple = x => x * 3; map(map([1, 2], triple), double)  → [6, 12]
```

**Nested arrow functions:**

```
map([[1, 2], [3, 4]], row => map(row, x => x * 2))  → [[2, 4], [6, 8]]
```

**With member access and complex expressions:**

```
filter(users, x => x.age > 25)                     → Filter objects by property
map(items, x => x.value * 2 + 1)                   → Complex transformations
filter(numbers, x => x > 0 and x < 10)             → Using logical operators
map([3, 7, 2, 9], x => x > 5 ? "high" : "low")     → ["low", "high", "low", "high"]
```

> **Note:** Arrow functions share the same `fndef` operator flag as traditional function definitions. If function definitions are disabled via parser options, arrow functions will also be disabled.

### Examples of New Array Functions

The new array utility functions provide additional ways to work with arrays:

**Using reduce (alias for fold):**

```
reduce([1, 2, 3, 4], 0, (acc, x) => acc + x)    → 10 (sum using reduce)
reduce([2, 3, 4], 1, (acc, x) => acc * x)       → 24 (product)
```

**Using find:**

```
find([1, 3, 7, 2, 9], x => x > 5)               → 7 (first element > 5)
find([1, 2, 3], x => x < 0)                     → undefined (not found)
find(users, x => x.age > 18)                    → First user over 18
```

**Using some and every:**

```
some([1, 5, 15, 3], x => x > 10)                → true (at least one > 10)
every([1, 2, 3, 4], x => x > 0)                 → true (all positive)
every([2, 4, 5, 6], x => x % 2 == 0)            → false (not all even)
some([1, 2, 3], x => x < 0)                     → false (none negative)
```

**Using unique/distinct:**

```
unique([1, 2, 2, 3, 3, 3, 4])                   → [1, 2, 3, 4]
distinct(["a", "b", "a", "c", "b"])             → ["a", "b", "c"]
unique([])                                      → []
```

**Combining array functions:**

```
// Filter positive numbers, remove duplicates
unique(filter([1, -2, 3, 3, -4, 5, 1], x => x > 0))  → [1, 3, 5]
map(unique([1, 2, 2, 3]), x => x * 2)               → [2, 4, 6]

// Find first even number greater than 5
find(filter([3, 7, 8, 9, 10], x => x > 5), x => x % 2 == 0)  → 8
```

### Examples of Type Checking Functions

Type checking functions are useful for validating data types and conditional logic:

**Basic type checking:**

```
isArray([1, 2, 3])                              → true
isNumber(42)                                    → true
isString("hello")                               → true
isBoolean(true)                                 → true
isNull(null)                                    → true
isUndefined(undefined)                          → true
isObject({a: 1})                                → true
isFunction(abs)                                 → true
```

**Using with conditionals:**

```
if(isArray(x), count(x), 0)                     → Get array length or 0
if(isNumber(x), x * 2, x)                       → Double if number
if(isString(x), toUpper(x), x)                  → Uppercase if string
```

**Using with filter:**

```
filter([1, "a", 2, "b", 3], isNumber)           → [1, 2, 3]
filter([1, "a", 2, "b", 3], isString)           → ["a", "b"]
```

**Using with some/every:**

```
some([1, 2, "hello", 3], isString)              → true (has at least one string)
every([1, 2, 3, 4], isNumber)                   → true (all are numbers)
every([1, "a", 3], isNumber)                    → false (not all numbers)
```

**Practical examples:**

```
count(filter([1, "a", 2, "b", 3], isString))    → 2 (count strings)
find(["a", "b", 3, "c", 5], isNumber)           → 3 (first number)
some(data, x => isNull(x) or isUndefined(x))    → Check for null/undefined
```

## Custom Functions

Your application may provide additional custom functions beyond the built-in ones. Check your application's documentation to see what custom functions are available.

> **For developers:** You can add custom functions via `parser.functions`. See [Parser Configuration](parser.md#parserfunctions) for details.

## Constants

The following constants are available in expressions:

| Constant | Value | Description |
|:-------- |:----- |:----------- |
| E        | 2.718... | Euler's number (base of natural logarithms) |
| PI       | 3.141... | The ratio of a circle's circumference to its diameter |
| true     | true  | Logical true value |
| false    | false | Logical false value |
| undefined | undefined | Represents a missing or undefined value |

**Examples:**

```
2 * PI              → 6.283185307179586
E ^ 2               → 7.3890560989306495
true and false      → false
x == undefined      → true (if x is not defined)
```

> **For developers:** Constants can be customized via `parser.consts`. See [Parser Configuration](parser.md#parserconsts) for details.

## Coalesce Operator

The `??` operator returns the right operand when the left operand is null, undefined, Infinity, or NaN:

```
x ?? 0                    → 0 (if x is undefined or null)
y ?? "default"            → y (if y has a value)
10 / 0 ?? -1              → -1 (division by zero gives Infinity)
sqrt(-1) ?? 0             → 0 (sqrt of negative gives NaN)
```

This is useful for providing default values:

```
user.nickname ?? user.name ?? "Anonymous"
settings.timeout ?? 5000
```

## Optional Property Access

Property access automatically handles missing properties without errors. If any part of a property chain doesn't exist, the result is `undefined` instead of an error:

```
user.profile.name         → "Ada" (if exists)
user.profile.email        → undefined (if missing, no error)
user.settings.theme       → undefined (if settings is missing)
items[99].value           → undefined (if index doesn't exist)
```

Combined with the coalesce operator:

```
user.settings.theme ?? "dark"     → "dark" (fallback if missing)
items[0].price ?? 0               → 0 (fallback if missing)
```

## CASE Expressions

SQL-style CASE expressions provide multi-way conditionals.

### Switch-style CASE

Compare a value against multiple options:

```
case status
    when "active" then "✓ Active"
    when "pending" then "⏳ Pending"
    when "inactive" then "✗ Inactive"
    else "Unknown"
end
```

### Condition-style CASE

Evaluate multiple conditions (like if/else if/else):

```
case
    when score >= 90 then "A"
    when score >= 80 then "B"
    when score >= 70 then "C"
    when score >= 60 then "D"
    else "F"
end
```

**Examples:**

```
// Categorize a number
case
    when x < 0 then "negative"
    when x == 0 then "zero"
    else "positive"
end

// Map status codes
case code
    when 200 then "OK"
    when 404 then "Not Found"
    when 500 then "Server Error"
    else "Unknown: " + code
end
```

## In and Not In Operators

Check if a value exists in an array:

```
"apple" in ["apple", "banana", "cherry"]       → true
"grape" in ["apple", "banana", "cherry"]       → false
"grape" not in ["apple", "banana", "cherry"]   → true
5 in [1, 2, 3, 4, 5]                           → true
```

> **Note:** The `in` operator may be disabled by your application.

## JSON Function

Convert values to JSON strings:

```
json([1, 2, 3])           → "[1,2,3]"
json({a: 1, b: 2})        → '{"a":1,"b":2}'
json("hello")             → '"hello"'
```
