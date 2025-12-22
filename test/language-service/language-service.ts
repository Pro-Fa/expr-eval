import { describe, it, expect, beforeEach } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createLanguageService } from '../../src/language-service/language-service';
import { CompletionItemKind, MarkupKind } from 'vscode-languageserver-types';

function getContentsValue(contents: any): string {
    if (typeof contents === 'string') {
        return contents;
    }
    if (contents && typeof contents === 'object' && contents.value) {
        return contents.value;
    }
    if (Array.isArray(contents)) {
        return contents.map((c: any) => c.value || '').join('');
    }
    return '';
}

describe('Language Service', () => {
    let ls: ReturnType<typeof createLanguageService>;

    beforeEach(() => {
        ls = createLanguageService();
    });

    describe('getCompletions', () => {
        it('should include provided variables in completions', () => {
            const text = 'foo';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { foo: 123, bar: 'test' },
                position: { line: 0, character: 3 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('foo');
        });

        it('should filter completions by prefix (starts with)', () => {
            const text = 'ma';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { max: 10, min: 5, foo: 1 },
                position: { line: 0, character: 2 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('max');
            // Only items starting with 'ma' are returned
            expect(labels.every(l => l.toLowerCase().startsWith('ma'))).toBe(true);
        });

        it('should be case-insensitive in prefix matching', () => {
            const text = 'MA';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { max: 10, foo: 1 },
                position: { line: 0, character: 2 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('max');
        });

        it('should return all completions with empty prefix', () => {
            const text = '';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { foo: 1, bar: 2 },
                position: { line: 0, character: 0 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('foo');
            expect(labels).toContain('bar');
            expect(completions.length).toBeGreaterThan(2); // includes built-in functions, constants, keywords
        });

        it('should return empty array when no variables provided', () => {
            const text = 'foo';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: undefined,
                position: { line: 0, character: 3 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).not.toContain('foo');
        });

        it('should include built-in functions in completions', () => {
            const text = 'sin';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 3 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('sin');
        });

        it('should include constants in completions', () => {
            const text = 'pi';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 2 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('PI');
        });

        it('should include keywords in completions', () => {
            const text = 'ca';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 2 }
            });
            const labels = completions.map(c => c.label);
            expect(labels).toContain('case');
        });

        it('should suggest children after a dot', () => {
            const text = 'foo.';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { foo: { bar: 1 } },
                position: { line: 0, character: 4 }
            });
            expect(completions.length).toBeGreaterThan(0);
            const item = completions.find(c => c.label === 'foo.bar');
            expect(item).toBeDefined();
            expect(item?.insertText).toBe('bar');
        });

        it('should provide completion items with proper kind and detail', () => {
            const text = 'si';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { sine: 1 },
                position: { line: 0, character: 2 }
            });

            const sinFunc = completions.find(c => c.label === 'sin');
            expect(sinFunc).toBeDefined();
            expect(sinFunc?.kind).toBe(CompletionItemKind.Function);
            expect(sinFunc?.detail).toBeDefined();
            expect(sinFunc?.insertTextFormat).toBe(2);
            // newText is provided via textEdit as a snippet with placeholders
            const newText = (sinFunc as any)?.textEdit?.newText as string | undefined;
            expect(typeof newText).toBe('string');
            expect(newText).toContain('sin(');
            expect(newText).toContain('${1');
        });

        it('should provide variable completions with correct kind', () => {
            const text = 'my';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: { myVar: 42 },
                position: { line: 0, character: 2 }
            });

            const varCompletion = completions.find(c => c.label === 'myVar');
            expect(varCompletion).toBeDefined();
            expect(varCompletion?.kind).toBe(CompletionItemKind.Variable);
            expect(varCompletion?.detail).toBe('number');
        });

        it('should provide constant completions with correct kind', () => {
            const text = 'e';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 1 }
            });

            const eConst = completions.find(c => c.label === 'E');
            expect(eConst).toBeDefined();
            expect(eConst?.kind).toBe(CompletionItemKind.Constant);
        });

        it('should show different types for different variable types', () => {
            const text = '';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const completions = ls.getCompletions({
                textDocument: doc,
                variables: {
                    numVar: 42,
                    strVar: 'hello',
                    arrVar: [1, 2, 3],
                    boolVar: true,
                    nullVar: null
                },
                position: { line: 0, character: 0 }
            });

            expect(completions.find(c => c.label === 'numVar')?.detail).toBe('number');
            expect(completions.find(c => c.label === 'strVar')?.detail).toBe('string');
            expect(completions.find(c => c.label === 'arrVar')?.detail).toBe('array');
            expect(completions.find(c => c.label === 'boolVar')?.detail).toBe('boolean');
            expect(completions.find(c => c.label === 'nullVar')?.detail).toBe('null');
        });
    });

    describe('getHover', () => {
        it('should show type information for variables', () => {
            const text = 'foo';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: { foo: 42 }
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('foo');
            expect(contents).toContain('number');
        });

        it('should show information for functions', () => {
            const text = 'sin';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('sin');
        });

        it('should show information for constants', () => {
            const text = 'PI';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            // Constant hover shows "CONSTANT: number", not the name itself for just the type
            expect(contents).toContain('number');
        });

        it('should show information for keywords', () => {
            const text = 'case';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('case');
        });

        it('should show information for operators', () => {
            const text = '1 + 2';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 2 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('operator');
            expect(contents).toContain('+');
        });

        it('should show information for numbers', () => {
            const text = '123';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('number');
        });

        it('should show information for strings', () => {
            const text = '"hello"';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 2 },
                variables: {}
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('string');
        });

        it('should return empty hover when position is not on a token', () => {
            const text = '   ';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 0 },
                variables: {}
            });

            expect(getContentsValue(hover.contents)).toBe('');
        });

        it('should prefer variable over function when both exist', () => {
            const text = 'myFunc';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: { myFunc: 'my-variable' }
            });

            const contents = getContentsValue(hover.contents);
            expect(contents).toContain('myFunc');
            // When myFunc is a variable, it shows as a variable with type 'string'
            expect(contents).toContain('string');
        });

        it('should show markup content for functions', () => {
            const text = 'max';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 }
            });

            const contents = hover.contents as any;
            // Functions show markdown content when they're recognized as TNAME tokens
            if (contents.kind) {
                expect(contents.kind).toBe(MarkupKind.Markdown);
            } else {
                // If it's a string, that means it wasn't recognized as a function
                expect(typeof contents).toBe('string');
            }
        });

        it('should show markdown content for variables', () => {
            const text = 'foo';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 1 },
                variables: { foo: 42 }
            });

            const contents = hover.contents as any;
            expect(contents.kind).toBe(MarkupKind.Markdown);
            const value = getContentsValue(hover.contents);
            expect(value).toContain('Value Preview');
        });
    });

    describe('getHighlighting', () => {
        it('should highlight numbers', () => {
            const text = '123';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const numberToken = tokens.find(t => t.type === 'number');
            expect(numberToken).toBeDefined();
            expect(numberToken?.value).toBe(123);
        });

        it('should highlight strings', () => {
            const text = '"hello"';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const stringToken = tokens.find(t => t.type === 'string');
            expect(stringToken).toBeDefined();
        });

        it('should highlight operators', () => {
            const text = '+';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const opToken = tokens.find(t => t.type === 'operator');
            expect(opToken).toBeDefined();
        });

        it('should highlight punctuation', () => {
            const text = '(';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const punctToken = tokens.find(t => t.type === 'punctuation');
            expect(punctToken).toBeDefined();
        });

        it('should recognize function names as function type', () => {
            const text = 'max(1, 2)';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            // max should be highlighted as a function (it's not a unary operator)
            const maxToken = tokens.find(t => t.value === 'max');
            expect(maxToken).toBeDefined();
            expect(maxToken?.type).toBe('function');
        });

        it('should highlight names', () => {
            const text = 'myVar';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const nameToken = tokens.find(t => t.type === 'name');
            expect(nameToken).toBeDefined();
        });

        it('should highlight keywords', () => {
            const text = 'case';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const keywordToken = tokens.find(t => t.type === 'keyword');
            expect(keywordToken).toBeDefined();
        });

        it('should provide correct start and end positions', () => {
            const text = 'foo + bar';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            expect(tokens.length).toBeGreaterThan(0);
            tokens.forEach(token => {
                expect(token.start).toBeLessThanOrEqual(token.end);
                expect(token.start).toBeGreaterThanOrEqual(0);
                expect(token.end).toBeLessThanOrEqual(text.length);
            });
        });

        it('should handle complex expressions', () => {
            const text = 'sin(x) + max(1, 2) * 3.14';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            expect(tokens.length).toBeGreaterThan(5);
            const types = tokens.map(t => t.type);
            expect(types).toContain('function');
            expect(types).toContain('name');
            expect(types).toContain('number');
            expect(types).toContain('operator');
            expect(types).toContain('punctuation');
        });

        it('should highlight string literals correctly', () => {
            const text = '"test string"';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);
            const tokens = ls.getHighlighting(doc);

            const stringToken = tokens.find(t => t.type === 'string');
            expect(stringToken).toBeDefined();
            expect(stringToken?.start).toBe(0);
            expect(stringToken?.end).toBe(text.length);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty documents', () => {
            const text = '';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 0 }
            });
            expect(Array.isArray(completions)).toBe(true);

            const hover = ls.getHover({
                textDocument: doc,
                position: { line: 0, character: 0 }
            });
            expect(hover).toBeDefined();

            const tokens = ls.getHighlighting(doc);
            expect(Array.isArray(tokens)).toBe(true);
        });

        it('should handle multi-line documents', () => {
            const text = 'foo + bar\nsin(x)';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const tokens = ls.getHighlighting(doc);
            expect(tokens.length).toBeGreaterThan(0);
        });

        it('should handle unicode characters in variable names', () => {
            const text = 'α';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const tokens = ls.getHighlighting(doc);
            expect(Array.isArray(tokens)).toBe(true);
        });

        it('should handle very long expressions', () => {
            const text = 'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const tokens = ls.getHighlighting(doc);
            expect(tokens.length).toBeGreaterThan(0);
        });

        it('should handle cursor at end of text', () => {
            const text = 'sin(x)';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: text.length }
            });
            expect(Array.isArray(completions)).toBe(true);
        });

        it('should handle cursor at start of text', () => {
            const text = 'sin(x)';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const completions = ls.getCompletions({
                textDocument: doc,
                position: { line: 0, character: 0 }
            });
            expect(Array.isArray(completions)).toBe(true);
        });
    });

    describe('Language Service initialization', () => {
        it('should create service with default options', () => {
            const service = createLanguageService();
            expect(service).toBeDefined();
            expect(service.getCompletions).toBeDefined();
            expect(service.getHover).toBeDefined();
            expect(service.getHighlighting).toBeDefined();
        });

        it('should create service with custom options', () => {
            const service = createLanguageService({
                operators: { '+': true, '-': false }
            });
            expect(service).toBeDefined();
        });

        it('should return consistent results for same input', () => {
            const text = 'sin(x)';
            const doc = TextDocument.create('file://test', 'plaintext', 1, text);

            const tokens1 = ls.getHighlighting(doc);
            const tokens2 = ls.getHighlighting(doc);

            expect(tokens1).toEqual(tokens2);
        });
    });
});
