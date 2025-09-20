# Test Modernization Plan

This document outlines the comprehensive plan to modernize the unit tests in the expr-eval project from the current Mocha/JavaScript setup to a modern TypeScript-based testing framework.

## 📊 Current State Analysis

### Test Framework
- **Current**: Mocha with ts-node/esm loader
- **Configuration**: `.mocharc.json` with TypeScript support
- **Coverage**: Basic test coverage with nyc

### Test Files Structure
```
test/
├── expression.js           (487 lines) - Main expression evaluation tests
├── parser.js              (340 lines) - Parser functionality tests
├── operators.js           (45 lines)  - Operator precedence tests
├── functions.js           (158 lines) - Mathematical function tests
├── functions-unary-ops.js  (35 lines)  - Unary operator tests
├── functions-binary-ops.js (33 lines)  - Binary operator tests
└── lib/spy.js             (15 lines)  - Test utility helpers
```

### Current Issues
1. **Mixed module systems**: Some CommonJS patterns remain
2. **JavaScript test files**: No type safety in tests
3. **Old assertion style**: Repetitive `assert.strictEqual()` usage
4. **Limited test utilities**: Repetitive setup code
5. **No test categorization**: Flat test structure
6. **Missing test types**: No performance, property-based, or comprehensive error testing

## 🎯 Migration Goals

1. **Type Safety**: Convert all tests to TypeScript with proper type annotations
2. **Modern Framework**: Migrate to Vitest for better performance and developer experience
3. **Enhanced Testing**: Add performance benchmarks, property-based testing, and comprehensive error coverage
4. **Better Organization**: Structured test categories and reusable utilities
5. **Improved Developer Experience**: Better IDE support and faster test execution

## 📋 Detailed Action Plan

### Phase 1: Migrate to Vitest
**Benefits**: Native TypeScript support, faster execution, built-in coverage, ESM-first

**Dependencies Changes:**
```bash
# Remove current test dependencies
npm remove mocha @types/mocha nyc

# Install Vitest
npm install --save-dev vitest @vitest/coverage-v8 @vitest/ui @vitest/browser
```

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'test/**',
        'dist/**',
        'node_modules/**',
        '**/*.d.ts'
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90
      }
    },
    typecheck: {
      checker: 'tsc',
      include: ['test/**/*.test.ts']
    },
    reporters: ['verbose', 'junit'],
    outputFile: {
      junit: './test-results.xml'
    }
  }
});
```

**Package.json Script Updates:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:typecheck": "vitest typecheck"
  }
}
```

### Phase 2: TypeScript Conversion (Week 2)

#### File-by-File Conversion Strategy

**Priority Order:**
1. `test/lib/spy.js` → `test/helpers/test-utils.ts` (utilities first)
2. `test/expression.js` → `test/expression.test.ts` (main functionality)
3. `test/parser.js` → `test/parser.test.ts` (core parser)
4. `test/functions.js` → `test/functions.test.ts` (mathematical functions)
5. `test/operators.js` → `test/operators.test.ts` (operators)
6. `test/functions-unary-ops.js` → `test/unary-operators.test.ts`
7. `test/functions-binary-ops.js` → `test/binary-operators.test.ts`

#### Example Conversion: expression.js → expression.test.ts

**Before (JavaScript/Mocha):**
```javascript
const assert = require('assert');
const Parser = require('../dist/bundle.js').Parser;

describe('Expression', function () {
  it('should evaluate simple expressions', function () {
    const parser = new Parser();
    const expr = parser.parse('2 + 3');
    assert.strictEqual(expr.evaluate(), 5);
  });
});
```

**After (TypeScript/Vitest):**
```typescript
import { describe, it, expect } from 'vitest';
import { Parser, Expression } from '../src/index.js';
import { parseAndEvaluate, expectMathResult } from './helpers/test-utils.js';

describe('Expression', () => {
  describe('evaluate()', () => {
    it('should evaluate simple arithmetic expressions', () => {
      expect(parseAndEvaluate('2 + 3')).toBe(5);
      expect(parseAndEvaluate('10 - 4')).toBe(6);
      expect(parseAndEvaluate('3 * 4')).toBe(12);
      expect(parseAndEvaluate('15 / 3')).toBe(5);
    });

    it('should handle operator precedence correctly', () => {
      expect(parseAndEvaluate('2 + 3 * 4')).toBe(14);
      expect(parseAndEvaluate('(2 + 3) * 4')).toBe(20);
    });

    it('should evaluate expressions with variables', () => {
      const parser = new Parser();
      const expr = parser.parse('x + y * z');

      expect(expr.evaluate({ x: 1, y: 2, z: 3 })).toBe(7);
      expect(expr.evaluate({ x: 10, y: 5, z: 2 })).toBe(20);
    });
  });

  describe('toString()', () => {
    it('should generate readable string representation', () => {
      const parser = new Parser();
      const expr = parser.parse('x + y');

      expect(expr.toString()).toBe('(x + y)');
    });
  });
});
```

#### Test Utilities Creation

**New File: `test/helpers/test-utils.ts`**
```typescript
import { Parser, Expression, Value, Values } from '../../src/index.js';

export const createParser = (options?: any): Parser => new Parser(options);

export const parseAndEvaluate = (expression: string, variables?: Values): Value => {
  return createParser().parse(expression).evaluate(variables);
};

export const expectMathResult = (
  expression: string,
  expected: number,
  precision: number = 10,
  variables?: Values
): void => {
  const result = parseAndEvaluate(expression, variables);
  expect(result).toBeCloseTo(expected, precision);
};

export const expectParseError = (expression: string, errorMessage?: string): void => {
  const parser = createParser();
  if (errorMessage) {
    expect(() => parser.parse(expression)).toThrow(errorMessage);
  } else {
    expect(() => parser.parse(expression)).toThrow();
  }
};

export const expectEvaluationError = (
  expression: string,
  variables?: Values,
  errorMessage?: string
): void => {
  const parser = createParser();
  const expr = parser.parse(expression);

  if (errorMessage) {
    expect(() => expr.evaluate(variables)).toThrow(errorMessage);
  } else {
    expect(() => expr.evaluate(variables)).toThrow();
  }
};
```

### Phase 3: Enhanced Testing Patterns (Week 3)

#### Performance Testing
**New File: `test/performance/benchmark.test.ts`**
```typescript
import { describe, it, expect, bench } from 'vitest';
import { performance } from 'perf_hooks';
import { Parser } from '../../src/index.js';

describe('Performance Benchmarks', () => {
  const parser = new Parser();

  bench('parse simple expressions', () => {
    parser.parse('2 + 3 * 4');
  });

  bench('parse complex expressions', () => {
    parser.parse('sin(x) + cos(y) * tan(z) + sqrt(a) + log(b)');
  });

  bench('evaluate with variables', () => {
    const expr = parser.parse('x * y + z');
    expr.evaluate({ x: 2, y: 3, z: 4 });
  });

  it('should parse 1000 simple expressions under 100ms', () => {
    const expression = '2 + 3 * 4';

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      parser.parse(expression);
    }
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
  });
});
```

#### Property-Based Testing
**Dependencies:**
```bash
npm install --save-dev fast-check
```

**New File: `test/property/mathematical-properties.test.ts`**
```typescript
import { describe, it } from 'vitest';
import { fc } from 'fast-check';
import { parseAndEvaluate, expectMathResult } from '../helpers/test-utils.js';

describe('Mathematical Properties', () => {
  it('should respect commutative property of addition', () => {
    fc.assert(fc.property(
      fc.float({ min: -100, max: 100 }),
      fc.float({ min: -100, max: 100 }),
      (a, b) => {
        const result1 = parseAndEvaluate('a + b', { a, b });
        const result2 = parseAndEvaluate('b + a', { a, b });
        expect(result1).toBeCloseTo(result2 as number, 10);
      }
    ));
  });

  it('should respect associative property of multiplication', () => {
    fc.assert(fc.property(
      fc.float({ min: -10, max: 10 }),
      fc.float({ min: -10, max: 10 }),
      fc.float({ min: -10, max: 10 }),
      (a, b, c) => {
        const result1 = parseAndEvaluate('(a * b) * c', { a, b, c });
        const result2 = parseAndEvaluate('a * (b * c)', { a, b, c });
        expect(result1).toBeCloseTo(result2 as number, 8);
      }
    ));
  });

  it('should respect distributive property', () => {
    fc.assert(fc.property(
      fc.float({ min: -10, max: 10 }),
      fc.float({ min: -10, max: 10 }),
      fc.float({ min: -10, max: 10 }),
      (a, b, c) => {
        const result1 = parseAndEvaluate('a * (b + c)', { a, b, c });
        const result2 = parseAndEvaluate('a * b + a * c', { a, b, c });
        expect(result1).toBeCloseTo(result2 as number, 8);
      }
    ));
  });
});
```

#### Comprehensive Error Testing
**New File: `test/errors/parser-errors.test.ts`**
```typescript
import { describe, it } from 'vitest';
import { expectParseError, expectEvaluationError } from '../helpers/test-utils.js';

describe('Parser Error Handling', () => {
  describe('Syntax Errors', () => {
    it('should throw on incomplete expressions', () => {
      expectParseError('2 +');
      expectParseError('* 3');
      expectParseError('2 + + 3');
    });

    it('should throw on mismatched parentheses', () => {
      expectParseError('(2 + 3');
      expectParseError('2 + 3)');
      expectParseError('((2 + 3)');
    });

    it('should throw on invalid function calls', () => {
      expectParseError('sin(');
      expectParseError('cos(2,)');
      expectParseError('unknown_function(2)');
    });
  });

  describe('Evaluation Errors', () => {
    it('should throw on undefined variables', () => {
      expectEvaluationError('x + 1');
      expectEvaluationError('sin(y)');
    });

    it('should throw on type mismatches', () => {
      expectEvaluationError('2 + "string"', { string: "text" });
    });
  });
});
```

#### Type Safety Tests
**New File: `test/types/type-safety.test.ts`**
```typescript
import { describe, it } from 'vitest';
import { expectType, expectError } from 'tsd';
import { Parser, Expression, Value } from '../../src/index.js';

describe('Type Safety', () => {
  it('should have correct return types', () => {
    const parser = new Parser();
    const expr = parser.parse('x + 1');

    expectType<Expression>(expr);
    expectType<Value>(expr.evaluate());
    expectType<Value>(expr.evaluate({ x: 5 }));
  });

  it('should enforce type constraints', () => {
    const parser = new Parser();
    const expr = parser.parse('x + 1');

    // Should error on invalid input types
    expectError(expr.evaluate('invalid'));
    expectError(expr.evaluate(123));
  });
});
```

### Phase 4: Enhanced Test Organization (Week 4)

#### New Test Structure
```
test/
├── helpers/
│   ├── test-utils.ts           - Common test utilities
│   └── math-helpers.ts         - Mathematical test helpers
├── unit/
│   ├── expression.test.ts      - Expression class tests
│   ├── parser.test.ts          - Parser class tests
│   ├── operators.test.ts       - Operator tests
│   └── functions.test.ts       - Function tests
├── integration/
│   ├── complex-expressions.test.ts  - End-to-end expression tests
│   └── real-world-usage.test.ts     - Real-world scenarios
├── performance/
│   └── benchmark.test.ts       - Performance benchmarks
├── property/
│   └── mathematical-properties.test.ts - Property-based tests
├── errors/
│   ├── parser-errors.test.ts   - Parser error cases
│   └── evaluation-errors.test.ts - Evaluation error cases
└── types/
    └── type-safety.test.ts     - TypeScript type tests
```

#### Test Coverage Goals
- **Statements**: 95%+
- **Branches**: 90%+
- **Functions**: 95%+
- **Lines**: 95%+

#### CI/CD Integration Updates
```yaml
# .github/workflows/ci.yml additions
- name: Run Tests
  run: |
    npm run test:typecheck
    npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 📊 Migration Timeline

### Week 1: Foundation Setup
- [ ] Choose test framework (Vitest recommended)
- [ ] Install dependencies and remove old ones
- [ ] Configure Vitest/updated Mocha
- [ ] Convert test utilities (spy.js → test-utils.ts)
- [ ] Convert 1 simple test file as proof of concept

### Week 2: Core Test Conversion
- [ ] Convert expression.js → expression.test.ts
- [ ] Convert parser.js → parser.test.ts
- [ ] Convert functions.js → functions.test.ts
- [ ] Convert remaining operator test files
- [ ] Ensure all existing tests pass

### Week 3: Enhanced Testing
- [ ] Add performance benchmark tests
- [ ] Implement property-based testing
- [ ] Create comprehensive error testing
- [ ] Add type safety tests
- [ ] Improve test coverage to 95%+

### Week 4: Organization & Polish
- [ ] Reorganize tests into logical categories
- [ ] Add test documentation
- [ ] Set up advanced test reporting
- [ ] Configure CI/CD integration
- [ ] Performance regression testing

## 🎯 Expected Benefits

### Developer Experience
1. **Type Safety**: Catch test errors at compile time
2. **Better IDE Support**: IntelliSense and refactoring for test code
3. **Faster Feedback**: Vitest is 2-5x faster than Mocha
4. **Modern Tooling**: Native TypeScript support, better debugging

### Code Quality
1. **Higher Test Coverage**: Comprehensive error and edge case testing
2. **Property-Based Testing**: Automatic discovery of edge cases
3. **Performance Monitoring**: Regression detection for expression parsing/evaluation
4. **Type Safety**: Ensures API contracts in tests match implementation

### Maintainability
1. **Cleaner Test Code**: Modern patterns and utilities
2. **Better Organization**: Logical categorization of different test types
3. **Reusable Components**: Test utilities reduce duplication
4. **Documentation**: Self-documenting test patterns

## 🔄 Rollback Plan

If migration encounters issues:

1. **Phase 1 Rollback**: Revert to Mocha, keep `.mocharc.json`
2. **Gradual Migration**: Convert files one by one, keep both JS and TS tests temporarily
3. **Parallel Testing**: Run both old and new test suites until migration is complete

## ✅ Success Criteria

- [ ] All existing functionality tested with TypeScript
- [ ] 95%+ test coverage maintained or improved
- [ ] Test execution time improved (target: 50% faster)
- [ ] Zero type errors in test code
- [ ] All CI/CD pipelines working with new test setup
- [ ] Documentation updated with new test patterns

---

**Next Steps**: Begin with Phase 1 by choosing the test framework and setting up the basic configuration. Vitest is recommended for the best modernization impact.
