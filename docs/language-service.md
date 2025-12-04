# Language Service

The library includes a built-in language service that provides IDE-like features for expr-eval expressions. This is useful for integrating expr-eval into code editors like Monaco Editor (used by VS Code).

## Features

- **Code Completions** - Autocomplete for functions, operators, keywords, and user-defined variables
- **Hover Information** - Documentation tooltips when hovering over functions and variables
- **Syntax Highlighting** - Token-based highlighting for numbers, strings, keywords, operators, etc.

## Basic Usage

```js
import { createLanguageService } from '@pro-fa/expr-eval';

const ls = createLanguageService();

// Define variables available in your expressions
const variables = { x: 42, user: { name: 'Ada' }, flag: true };

// Get completions at a position
const completions = ls.getCompletions({
    textDocument: doc,  // LSP-compatible text document
    position: { line: 0, character: 5 },
    variables
});

// Get hover information
const hover = ls.getHover({
    textDocument: doc,
    position: { line: 0, character: 3 },
    variables
});

// Get syntax highlighting tokens
const tokens = ls.getHighlighting(doc);
```

## Monaco Editor Integration Sample

A complete working example of Monaco Editor integration is included in the repository. To run it:

```bash
# Build the UMD bundle and start the sample server
npm run monaco-sample:serve
```

Then open http://localhost:8080 in your browser. The sample demonstrates:

- Autocompletion for built-in functions (`sum`, `max`, `min`, etc.) and user variables
- Hover documentation for functions and variables
- Live syntax highlighting
- Real-time expression evaluation

The sample code is located in `samples/language-service-sample/` and shows how to:

1. Register a custom language with Monaco
2. Connect the language service to Monaco's completion and hover providers
3. Apply syntax highlighting using decorations
4. Create an LSP-compatible text document wrapper for Monaco models
