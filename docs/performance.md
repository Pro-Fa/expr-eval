# Performance Testing Guide

> **Audience:** Contributors working on expr-eval internals and performance optimization.

This document explains how to run and interpret performance tests for the expr-eval library.

## Overview

The performance testing suite includes comprehensive benchmarks for:

- **Parsing Performance** - How fast expressions are parsed into AST
- **Evaluation Performance** - How fast parsed expressions are evaluated
- **Memory Usage** - Memory efficiency and garbage collection impact
- **Scalability** - Performance with increasing complexity
- **Regression Detection** - Automated performance regression detection

## Modern Tooling

The performance tests use modern JavaScript performance testing tools:

- **[Tinybench](https://github.com/tinylibs/tinybench)** - Lightweight, accurate benchmarking library
- **[Vitest](https://vitest.dev/)** - Fast test runner with built-in benchmarking support
- **Performance APIs** - Browser and Node.js native performance measurement

## Quick Start

### Run All Benchmarks

```bash
npm run bench
```

This runs the comprehensive benchmark suite and provides a detailed performance report.

### Run Specific Benchmark Categories

```bash
# Parsing performance only
npm run bench:parsing

# Evaluation performance only
npm run bench:evaluation

# Memory usage benchmarks
npm run bench:memory

# CI-friendly output (for automated testing)
npm run bench:ci
```

## Benchmark Categories

### 1. Parsing Performance (`benchmarks/parsing.bench.ts`)

Tests how efficiently expressions are parsed into Abstract Syntax Trees (AST).

**Test Cases:**
- Simple arithmetic: `2 + 3`
- Complex arithmetic: `(2 + 3) * 4 - 5 / 2`
- Variable expressions: `x * y + z`
- Function calls: `sin(x) + cos(y) + sqrt(z)`
- Nested expressions: `((a + b) * (c - d)) / ((e + f) * (g - h))`
- Array operations: `[1, 2, 3, 4, 5].map(x => x * 2).filter(x => x > 4)`
- String operations: `"hello" + " " + "world"`
- Conditional expressions: `x > 0 ? y : z`

**Performance Expectations:**
- Simple expressions: >100,000 ops/sec
- Complex expressions: >10,000 ops/sec
- Memory usage should remain stable

### 2. Evaluation Performance (`benchmarks/evaluation.bench.ts`)

Tests how efficiently parsed expressions are evaluated with different variable contexts.

**Test Scenarios:**
- Pre-parsed vs parse-and-evaluate
- Different variable set sizes
- Function-heavy expressions
- Mathematical computations
- Array and string operations

**Performance Expectations:**
- Simple evaluations: >500,000 ops/sec
- Complex evaluations: >50,000 ops/sec
- Variable lookup should be O(1)

### 3. Memory Performance (`benchmarks/memory.bench.ts`)

Tests memory efficiency and garbage collection impact.

**Test Areas:**
- Parser instance creation/cleanup
- Expression reuse vs recreation
- Large variable contexts
- Deep nested expressions
- Long arithmetic expressions

**Memory Expectations:**
- No memory leaks during repeated operations
- Efficient garbage collection
- Minimal memory footprint per expression

## Understanding Results

### Reading Benchmark Output

```
Operation                   Mean Time (ms)    Ops/sec     Status
Simple arithmetic parsing       0.0045        220,000     ✅ Fast
Complex parsing                 0.0250         40,000     ✅ Fast
Very complex parsing            0.1500          6,667     ⚠️ Check
```

### Performance Grades

The benchmark runner assigns overall performance grades:

- **A (🏆)**: >100,000 avg ops/sec - Excellent performance
- **B (👍)**: >50,000 avg ops/sec - Good performance
- **C (👌)**: >10,000 avg ops/sec - Acceptable performance
- **D (⚠️)**: >1,000 avg ops/sec - Needs optimization
- **F (❌)**: <1,000 avg ops/sec - Poor performance

### Regression Detection

The system automatically flags potential performance regressions:

- Operations taking >1ms are flagged as potential issues
- Dramatic performance drops between runs
- Memory usage increases beyond thresholds

## Writing Custom Benchmarks

### Using Vitest Bench

```typescript
import { bench, describe } from 'vitest';
import { Parser } from '../index';

describe('Custom Benchmarks', () => {
  const parser = new Parser();

  bench('My custom test', () => {
    // Your test code here
    parser.evaluate('custom expression');
  });
});
```

### Using Tinybench Directly

```typescript
import { Bench } from 'tinybench';
import { Parser } from '../index';

const bench = new Bench({ time: 1000 });
const parser = new Parser();

bench.add('Custom test', () => {
  parser.evaluate('custom expression');
});

await bench.run();
console.table(bench.table());
```

## Performance Best Practices

### For expr-eval Usage

1. **Reuse Expressions**: Parse once, evaluate many times
   ```typescript
   const expr = parser.parse('x * y + z');
   // Reuse for different variable values
   expr.evaluate({ x: 1, y: 2, z: 3 });
   expr.evaluate({ x: 4, y: 5, z: 6 });
   ```

2. **Minimize Variable Context**: Only include needed variables
   ```typescript
   // Good
   expr.evaluate({ x: 1, y: 2 });

   // Avoid if not needed
   expr.evaluate({ x: 1, y: 2, unused1: 3, unused2: 4, ... });
   ```

3. **Use Simple Expressions**: Complex nesting impacts performance
   ```typescript
   // Faster
   parser.evaluate('a + b + c');

   // Slower
   parser.evaluate('((((a + b) + c) + d) + e)');
   ```

### For expr-eval Development

1. **Profile Before Optimizing**: Use benchmarks to identify bottlenecks
2. **Test Edge Cases**: Include worst-case scenarios in benchmarks
3. **Monitor Regressions**: Run benchmarks in CI/CD pipelines
4. **Memory Awareness**: Test for memory leaks and efficient cleanup

## Continuous Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]
jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run bench:ci
      - name: Check for regressions
        run: |
          # Custom script to compare with baseline
          node scripts/check-performance-regression.js
```

### Performance Monitoring

Set up automated performance monitoring:

1. **Baseline Establishment**: Record performance baselines for major versions
2. **Regression Alerts**: Automatically flag significant performance drops
3. **Trend Analysis**: Track performance trends over time
4. **Environment Consistency**: Use consistent hardware for benchmarks

## Troubleshooting

### Common Issues

**"Benchmark results vary widely"**
- Ensure system is not under load during testing
- Close other applications
- Run multiple iterations and average results

**"Memory usage keeps growing"**
- Check for memory leaks in test code
- Ensure proper cleanup after benchmarks
- Monitor garbage collection frequency

**"Performance suddenly degraded"**
- Check recent code changes
- Verify no unintended dependencies were added
- Profile specific operations that became slower

### Getting Help

- Check existing benchmark results for comparison
- Run individual benchmark categories to isolate issues
- Use Node.js profiling tools for detailed analysis
- Review performance-related GitHub issues

## Contributing Performance Tests

When adding new features to expr-eval:

1. **Add Corresponding Benchmarks**: New features should include performance tests
2. **Verify Performance Impact**: Ensure new features don't regress existing performance
3. **Document Performance Characteristics**: Include expected performance ranges
4. **Update Baselines**: Establish new performance baselines when architecture changes

---

For more detailed information about specific benchmarks, see the individual benchmark files in the `benchmarks/` directory.
