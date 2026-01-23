# Language Service

The library includes a built-in language service that provides IDE-like features for expr-eval expressions. This is useful for integrating expr-eval into code editors like Monaco Editor (used by VS Code).

## Features

- **Code Completions** - Autocomplete for functions, operators, keywords, and user-defined variables
  - **Snippet support** - Function completions include tab stops with parameter placeholders (e.g., `sum(${1:a})`)
  - **Path-based variable completions** - Completions for nested object properties (e.g., typing `user.` shows `user.name`, `user.profile.email`)
  - **Text edits with ranges** - Proper replacement ranges for more accurate completions
- **Hover Information** - Documentation tooltips when hovering over functions and variables
  - **Variable value previews** - Hovers on variables show a truncated JSON preview of the value
  - **Nested path support** - Hovering over `user.name` resolves and shows the value at that path
- **Syntax Highlighting** - Token-based highlighting for numbers, strings, keywords, operators, etc.
- **Diagnostics** - Error detection for function argument count validation
  - **Too few arguments** - Reports when a function is called with fewer arguments than required (e.g., `pow(2)` needs 2 arguments)
  - **Too many arguments** - Reports when a function is called with more arguments than allowed (e.g., `random(1, 2, 3)` accepts at most 1)
  - **Variadic functions** - Correctly handles functions that accept unlimited arguments (e.g., `min`, `max`, `coalesce`)

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

// Get diagnostics (function argument count errors)
const diagnostics = ls.getDiagnostics({ textDocument: doc });
```

## Monaco Editor Integration Sample

A complete working example of Monaco Editor integration is included in the repository. To run it:

```bash
# Build the UMD bundle and start the sample server
npm run playground
```

Then open http://localhost:8080 in your browser. The sample demonstrates:

- Autocompletion for built-in functions (`sum`, `max`, `min`, etc.) and user variables
- Hover documentation for functions and variables
- Live syntax highlighting
- Real-time expression evaluation
- **Diagnostics** - Red squiggly underlines for function argument count errors (select the "Diagnostics Demo" example to see this in action)

The sample code is located in `samples/language-service-sample/` and shows how to:

1. Register a custom language with Monaco
2. Connect the language service to Monaco's completion and hover providers
3. Apply syntax highlighting using decorations
4. Create an LSP-compatible text document wrapper for Monaco models
5. Display diagnostics using Monaco's `setModelMarkers` API

## Advanced Features

### Nested Variable Completions

The language service supports path-based completions for nested object properties. When you type a dot after a variable name, you'll get completions for its properties:

```js
const variables = {
  user: {
    name: 'Ada',
    profile: {
      email: 'ada@example.com',
      age: 30
    }
  },
  config: {
    timeout: 5000,
    retries: 3
  }
};

// Typing "user." will show completions: user.name, user.profile
// Typing "user.profile." will show: user.profile.email, user.profile.age
```

**Monaco Editor Integration**: Add `triggerCharacters: ['.']` to your completion provider to automatically trigger completions when typing a dot:

```js
monaco.languages.registerCompletionItemProvider(languageId, {
  triggerCharacters: ['.'],
  provideCompletionItems: function (model, position) {
    // ... completion logic
  }
});
```

### Snippet Support in Completions

Function completions include snippet support with tab stops for parameters. This provides a better editing experience in editors that support snippets:

```js
// When completing a function like "sum", the insertText is "sum(${1:a})"
// After selecting the completion:
// 1. The text "sum(a)" is inserted
// 2. The parameter "a" is selected, ready for editing
// 3. You can tab to the next parameter (if any)
```

**Monaco Editor Integration**: Use `insertTextRules` with `monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet` when the completion's `insertTextFormat` is 2 (snippet):

```js
const suggestions = items.map(it => ({
  label: it.label,
  kind: mapKind(it.kind),
  detail: it.detail,
  documentation: it.documentation,
  insertText: it.insertText || it.label,
  insertTextRules: it.insertTextFormat === 2 
    ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
    : undefined,
  range
}));
```

### Text Edit Ranges

Completion items may include a `textEdit` with a specific `range` for more precise text replacement. This is especially important for path-based completions where only the partial segment after the last dot should be replaced:

```js
// When completing "user.na|" (cursor at |), only "na" should be replaced, not "user.na"
// The textEdit.range will specify the exact range to replace
```

**Monaco Editor Integration**: Check for `textEdit.range` and use it when available:

```js
const suggestions = items.map(it => {
  const range = it.textEdit?.range 
    ? new monaco.Range(
        it.textEdit.range.start.line + 1,
        it.textEdit.range.start.character + 1,
        it.textEdit.range.end.line + 1,
        it.textEdit.range.end.character + 1
      )
    : defaultRange;
  
  return {
    label: it.label,
    insertText: it.textEdit?.newText || it.insertText || it.label,
    range
  };
});
```

### Variable Value Previews in Hover

When hovering over a variable (including nested paths), the hover will display:
- The variable's type
- A truncated JSON preview of its value

```js
const variables = { 
  user: { name: 'Ada', score: 95 },
  items: [1, 2, 3, 4, 5]
};

// Hovering over "user" shows:
// user: Variable (object)
// Value Preview
// {
//   "name": "Ada",
//   "score": 95
// }

// Hovering over "user.name" shows:
// user.name: Variable (string)
// Value Preview
// "Ada"
```

The preview is automatically truncated to prevent overwhelming hovers with large data structures.

### HoverV2 Type

The `getHover` method returns a `HoverV2` type, which guarantees that `contents` is a `MarkupContent` object (not a deprecated string or array):

```typescript
interface HoverV2 extends Hover {
  contents: MarkupContent; // Always MarkupContent, never string or array
}
```

**Monaco Editor Integration**: The hover contents are always in the `MarkupContent` format:

```js
const hover = ls.getHover({textDocument: doc, position, variables});
if (hover && hover.contents) {
  // hover.contents is always a MarkupContent object
  const value = hover.contents.value;
  const kind = hover.contents.kind; // 'plaintext' or 'markdown'
  
  contents = [{value}];
}
```

## API Reference

### createLanguageService(options?)

Creates a new language service instance.

**Parameters:**
- `options` (optional): `LanguageServiceOptions` - Configuration options for the language service
  - `operators`: `Record<string, boolean>` - Map of operator names to booleans indicating whether they are allowed

**Returns:** `LanguageServiceApi` - The language service instance

**Example:**
```js
import { createLanguageService } from '@pro-fa/expr-eval';

const ls = createLanguageService({
  operators: {
    '+': true,
    '-': true,
    '*': true,
    '/': true
  }
});
```

### ls.getCompletions(params)

Returns a list of possible completions for the given position in the document.

**Parameters:**
- `params`: `GetCompletionsParams`
  - `textDocument`: `TextDocument` - The text document to analyze
  - `position`: `Position` - The cursor position (0-based line and character)
  - `variables`: `Values` (optional) - User-defined variables available in the expression

**Returns:** `CompletionItem[]` - Array of completion items

**CompletionItem Properties:**
- `label`: `string` - The display label
- `kind`: `CompletionItemKind` - The kind of completion (Function, Variable, Keyword, etc.)
- `detail`: `string` (optional) - Additional details shown in the completion UI
- `documentation`: `string | MarkupContent` (optional) - Documentation for the item
- `insertText`: `string` (optional) - The text to insert (may be a snippet)
- `insertTextFormat`: `InsertTextFormat` (optional) - 1 = PlainText, 2 = Snippet
- `textEdit`: `TextEdit` (optional) - Text edit with specific range and newText

**Example:**
```js
const completions = ls.getCompletions({
  textDocument: doc,
  position: { line: 0, character: 5 },
  variables: { user: { name: 'Ada' }, x: 42 }
});
```

### ls.getHover(params)

Returns hover information for the given position in the document.

**Parameters:**
- `params`: `GetHoverParams`
  - `textDocument`: `TextDocument` - The text document to analyze
  - `position`: `Position` - The cursor position (0-based line and character)
  - `variables`: `Values` (optional) - User-defined variables available in the expression

**Returns:** `HoverV2` - Hover information with guaranteed MarkupContent

**HoverV2 Properties:**
- `contents`: `MarkupContent` - The hover content
  - `kind`: `MarkupKind` - Either 'plaintext' or 'markdown'
  - `value`: `string` - The hover text
- `range`: `Range` (optional) - The range of the hovered element

**Example:**
```js
const hover = ls.getHover({
  textDocument: doc,
  position: { line: 0, character: 3 },
  variables: { user: { name: 'Ada' } }
});

console.log(hover.contents.value); // The hover text
console.log(hover.contents.kind);  // 'markdown' or 'plaintext'
```

### ls.getHighlighting(textDocument)

Returns a list of syntax highlighting tokens for the given text document.

**Parameters:**
- `textDocument`: `TextDocument` - The text document to analyze

**Returns:** `HighlightToken[]` - Array of highlighting tokens

**HighlightToken Properties:**
- `type`: `'number' | 'string' | 'name' | 'keyword' | 'operator' | 'function' | 'punctuation'`
- `start`: `number` - Start offset in the document
- `end`: `number` - End offset in the document
- `value`: `string | number | boolean | undefined` (optional) - The token value

**Example:**
```js
const tokens = ls.getHighlighting(doc);
tokens.forEach(token => {
  console.log(`${token.type} at ${token.start}-${token.end}: ${token.value}`);
});
```

### ls.getDiagnostics(params)

Returns a list of diagnostics for the given text document. Currently validates function argument counts.

**Parameters:**
- `params`: `GetDiagnosticsParams`
  - `textDocument`: `TextDocument` - The text document to analyze

**Returns:** `Diagnostic[]` - Array of LSP-compatible diagnostic objects

**Diagnostic Properties:**
- `range`: `Range` - The range of the problematic function call
- `severity`: `DiagnosticSeverity` - The severity level (Error)
- `message`: `string` - Human-readable description of the issue
- `source`: `string` - Always `'expr-eval'`

**Example:**
```js
const diagnostics = ls.getDiagnostics({ textDocument: doc });
diagnostics.forEach(d => {
  console.log(`${d.message} at line ${d.range.start.line}`);
});

// For expression "pow(2) + random(1, 2, 3)":
// "Function 'pow' expects at least 2 arguments, but got 1." at line 0
// "Function 'random' expects at most 1 argument, but got 3." at line 0
```

**Monaco Editor Integration:**
```js
function applyDiagnostics() {
    const doc = makeTextDocument(model);
    const diagnostics = ls.getDiagnostics({ textDocument: doc });

    const markers = diagnostics.map(d => ({
        severity: monaco.MarkerSeverity.Error,
        message: d.message,
        startLineNumber: d.range.start.line + 1,
        startColumn: d.range.start.character + 1,
        endLineNumber: d.range.end.line + 1,
        endColumn: d.range.end.character + 1,
        source: d.source
    }));

    monaco.editor.setModelMarkers(model, 'expr-eval', markers);
}
```

## TypeScript Types

The library exports the following TypeScript types for use in your applications:

### Exported Types

```typescript
import type {
  LanguageServiceApi,
  HoverV2,
  GetCompletionsParams,
  GetHoverParams,
  GetDiagnosticsParams,
  HighlightToken,
  LanguageServiceOptions,
  ArityInfo
} from '@pro-fa/expr-eval';
```

- **`LanguageServiceApi`** - The main language service interface with `getCompletions`, `getHover`, `getHighlighting`, and `getDiagnostics` methods
- **`HoverV2`** - Extended Hover type with guaranteed `MarkupContent` for contents (not deprecated string/array formats)
- **`GetCompletionsParams`** - Parameters for `getCompletions`: `textDocument`, `position`, and optional `variables`
- **`GetHoverParams`** - Parameters for `getHover`: `textDocument`, `position`, and optional `variables`
- **`GetDiagnosticsParams`** - Parameters for `getDiagnostics`: `textDocument`
- **`HighlightToken`** - Syntax highlighting token with `type`, `start`, `end`, and optional `value`
- **`LanguageServiceOptions`** - Configuration options for creating a language service, including optional `operators` map
- **`ArityInfo`** - Describes a function's expected argument count with `min` and optional `max` (undefined for variadic functions)

### LSP Types

The language service uses types from `vscode-languageserver-types` for LSP compatibility:

```typescript
import type { 
  Position,
  Range,
  CompletionItem,
  CompletionItemKind,
  MarkupContent,
  MarkupKind,
  InsertTextFormat,
  Diagnostic,
  DiagnosticSeverity
} from 'vscode-languageserver-types';

import type { TextDocument } from 'vscode-languageserver-textdocument';
```

These types ensure compatibility with Language Server Protocol-based editors and tools.
