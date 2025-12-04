Expression Evaluator
==================================

[![npm](https://img.shields.io/npm/v/@pro-fa/expr-eval.svg?maxAge=3600)](https://www.npmjs.com/package/@pro-fa/expr-eval)

## Description

**This is a modern TypeScript port of the expr-eval library, completely rewritten with contemporary build tools and development practices.** Originally based on [expr-eval 2.0.2](http://silentmatt.com/javascript-expression-evaluator/), this version has been restructured with a modular architecture, TypeScript support, and comprehensive testing using Vitest.

Parses and evaluates mathematical expressions. It's a safer and more math-oriented alternative to using JavaScript's `eval` function for mathematical expressions.

It has built-in support for common math operators and functions. Additionally, you can add your own JavaScript functions. Expressions can be evaluated directly, or compiled into native JavaScript functions.

## Installation

```bash
npm install @pro-fa/expr-eval
```

## Quick Start

```js
const Parser = require('@pro-fa/expr-eval').Parser;

const parser = new Parser();
let expr = parser.parse('2 * x + 1');
console.log(expr.evaluate({ x: 3 })); // 7

// or
Parser.evaluate('6 * x', { x: 7 }) // 42
```

## Documentation

| Document | Description |
|:---------|:------------|
| [Parser](docs/parser.md) | Parser class API, constructor options, and methods |
| [Expression](docs/expression.md) | Expression object methods: evaluate, substitute, simplify, variables, symbols, toString, toJSFunction |
| [Expression Syntax](docs/syntax.md) | Operator precedence, unary operators, pre-defined functions, string manipulation, array literals, function definitions, constants |
| [TypeScript Port Enhancements](docs/enhancements.md) | New features: undefined support, coalesce operator, optional chaining, SQL case blocks, object construction, promises, and more |
| [Language Service](docs/language-service.md) | IDE integration: code completions, hover information, syntax highlighting, Monaco Editor integration |
| [Performance Testing](docs/performance.md) | Benchmarks, performance grades, and optimization guidance |

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

## Running Tests

```bash
cd <project-directory>
npm install
npm test
```

## Performance Benchmarks

```bash
# Run all benchmarks
npm run bench

# Run specific categories
npm run bench:parsing     # Parser performance
npm run bench:evaluation  # Evaluation performance
npm run bench:memory      # Memory usage
```

See [docs/performance.md](docs/performance.md) for detailed performance documentation.

## License

See [LICENSE.txt](LICENSE.txt) for license information.
