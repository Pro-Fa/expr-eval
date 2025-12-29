import { describe, it, expect } from 'vitest';
import { extractPathPrefix, isPathChar, toTruncatedJsonString, makeTokenStream, iterateTokens } from '../../src/language-service/ls-utils';
import { Parser } from '../../src/parsing/parser';

describe('ls-utils', () => {
  it('extractPathPrefix finds start and prefix across $ and dots', () => {
    const text = ' let $foo.bar_baz = 1';
    const pos = text.indexOf('z') + 1; // position right after last path char
    const { start, prefix } = extractPathPrefix(text, pos);
    expect(prefix).toBe('$foo.bar_baz');
    expect(text.slice(start, pos)).toBe('$foo.bar_baz');
  });

  it('isPathChar allows A-Z, a-z, 0-9, _, $, . and rejects others', () => {
    for (const ch of ['A', 'z', '0', '_', '$', '.']) {
      expect(isPathChar(ch)).toBe(true);
    }
    for (const ch of ['-', ' ', '\n', '+', '(', ')']) {
      expect(isPathChar(ch)).toBe(false);
    }
  });

  it('toTruncatedJsonString returns <empty> for undefined', () => {
    const s = toTruncatedJsonString(undefined);
    expect(s).toBe('<empty>');
  });

  it('toTruncatedJsonString returns <unserializable> for circular objects', () => {
    const a: any = {};
    a.self = a;
    const s = toTruncatedJsonString(a);
    expect(s).toBe('<unserializable>');
  });

  it('toTruncatedJsonString truncates to maxLines*maxWidth and appends ellipsis', () => {
    const long = { text: 'x'.repeat(200) };
    const out = toTruncatedJsonString(long, 2, 10);
    expect(out.endsWith('...')).toBe(true);
    const parts = out.split('\n\n');
    expect(parts.length).toBe(2);
  });

  it('iterateTokens can stop early with untilPos', () => {
    const parser = new Parser();
    const text = '1 + 2 * 3';
    const ts = makeTokenStream(parser, text);
    const early = iterateTokens(ts, 2); // somewhere after first token
    expect(early.length).toBeGreaterThan(0);
    expect(early.length).toBeLessThan(5);
  });
});
