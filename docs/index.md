# expr-eval

[![npm](https://img.shields.io/npm/v/@pro-fa/expr-eval.svg?maxAge=3600)](https://www.npmjs.com/package/@pro-fa/expr-eval)

**A safe mathematical expression evaluator for JavaScript and TypeScript.**

This is a modern TypeScript port of the expr-eval library, completely rewritten with contemporary build tools and development practices. Originally based on [expr-eval 2.0.2](http://silentmatt.com/javascript-expression-evaluator/), this version has been restructured with a modular architecture, TypeScript support, and comprehensive testing using Vitest.

## What is expr-eval?

expr-eval parses and evaluates mathematical expressions. It's a safer and more math-oriented alternative to using JavaScript's `eval` function for mathematical expressions.

It has built-in support for common math operators and functions. Additionally, you can add your own JavaScript functions. Expressions can be evaluated directly, or compiled into native JavaScript functions.

## Installation

```bash
npm install @pro-fa/expr-eval
```

## Quick Start

```typescript
import { Parser } from '@pro-fa/expr-eval';

const parser = new Parser();
const expr = parser.parse('2 * x + 1');
console.log(expr.evaluate({ x: 3 })); // 7

// or evaluate directly
Parser.evaluate('6 * x', { x: 7 }); // 42
```

## Key Features

- **Mathematical Expressions** - Full support for arithmetic, comparison, and logical operators
- **Built-in Functions** - Trigonometry, logarithms, min/max, array operations, string manipulation
- **Custom Functions** - Add your own JavaScript functions
- **Variable Support** - Evaluate expressions with dynamic variable values
- **Expression Compilation** - Convert expressions to native JavaScript functions
- **TypeScript Support** - Full type definitions included
- **Undefined Support** - Graceful handling of undefined values
- **Coalesce Operator** - `??` operator for null/undefined fallback
- **SQL Case Blocks** - SQL-style CASE/WHEN/THEN/ELSE expressions
- **Object Construction** - Create objects and arrays in expressions
- **Language Service** - IDE integration with completions, hover info, and highlighting

## Playground

Try out the expression evaluator and its language server capabilities directly in your browser at the [Playground](https://pro-fa.github.io/expr-eval/). The playground provides an interactive environment with:

- Live expression evaluation
- Code completions and IntelliSense
- Syntax highlighting
- Hover information for functions and variables

## Documentation Overview

### For Expression Writers

If you're writing expressions in an application powered by expr-eval:

- [Quick Reference](quick-reference.md) - Cheat sheet of operators, functions, and syntax
- [Expression Syntax](syntax.md) - Complete syntax reference with examples

### For Developers

If you're integrating expr-eval into your project:

- [Parser](parser.md) - Parser configuration, methods, and customization
- [Expression](expression.md) - Expression object methods: evaluate, simplify, variables, toJSFunction
- [Advanced Features](advanced-features.md) - Promises, custom resolution, type conversion, operator customization
- [Language Service](language-service.md) - IDE integration: completions, hover info, diagnostics, Monaco Editor
- [Migration Guide](migration.md) - Upgrading from original expr-eval or previous versions

### For Contributors

- [Contributing](contributing.md) - Development setup, code style, and PR guidelines
- [Performance Testing](performance.md) - Benchmarks, profiling, and optimization guidance
- [Breaking Changes](breaking-changes.md) - Version-by-version breaking change documentation

## License

See [LICENSE.txt](https://github.com/pro-fa/expr-eval/blob/main/LICENSE.txt) for license information.
