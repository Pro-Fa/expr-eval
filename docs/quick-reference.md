# Expression Quick Reference

> **Audience:** Users writing expressions in applications powered by expr-eval.

This is a quick reference card. For detailed documentation, see [Expression Syntax](syntax.md).

## Arithmetic

| Expression | Result | Description |
|:-----------|:-------|:------------|
| `2 + 3` | 5 | Addition |
| `10 - 4` | 6 | Subtraction |
| `3 * 4` | 12 | Multiplication |
| `15 / 3` | 5 | Division |
| `10 % 3` | 1 | Remainder (modulo) |
| `2 ^ 3` | 8 | Exponentiation |
| `5!` | 120 | Factorial |
| `-x` | negated | Negation |

## Comparison

| Expression | Result | Description |
|:-----------|:-------|:------------|
| `5 > 3` | true | Greater than |
| `5 >= 5` | true | Greater than or equal |
| `3 < 5` | true | Less than |
| `3 <= 3` | true | Less than or equal |
| `5 == 5` | true | Equal |
| `5 != 3` | true | Not equal |
| `"a" in ["a", "b"]` | true | In array (may be disabled) |

## Logic

| Expression | Result | Description |
|:-----------|:-------|:------------|
| `true and false` | false | Logical AND |
| `true or false` | true | Logical OR |
| `not true` | false | Logical NOT |

## Conditionals

| Expression | Result | Description |
|:-----------|:-------|:------------|
| `x > 0 ? "yes" : "no"` | depends on x | Ternary (if-then-else) |
| `x ?? 0` | x or 0 | Coalesce (null/undefined fallback) |

## Math Functions

| Function | Example | Result |
|:---------|:--------|:-------|
| `abs(x)` | `abs(-5)` | 5 |
| `round(x)` | `round(3.7)` | 4 |
| `floor(x)` | `floor(3.7)` | 3 |
| `ceil(x)` | `ceil(3.2)` | 4 |
| `sqrt(x)` | `sqrt(16)` | 4 |
| `min(a, b, ...)` | `min(3, 1, 4)` | 1 |
| `max(a, b, ...)` | `max(3, 1, 4)` | 4 |
| `clamp(x, min, max)` | `clamp(15, 0, 10)` | 10 |
| `pow(x, y)` | `pow(2, 3)` | 8 |
| `sin(x)` | `sin(PI / 2)` | 1 |
| `cos(x)` | `cos(0)` | 1 |
| `log(x)` | `log(E)` | 1 |
| `log10(x)` | `log10(100)` | 2 |

## String Functions

| Function | Example | Result |
|:---------|:--------|:-------|
| `length(s)` | `length("hello")` | 5 |
| `toUpper(s)` | `toUpper("hi")` | "HI" |
| `toLower(s)` | `toLower("HI")` | "hi" |
| `trim(s)` | `trim("  x  ")` | "x" |
| `left(s, n)` | `left("hello", 2)` | "he" |
| `right(s, n)` | `right("hello", 2)` | "lo" |
| `contains(s, sub)` | `contains("hello", "ell")` | true |
| `startsWith(s, sub)` | `startsWith("hello", "he")` | true |
| `endsWith(s, sub)` | `endsWith("hello", "lo")` | true |
| `replace(s, old, new)` | `replace("aa", "a", "b")` | "bb" |
| `split(s, delim)` | `split("a,b", ",")` | ["a", "b"] |

## Array Functions

| Function | Example | Result |
|:---------|:--------|:-------|
| `count(arr)` | `count([1, 2, 3])` | 3 |
| `indexOf(val, arr)` | `indexOf(2, [1, 2, 3])` | 1 |
| `join(sep, arr)` | `join("-", [1, 2])` | "1-2" |
| `unique(arr)` | `unique([1, 1, 2])` | [1, 2] |
| `map(arr, fn)` | `map([1, 2], x => x * 2)` | [2, 4] |
| `filter(arr, fn)` | `filter([1, 2, 3], x => x > 1)` | [2, 3] |
| `find(arr, fn)` | `find([1, 5, 2], x => x > 3)` | 5 |
| `fold(arr, init, fn)` | `fold([1, 2, 3], 0, (a, x) => a + x)` | 6 |
| `some(arr, fn)` | `some([1, 5], x => x > 3)` | true |
| `every(arr, fn)` | `every([1, 2], x => x > 0)` | true |

## Object Functions

| Function | Example | Result |
|:---------|:--------|:-------|
| `keys(obj)` | `keys({a: 1, b: 2})` | ["a", "b"] |
| `values(obj)` | `values({a: 1, b: 2})` | [1, 2] |
| `merge(o1, o2)` | `merge({a: 1}, {b: 2})` | {a: 1, b: 2} |

## Type Checking

| Function | Description |
|:---------|:------------|
| `isNumber(v)` | Returns true if v is a number |
| `isString(v)` | Returns true if v is a string |
| `isArray(v)` | Returns true if v is an array |
| `isObject(v)` | Returns true if v is an object |
| `isBoolean(v)` | Returns true if v is a boolean |
| `isNull(v)` | Returns true if v is null |
| `isUndefined(v)` | Returns true if v is undefined |

## Constants

| Constant | Value |
|:---------|:------|
| `PI` | 3.14159... |
| `E` | 2.71828... |
| `true` | Boolean true |
| `false` | Boolean false |

## Array Literals

```
[1, 2, 3]
["a", "b", "c"]
[1, "mixed", true, [nested]]
```

## Object Literals

```
{a: 1, b: 2}
{name: "John", age: 30}
{nested: {x: 1, y: 2}}
```

## Property Access

```
user.name           // Object property
user.address.city   // Nested property
items[0]            // Array index
items[0].name       // Combined
```

## Arrow Functions

```
x => x * 2                    // Single parameter
(x, y) => x + y               // Multiple parameters
(acc, x) => acc + x           // For fold/reduce
```

## Variables (if enabled)

```
x = 5; x * 2                  // Assignment, then use
fn = x => x * 2; fn(3)        // Function assignment
```
