import { Bench } from 'tinybench';
import { Parser } from '../index';

// Comprehensive evaluation performance benchmark suite for detailed evaluation performance analysis
export async function runDetailedEvaluationBenchmarks() {
  const parser = new Parser();
  const bench = new Bench({ time: 1000, iterations: 50000 });

  const expressions = {
    simple: { expr: '2 + 3', vars: {} },
    arithmetic: { expr: '(a + b) * c - d / e', vars: { a: 10, b: 20, c: 30, d: 40, e: 50 } },
    functions: { expr: 'sin(x) + cos(y) + sqrt(z)', vars: { x: 45, y: 30, z: 25 } },
    conditional: { expr: 'a > b ? c * 2 : d / 2', vars: { a: 5, b: 3, c: 10, d: 20 } },
    nested: { expr: '((a + b) * (c - d)) / (e + f)', vars: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 } },
    array: { expr: '[1, 2, 3, 4, 5]', vars: {} },
    string: { expr: '"hello " + "world"', vars: {} },
    comparison: { expr: 'a > b && c < d || e == f', vars: { a: 5, b: 3, c: 2, d: 4, e: 1, f: 1 } }
  };

  // Pre-parse expressions to test pure evaluation performance
  const parsedExpressions = Object.fromEntries(
    Object.entries(expressions).map(([key, { expr, vars }]) => [
      key,
      { parsed: parser.parse(expr), vars }
    ])
  );

  // Test parsing + evaluation (full pipeline)
  Object.entries(expressions).forEach(([name, { expr, vars }]) => {
    bench.add(`${name} - parse + evaluate`, () => {
      parser.evaluate(expr, vars);
    });
  });

  // Test pure evaluation (pre-parsed expressions)
  Object.entries(parsedExpressions).forEach(([name, { parsed, vars }]) => {
    bench.add(`${name} - evaluate only`, () => {
      parsed.evaluate(vars);
    });
  });

  // Test evaluation with different context sizes
  const simpleExpr = parser.parse('x + y');

  bench.add('eval with small context (2 vars)', () => {
    simpleExpr.evaluate({ x: 1, y: 2 });
  });

  bench.add('eval with medium context (10 vars)', () => {
    const mediumContext = Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`var${i}`, i])
    );
    simpleExpr.evaluate({ ...mediumContext, x: 1, y: 2 });
  });

  bench.add('eval with large context (100 vars)', () => {
    const largeContext = Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [`var${i}`, i])
    );
    simpleExpr.evaluate({ ...largeContext, x: 1, y: 2 });
  });

  // Test expression reuse vs recreation
  bench.add('expression reuse (parse once, eval many)', () => {
    const expr = parser.parse('x * 2 + 1');
    for (let i = 0; i < 10; i++) {
      expr.evaluate({ x: i });
    }
  });

  bench.add('expression recreation (parse + eval each time)', () => {
    for (let i = 0; i < 10; i++) {
      parser.evaluate('x * 2 + 1', { x: i });
    }
  });

  await bench.run();

  console.log('\n=== Detailed Evaluation Performance Results ===');
  console.table(
    bench.tasks.map(task => ({
      'Scenario': task.name,
      'Mean Time (ms)': task.result?.mean.toFixed(4) || 'N/A',
      'Std Dev (ms)': task.result?.sd.toFixed(4) || 'N/A',
      'Min Time (ms)': task.result?.min.toFixed(4) || 'N/A',
      'Max Time (ms)': task.result?.max.toFixed(4) || 'N/A',
      'Ops/sec': task.result?.hz.toFixed(0) || 'N/A'
    }))
  );

  return bench.tasks.map(task => ({
    name: task.name,
    result: task.result
  }));
}

// Performance comparison between evaluation methods
export async function runEvaluationComparisonBenchmarks() {
  const parser = new Parser();
  const bench = new Bench({ time: 2000, iterations: 100000 });

  const testExpression = 'a * b + c / d - e';
  const variables = { a: 10, b: 20, c: 30, d: 40, e: 50 };
  const parsedExpr = parser.parse(testExpression);

  // Method 1: Parse and evaluate in one call
  bench.add('Method 1: parser.evaluate()', () => {
    parser.evaluate(testExpression, variables);
  });

  // Method 2: Parse once, evaluate many times
  bench.add('Method 2: parse once, evaluate', () => {
    parsedExpr.evaluate(variables);
  });

  // Method 3: Using toString() and re-parsing (anti-pattern)
  bench.add('Method 3: toString() + re-parse (anti-pattern)', () => {
    const str = parsedExpr.toString();
    parser.evaluate(str, variables);
  });

  await bench.run();

  console.log('\n=== Evaluation Method Comparison ===');
  const results = bench.tasks.map(task => ({
    'Method': task.name,
    'Mean Time (μs)': task.result ? (task.result.mean * 1000).toFixed(2) : 'N/A',
    'Ops/sec': task.result?.hz.toFixed(0) || 'N/A',
    'Relative Performance': '1.00x' // Will calculate after we have all results
  }));

  // Calculate relative performance (fastest = 1.00x)
  const times = bench.tasks
    .map(task => task.result?.mean || Infinity)
    .filter(time => time !== Infinity);

  if (times.length > 0) {
    const fastest = Math.min(...times);
    results.forEach((result, index) => {
      const time = bench.tasks[index].result?.mean;
      if (time) {
        const relative = time / fastest;
        result['Relative Performance'] = `${relative.toFixed(2)}x`;
        if (relative === 1) {
          result['Relative Performance'] += ' ⚡ (fastest)';
        }
      }
    });
  }

  console.table(results);

  return {
    results: bench.tasks.map(task => ({
      name: task.name,
      result: task.result
    })),
    recommendation: 'For best performance: parse once, evaluate many times with the same expression.'
  };
}
