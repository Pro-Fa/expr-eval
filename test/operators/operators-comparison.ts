import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Comparison Operators Tests - Converted from operators.js
// Tests for ==, !=, >, >=, <, <= operators

describe('Comparison Operators TypeScript Test', () => {
  describe('== operator', () => {
    it('2 == 3', () => {
      expect(Parser.evaluate('2 == 3')).toBe(false);
    });

    it('3 * 1 == 2', () => {
      expect(Parser.evaluate('3 == 2')).toBe(false);
    });

    it('3 == 3', () => {
      expect(Parser.evaluate('3 == 3')).toBe(true);
    });

    it('\'3\' == 3', () => {
      expect(Parser.evaluate('\'3\' == 3')).toBe(false);
    });

    it('\'string 1\' == \'string 2\'', () => {
      expect(Parser.evaluate('\'string 1\' == \'string 2\'')).toBe(false);
    });

    it('\'string 1\' == "string 1"', () => {
      expect(Parser.evaluate('\'string 1\' == \'string 1\'')).toBe(true);
    });

    it('\'3\' == \'3\'', () => {
      expect(Parser.evaluate('\'3\' == \'3\'')).toBe(true);
    });

    it('null == null', () => {
      expect(Parser.evaluate('null == alsoNull', { null: null, alsoNull: null })).toBe(true);
    });
  });

  describe('!= operator', () => {
    it('2 != 3', () => {
      expect(Parser.evaluate('2 != 3')).toBe(true);
    });

    it('3 != 2', () => {
      expect(Parser.evaluate('3 != 2')).toBe(true);
    });

    it('3 != 3', () => {
      expect(Parser.evaluate('3 != 3')).toBe(false);
    });

    it('\'3\' != 3', () => {
      expect(Parser.evaluate('\'3\' != 3')).toBe(true);
    });

    it('\'3\' != \'3\'', () => {
      expect(Parser.evaluate('\'3\' != \'3\'')).toBe(false);
    });

    it('\'string 1\' != \'string 1\'', () => {
      expect(Parser.evaluate('\'string 1\' != \'string 1\'')).toBe(false);
    });

    it('\'string 1\' != \'string 2\'', () => {
      expect(Parser.evaluate('\'string 1\' != \'string 2\'')).toBe(true);
    });
  });

  describe('> operator', () => {
    it('2 > 3', () => {
      expect(Parser.evaluate('2 > 3')).toBe(false);
    });

    it('3 > 2', () => {
      expect(Parser.evaluate('3 > 2')).toBe(true);
    });

    it('3 > 3', () => {
      expect(Parser.evaluate('3 > 3')).toBe(false);
    });
  });

  describe('>= operator', () => {
    it('2 >= 3', () => {
      expect(Parser.evaluate('2 >= 3')).toBe(false);
    });

    it('3 >= 2', () => {
      expect(Parser.evaluate('3 >= 2')).toBe(true);
    });

    it('3 >= 3', () => {
      expect(Parser.evaluate('3 >= 3')).toBe(true);
    });
  });

  describe('< operator', () => {
    it('2 < 3', () => {
      expect(Parser.evaluate('2 < 3')).toBe(true);
    });

    it('3 < 2', () => {
      expect(Parser.evaluate('3 < 2')).toBe(false);
    });

    it('3 < 3', () => {
      expect(Parser.evaluate('3 < 3')).toBe(false);
    });
  });

  describe('<= operator', () => {
    it('2 <= 3', () => {
      expect(Parser.evaluate('2 <= 3')).toBe(true);
    });

    it('3 <= 2', () => {
      expect(Parser.evaluate('3 <= 2')).toBe(false);
    });

    it('3 <= 3', () => {
      expect(Parser.evaluate('3 <= 3')).toBe(true);
    });
  });
});
