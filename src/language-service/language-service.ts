// Lightweight language service (worker-LSP style) for expr-eval
// Provides: completions, hover, and syntax highlighting using the existing tokenizer

import {
  TOP,
  TNUMBER,
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
  LanguageServiceApi,
  HoverV2
} from './language-service.types';
import type { CompletionItem, Range } from 'vscode-languageserver-types';
import { CompletionItemKind, MarkupKind, InsertTextFormat } from 'vscode-languageserver-types';
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

  // Cache function details and names for performance
  // These are computed once and reused across all calls
  let cachedFunctions: FunctionDetails[] | null = null;
  let cachedFunctionNames: Set<string> | null = null;
  let cachedConstants: string[] | null = null;

  /**
   * Returns all available functions with their details
   * Results are cached for performance
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
   */
  function functionNamesSet(): Set<string> {
    if (cachedFunctionNames !== null) {
      return cachedFunctionNames;
    }
    allFunctions(); // This populates cachedFunctionNames
    return cachedFunctionNames!;
  }

  /**
   * Returns all available constants
   * Results are cached for performance
   */
  function allConstants(): string[] {
    if (cachedConstants !== null) {
      return cachedConstants;
    }
    cachedConstants = parser.consts ? Object.keys(parser.consts) : [];
    return cachedConstants;
  }

  function tokenKindToHighlight(t: Token): HighlightToken['type'] {
    switch (t.type) {
      case TNUMBER:
        return 'number';
      case TSTRING:
        return 'string';
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
      detail: valueTypeName(parser.consts[name]),
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
        const v = parser.consts[label];
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
    if (token.type === TNUMBER || token.type === TSTRING) {
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

  return {
    getCompletions,
    getHover,
    getHighlighting
  };

}
