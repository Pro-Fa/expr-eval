# Contributing to expr-eval

Thank you for your interest in contributing to expr-eval! This guide will help you get started with development.

> **Audience**: Project contributors

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/pro-fa/expr-eval.git
   cd expr-eval
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to verify setup**
   ```bash
   npm test
   ```

## Project Structure

```
expr-eval/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── config/            # Parser configuration
│   ├── core/              # Core evaluation logic
│   ├── errors/            # Error types and handling
│   ├── functions/         # Built-in functions
│   │   ├── array/         # Array functions
│   │   ├── math/          # Math functions
│   │   ├── object/        # Object functions
│   │   ├── string/        # String functions
│   │   └── utility/       # Utility functions
│   ├── language-service/  # IDE integration
│   ├── operators/         # Operator implementations
│   │   ├── binary/        # Binary operators
│   │   └── unary/         # Unary operators
│   ├── parsing/           # Tokenizer and parser
│   ├── types/             # TypeScript type definitions
│   └── validation/        # Expression validation
├── test/                   # Test files (mirrors src/ structure)
├── docs/                   # Documentation
├── benchmarks/             # Performance benchmarks
└── samples/                # Example applications
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Building

```bash
# Build the library
npm run build
```

### Benchmarks

```bash
# Run all benchmarks
npm run bench

# Run specific benchmark categories
npm run bench:parsing
npm run bench:evaluation
npm run bench:memory
```

## Code Style

### TypeScript Guidelines

- Use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `readonly` for properties that shouldn't be modified
- Document public APIs with TSDoc comments

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions/Methods**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (no `I` prefix)

### Example

```typescript
/**
 * Evaluates a mathematical expression.
 * @param expression - The expression string to evaluate
 * @param variables - Variable values for the expression
 * @returns The evaluation result
 */
export function evaluate(
  expression: string,
  variables: Record<string, Value>
): Value {
  // Implementation
}
```

## Testing Guidelines

### Test File Organization

- Test files should mirror the source structure
- Use descriptive test names that explain the expected behavior
- Group related tests with `describe` blocks

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { Parser } from '../src';

describe('Parser', () => {
  describe('evaluate', () => {
    it('should evaluate simple arithmetic', () => {
      const parser = new Parser();
      expect(parser.evaluate('2 + 3')).toBe(5);
    });

    it('should substitute variables', () => {
      const parser = new Parser();
      expect(parser.evaluate('x * 2', { x: 5 })).toBe(10);
    });
  });
});
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write tests for new functionality
   - Update documentation as needed
   - Follow the code style guidelines

3. **Run checks locally**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit with a descriptive message**
   ```bash
   git commit -m "feat: add support for new operator"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test additions or modifications
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Adding New Functions

1. Create the function in the appropriate `src/functions/` subdirectory
2. Export it from the subdirectory's `index.ts`
3. Register it in the parser's default functions
4. Add tests in the corresponding `test/functions/` file
5. Document the function in `docs/syntax.md`

## Adding New Operators

1. Create the operator in `src/operators/binary/` or `src/operators/unary/`
2. Add the operator token to the tokenizer
3. Add parser support for the operator precedence
4. Register it in the parser configuration
5. Add tests and documentation

## Questions?

If you have questions about contributing, feel free to:
- Open an issue on GitHub
- Check existing issues and discussions

Thank you for contributing!
