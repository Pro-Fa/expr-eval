import { Bench } from 'tinybench';
import { Parser } from '../index';

// Tinybench for detailed performance analysis
export async function runDetailedParsingBenchmarks() {
  const parser = new Parser();
  const bench = new Bench({ time: 1000, iterations: 10000 });

  const expressions = {
    simple: '2 + 3',
    arithmetic: '(2 + 3) * 4 - 5 / 2',
    variables: 'x * y + z',
    functions: 'sin(x) + cos(y) + sqrt(z)',
    complex: 'sin(PI * x / 180) + cos(PI * y / 180) + sqrt(abs(z)) + log(max(a, b))',
    nested: '((a + b) * (c - d)) / ((e + f) * (g - h))',
    array: '[1, 2, 3, 4, 5]',
    string: '"hello" + " " + "world" + "!" + " length: " + len("test")',
    conditional: 'x > 0 ? (y > 0 ? x + y : x - y) : (y > 0 ? y - x : -(x + y))'
  };

  // Add benchmarks for each expression type
  Object.entries(expressions).forEach(([name, expr]) => {
    bench.add(`Parse ${name}`, () => {
      parser.parse(expr);
    });
  });

  // Memory usage tests
  bench.add('Memory - multiple parser instances', () => {
    // Test memory efficiency of creating multiple parser instances
    const parsers = Array.from({ length: 100 }, () => new Parser());
    parsers.forEach(p => p.parse('2 + 3 * 4'));
  });

  bench.add('Memory - large expression parsing', () => {
    // Test parsing of very large expressions
    const largeExpr = Array.from({ length: 1000 }, (_, i) => `x${i}`).join(' + ');
    parser.parse(largeExpr);
  });

  await bench.run();

  console.log('\n=== Detailed Parsing Performance Results ===');
  console.table(
    bench.tasks.map(task => ({
      'Expression Type': task.name,
      'Mean Time (ms)': task.result?.mean?.toFixed(4) || 'N/A',
      'Std Dev (ms)': task.result?.sd?.toFixed(4) || 'N/A',
      'Min Time (ms)': task.result?.min?.toFixed(4) || 'N/A',
      'Max Time (ms)': task.result?.max?.toFixed(4) || 'N/A',
      'Ops/sec': task.result?.hz?.toFixed(0) || 'N/A'
    }))
  );

  return bench.tasks.map(task => ({
    name: task.name,
    result: task.result
  }));
}
