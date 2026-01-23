# TypeScript Port Enhancements

> **Note:** This document has been reorganized. See [Advanced Features](advanced-features.md) for the main documentation.

This is a modern TypeScript port of the expr-eval library, completely rewritten with contemporary build tools and development practices. Originally based on [expr-eval 2.0.2](http://silentmatt.com/javascript-expression-evaluator/), this version has been restructured with a modular architecture, TypeScript support, and comprehensive testing using Vitest. The library maintains backward compatibility while providing enhanced features and improved maintainability.

## Summary of Enhancements

This TypeScript port adds the following features over the original library:

### Expression Syntax Enhancements

- **`undefined` keyword** - Use `undefined` in expressions and handle undefined values gracefully
- **Coalesce operator (`??`)** - Null/undefined fallback: `x ?? defaultValue`
- **`not in` operator** - Check if value is not in array: `"x" not in arr`
- **Optional chaining** - Property access returns `undefined` instead of throwing errors
- **String concatenation with `+`** - Concatenate strings using the `+` operator
- **SQL-style CASE blocks** - Multi-way conditionals with `case/when/then/else/end`
- **Object construction** - Create objects with `{key: value}` syntax
- **`json()` function** - Convert values to JSON strings

### Developer Integration Features

- **Promise support** - Custom functions can return promises (async evaluation)
- **Custom variable resolution** - `parser.resolve` callback for dynamic variable lookup
- **`as` operator** - Type conversion with customizable implementation

For detailed documentation, see:
- [Advanced Features](advanced-features.md) - Developer integration features
- [Expression Syntax](syntax.md) - Complete syntax reference
- [Parser](parser.md) - Parser configuration
