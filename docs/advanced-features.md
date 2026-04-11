# Advanced Features

> **Audience:** Developers integrating expr-eval who need advanced customization and features.

This document covers advanced integration features beyond basic parsing and evaluation. For expression syntax, see [Expression Syntax](syntax.md). For basic parser usage, see [Parser](parser.md).

## About This TypeScript Port

This is a modern TypeScript port of the expr-eval library, completely rewritten with contemporary build tools and development practices. Originally based on [expr-eval 2.0.2](http://silentmatt.com/javascript-expression-evaluator/), this version has been restructured with a modular architecture, TypeScript support, and comprehensive testing using Vitest.

The library maintains backward compatibility while providing enhanced features and improved maintainability.

## Async Expressions (Promise Support)

Custom functions can return promises. When they do, `evaluate()` returns a promise:

```js
const parser = new Parser();

// Synchronous function
parser.functions.double = value => value * 2;
parser.evaluate('double(2) + 3'); // 7

// Async function
parser.functions.fetchData = async (id) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
};

// evaluate() now returns a Promise
const result = await parser.evaluate('fetchData(123) + 10');
```

**Note:** When any function in an expression returns a promise, the entire `evaluate()` call becomes async.

## Custom Variable Name Resolution

The `parser.resolve` callback is called when a variable name is not found in the provided variables object. This enables:

- Variable name aliasing
- Dynamic variable lookup
- Custom naming conventions (e.g., `$variable` syntax)

```js
const parser = new Parser();

// Example 1: Alias resolution
const data = { variables: { a: 5, b: 10 } };

parser.resolve = (name) => {
  if (name === '$v') {
    return { alias: 'variables' };
  }
  return undefined;
};

parser.evaluate('$v.a + $v.b', data); // 15

// Example 2: Direct value resolution
parser.resolve = (name) => {
  if (name.startsWith('$')) {
    const key = name.substring(1);
    return { value: data.variables[key] };
  }
  return undefined;
};

parser.evaluate('$a + $b', {}); // 15
```

**Return values:**
- `{ alias: string }` - Redirect to another variable name
- `{ value: any }` - Return a value directly
- `undefined` - Use default behavior (throws error for unknown variables)

### Per-Expression Variable Resolver

`parser.resolve` is shared by every expression a parser produces. When you need different resolution logic for different evaluations — e.g. per-row, per-request, or per-tenant lookups — pass a resolver directly to `Expression.evaluate()` (or `parser.evaluate()`) instead of mutating `parser.resolve`. This lets a single parsed expression be reused across many calls without the cost of re-parsing or the hazards of shared mutable state.

```js
const parser = new Parser();
const expr = parser.parse('$user.name + " is " + $user.age');

// Same compiled expression, two different data sources, no parser mutation.
expr.evaluate({}, (name) =>
  name === '$user' ? { value: { name: 'Alice', age: 30 } } : undefined
); // 'Alice is 30'

expr.evaluate({}, (name) =>
  name === '$user' ? { value: { name: 'Bob',   age: 25 } } : undefined
); // 'Bob is 25'
```

The per-call resolver uses the same return shape as `parser.resolve` — `{ alias }`, `{ value }`, or `undefined` — and the resolution order during evaluation is:

1. The `variables` object passed to `evaluate()`
2. The per-call `resolver` (if provided)
3. `parser.resolve` (the parser-level callback)
4. Otherwise, a `VariableError` is thrown

Because the per-call resolver falls through to `parser.resolve` on `undefined`, the two can be layered: a parser-level resolver can provide defaults or shared lookups, while per-call resolvers handle request-specific data.

```js
const parser = new Parser();

// Parser-level: shared constants that never change
parser.resolve = (name) =>
  name === '$pi' ? { value: Math.PI } : undefined;

// Per-call: request-specific data
parser.parse('$pi * $radius ^ 2').evaluate({}, (name) =>
  name === '$radius' ? { value: 5 } : undefined
); // 78.539...
```

Both `Parser.evaluate(expr, variables, resolver)` and `Expression.evaluate(variables, resolver)` accept the resolver, and it propagates through nested constructs such as short-circuit `and`/`or`, the ternary `?:` operator, user-defined functions, and arrow functions.

## Type Conversion (as Operator)

The `as` operator provides type conversion capabilities. **Disabled by default.**

```js
const parser = new Parser({ operators: { conversion: true } });

parser.evaluate('"1.6" as "number"');   // 1.6
parser.evaluate('"1.6" as "int"');      // 2 (rounded)
parser.evaluate('"1.6" as "integer"');  // 2 (rounded)
parser.evaluate('"1" as "boolean"');    // true
parser.evaluate('"" as "boolean"');     // false
```

### Custom Type Conversion

Override `parser.binaryOps.as` to implement custom type conversion:

```js
const parser = new Parser({ operators: { conversion: true } });

// Integrate with a date library
parser.binaryOps.as = (value, type) => {
  if (type === 'date') {
    return new Date(value);
  }
  if (type === 'currency') {
    return `$${Number(value).toFixed(2)}`;
  }
  // Fall back to default behavior
  return defaultAsOperator(value, type);
};

parser.evaluate('"2024-01-15" as "date"'); // Date object
parser.evaluate('1234.5 as "currency"');    // "$1234.50"
```

## Expression Syntax Features

The following syntax features are available in expressions. They are documented here for developers to understand what's available; users should refer to [Expression Syntax](syntax.md).

### Undefined Support

The `undefined` keyword is available in expressions:

```js
x > 3 ? undefined : x
x == undefined ? 1 : 2
```

**Behavior:**
- Variables can be set to `undefined` without errors
- Most operators return `undefined` if any operand is `undefined`: `2 + undefined` → `undefined`
- Comparison operators follow JavaScript semantics: `3 > undefined` → `false`

### Coalesce Operator (??)

The `??` operator returns the right operand when the left is:
- `undefined`
- `null`
- `Infinity` (e.g., division by zero)
- `NaN`

```
x ?? 0              // Returns 0 if x is null/undefined
10 / 0 ?? -1        // Returns -1 (10/0 is Infinity)
sqrt(-1) ?? 0       // Returns 0 (sqrt(-1) is NaN)
```

### Optional Chaining for Property Access

Property access automatically handles missing properties without throwing errors:

```js
const obj = { user: { profile: { name: 'Ada' } } };

parser.evaluate('user.profile.name', obj);           // 'Ada'
parser.evaluate('user.profile.email', obj);          // undefined (not error)
parser.evaluate('user.settings.theme', obj);         // undefined (not error)
parser.evaluate('user.settings.theme ?? "dark"', obj); // 'dark'
```

### Not In Operator

The `not in` operator checks if a value is not in an array:

```
"d" not in ["a", "b", "c"]  // true
"a" not in ["a", "b", "c"]  // false
```

Equivalent to: `not ("a" in ["a", "b", "c"])`

**Note:** Requires `operators.in: true` in parser options.

### String Concatenation with +

The `+` operator concatenates strings:

```
"hello" + " " + "world"  // "hello world"
"Count: " + 42           // "Count: 42"
```

### SQL-Style CASE Blocks

SQL-style CASE expressions provide multi-way conditionals:

**Switch-style (comparing a value):**

```
case status
    when "active" then "✓ Active"
    when "pending" then "⏳ Pending"
    when "inactive" then "✗ Inactive"
    else "Unknown"
end
```

**If/else-style (evaluating conditions):**

```
case
    when score >= 90 then "A"
    when score >= 80 then "B"
    when score >= 70 then "C"
    when score >= 60 then "D"
    else "F"
end
```

> **Note:** `toJSFunction()` is not supported for expressions that use CASE blocks.

### Object Construction

Create objects directly in expressions:

```
{
    name: firstName + " " + lastName,
    age: currentYear - birthYear,
    scores: [test1, test2, test3],
    meta: {
        created: now,
        version: 1
    }
}
```

### json() Function

Convert values to JSON strings:

```
json([1, 2, 3])           // "[1,2,3]"
json({a: 1, b: 2})        // '{"a":1,"b":2}'
```

## Operator Customization

### Custom Binary Operators

Add or modify binary operators via `parser.binaryOps`:

```js
const parser = new Parser();

// Positive modulo (always returns positive)
parser.binaryOps['%%'] = (a, b) => ((a % b) + b) % b;

// String repeat operator
parser.binaryOps['**'] = (str, n) => str.repeat(n);
```

### Custom Unary Operators

Add or modify unary operators via `parser.unaryOps`:

```js
const parser = new Parser();

// Custom unary operator
parser.unaryOps['$'] = (x) => `$${x.toFixed(2)}`;
```

## See Also

- [Parser](parser.md) - Parser configuration and methods
- [Expression](expression.md) - Expression object API
- [Expression Syntax](syntax.md) - Complete syntax reference for expression writers
- [Language Service](language-service.md) - IDE integration
