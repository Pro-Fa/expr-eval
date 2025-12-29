# Breaking Changes

This document lists breaking changes in the library to help users migrate between versions.

## Version 5.0.0

### Security: Functions Must Be Registered Explicitly

**Background**: This change addresses critical security vulnerabilities:
- [CVE-2025-12735](https://github.com/advisories/GHSA-jc85-fpwf-qm7x) - Code injection via arbitrary function calls
- [CVE-2025-13204](https://github.com/advisories) - Prototype pollution via `__proto__`, `prototype`, `constructor` access
- [silentmatt/expr-eval#289](https://github.com/silentmatt/expr-eval/issues/289) - Member function call bypass

**What Changed**: Functions can no longer be passed directly via the evaluation context. All functions that need to be called from expressions must be explicitly registered in `parser.functions`.

**Before (Vulnerable)**:
```typescript
const parser = new Parser();

// This pattern is NO LONGER ALLOWED
parser.evaluate('customFunc()', { customFunc: () => 'result' });

// This also NO LONGER WORKS
parser.evaluate('obj.method()', { 
  obj: { 
    method: () => 'dangerous' 
  } 
});
```

**After (Secure)**:
```typescript
const parser = new Parser();

// Register functions explicitly
parser.functions.customFunc = () => 'result';
parser.evaluate('customFunc()');

// For methods on objects, register them as top-level functions
parser.functions.objMethod = () => 'safe';
parser.evaluate('objMethod()');
```

**What Still Works**:
- Passing primitive values (strings, numbers, booleans) via context
- Passing arrays and objects with non-function properties via context
- Using built-in Math functions (sin, cos, sqrt, etc.)
- Using inline-defined functions in expressions: `(f(x) = x * 2)(5)`
- Using functions registered in `parser.functions`

**Migration Guide**:

1. **Identify function usage**: Search your codebase for patterns like `evaluate('...', { fn: ... })` where `fn` is a function.

2. **Register functions before evaluation**:
   ```typescript
   // Before
   parser.evaluate('calculate(x)', { calculate: myFunc, x: 5 });
   
   // After
   parser.functions.calculate = myFunc;
   parser.evaluate('calculate(x)', { x: 5 });
   ```

3. **For dynamic functions**: If you need to register functions dynamically:
   ```typescript
   const parser = new Parser();
   parser.functions.dynamicFn = createDynamicFunction();
   const result = parser.evaluate('dynamicFn()');
   delete parser.functions.dynamicFn; // Clean up if needed
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
