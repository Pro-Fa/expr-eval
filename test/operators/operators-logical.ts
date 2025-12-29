import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';
import spy from '../lib/spy.js';

// Helper functions for spy tests
function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

// Logical Operators Tests - Converted from operators.js
// Tests for and, or, not, in, not in operators and conditional operator

describe('Logical Operators TypeScript Test', () => {
  describe('and operator', () => {
    it('1 and 0', () => {
      expect(Parser.evaluate('1 and 0')).toBe(false);
    });

    it('1 and 1', () => {
      expect(Parser.evaluate('1 and 1')).toBe(true);
    });

    it('0 and 0', () => {
      expect(Parser.evaluate('0 and 0')).toBe(false);
    });

    it('0 and 1', () => {
      expect(Parser.evaluate('0 and 1')).toBe(false);
    });

    it('0 and 1 and 0', () => {
      expect(Parser.evaluate('0 and 1 and 0')).toBe(false);
    });

    it('1 and 1 and 0', () => {
      expect(Parser.evaluate('1 and 1 and 0')).toBe(false);
    });

    it('skips rhs when lhs is false', () => {
      const notCalled = spy(returnFalse);

      expect(Parser.evaluate('false and notCalled()', { notCalled: notCalled })).toBe(false);
      expect(notCalled.called).toBe(false);
    });

    it('evaluates rhs when lhs is true', () => {
      const called = spy(returnFalse);
      // Security: Functions must be registered in parser.functions before use
      const parser = new Parser();
      parser.functions.called = called;

      expect(parser.evaluate('true and called()')).toBe(false);
      expect(called.called).toBe(true);
    });
  });

  describe('or operator', () => {
    it('1 or 0', () => {
      expect(Parser.evaluate('1 or 0')).toBe(true);
    });

    it('1 or 1', () => {
      expect(Parser.evaluate('1 or 1')).toBe(true);
    });

    it('0 or 0', () => {
      expect(Parser.evaluate('0 or 0')).toBe(false);
    });

    it('0 or 1', () => {
      expect(Parser.evaluate('0 or 1')).toBe(true);
    });

    it('0 or 1 or 0', () => {
      expect(Parser.evaluate('0 or 1 or 0')).toBe(true);
    });

    it('1 or 1 or 0', () => {
      expect(Parser.evaluate('1 or 1 or 0')).toBe(true);
    });

    it('skips rhs when lhs is true', () => {
      const notCalled = spy(returnFalse);

      expect(Parser.evaluate('true or notCalled()', { notCalled: notCalled })).toBe(true);
      expect(notCalled.called).toBe(false);
    });

    it('evaluates rhs when lhs is false', () => {
      const called = spy(returnTrue);
      // Security: Functions must be registered in parser.functions before use
      const parser = new Parser();
      parser.functions.called = called;

      expect(parser.evaluate('false or called()')).toBe(true);
      expect(called.called).toBe(true);
    });
  });

  describe('in operator', () => {
    const parser = new Parser();

    it('"a" in ["a", "b"]', () => {
      expect(parser.evaluate('"a" in toto', { toto: ['a', 'b'] })).toBe(true);
    });

    it('"a" in ["b", "a"]', () => {
      expect(parser.evaluate('"a" in toto', { toto: ['b', 'a'] })).toBe(true);
    });

    it('3 in [4, 3]', () => {
      expect(parser.evaluate('3 in toto', { toto: [4, 3] })).toBe(true);
    });

    it('"c" in ["a", "b"]', () => {
      expect(parser.evaluate('"c" in toto', { toto: ['a', 'b'] })).toBe(false);
    });

    it('"c" in ["b", "a"]', () => {
      expect(parser.evaluate('"c" in toto', { toto: ['b', 'a'] })).toBe(false);
    });

    it('3 in [1, 2]', () => {
      expect(parser.evaluate('3 in toto', { toto: [1, 2] })).toBe(false);
    });
  });

  describe('not in operator', () => {
    const parser = new Parser();

    it('"c" not in ["a", "b"]', () => {
      expect(parser.evaluate('"c" not in toto', { toto: ['a', 'b'] })).toBe(true);
    });

    it('"a" in ["a", "b"]', () => {
      expect(parser.evaluate('"a" not in toto', { toto: ['a', 'b'] })).toBe(false);
    });

    it('"a" in ["b", "a"]', () => {
      expect(parser.evaluate('"a" not in toto', { toto: ['b', 'a'] })).toBe(false);
    });

    it('3 in [4, 3]', () => {
      expect(parser.evaluate('3 not in toto', { toto: [4, 3] })).toBe(false);
    });

    it('"c" in ["a", "b"]', () => {
      expect(parser.evaluate('"c" not in toto', { toto: ['a', 'b'] })).toBe(true);
    });

    it('"c" in ["b", "a"]', () => {
      expect(parser.evaluate('"c" not in toto', { toto: ['b', 'a'] })).toBe(true);
    });

    it('3 in [1, 2]', () => {
      expect(parser.evaluate('3 not in toto', { toto: [1, 2] })).toBe(true);
    });
  });

  describe('not operator', () => {
    it('not 1', () => {
      expect(Parser.evaluate('not 1')).toBe(false);
    });

    it('not true', () => {
      expect(Parser.evaluate('not true')).toBe(false);
    });

    it('not 0', () => {
      expect(Parser.evaluate('not 0')).toBe(true);
    });

    it('not false', () => {
      expect(Parser.evaluate('not false')).toBe(true);
    });

    it('not 4', () => {
      expect(Parser.evaluate('not 4')).toBe(false);
    });

    it('1 and not 0', () => {
      expect(Parser.evaluate('1 and not 0')).toBe(true);
    });

    it('not \'0\'', () => {
      expect(Parser.evaluate('not \'0\'')).toBe(false);
    });

    it('not \'\'', () => {
      expect(Parser.evaluate('not \'\'')).toBe(true);
    });
  });

  describe('conditional operator', () => {
    const parser = new Parser();

    it('1 ? 2 : 0 ? 3 : 4', () => {
      expect(parser.evaluate('1 ? 2 : 0 ? 3 : 4')).toBe(2);
    });

    it('(1 ? 2 : 0) ? 3 : 4', () => {
      expect(parser.evaluate('(1 ? 2 : 0) ? 3 : 4')).toBe(3);
    });

    it('0 ? 2 : 0 ? 3 : 4', () => {
      expect(parser.evaluate('0 ? 2 : 0 ? 3 : 4')).toBe(4);
    });

    it('(0 ? 2 : 0) ? 3 : 4', () => {
      expect(parser.evaluate('0 ? 2 : 0 ? 3 : 4')).toBe(4);
    });

    it('(0 ? 0 : 2) ? 3 : 4', () => {
      expect(parser.evaluate('(1 ? 2 : 0) ? 3 : 4')).toBe(3);
    });

    it('min(1 ? 3 : 10, 0 ? 11 : 2)', () => {
      expect(parser.evaluate('min(1 ? 3 : 10, 0 ? 11 : 2)')).toBe(2);
    });

    it('a == 1 ? b == 2 ? 3 : 4 : 5', () => {
      expect(parser.evaluate('a == 1 ? b == 2 ? 3 : 4 : 5', { a: 1, b: 2 })).toBe(3);
      expect(parser.evaluate('a == 1 ? b == 2 ? 3 : 4 : 5', { a: 1, b: 9 })).toBe(4);
      expect(parser.evaluate('a == 1 ? b == 2 ? 3 : 4 : 5', { a: 9, b: 2 })).toBe(5);
      expect(parser.evaluate('a == 1 ? b == 2 ? 3 : 4 : 5', { a: 9, b: 9 })).toBe(5);
    });

    it('should only evaluate one branch', () => {
      expect(parser.evaluate('1 ? 42 : fail')).toBe(42);
      expect(parser.evaluate('0 ? fail : 99')).toBe(99);
    });
  });

  describe('length operator', () => {
    const parser = new Parser();

    it('should return 0 for empty strings', () => {
      expect(parser.evaluate('length ""')).toBe(0);
    });

    it('should return the length of a string', () => {
      expect(parser.evaluate('length "a"')).toBe(1);
      expect(parser.evaluate('length "as"')).toBe(2);
      expect(parser.evaluate('length "asd"')).toBe(3);
      expect(parser.evaluate('length "asdf"')).toBe(4);
    });

    it('should convert numbers to strings', () => {
      expect(parser.evaluate('length 0')).toBe(1);
      expect(parser.evaluate('length 12')).toBe(2);
      expect(parser.evaluate('length 999')).toBe(3);
      expect(parser.evaluate('length 1000')).toBe(4);
      expect(parser.evaluate('length -1')).toBe(2);
      expect(parser.evaluate('length -999')).toBe(4);
    });

    it('should return 0 for empty arrays', () => {
      expect(parser.evaluate('length []')).toBe(0);
    });

    it('should return the length of an array', () => {
      expect(parser.evaluate('length [123]')).toBe(1);
      expect(parser.evaluate('length [123, 456]')).toBe(2);
      expect(parser.evaluate('length [12, 34, 56]')).toBe(3);
      expect(parser.evaluate('length [1, 2, 3, 4]')).toBe(4);
    });
  });
});
