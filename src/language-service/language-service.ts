// Lightweight language service (worker-LSP style) for expr-eval
// Provides: completions, hover, and syntax highlighting using the existing tokenizer

import {
    TEOF,
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
    Token,
    TokenStream
} from '../parsing';
import {Parser} from '../parsing';
import type {Values, Value} from '../types';
import type { HighlightToken, LanguageServiceOptions, GetCompletionsParams, GetHoverParams, LanguageServiceApi } from './language-service.types';
import type { CompletionItem, Hover, Range } from 'vscode-languageserver-types'
import { CompletionItemKind, MarkupKind } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'
import {BUILTIN_FUNCTION_DOCS, BUILTIN_KEYWORD_DOCS, DEFAULT_CONSTANT_DOCS} from './language-service.documentation';

function valueTypeName(value: Value): string {
    const t = typeof value;
    switch (true) {
        case value === null:
            return 'null';
        case Array.isArray(value):
            return 'array';
        case t === 'function':
            return 'function';
        case t === 'object':
            return 'object';
        default:
            return t; // number, string, boolean, undefined
    }
}

function isWordChar(ch: string): boolean {
    return /[A-Za-z0-9_$]/.test(ch);
}

function extractPrefix(text: string, position: number): { start: number; prefix: string } {
    let i = Math.max(0, Math.min(position, text.length));
    // If the cursor is right after a word char, keep it included
    if (i > 0 && !isWordChar(text[i]) && isWordChar(text[i - 1])) {
        i = i - 1;
    }
    let start = i;
    while (start > 0 && isWordChar(text[start - 1])) {
        start--;
    }
    return {start, prefix: text.slice(start, position)};
}

function makeTokenStream(parser: Parser, text: string): TokenStream {
    return new TokenStream(parser, text);
}

function iterateTokens(ts: TokenStream, untilPos?: number): { token: Token; start: number; end: number }[] {
    const spans: { token: Token; start: number; end: number }[] = [];
    while (true) {
        const t = ts.next();
        if (t.type === TEOF) {
            break;
        }
        const start = (t as any).index as number;
        const end = ts.pos; // pos advanced to end of current token in TokenStream
        spans.push({token: t, start, end});
        if (untilPos != null && end >= untilPos) {
            // We can stop early if we reached the position
            break;
        }
    }
    return spans;
}

export function createLanguageService(options: LanguageServiceOptions | undefined = undefined): LanguageServiceApi {
    // Build a parser instance to access keywords/operators/functions/consts
    const parser = new Parser({
        operators: options?.operators,
    });

    const functionDocs = {...BUILTIN_FUNCTION_DOCS};
    const constantDocs = {
        ...DEFAULT_CONSTANT_DOCS,
    } as Record<string, string>;

    function allFunctions(): string[] {
        // Parser exposes built-in functions on parser.functions
        const definedFunctions = parser.functions ? Object.keys(parser.functions) : [];
        // Unary operators can also be used like functions with parens: sin(x), abs(x), ...
        const unary = parser.unaryOps ? Object.keys(parser.unaryOps) : [];
        // Merge, prefer functions map descriptions where available
        return Array.from(new Set([...definedFunctions, ...unary]));
    }

    function allConstants(): string[] {
        return parser.consts ? Object.keys(parser.consts) : [];
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
                // If not matches, check if it's a function or an identifier
                const functions = allFunctions();
                if (t.type === TNAME && functions.includes(String(t.value))) {
                    return 'function';
                }

                return 'name';
            }
        }
    }

    function buildFunctionDetail(name: string): string {
        // Attempt to infer arity from the actual function length if present
        const f: any = (parser.functions && parser.functions[name]) || (parser.unaryOps && parser.unaryOps[name]);
        const arity = typeof f === 'function' ? f.length : undefined;
        return arity != null ? `${name}(${Array.from({length: arity}).map((_, i) => 'arg' + (i + 1)).join(', ')})` : `${name}(…)`;
    }

    function buildFunctionDoc(name: string): string | undefined {
        const doc = functionDocs[name];
        if (doc) {
            return doc;
        }
        // Provide a generic doc for unary operators if not documented
        if (parser.unaryOps && parser.unaryOps[name]) {
            return `${name} x: unary operator`;
        }
        return undefined;
    }

    function variableCompletions(vars?: Values): CompletionItem[] {
        if (!vars) {
            return [];
        }
        return Object.keys(vars).map(k => ({
            label: k,
            kind: CompletionItemKind.Variable,
            detail: valueTypeName(vars[k]),
            documentation: undefined
        }));
    }

    function functionCompletions(): CompletionItem[] {
        return allFunctions().map(name => ({
            label: name,
            kind: CompletionItemKind.Function,
            detail: buildFunctionDetail(name),
            documentation: buildFunctionDoc(name),
            insertText: `${name}()`
        }));
    }

    function constantCompletions(): CompletionItem[] {
        return allConstants().map(name => ({
            label: name,
            kind: CompletionItemKind.Constant,
            detail: valueTypeName(parser.consts[name]),
            documentation: constantDocs[name]
        }));
    }

    function keywordCompletions(): CompletionItem[] {
        return (parser.keywords || []).map(keyword => ({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            detail: 'keyword',
            documentation: BUILTIN_KEYWORD_DOCS[keyword]
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
        const pos = textDocument.offsetAt(position);

        const {start, prefix} = extractPrefix(text, pos);

        // Very light context: if immediately after a dot, do not suggest globals (future work could inspect previous name)
        if (start > 0 && text[start - 1] === '.') {
            return []; // object member completions out of scope for now
        }

        const all: CompletionItem[] = [
            ...functionCompletions(),
            ...constantCompletions(),
            ...keywordCompletions(),
            ...variableCompletions(variables)
        ];

        return filterByPrefix(all, prefix);
    }

    function getHover(params: GetHoverParams): Hover {
        const { textDocument, position, variables } = params;
        const text = textDocument.getText();
        const ts = makeTokenStream(parser, text);
        const spans = iterateTokens(ts);

        const offset = textDocument.offsetAt(position);
        const span = spans.find(s => offset >= s.start && offset <= s.end);
        if (!span) {
            return {contents: ''};
        }

        const token = span.token;
        const label = String(token.value);

        if (token.type === TNAME || token.type === TKEYWORD) {
            // Variable hover
            if (variables && Object.prototype.hasOwnProperty.call(variables, label)) {
                const variable = variables[label];
                const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
                return {
                    contents: { kind: MarkupKind.PlainText, value: `${label}: ${valueTypeName(variable)}` },
                    range
                };
            }

            // Function hover
            if (allFunctions().includes(label)) {
                const detail = buildFunctionDetail(label);
                const doc = buildFunctionDoc(label);
                const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
                const value = doc ? `**${detail}**\n\n${doc}` : detail;
                return {
                    contents: { kind: MarkupKind.Markdown, value },
                    range
                };
            }

            // Constant hover
            if (allConstants().includes(label)) {
                const v = parser.consts[label];
                const doc = constantDocs[label];
                const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
                return {
                    contents: { kind: MarkupKind.PlainText, value: `${label}: ${valueTypeName(v)}${doc ? `\n\n${doc}` : ''}` },
                    range
                };
            }

            // Keyword hover
            if (token.type === TKEYWORD) {
                const doc = BUILTIN_KEYWORD_DOCS[label];
                const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
                return { contents: { kind: MarkupKind.PlainText, value: doc || 'keyword' }, range };
            }
        }

        // Operators: show a simple label
        if (token.type === TOP) {
            const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
            return {contents: { kind: MarkupKind.PlainText, value: `operator: ${label}` }, range};
        }

        // Numbers/strings
        if (token.type === TNUMBER || token.type === TSTRING) {
            const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
            return {contents: { kind: MarkupKind.PlainText, value: `${valueTypeName(token.value as any)}` }, range};
        }

        return {contents: ''};
    }

    function getHighlighting(textDocument: TextDocument): HighlightToken[] {
        const text = textDocument.getText();
        const tokenStream = makeTokenStream(parser, text);
        const spans = iterateTokens(tokenStream);
        return spans.map(span => ({
            type: tokenKindToHighlight(span.token),
            start: span.start,
            end: span.end,
            value: span.token.value as any
        }));
    }

    return {
        getCompletions,
        getHover,
        getHighlighting
    };
}
