import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // Global ignores for generated files
  {
    ignores: [
      'dist/**',
      '.rollup.cache/**',
      'node_modules/**',
      'coverage/**',
      '.nyc_output/**'
    ]
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Source files (ES modules)
  {
    files: ['index.js', 'src/**/*.js', 'rollup*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      // Modern formatting rules
      'semi': ['error', 'always'],
      'space-before-function-paren': [
        'error', {
          'anonymous': 'always',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',

      // Modern JavaScript best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-spacing': 'error',
      'template-curly-spacing': 'error'
    }
  },

  // Test files configuration (ESM style)
  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        // Mocha globals - don't redefine, just ensure they're available
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    rules: {
      // Allow var usage in test files for compatibility with older test patterns
      'no-var': 'off',
      'prefer-const': 'off',

      // Disable redefinition warnings for test globals
      'no-redeclare': 'off',
      'no-undef': 'off',

      // Allow mathematical precision issues for test data
      'no-loss-of-precision': 'off',

      // Allow unused vars in tests (like unused parameters in test scenarios)
      'no-unused-vars': 'off',

      // Standard formatting rules
      'semi': ['error', 'always'],
      'space-before-function-paren': [
        'error', {
          'anonymous': 'always',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error'
    }
  },

  // TypeScript files configuration - using modern typescript-eslint
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx']
  })),

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      // TypeScript-specific rules - relaxed for expression evaluator
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-this-alias': 'off',

      // Allow mathematical precision issues for expression evaluator
      'no-loss-of-precision': 'off',

      // Allow older JS patterns that are still useful
      'prefer-spread': 'off',
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',

      // Standard formatting rules
      'semi': ['error', 'always'],
      'space-before-function-paren': [
        'error', {
          'anonymous': 'always',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',

      // Modern TypeScript best practices (where reasonable)
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-spacing': 'error',
      'template-curly-spacing': 'error'
    }
  }
];
