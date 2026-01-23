// Lightweight language service (worker-LSP style) for expr-eval
// Provides: completions, hover, and syntax highlighting using the existing tokenizer

import {
  TOP,
  TNUMBER,
  TCONST,
  TSTRING,
  TPAREN,
  TBRACKET,
  TCOMMA,
  TNAME,
  TSEMICOLON,
  TKEYWORD,
  TBRACE,
  Token
} from '../parsing';
import { Parser } from '../parsing/parser';
import type {
  HighlightToken,
  LanguageServiceOptions,
  GetCompletionsParams,
  GetHoverParams,
  GetDiagnosticsParams,
  LanguageServiceApi,
  HoverV2
} from './language-service.types';
import type { CompletionItem, Range, Diagnostic } from 'vscode-languageserver-types';
import { CompletionItemKind, MarkupKind, InsertTextFormat, DiagnosticSeverity } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { BUILTIN_KEYWORD_DOCS, DEFAULT_CONSTANT_DOCS } from './language-service.documentation';
import { FunctionDetails } from './language-service.models';
import {
  valueTypeName,
  extractPathPrefix,
  makeTokenStream,
  iterateTokens
} from './ls-utils';
import { pathVariableCompletions, tryVariableHoverUsingSpans } from './variable-utils';

export function createLanguageService(options: LanguageServiceOptions | undefined = undefined): LanguageServiceApi {
  // Build a parser instance to access keywords/operators/functions/consts
  const parser = new Parser({
    operators: options?.operators
  });

  const constantDocs = {
    ...DEFAULT_CONSTANT_DOCS
  } as Record<string, string>;

  // Instance-level cache for function details and names
  // Each language service instance maintains its own cache, making this thread-safe
  // as concurrent uses will operate on separate instances
  let cachedFunctions: FunctionDetails[] | null = null;
  let cachedFunctionNames: Set<string> | null = null;
  let cachedConstants: string[] | null = null;

  /**
   * Returns all available functions with their details
   * Results are cached for performance within this instance
   */
  function allFunctions(): FunctionDetails[] {
    if (cachedFunctions !== null) {
      return cachedFunctions;
    }

    // Parser exposes built-in functions on parser.functions
    const definedFunctions = parser.functions ? Object.keys(parser.functions) : [];
    // Unary operators can also be used like functions with parens: sin(x), abs(x), ...
    const unary = parser.unaryOps ? Object.keys(parser.unaryOps) : [];
    // Merge, prefer functions map descriptions where available
    const rawFunctions = Array.from(new Set([...definedFunctions, ...unary]));

    cachedFunctions = rawFunctions.map(name => new FunctionDetails(parser, name));
    cachedFunctionNames = new Set(rawFunctions);
    return cachedFunctions;
  }

  /**
   * Returns a set of function names for fast lookup
   * This ensures the cache is populated before returning
   */
  function functionNamesSet(): Set<string> {
    if (cachedFunctionNames !== null) {
      return cachedFunctionNames;
    }
    // Calling allFunctions() ensures cachedFunctionNames is populated
    allFunctions();
    // After allFunctions(), cachedFunctionNames is guaranteed to be non-null
    // We return a fallback empty set only as a defensive measure
    return cachedFunctionNames ?? new Set<string>();
  }

  /**
   * Returns all available constants
   * Results are cached for performance within this instance
   */
  function allConstants(): string[] {
    if (cachedConstants !== null) {
      return cachedConstants;
    }
    cachedConstants = parser.numericConstants ? Object.keys(parser.numericConstants) : [];
    cachedConstants = [...cachedConstants, ...Object.keys(parser.buildInLiterals)];

    return cachedConstants;
  }

  function tokenKindToHighlight(t: Token): HighlightToken['type'] {
    switch (t.type) {
      case TNUMBER:
        return 'number';
      case TSTRING:
        return 'string';
      case TCONST:
        return 'constant';
      case TKEYWORD:
        return 'keyword';
      case TOP:
        return 'operator';
      case TPAREN:
      case TBRACE:
      case TBRACKET:
      case TCOMMA:
      case TSEMICOLON:
        return 'punctuation';
      case TNAME:
      default: {
        // Use cached set for fast function name lookup
        if (t.type === TNAME && functionNamesSet().has(String(t.value))) {
          return 'function';
        }

        return 'name';
      }
    }
  }

  function functionCompletions(rangeFull: Range): CompletionItem[] {
    return allFunctions().map(func => ({
      label: func.name,
      kind: CompletionItemKind.Function,
      detail: func.details(),
      documentation: func.docs(),
      insertTextFormat: InsertTextFormat.Snippet,
      textEdit: { range: rangeFull, newText: func.completionText() }
    }));
  }

  function constantCompletions(rangeFull: Range): CompletionItem[] {
    return allConstants().map(name => ({
      label: name,
      kind: CompletionItemKind.Constant,
      detail: valueTypeName(parser.numericConstants[name] ?? parser.buildInLiterals[name]),
      documentation: constantDocs[name],
      textEdit: { range: rangeFull, newText: name }
    }));
  }

  function keywordCompletions(rangeFull: Range): CompletionItem[] {
    return (parser.keywords || []).map(keyword => ({
      label: keyword,
      kind: CompletionItemKind.Keyword,
      detail: 'keyword',
      documentation: BUILTIN_KEYWORD_DOCS[keyword],
      textEdit: { range: rangeFull, newText: keyword }
    }));
  }

  function filterByPrefix(items: CompletionItem[], prefix: string): CompletionItem[] {
    if (!prefix) {
      return items;
    }
    const lower = prefix.toLowerCase();
    return items.filter(i => i.label.toLowerCase().startsWith(lower));
  }

  function getCompletions(params: GetCompletionsParams): CompletionItem[] {
    const { textDocument, variables, position } = params;
    const text = textDocument.getText();
    const offsetPosition = textDocument.offsetAt(position);

    const { start, prefix } = extractPathPrefix(text, offsetPosition);

    // Build ranges for replacement
    const rangeFull: Range = { start: textDocument.positionAt(start), end: position };
    const lastDot = prefix.lastIndexOf('.');
    const partial = lastDot >= 0 ? prefix.slice(lastDot + 1) : prefix;
    const replaceStartOffset =
            start + (prefix.length - partial.length);
    const rangePartial: Range = {
      start: textDocument.positionAt(replaceStartOffset),
      end: position
    };

    const all: CompletionItem[] = [
      ...functionCompletions(rangeFull),
      ...constantCompletions(rangeFull),
      ...keywordCompletions(rangeFull),
      ...pathVariableCompletions(variables, prefix, rangePartial)
    ];

    return prefix.includes('.') ? all : filterByPrefix(all, prefix);
  }

  function getHover(params: GetHoverParams): HoverV2 {
    const { textDocument, position, variables } = params;
    const text = textDocument.getText();

    // Build spans once and reuse
    const ts = makeTokenStream(parser, text);
    const spans = iterateTokens(ts);

    const variableHover = tryVariableHoverUsingSpans(textDocument, position, variables, spans);
    if (variableHover) {
      return variableHover;
    }

    // Fallback to token-based hover

    const offset = textDocument.offsetAt(position);
    const span = spans.find(s => offset >= s.start && offset <= s.end);
    if (!span) {
      return { contents: { kind: MarkupKind.PlainText, value: '' } };
    }

    const token = span.token;
    const label = String(token.value);

    if (token.type === TNAME || token.type === TKEYWORD) {
      // Function hover
      const func = allFunctions().find(f => f.name === label);
      if (func) {
        const range: Range = {
          start: textDocument.positionAt(span.start),
          end: textDocument.positionAt(span.end)
        };
        const value = func.docs() ?? func.details();
        return {
          contents: { kind: MarkupKind.Markdown, value },
          range
        };
      }

      // Constant hover
      if (allConstants().includes(label)) {
        const v = parser.numericConstants[label] ?? parser.buildInLiterals[label];
        const doc = constantDocs[label];
        const range: Range = {
          start: textDocument.positionAt(span.start),
          end: textDocument.positionAt(span.end)
        };
        return {
          contents: {
            kind: MarkupKind.PlainText,
            value: `${label}: ${valueTypeName(v)}${doc ? `\n\n${doc}` : ''}`
          },
          range
        };
      }

      // Keyword hover
      if (token.type === TKEYWORD) {
        const doc = BUILTIN_KEYWORD_DOCS[label];
        const range: Range = {
          start: textDocument.positionAt(span.start),
          end: textDocument.positionAt(span.end)
        };
        return { contents: { kind: MarkupKind.PlainText, value: doc || 'keyword' }, range };
      }
    }

    // Operators: show a simple label
    if (token.type === TOP) {
      const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
      return { contents: { kind: MarkupKind.PlainText, value: `operator: ${label}` }, range };
    }

    // Numbers/strings
    if (token.type === TNUMBER || token.type === TSTRING || token.type === TCONST) {
      const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
      return { contents: { kind: MarkupKind.PlainText, value: `${valueTypeName(token.value)}` }, range };
    }

    return { contents: { kind: MarkupKind.PlainText, value: '' } };
  }

  function getHighlighting(textDocument: TextDocument): HighlightToken[] {
    const text = textDocument.getText();
    const tokenStream = makeTokenStream(parser, text);
    const spans = iterateTokens(tokenStream);
    return spans.map(span => ({
      type: tokenKindToHighlight(span.token),
      start: span.start,
      end: span.end,
      value: span.token.value
    }));
  }

  /**
   * Analyzes the document for function calls and checks if they have the correct number of arguments.
   * Returns diagnostics for function calls with incorrect argument counts.
   */
  function getDiagnostics(params: GetDiagnosticsParams): Diagnostic[] {
    const { textDocument } = params;
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];

    const ts = makeTokenStream(parser, text);
    const spans = iterateTokens(ts);

    // Build a map from function name to FunctionDetails for quick lookup
    const funcDetailsMap = new Map<string, FunctionDetails>();
    for (const func of allFunctions()) {
      funcDetailsMap.set(func.name, func);
    }

    // Find function calls: TNAME followed by TPAREN '('
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const token = span.token;

      // Check if this is a function name followed by '('
      if (token.type === TNAME && functionNamesSet().has(String(token.value))) {
        const funcName = String(token.value);

        // Look for the next token being '('
        if (i + 1 < spans.length && spans[i + 1].token.type === TPAREN && spans[i + 1].token.value === '(') {
          const openParenIndex = i + 1;
          const openParenSpan = spans[openParenIndex];

          // Count arguments by tracking parentheses/brackets depth and commas
          let argCount = 0;
          let parenDepth = 1;
          let bracketDepth = 0;
          let braceDepth = 0;
          let foundClosingParen = false;
          let closeParenSpan = openParenSpan;
          let hasSeenArgumentToken = false;

          for (let j = openParenIndex + 1; j < spans.length && parenDepth > 0; j++) {
            const currentToken = spans[j].token;

            if (currentToken.type === TPAREN) {
              if (currentToken.value === '(') {
                parenDepth++;
                // Opening paren can start an argument (e.g., nested function call)
                if (parenDepth === 2 && bracketDepth === 0 && braceDepth === 0 && !hasSeenArgumentToken) {
                  hasSeenArgumentToken = true;
                  argCount = 1;
                }
              } else if (currentToken.value === ')') {
                parenDepth--;
                if (parenDepth === 0) {
                  foundClosingParen = true;
                  closeParenSpan = spans[j];
                }
              }
            } else if (currentToken.type === TBRACKET) {
              if (currentToken.value === '[') {
                bracketDepth++;
                // Opening bracket starts an argument (array literal)
                if (parenDepth === 1 && bracketDepth === 1 && braceDepth === 0 && !hasSeenArgumentToken) {
                  hasSeenArgumentToken = true;
                  argCount = 1;
                }
              } else if (currentToken.value === ']') {
                bracketDepth--;
              }
            } else if (currentToken.type === TBRACE) {
              if (currentToken.value === '{') {
                braceDepth++;
                // Opening brace starts an argument (object literal)
                if (parenDepth === 1 && bracketDepth === 0 && braceDepth === 1 && !hasSeenArgumentToken) {
                  hasSeenArgumentToken = true;
                  argCount = 1;
                }
              } else if (currentToken.value === '}') {
                braceDepth--;
              }
            } else if (currentToken.type === TCOMMA && parenDepth === 1 && bracketDepth === 0 && braceDepth === 0) {
              // Only count commas at the top level of the function call
              argCount++;
              hasSeenArgumentToken = false; // Reset for next argument
            } else if (parenDepth === 1 && bracketDepth === 0 && braceDepth === 0 && !hasSeenArgumentToken) {
              // First non-comma, non-paren, non-bracket, non-brace token at depth 1 means we have at least one argument
              hasSeenArgumentToken = true;
              argCount = Math.max(argCount, 1);
            }
          }

          // If we found a closing paren and there was content, argCount is commas + 1
          // If there were no arguments (empty parens), argCount stays 0
          if (foundClosingParen && argCount > 0) {
            // argCount currently holds the count from counting commas
            // When we saw first token at depth 1, we set argCount = 1
            // Each comma adds 1 more, so argCount is correct
          }

          // Get the function's expected arity
          const funcDetails = funcDetailsMap.get(funcName);
          if (funcDetails) {
            const arityInfo = funcDetails.arityInfo();
            if (arityInfo) {
              const { min, max } = arityInfo;

              // Check if argument count is too few
              if (argCount < min) {
                const range: Range = {
                  start: textDocument.positionAt(span.start),
                  end: textDocument.positionAt(closeParenSpan.end)
                };
                diagnostics.push({
                  range,
                  severity: DiagnosticSeverity.Error,
                  message: `Function '${funcName}' expects at least ${min} argument${min !== 1 ? 's' : ''}, but got ${argCount}.`,
                  source: 'expr-eval'
                });
              }
              // Check if argument count is too many (only if max is defined, i.e., not variadic)
              else if (max !== undefined && argCount > max) {
                const range: Range = {
                  start: textDocument.positionAt(span.start),
                  end: textDocument.positionAt(closeParenSpan.end)
                };
                diagnostics.push({
                  range,
                  severity: DiagnosticSeverity.Error,
                  message: `Function '${funcName}' expects at most ${max} argument${max !== 1 ? 's' : ''}, but got ${argCount}.`,
                  source: 'expr-eval'
                });
              }
            }
          }
        }
      }
    }

    return diagnostics;
  }

  return {
    getCompletions,
    getHover,
    getHighlighting,
    getDiagnostics
  };

}
