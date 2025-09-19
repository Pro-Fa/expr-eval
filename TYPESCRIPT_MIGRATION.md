# TypeScript Migration Guide

This document outlines the TypeScript setup and migration plan for the expr-eval project.

## Current TypeScript Setup

The project has been prepared for TypeScript conversion with the following tooling:

### Dependencies Added
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@rollup/plugin-typescript` - Rollup TypeScript plugin
- `tslib` - TypeScript runtime helpers
- `@typescript-eslint/parser` - TypeScript ESLint parser
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint rules
- `rimraf` - Cross-platform directory cleanup

### Configuration Files
- `tsconfig.json` - Main TypeScript configuration for development
- `tsconfig.build.json` - Build-specific TypeScript configuration
- Updated `eslint.config.js` - Added TypeScript linting support
- Updated rollup configurations - Added TypeScript compilation

### Build Scripts
- `npm run type-check` - Run TypeScript type checking without compilation
- `npm run build:types` - Generate TypeScript declaration files
- `npm run build:js` - Build JavaScript bundles using TypeScript
- `npm run lint:ts` - Lint TypeScript files

## Migration Strategy

### Phase 1: Setup (✅ Complete)
- Install TypeScript tooling
- Configure build system
- Set up linting and type checking
- Prepare development environment

### Phase 2: File-by-file conversion (Not started)
1. **Utilities first**: Start with simple utility files in `src/`
   - `src/token.js` → `src/token.ts`
   - `src/instruction.js` → `src/instruction.ts`

2. **Core logic**: Convert the main logic files
   - `src/functions.js` → `src/functions.ts`
   - `src/functions-binary-ops.js` → `src/functions-binary-ops.ts`
   - `src/functions-unary-ops.js` → `src/functions-unary-ops.ts`

3. **Parser components**: Convert parser-related files
   - `src/token-stream.js` → `src/token-stream.ts`
   - `src/parser-state.js` → `src/parser-state.ts`
   - `src/expression.js` → `src/expression.ts`
   - `src/parser.js` → `src/parser.ts`

4. **Entry point**: Convert the main entry point
   - `index.js` → `index.ts` (already exists as copy)

5. **Tests**: Update test files to work with TypeScript
   - Add type imports where needed
   - Update test configuration

### Phase 3: Type refinement
- Replace the manual `parser.d.ts` with generated types
- Add strict type annotations
- Remove `any` types where possible
- Add comprehensive JSDoc comments

### Phase 4: Advanced TypeScript features
- Generic types for better type safety
- Utility types for complex expressions
- Template literal types for operators
- Branded types for different value types

## Development Workflow

### Before converting a file:
1. Ensure all dependencies of the file are already converted
2. Run existing tests to ensure baseline functionality
3. Study the current `parser.d.ts` for expected types

### During conversion:
1. Rename `.js` to `.ts`
2. Add explicit type annotations
3. Fix any TypeScript errors
4. Run `npm run type-check` to verify
5. Run `npm run lint:ts` to ensure code style
6. Run tests to ensure functionality

### After conversion:
1. Update imports in dependent files
2. Run full test suite
3. Update documentation if needed

## Testing the Setup

You can test the current TypeScript setup with:

```bash
# Type checking
npm run type-check

# TypeScript linting  
npm run lint:ts

# Build with TypeScript
npm run build:js

# Generate type declarations
npm run build:types
```

## Notes

- The existing `parser.d.ts` file contains comprehensive type definitions that should guide the TypeScript conversion
- All configurations support both JavaScript and TypeScript during the transition
- Source maps and declaration maps are enabled for debugging
- The build process generates multiple output formats (UMD, ES modules, minified)
- ESLint is configured to enforce consistent code style for TypeScript files