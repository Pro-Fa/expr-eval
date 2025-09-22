import { runDetailedParsingBenchmarks } from './parsing.bench';
import { runDetailedEvaluationBenchmarks } from './evaluation.bench';
import { runMemoryBenchmarks, runRegressionBenchmarks } from './memory.bench';

/**
 * Comprehensive performance test runner
 * This file can be run directly to execute all performance benchmarks
 */

interface BenchmarkResult {
  name: string;
  result?: {
    mean: number;
    sd: number;
    min: number;
    max: number;
    hz: number;
  };
  isRegression?: boolean;
}

interface BenchmarkSuite {
  name: string;
  results: BenchmarkResult[];
  summary: {
    totalTests: number;
    avgOpsPerSec: number;
    fastestTest: string;
    slowestTest: string;
  };
}

async function runAllBenchmarks(): Promise<BenchmarkSuite[]> {
  console.log('🚀 Starting expr-eval Performance Benchmarks...\n');

  const suites: BenchmarkSuite[] = [];

  try {
    // Run parsing benchmarks
    console.log('📊 Running Parsing Performance Tests...');
    const parsingResults = await runDetailedParsingBenchmarks();
    suites.push(createSummary('Parsing Performance', parsingResults));

    // Run evaluation benchmarks
    console.log('\n⚡ Running Evaluation Performance Tests...');
    const evaluationResults = await runDetailedEvaluationBenchmarks();
    suites.push(createSummary('Evaluation Performance', evaluationResults));

    // Run memory benchmarks
    console.log('\n🧠 Running Memory Performance Tests...');
    const memoryResults = await runMemoryBenchmarks();
    suites.push(createSummary('Memory Performance', memoryResults));

    // Run regression tests
    console.log('\n🔍 Running Regression Detection Tests...');
    const regressionResults = await runRegressionBenchmarks();
    suites.push(createSummary('Regression Tests', regressionResults));

  } catch (error) {
    console.error('❌ Error running benchmarks:', error);
    throw error;
  }

  return suites;
}

function createSummary(name: string, results: BenchmarkResult[]): BenchmarkSuite {
  const validResults = results.filter(r => r.result);
  const opsPerSecValues = validResults.map(r => r.result!.hz);
  const avgOpsPerSec = opsPerSecValues.reduce((a, b) => a + b, 0) / opsPerSecValues.length;

  const fastest = validResults.reduce((prev, current) =>
    (current.result!.hz > prev.result!.hz) ? current : prev
  );

  const slowest = validResults.reduce((prev, current) =>
    (current.result!.hz < prev.result!.hz) ? current : prev
  );

  return {
    name,
    results,
    summary: {
      totalTests: results.length,
      avgOpsPerSec: Math.round(avgOpsPerSec),
      fastestTest: fastest.name,
      slowestTest: slowest.name
    }
  };
}

function printFinalSummary(suites: BenchmarkSuite[]) {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 FINAL PERFORMANCE SUMMARY');
  console.log('='.repeat(80));

  suites.forEach(suite => {
    console.log(`\n📋 ${suite.name}:`);
    console.log(`   Tests: ${suite.summary.totalTests}`);
    console.log(`   Average Ops/sec: ${suite.summary.avgOpsPerSec.toLocaleString()}`);
    console.log(`   Fastest: ${suite.summary.fastestTest}`);
    console.log(`   Slowest: ${suite.summary.slowestTest}`);

    const regressions = suite.results.filter(r => r.isRegression);
    if (regressions.length > 0) {
      console.log(`   ⚠️  Potential regressions: ${regressions.length}`);
      regressions.forEach(r => console.log(`      - ${r.name}`));
    }
  });

  // Overall performance health check
  const totalTests = suites.reduce((sum, suite) => sum + suite.summary.totalTests, 0);
  const avgPerformance = suites.reduce((sum, suite) => sum + suite.summary.avgOpsPerSec, 0) / suites.length;

  console.log('\n🏆 Overall Performance:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Average Performance: ${Math.round(avgPerformance).toLocaleString()} ops/sec`);

  // Performance grade
  let grade = 'A';
  if (avgPerformance < 100000) {
    grade = 'B';
  }
  if (avgPerformance < 50000) {
    grade = 'C';
  }
  if (avgPerformance < 10000) {
    grade = 'D';
  }
  if (avgPerformance < 1000) {
    grade = 'F';
  }

  console.log(`   Performance Grade: ${grade} ${getGradeEmoji(grade)}`);
  console.log('='.repeat(80));
}

function getGradeEmoji(grade: string): string {
  const emojis: Record<string, string> = {
    'A': '🏆',
    'B': '👍',
    'C': '👌',
    'D': '⚠️',
    'F': '❌'
  };
  return emojis[grade] || '❓';
}

// Export for use in other files
export { runAllBenchmarks, BenchmarkResult, BenchmarkSuite };

// Run if this file is executed directly
if (import.meta.url === new URL(import.meta.resolve('./index.bench.ts')).href) {
  runAllBenchmarks()
    .then(suites => {
      printFinalSummary(suites);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Benchmark execution failed:', error);
      process.exit(1);
    });
}
