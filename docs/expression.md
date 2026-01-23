# Expression

> **Audience:** Developers integrating expr-eval into their projects.

`Parser.parse(str)` returns an `Expression` object. `Expression`s are similar to JavaScript functions, i.e. they can be "called" with variables bound to passed-in values. In fact, they can even be converted into JavaScript functions.

## evaluate(variables?: object)

Evaluate the expression, with variables bound to the values in `{variables}`. Each variable in the expression is bound to the corresponding member of the `variables` object. If there are unbound variables, `evaluate` will throw an exception.

```js
import { Parser } from '@pro-fa/expr-eval';

const expr = Parser.parse("2 ^ x");
console.log(expr.evaluate({ x: 3 })); // 8
```

## substitute(variable: string, expression: Expression | string | number)

Create a new `Expression` with the specified variable replaced with another expression. This is similar to function composition. If `expression` is a string or number, it will be parsed into an `Expression`.

```js
const expr = Parser.parse("2 * x + 1");
console.log(expr.toString());              // ((2*x)+1)

const expr2 = expr.substitute("x", "4 * x");
console.log(expr2.toString());             // ((2*(4*x))+1)
console.log(expr2.evaluate({ x: 3 }));     // 25
```

## simplify(variables: object)

Simplify constant sub-expressions and replace variable references with literal values. This is basically a partial evaluation, that does as much of the calculation as it can with the provided variables. Function calls are not evaluated (except the built-in operator functions), since they may not be deterministic.

Simplify is pretty simple. For example, it doesn't know that addition and multiplication are associative, so `((2*(4*x))+1)` from the previous example cannot be simplified unless you provide a value for x. `2*4*x+1` can however, because it's parsed as `(((2*4)*x)+1)`, so the `(2*4)` sub-expression will be replaced with "8", resulting in `((8*x)+1)`.

```js
const expr = Parser.parse("x * (y * atan(1))").simplify({ y: 4 });
console.log(expr.toString());          // (x*3.141592653589793)
console.log(expr.evaluate({ x: 2 }));  // 6.283185307179586
```

## variables(options?: object)

Get an array of the unbound variables in the expression.

```js
const expr = Parser.parse("x * (y * atan(1))");
console.log(expr.variables());                     // ['x', 'y']
console.log(expr.simplify({ y: 4 }).variables());  // ['x']
```

By default, `variables` will return "top-level" objects, so for example, `Parser.parse(x.y.z).variables()` returns `['x']`. If you want to get the whole chain of object members, you can call it with `{ withMembers: true }`. So `Parser.parse(x.y.z).variables({ withMembers: true })` would return `['x.y.z']`.

## symbols(options?: object)

Get an array of variables, including any built-in functions used in the expression.

```js
const expr = Parser.parse("min(x, y, z)");
console.log(expr.symbols());                          // ['min', 'x', 'y', 'z']
console.log(expr.simplify({ y: 4, z: 5 }).symbols()); // ['min', 'x']
```

Like `variables`, `symbols` accepts an option argument `{ withMembers: true }` to include object members.

## toString()

Convert the expression to a string. `toString()` surrounds every sub-expression with parentheses (except literal values, variables, and function calls), so it's useful for debugging precedence errors.

## toJSFunction(parameters: array | string, variables?: object)

Convert an `Expression` object into a callable JavaScript function. `parameters` is an array of parameter names, or a string, with the names separated by commas.

If the optional `variables` argument is provided, the expression will be simplified with variables bound to the supplied values.

```js
const expr = Parser.parse("x + y + z");

// Create a function with all three parameters
const f1 = expr.toJSFunction("x,y,z");
console.log(f1(1, 2, 3)); // 6

// Create a function with x pre-bound to 100
const f2 = expr.toJSFunction("y,z", { x: 100 });
console.log(f2(2, 3)); // 105
```
