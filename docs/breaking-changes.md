# Breaking Changes

This document lists breaking changes between versions of `@pro-fa/expr-eval`.

> **Audience**: Developers upgrading between versions

For detailed migration instructions, see the [Migration Guide](migration.md).

## Version 6.0.0

### Null Comparison Behavior

**What Changed**: Null comparisons now follow JavaScript semantics more closely. Previously, `null == undefined` returned `true`, but other null comparisons may have behaved unexpectedly.

**Migration**: Review expressions that compare values to `null` or `undefined`. Use the `??` (coalesce) operator for null/undefined fallback values.

## Version 5.0.0

### registerFunction Deprecated

**What Changed**: `registerFunction()` is deprecated. Use direct assignment to `parser.functions` instead.

**Before**:
```typescript
parser.registerFunction('double', (x) => x * 2);
```

**After**:
```typescript
parser.functions.double = (x) => x * 2;
```

### Protected Properties

Access to the following properties is now blocked to prevent prototype pollution attacks:
- `__proto__`
- `prototype`
- `constructor`

Attempting to access these properties in variable names or member expressions will throw an `AccessError`.

**Example**:
```typescript
// These will throw AccessError
parser.evaluate('x.__proto__', { x: {} });
parser.evaluate('__proto__', { __proto__: {} });
```

## Version 4.0.0

### Concatenation Operator Changed from `||` to `|`

**What Changed**: The `||` operator was repurposed for logical OR (JavaScript-style). A new `|` (pipe) operator was introduced for array and string concatenation. Additionally, the `&&` operator was added for logical AND.

**Before (original expr-eval 2.x)**:
```typescript
// || was used for concatenation
parser.evaluate('"hello" || " world"');  // "hello world"
parser.evaluate('[1, 2] || [3, 4]');     // [1, 2, 3, 4]
```

**After (v4.0.0+)**:
```typescript
// | is now used for concatenation
parser.evaluate('"hello" | " world"');   // "hello world"
parser.evaluate('[1, 2] | [3, 4]');      // [1, 2, 3, 4]

// || is now logical OR
parser.evaluate('true || false');        // true
parser.evaluate('false || true');        // true

// && is logical AND (new)
parser.evaluate('true && false');        // false
parser.evaluate('true && true');         // true
```

**Migration Guide**:

1. **Find concatenation usage**: Search your expressions for `||` used with strings or arrays
2. **Replace with pipe**: Change `||` to `|` for concatenation operations
3. **Review logical operations**: If you were using `or` keyword, you can now also use `||`

### Package Renamed

The package was renamed from `expr-eval` to `@pro-fa/expr-eval` and ported to TypeScript.

```bash
# Remove old package
npm uninstall expr-eval

# Install new package
npm install @pro-fa/expr-eval
```

Update imports:
```typescript
// Before
const { Parser } = require('expr-eval');

// After
import { Parser } from '@pro-fa/expr-eval';
```
