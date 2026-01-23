# Contributing to expr-eval

Thank you for your interest in contributing to expr-eval! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/pro-fa/expr-eval.git
cd expr-eval

# Install dependencies
npm install

# Run tests to verify setup
npm test
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

### Running Benchmarks

```bash
# Run all benchmarks
npm run bench

# Run specific benchmark categories
npm run bench:parsing
npm run bench:evaluation
npm run bench:memory
```

See [Performance Testing Guide](docs/performance.md) for details on interpreting benchmark results.

### Building

```bash
# Build the library
npm run build

# Build and watch for changes
npm run build:watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Project Structure

```
expr-eval/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── config/            # Parser configuration
│   ├── core/              # Core expression operations
│   ├── errors/            # Error types and handling
│   ├── functions/         # Built-in functions
│   │   ├── array/        # Array functions
│   │   ├── math/         # Math functions
│   │   ├── object/       # Object functions
│   │   ├── string/       # String functions
│   │   └── utility/      # Utility functions
│   ├── language-service/  # IDE integration (LSP)
│   ├── operators/         # Operator implementations
│   │   ├── binary/       # Binary operators
│   │   └── unary/        # Unary operators
│   ├── parsing/           # Parser and tokenizer
│   ├── types/             # TypeScript type definitions
│   └── validation/        # Expression validation
├── test/                   # Test files (mirrors src structure)
├── benchmarks/             # Performance benchmarks
├── docs/                   # Documentation
└── samples/                # Example integrations
```

## Making Changes

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint)
- Use meaningful variable and function names
- Add JSDoc/TSDoc comments for public APIs

### Adding a New Function

1. **Create the function** in the appropriate directory under `src/functions/`
2. **Export it** from the directory's `index.ts`
3. **Register it** in `src/functions/index.ts`
4. **Add tests** in the corresponding `test/functions/` directory
5. **Document it** in `docs/syntax.md` under the appropriate section
6. **Update quick-reference.md** if it's a commonly-used function

Example structure for a new string function:

```typescript
// src/functions/string/my-function.ts
import { Value } from '../../types';

/**
 * Description of what the function does.
 * @param str - The input string
 * @returns The transformed string
 */
export function myFunction(str: Value): string | undefined {
  if (typeof str !== 'string') return undefined;
  // Implementation
  return str.toUpperCase();
}
```

### Adding a New Operator

1. Create the operator in `src/operators/binary/` or `src/operators/unary/`
2. Register it in the parser configuration
3. Add tests
4. Document in `docs/syntax.md`

### Modifying the Parser

Changes to the parser (`src/parsing/`) require extra care:

1. Ensure backward compatibility
2. Add comprehensive tests for edge cases
3. Run benchmarks to check performance impact
4. Update documentation if syntax changes

## Testing Guidelines

### Writing Tests

- Use descriptive test names that explain what's being tested
- Test both success cases and error cases
- Test edge cases (empty arrays, undefined values, etc.)
- Group related tests using `describe` blocks

```typescript
describe('myFunction', () => {
  it('should transform a simple string', () => {
    expect(Parser.evaluate('myFunction("hello")')).toBe('HELLO');
  });

  it('should return undefined for non-string input', () => {
    expect(Parser.evaluate('myFunction(123)')).toBeUndefined();
  });

  it('should handle empty strings', () => {
    expect(Parser.evaluate('myFunction("")')).toBe('');
  });
});
```

### Test Coverage

Aim for high test coverage, especially for:
- All public API functions
- Error handling paths
- Edge cases and boundary conditions

## Documentation

### Updating Documentation

When making changes, update the relevant documentation:

| Change Type | Documents to Update |
|-------------|---------------------|
| New function | `docs/syntax.md`, `docs/quick-reference.md` |
| New operator | `docs/syntax.md`, `docs/quick-reference.md` |
| Parser options | `docs/parser.md` |
| Expression methods | `docs/expression.md` |
| Language service | `docs/language-service.md` |
| Breaking changes | `BREAKING_CHANGES.md` |

### Documentation Audiences

Remember that documentation serves different audiences:

- **Expression writers**: Non-programmers writing expressions (focus on `syntax.md`, `quick-reference.md`)
- **Developers**: Programmers integrating the library (focus on `parser.md`, `expression.md`)
- **Contributors**: People working on the library itself (focus on `performance.md`, this file)

## Pull Request Process

1. **Fork** the repository and create a feature branch
2. **Make your changes** following the guidelines above
3. **Add tests** for any new functionality
4. **Run the test suite** and ensure all tests pass
5. **Run benchmarks** if your change might affect performance
6. **Update documentation** as needed
7. **Submit a pull request** with a clear description of changes

### PR Checklist

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated (if applicable)
- [ ] BREAKING_CHANGES.md updated (if applicable)
- [ ] Benchmarks run (if performance-sensitive)

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Version of expr-eval
- Node.js version
- Minimal code example demonstrating the issue

## Security

If you discover a security vulnerability, please do NOT open a public issue. Instead, report it privately following the security policy in the repository.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see [LICENSE.txt](LICENSE.txt)).

## Questions?

If you have questions about contributing, feel free to open a discussion or issue on GitHub.
