# Parser

Parser is the main class in the library. It has a single `parse` method, and "static" methods for parsing and evaluating expressions.

## Parser()

Constructs a new `Parser` instance.

The constructor takes an optional `options` parameter that allows you to enable or disable operators.

For example, the following will create a `Parser` that does not allow comparison or logical operators, but does allow `in`:

```js
const parser = new Parser({
  operators: {
    // These default to true, but are included to be explicit
    add: true,
    concatenate: true,
    conditional: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,

    // Disable and, or, not, <, ==, !=, etc.
    logical: false,
    comparison: false,

    // Disable 'in' and = operators
    'in': false,
    assignment: false
  }
});
```

## parse(expression: string)

Convert a mathematical expression into an `Expression` object.

## Parser.parse(expression: string)

Static equivalent of `new Parser().parse(expression)`.

## Parser.evaluate(expression: string, variables?: object)

Parse and immediately evaluate an expression using the values and functions from the `variables` object.

`Parser.evaluate(expr, vars)` is equivalent to calling `Parser.parse(expr).evaluate(vars)`.
