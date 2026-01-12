import { describe, it, expect } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { pathVariableCompletions, tryVariableHoverUsingSpans } from '../../src/language-service/variable-utils';
import { makeTokenStream, iterateTokens } from '../../src/language-service/ls-utils';
import { Parser } from '../../src/parsing/parser';

describe('variable-utils', () => {
  describe('pathVariableCompletions', () => {
    it('returns empty when vars undefined', () => {
      const items = pathVariableCompletions(undefined, 'a');
      expect(items).toEqual([]);
    });

    it('returns empty when base path missing', () => {
      const items = pathVariableCompletions({ a: { b: 1 } }, 'x.');
      expect(items).toEqual([]);
    });

    it('lists children when ends with dot and sets insertText and detail', () => {
      const items = pathVariableCompletions({ foo: { bar: 1, Baz: 'x' } }, 'foo.');
      const labels = items.map(i => i.label);
      expect(labels).toContain('foo.bar');
      expect(labels).toContain('foo.Baz');
      const bar = items.find(i => i.label === 'foo.bar');
      expect(bar?.insertText).toBe('bar');
      expect(bar?.detail).toBe('number');
    });

    it('filters by partial (case-insensitive startsWith)', () => {
      const items = pathVariableCompletions({ user: { first: 'a', last: 'b' } }, 'user.f');
      expect(items.length).toBe(1);
      expect(items[0].label).toBe('user.first');
      const items2 = pathVariableCompletions({ user: { First: 'a', last: 'b' } }, 'user.f');
      expect(items2.length).toBe(1);
      expect(items2[0].label).toBe('user.First');
    });

    it('applies rangePartial in textEdit when provided', () => {
      const rangePartial = {
        start: { line: 0, character: 5 },
        end: { line: 0, character: 6 }
      };
      const items = pathVariableCompletions({ user: { age: 21 } }, 'user.a', rangePartial);
      expect(items[0].textEdit).toBeDefined();
      expect((items[0].textEdit as any).range).toEqual(rangePartial);
      expect((items[0].textEdit as any).newText).toBe('age');
    });
  });

  describe('tryVariableHoverUsingSpans', () => {
    const parser = new Parser();

    it('returns undefined without variables', () => {
      const doc = TextDocument.create('file://test', 'plaintext', 1, 'x');
      const spans = iterateTokens(makeTokenStream(parser, 'x'));
      const hover = tryVariableHoverUsingSpans(doc, { line: 0, character: 0 }, undefined, spans);
      expect(hover).toBeUndefined();
    });

    it('hovers last segment value', () => {
      const text = '$test.person.age';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const pos = { line: 0, character: text.length }; // after age
      const hover = tryVariableHoverUsingSpans(doc, pos, { $test: { person: { age: 21 } } }, spans)!;
      expect(hover).toBeDefined();
      const value = (hover.contents as any).value as string;
      expect(value).toContain('age');
      expect(value).toContain('number');
      expect(value).toContain('Value Preview');
    });

    it('hovers middle segment object', () => {
      const text = '$test.person.age';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const charIndex = text.indexOf('person') + 1;
      const pos = { line: 0, character: charIndex };
      const hover = tryVariableHoverUsingSpans(doc, pos, { $test: { person: { age: 21, name: 'x' } } }, spans)!;
      const value = (hover.contents as any).value as string;
      expect(value).toContain('$test.person');
      expect(value).toContain('object');
    });

    it('returns undefined when not on a name or dot', () => {
      const text = '  $x';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const hover = tryVariableHoverUsingSpans(doc, { line: 0, character: 0 }, { $x: 1 }, spans);
      expect(hover).toBeUndefined();
    });

    it('on trailing dot resolves to the left name', () => {
      const text = '$a.';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const hover = tryVariableHoverUsingSpans(doc, { line: 0, character: text.length - 1 }, { $a: { b: 1 } }, spans)!;
      const value = (hover.contents as any).value as string;
      expect(value).toContain('$a');
      expect(value).toContain('object');
    });

    it('returns undefined when path segment not found', () => {
      const text = '$a.missing';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const pos = { line: 0, character: text.indexOf('missing') + 1 };
      const hover = tryVariableHoverUsingSpans(doc, pos, { $a: {} }, spans);
      expect(hover).toBeUndefined();
    });

    it('range equals hovered segment span', () => {
      const text = '$user.name';
      const doc = TextDocument.create('file://test', 'plaintext', 1, text);
      const spans = iterateTokens(makeTokenStream(parser, text));
      const nameStart = text.indexOf('name');
      const pos = { line: 0, character: nameStart + 1 };
      const hover = tryVariableHoverUsingSpans(doc, pos, { $user: { name: 'Ann' } }, spans)!;
      expect(hover.range).toBeDefined();
      const range = hover.range!;
      expect(range.start.line).toBe(0);
      expect(range.end.line).toBe(0);
      // The hovered token span should cover exactly 'name'
      expect(range.end.character - range.start.character).toBe(4);
    });
  });

  describe('pathVariableCompletions edge cases', () => {
    it('uses detail "object" when child.value is undefined', () => {
      const items = pathVariableCompletions({ a: { b: undefined as any } }, 'a.');
      const b = items.find(i => i.label === 'a.b');
      expect(b?.detail).toBe('object');
    });
  });
});
