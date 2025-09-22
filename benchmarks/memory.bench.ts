import { Bench } from 'tinybench';
import { Parser } from '../index';

// Memory profiling with tinybench
export async function runMemoryBenchmarks() {
  const bench = new Bench({ time: 1000, iterations: 1000 });

  // Test memory usage patterns
  bench.add('Parser creation and cleanup', () => {
    const parser = new Parser();
    parser.parse('2 + 3');
    // Let it be garbage collected
  });

  bench.add('Expression reuse vs recreation', () => {
    const parser = new Parser();
    const expr = parser.parse('x + y');
    for (let i = 0; i < 10; i++) {
      expr.evaluate({ x: i, y: i + 1 });
    }
  });

  bench.add('Large variable context', () => {
    const parser = new Parser();
    const expr = parser.parse('x + y + z');
    const largeContext = Object.fromEntries(
      Array.from({ length: 1000 }, (_, i) => [`var${i}`, i])
    );
    expr.evaluate({ ...largeContext, x: 1, y: 2, z: 3 });
  });

  await bench.run();

  console.log('\n=== Memory Performance Results ===');
  console.table(
    bench.tasks.map(task => ({
      'Test Type': task.name,
      'Mean Time (ms)': task.result?.mean.toFixed(4) || 'N/A',
      'Ops/sec': task.result?.hz.toFixed(0) || 'N/A',
      'Memory Efficiency': task.result ? (1000 / task.result.mean).toFixed(2) + ' ops/ms' : 'N/A'
    }))
  );

  return bench.tasks.map(task => ({
    name: task.name,
    result: task.result
  }));
}

// Performance regression detection
export async function runRegressionBenchmarks() {
  const bench = new Bench({ time: 2000, iterations: 10000 });
  const parser = new Parser();

  // Core operations that should remain fast
  const coreOperations = {
    'Simple parsing': () => parser.parse('2 + 3'),
    'Variable parsing': () => parser.parse('x + y'),
    'Function parsing': () => parser.parse('sin(x)'),
    'Simple evaluation': () => parser.evaluate('2 + 3'),
    'Variable evaluation': () => parser.evaluate('x + y', { x: 1, y: 2 }),
    'Function evaluation': () => parser.evaluate('sin(x)', { x: Math.PI / 2 })
  };

  Object.entries(coreOperations).forEach(([name, operation]) => {
    bench.add(name, operation);
  });

  await bench.run();

  console.log('\n=== Performance Regression Test Results ===');
  console.table(
    bench.tasks.map(task => ({
      'Operation': task.name,
      'Mean Time (μs)': task.result ? (task.result.mean * 1000).toFixed(2) : 'N/A',
      'Ops/sec': task.result?.hz.toFixed(0) || 'N/A',
      'Status': task.result && task.result.mean < 0.001 ? '✅ Fast' : '⚠️ Check'
    }))
  );

  return bench.tasks.map(task => ({
    name: task.name,
    result: task.result,
    isRegression: task.result ? task.result.mean > 0.001 : false // Flag if > 1ms
  }));
}
