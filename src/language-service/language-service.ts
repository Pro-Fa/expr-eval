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
import {Parser} from '../parsing/parser';
import {Values, Value, ValueObject} from '../types';
import type { HighlightToken, LanguageServiceOptions, GetCompletionsParams, GetHoverParams, LanguageServiceApi, HoverV2 } from './language-service.types';
import type {CompletionItem, Range, Position} from 'vscode-languageserver-types'
import { CompletionItemKind, MarkupKind, InsertTextFormat } from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { BUILTIN_KEYWORD_DOCS, DEFAULT_CONSTANT_DOCS} from './language-service.documentation';
import { FunctionDetails } from "./language-service.models";

class VarTrieNode {
    children: Record<string, VarTrieNode> = {};
    value: Value | undefined = undefined;
}

class VarTrie {
    root: VarTrieNode = new VarTrieNode();

    private static isValueObject(v: Value): v is ValueObject {
        return v !== null && typeof v === 'object' && !Array.isArray(v);
    }

    buildFromValues(vars: Values): void {
        const walk = (obj: ValueObject, node: VarTrieNode) => {
            for (const key of Object.keys(obj)) {
                if (!node.children[key]) {
                    node.children[key] = new VarTrieNode();
                }
                const child = node.children[key];
                child.value = obj[key];
                const val = obj[key];
                if (VarTrie.isValueObject(val)) {
                    walk(val, child);
                }
            }
        };
        walk(vars as ValueObject, this.root);
    }

    search(path: string[]): VarTrieNode | undefined {
        let node: VarTrieNode | undefined = this.root;
        for (const seg of path) {
            node = node?.children[seg];
            if (!node) {
                return undefined;
            }
        }
        return node;
    }
}



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

function pathVariableCompletions(vars: Values | undefined, prefix: string, rangePartial?: Range): CompletionItem[] {
    if (!vars) {
        return [];
    }

    const trie = new VarTrie();
    trie.buildFromValues(vars);

    const lastDot = prefix.lastIndexOf('.');
    const endsWithDot = lastDot === prefix.length - 1;

    const baseParts = (endsWithDot
            ? prefix.slice(0, -1)
            : lastDot >= 0 ? prefix.slice(0, lastDot) : ''
    )
        .split('.')
        .filter(Boolean);

    const partial = endsWithDot ? '' : prefix.slice(lastDot + 1);
    const lowerPartial = partial.toLowerCase();

    const baseNode = trie.search(baseParts);
    if (!baseNode) {
        return [];
    }

    return Object.entries(baseNode.children)
        .filter(([k]) => !partial || k.toLowerCase().startsWith(lowerPartial))
        .map(([key, child]) => ({
            label: (baseParts.length ? baseParts.concat(key) : [key]).join('.'),
            kind: CompletionItemKind.Variable,
            detail: child.value !== undefined ? valueTypeName(child.value) : 'object',
            insertText: key,
            textEdit: rangePartial ? { range: rangePartial, newText: key } : undefined,
            documentation: undefined,
        }));
}

function isPathChar(ch: string): boolean {
    return /[A-Za-z0-9_$.]/.test(ch);
}

function extractPathPrefix(text: string, position: number): { start: number; prefix: string } {
    const i = Math.max(0, Math.min(position, text.length));
    let start = i;

    while (start > 0 && isPathChar(text[start - 1])) {
        start--;
    }

    return { start, prefix: text.slice(start, i) };
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
        const start = t.index;
        const end = ts.pos; // pos advanced to end of current token in TokenStream
        spans.push({token: t, start, end});
        if (untilPos != null && end >= untilPos) {
            // We can stop early if we reached the position
            break;
        }
    }
    return spans;
}

function toTruncatedJsonString(
    value: unknown,
    maxLines = 3,
    maxWidth = 50,
): string {
    let text: string;

    try {
        text = JSON.stringify(value, null, 2);
    } catch {
        return '<unserializable>';
    }

    if (!text) {
        return '<empty>';
    }

    let lines: string[] = [];

    for(let i = 0, lineAmount = 0; i < text.length && lineAmount < maxLines; i += maxWidth, lineAmount++) {
        lines.push(text.slice(i, i + maxWidth));
    }

    const maxChars = maxLines * maxWidth;
    const exceededMaxLength = text.length > maxChars;
    return exceededMaxLength ? lines.join('\n\n') + '...' : lines.join('\n\n');
}


export function createLanguageService(options: LanguageServiceOptions | undefined = undefined): LanguageServiceApi {
    // Build a parser instance to access keywords/operators/functions/consts
    const parser = new Parser({
        operators: options?.operators,
    });

    const constantDocs = {
        ...DEFAULT_CONSTANT_DOCS,
    } as Record<string, string>;

    function allFunctions(): FunctionDetails[] {
        // Parser exposes built-in functions on parser.functions
        const definedFunctions = parser.functions ? Object.keys(parser.functions) : [];
        // Unary operators can also be used like functions with parens: sin(x), abs(x), ...
        const unary = parser.unaryOps ? Object.keys(parser.unaryOps) : [];
        // Merge, prefer functions map descriptions where available
        const rawFunctions = Array.from(new Set([...definedFunctions, ...unary]));



        return rawFunctions.map(name => new FunctionDetails(parser, name));
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
                if (t.type === TNAME && functions.find((f: FunctionDetails) => f.name == String(t.value))) {
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
            textEdit: { range: rangeFull, newText: func.completionText() },
        }));
    }

    function constantCompletions(rangeFull: Range): CompletionItem[] {
        return allConstants().map(name => ({
            label: name,
            kind: CompletionItemKind.Constant,
            detail: valueTypeName(parser.consts[name]),
            documentation: constantDocs[name],
            textEdit: { range: rangeFull, newText: name },
        }));
    }

    function keywordCompletions(rangeFull: Range): CompletionItem[] {
        return (parser.keywords || []).map(keyword => ({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            detail: 'keyword',
            documentation: BUILTIN_KEYWORD_DOCS[keyword],
            textEdit: { range: rangeFull, newText: keyword },
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

        const {start, prefix} = extractPathPrefix(text, offsetPosition);

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
            ...pathVariableCompletions(variables, prefix, rangePartial),
        ];

        return prefix.includes('.') ? all : filterByPrefix(all, prefix);
    }

    function tryVariableHover(textDocument: TextDocument, position: Position, variables?: Values): HoverV2 | undefined {
        // If we don't have variables, we can't provide a hover for a variable path
        if (!variables) {
            return undefined;
        }
        const text = textDocument.getText();
        const offset = textDocument.offsetAt(position);
        // Find start of the path (walk backwards over path chars)
        const { start } = extractPathPrefix(text, offset);
        // Find end of the path (walk forwards over path chars)
        let end = offset;
        while (end < text.length && isPathChar(text[end])) {
            end++;
        }
        if (end <= start) {
            return undefined;
        }

        const fullPath = text.slice(start, end);
        const parts = fullPath.split('.').filter(Boolean);
        if (parts.length === 0) {
            return undefined;
        }

        const trie = new VarTrie();
        trie.buildFromValues(variables);
        const node = trie.search(parts);
        if (!node) {
            return undefined;
        }

        const range: Range = { start: textDocument.positionAt(start), end: textDocument.positionAt(end) };
        const nodeValue = node.value;
        return {
            contents: { kind: MarkupKind.Markdown, value: `${fullPath}: ${nodeValue !== undefined ? `Variable (${valueTypeName(nodeValue)})` : 'object'}\n\n**Value Preview**\n\n${toTruncatedJsonString(nodeValue)}` },
            range
        };
    }

    function getHover(params: GetHoverParams): HoverV2 {
        const { textDocument, position, variables } = params;
        const text = textDocument.getText();

        const variableHover = tryVariableHover(textDocument, position, variables);
        if (variableHover) {
            return variableHover;
        }

        // Fallback to token-based hover
        const ts = makeTokenStream(parser, text);
        const spans = iterateTokens(ts);

        const offset = textDocument.offsetAt(position);
        const span = spans.find(s => offset >= s.start && offset <= s.end);
        if (!span) {
            return {contents: { kind: "plaintext", value: '' }};
        }

        const token = span.token;
        const label = String(token.value);

        if (token.type === TNAME || token.type === TKEYWORD) {
            // Function hover
            const func = allFunctions().find(f => f.name === label);
            if (func) {
                const range: Range = { start: textDocument.positionAt(span.start), end: textDocument.positionAt(span.end) };
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
            return {contents: { kind: MarkupKind.PlainText, value: `${valueTypeName(token.value)}` }, range};
        }

        return { contents: { kind: "plaintext", value: '' }};
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
