# Changelog

## [3.0.0]

- Fork of https://github.com/msironi/expr-eval because we introduce some breaking changes
- BREAKING CHANGE: Concatenation operator is renamed from || to | in order to avoid ambiguity with the logical or-operator.
- Support the logical && and ||-operators
- Support property access using the backet notation which allows for dereferencing properties using a variable.
- Fetching an unknown array index will now result in undefined instead of the first element in the array.

## [2.0.2.1] 2025-05-07

- Fork of https://github.com/silentmatt/expr-eval which appears to be abandoned
- Add undefined as an expression keyword.
- Add support for setting variables to undefined.
- Operators/functions return undefined if they operate on undefined.
- Array/structure references act like JavaScript ?.
- Add coalesce operator ??; operator returns the right side if the left side is undefined, null, Infinity, or a Nan, the left side otherwise.
- String concatenation using the + operator on two strings.
- Support for custom functions returning promises; expression evaluation will stop until the promise resolves.  Note that this means that the return value of evaluate will be a promise.
- Support for invoking a callback for custom variable name resolution if an expression references an unknown variable.  This allows things like environment variables to be exposed in expressions.
- Support for SQL style case/when blocks, both for switch style cases and for if/else/if style cases.
- Construction of objects in expressions using JavaScript style syntax.
- Value conversion using the AS operator; note that this is disabled by default.

## [2.0.2] - 2019-09-28

### Added

- Added non-default exports when using the ES module format. This allows `import { Parser } from 'expr-eval'` to work in TypeScript. The default export is still available for backward compatibility.


## [2.0.1] - 2019-09-10

### Added

- Added the `if(condition, trueValue, falseValue)` function back. The ternary operator is still recommended if you need to only evaluate one branch, but we're keep this as an option at least for now.


## [2.0.0] - 2019-09-07

### Added

- Better support for arrays, including literals: `[ 1, 2, 3 ]` and indexing: `array[0]`
- New functions for arrays: `join`, `indexOf`, `map`, `filter`, and `fold`
- Variable assignment: `x = 4`
- Custom function definitions: `myfunction(x, y) = x * y`
- Evaluate multiple expressions by separating them with `;`
- New operators: `log2` (base-2 logarithm), `cbrt` (cube root), `expm1` (`e^x - 1`), `log1p` (`log(1 + x)`), `sign` (essentially `x == 0 ? 0 : x / abs x`)

### Changed

- `min` and `max` functions accept either a parameter list or a single array argument
- `in` operator is enabled by default. It can be disabled by passing { operators: `{ 'in': false } }` to the `Parser` constructor.
- `||` (concatenation operator) now supports strings and arrays

### Removed

- Removed the `if(condition, trueValue, falseValue)` function. Use the ternary conditional operator instead: `condition ? trueValue : falseValue`, or you can add it back easily with a custom function.
