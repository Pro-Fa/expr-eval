# Expression

`Parser.parse(str)` returns an `Expression` object. `Expression`s are similar to JavaScript functions, i.e. they can be "called" with variables bound to passed-in values. In fact, they can even be converted into JavaScript functions.

## evaluate(variables?: object)

Evaluate the expression, with variables bound to the values in `{variables}`. Each variable in the expression is bound to the corresponding member of the `variables` object. If there are unbound variables, `evaluate` will throw an exception.

```js
js> expr = Parser.parse("2 ^ x");
(2^x)
js> expr.evaluate({ x: 3 });
8
```

## substitute(variable: string, expression: Expression | string | number)

Create a new `Expression` with the specified variable replaced with another expression. This is similar to function composition. If `expression` is a string or number, it will be parsed into an `Expression`.

```js
js> expr = Parser.parse("2 * x + 1");
((2*x)+1)
js> expr.substitute("x", "4 * x");
((2*(4*x))+1)
js> expr2.evaluate({ x: 3 });
25
```

## simplify(variables: object)

Simplify constant sub-expressions and replace variable references with literal values. This is basically a partial evaluation, that does as much of the calculation as it can with the provided variables. Function calls are not evaluated (except the built-in operator functions), since they may not be deterministic.

Simplify is pretty simple. For example, it doesn't know that addition and multiplication are associative, so `((2*(4*x))+1)` from the previous example cannot be simplified unless you provide a value for x. `2*4*x+1` can however, because it's parsed as `(((2*4)*x)+1)`, so the `(2*4)` sub-expression will be replaced with "8", resulting in `((8*x)+1)`.

```js
js> expr = Parser.parse("x * (y * atan(1))").simplify({ y: 4 });
(x*3.141592653589793)
js> expr.evaluate({ x: 2 });
6.283185307179586
```

## variables(options?: object)

Get an array of the unbound variables in the expression.

```js
js> expr = Parser.parse("x * (y * atan(1))");
(x*(y*atan(1)))
js> expr.variables();
x,y
js> expr.simplify({ y: 4 }).variables();
x
```

By default, `variables` will return "top-level" objects, so for example, `Parser.parse(x.y.z).variables()` returns `['x']`. If you want to get the whole chain of object members, you can call it with `{ withMembers: true }`. So `Parser.parse(x.y.z).variables({ withMembers: true })` would return `['x.y.z']`.

## symbols(options?: object)

Get an array of variables, including any built-in functions used in the expression.

```js
js> expr = Parser.parse("min(x, y, z)");
(min(x, y, z))
js> expr.symbols();
min,x,y,z
js> expr.simplify({ y: 4, z: 5 }).symbols();
min,x
```

Like `variables`, `symbols` accepts an option argument `{ withMembers: true }` to include object members.

## toString()

Convert the expression to a string. `toString()` surrounds every sub-expression with parentheses (except literal values, variables, and function calls), so it's useful for debugging precedence errors.

## toJSFunction(parameters: array | string, variables?: object)

Convert an `Expression` object into a callable JavaScript function. `parameters` is an array of parameter names, or a string, with the names separated by commas.

If the optional `variables` argument is provided, the expression will be simplified with variables bound to the supplied values.

```js
js> expr = Parser.parse("x + y + z");
((x + y) + z)
js> f = expr.toJSFunction("x,y,z");
[Function] // function (x, y, z) { return x + y + z; };
js> f(1, 2, 3)
6
js> f = expr.toJSFunction("y,z", { x: 100 });
[Function] // function (y, z) { return 100 + y + z; };
js> f(2, 3)
105
```
