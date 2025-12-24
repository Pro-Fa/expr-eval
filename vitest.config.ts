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
        'benchmarks/**',
        'dist/**',
        'node_modules/**',
        '**/*.d.ts',
        'tree-shake-test.mjs',
        'vite.config.ts',
        'vitest.config.ts',
        // type-only file — exclude from coverage
        'src/language-service/language-service.types.ts',
        'samples/**'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    typecheck: {
      checker: 'tsc',
      include: ['test/**/*.test.ts']
    },
    reporters: ['verbose'],
    outputFile: {
      junit: './test-results.xml'
    },
    // Configure to work with existing JS test files during migration
    include: [
      'test/**/*.{test,spec}.{js,ts}',
      'test/*.js', // Include test files in root test directory
      'test/*.ts', // Include TypeScript test files
      'test/*.ts', // Include TypeScript partial files in root
      'test/**/*.ts' // Include TypeScript files in subdirectories
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'test/lib/**', // Exclude utility files
      'benchmarks/**' // Exclude benchmark files from regular test runs
    ]
  }
});
