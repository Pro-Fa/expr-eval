# TypeScript Port Enhancements

This is a modern TypeScript port of the expr-eval library, completely rewritten with contemporary build tools and development practices. Originally based on [expr-eval 2.0.2](http://silentmatt.com/javascript-expression-evaluator/), this version has been restructured with a modular architecture, TypeScript support, and comprehensive testing using Vitest. The library almost maintains backward compatibility while providing enhanced features and improved maintainability.

This port adds the following enhancements over the original:

## Support for json() function

This will return a JSON string:

```js
json([1, 2, 3])
```

## Support for undefined

The concept of JavaScript's undefined has been added to the parser.

### undefined keyword

The undefined keyword has been added to the parser allowing it to be used in expressions.

```js
x > 3 ? undefined : x
x == undefined ? 1 : 2
```

### Setting expression variables to undefined

If you set a local variable to undefined, expr-eval would generate an error saying that your variable was unrecognized.

For example:

```js
/* myCustomFn() returns undefined */
x = myCustomFn(); x > 3
/* Error: unrecognized variable: x */
```

This has been fixed, you can now set expression variables to undefined and they will resolve correctly.

### Operators/functions gracefully support undefined

All operators and built-in functions have been extended to gracefully support undefined. Generally speaking if one of the input values is undefined then the operator/function returns undefined. So `2 + undefined` is `undefined`, `max(0, 1, undefined)` is `undefined`, etc.

Logical operators act just like JavaScript, so `3 > undefined` is `false`.

## Coalesce Operator

The coalesce operator `??` has been added; `x ?? y` will evaluate to y if x is:

* `undefined`
* `null`
* Infinity (divide by zero)
* NaN

Examples:

```js
var parser = new Parser();
var obj = { x: undefined, y: 10, z: 0 };
parser.evaluate('x ?? 0', obj); // 0
parser.evaluate('y ?? 0', obj); // 10
parser.evaluate('x ?? 1 * 3', obj); // (undefined ?? 1) * 3 = 3
parser.evaluate('y ?? 1 * 3', obj); // (10 ?? 1) * 3 = 30
parser.evaluate('10 / z', obj); // Infinity
parser.evaluate('10 / z ?? 0', obj); // 0
parser.evaluate('sqrt -1'); // NaN
parser.evaluate('sqrt -1 ?? 0'); // 0
```

## Not In Operator

The `not in` operator has been added.

`"a" not in ["a", "b", "c"]`

is equivalent to

`not ("a" in ["a", "b", "c"])`

## Optional Chaining for Property Access

Structure/array property references now act like `?.`, meaning if the entire property chain does not exist then instead of throwing an error the value of the property is undefined.

For example:

```js
var parser = new Parser();
var obj = { thingy: { array: [{ value: 10 }] } };
parser.evaluate('thingy.array[0].value', obj); // 10
parser.evaluate('thingy.array[1].value', obj); // undefined
parser.evaluate('thingy.doesNotExist[0].childArray[1].notHere.alsoNotHere', obj); // undefined
parser.evaluate('thingy.array[0].value.doesNotExist', obj); // undefined
```

This can be combined with the coalesce operator to gracefully fall back on a default value if some part of a long property reference is `undefined`.

```js
var parser = new Parser();
var obj = { thingy: { array: [{ value: 10 }] } };
parser.evaluate('thingy.array[1].value ?? 0', obj); // 0
```

## String Concatenation Using +

The + operator can now be used to concatenate strings.

```js
var parser = new Parser();
var obj = { thingy: { array: [{ value: 10 }] } };
parser.evaluate('"abc" + "def" + "ghi"', obj); // 'abcdefghi'
```

## Support for Promises in Custom Functions

Custom functions can return promises. When this happens evaluate will return a promise that when resolved contains the expression value.

```js
const parser = new Parser();

parser.functions.doIt = value => value + value;
parser.evaluate('doIt(2) + 3'); // 7

parser.functions.doIt = value =>
    new Promise((resolve) => setTimeout(() => resolve(value + value), 100));
await parser.evaluate('doIt(2) + 3'); // 7
```

## Support for Custom Variable Name Resolution

Custom logic can be provided to resolve unrecognized variable names. The parser has a resolve callback that will be called any time a variable name is not recognized. This can return an object that either indicates that the variable name is an alias for another variable or it can return the variable value.

```js
const parser = new Parser();
const obj = { variables: { a: 5, b: 1 } };
parser.resolve = token => token === '$v' ? { alias: 'variables' } : undefined;
parser.evaluate('$v.a + variables.b', obj); // 6

parser.resolve = token =>
    token.startsWith('$') ? { value: obj.variables[token.substring(1)] } : undefined;
assert.strictEqual(parser.evaluate('$a + $b'), 6);
```

## SQL Style Case Blocks

> **NOTE:** `toJSFunction()` is not supported for expressions that use case blocks.

SQL style case blocks are now supported, for both cases which evaluate a value against other values (a switch style case) and cases which test for the first truthy when (if/else/if style cases).

### Switch-style case

```js
const parser = new Parser();
const expr = `
    case x
        when 1 then 'one'
        when 1+1 then 'two'
        when 1+1+1 then 'three'
        else 'too-big'
    end
`;
parser.evaluate(expr, { x: 1 }); // 'one'
parser.evaluate(expr, { x: 2 }); // 'two'
parser.evaluate(expr, { x: 3 }); // 'three'
parser.evaluate(expr, { x: 4 }); // 'too-big'
```

### If/else-style case

```js
const parser = new Parser();
const expr = `
    case
        when x == 1 then 'one'
        when x == 1+1 then 'two'
        when x == 1+1+1 then 'three'
        else 'too-big'
    end
`;
parser.evaluate(expr, { x: 1 }); // 'one'
parser.evaluate(expr, { x: 2 }); // 'two'
parser.evaluate(expr, { x: 3 }); // 'three'
parser.evaluate(expr, { x: 4 }); // 'too-big'
```

## Object Construction

Objects can be created using JavaScript syntax. This allows for expressions that return object values and for object arguments to be passed to custom functions.

```js
const parser = new Parser();
const expr = `{
    a: x * 3,
    b: {
        /*this x is a property and not the x on the input object*/
        x: "first" + "_" + "second",
        y: min(x, 0),
    },
    c: [0, 1, 2, x],
}`;
parser.evaluate(expr, { x: 3 });
/*
{
    a: 15,
    b: {
        x: 'first_second',
        z: 0
    },
    c: [0, 1, 2, 3]
}
*/
```

## As Operator (Type Conversion)

An as operator has been added to support type conversion. **This operator is disabled by default and must be explicitly enabled by setting `operators.conversion` to true in the options.** It can be used to perform value conversion. By default is of limited value; it only supports converting values to numbers, int/integer (by rounding the number), and boolean. The intent is to allow integration of more sophisticated value conversion packages such as numeral.js and moment for conversion of other values.

```js
const parser = new Parser({ operators: { conversion: true } });
parser.evaluate('"1.6" as "number"'); // 1.6
parser.evaluate('"1.6" as "int"'); // 2
parser.evaluate('"1.6" as "integer"'); // 2
parser.evaluate('"1.6" as "boolean"'); // true
```

The default `as` implementation can be overridden by replacing `parser.binaryOps.as`.

```js
const parser = new Parser({ operators: { conversion: true } });
parser.binaryOps.as = (a, _b) => a + '_suffix';
parser.evaluate('"abc" as "suffix"'); // 'abc_suffix'
```
