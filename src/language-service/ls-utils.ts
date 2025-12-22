import { Value } from '../types';
import {Parser} from "../parsing/parser";
import {TEOF, Token, TokenStream} from "../parsing";

export function valueTypeName(value: Value): string {
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
            return t as string;
    }
}

export function isPathChar(ch: string): boolean {
    return /[A-Za-z0-9_$.]/.test(ch);
}

export function extractPathPrefix(text: string, position: number): { start: number; prefix: string } {
    const i = Math.max(0, Math.min(position, text.length));
    let start = i;
    while (start > 0 && isPathChar(text[start - 1])) {
        start--;
    }
    return { start, prefix: text.slice(start, i) };
}

export function toTruncatedJsonString(value: unknown, maxLines = 3, maxWidth = 50): string {
    let text: string;
    try {
        text = JSON.stringify(value, null, 2) as string;
    } catch {
        return '<unserializable>';
    }
    if (!text) {
        return '<empty>';
    }
    const lines: string[] = [];
    for (let i = 0, lineAmount = 0; i < text.length && lineAmount < maxLines; i += maxWidth, lineAmount++) {
        lines.push(text.slice(i, i + maxWidth));
    }
    const maxChars = maxLines * maxWidth;
    const exceededMaxLength = text.length > maxChars;
    return exceededMaxLength ? lines.join('\n\n') + '...' : lines.join('\n\n');
}

export function makeTokenStream(parser: Parser, text: string): TokenStream {
    return new TokenStream(parser, text);
}

export function iterateTokens(ts: TokenStream, untilPos?: number): { token: Token; start: number; end: number }[] {
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
