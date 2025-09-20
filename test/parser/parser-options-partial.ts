import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Parser Options Tests - Converted from parser.js
// Tests for parser configuration and operator enabling/disabling

describe('Parser Options TypeScript Test', () => {
  describe('operator configuration', () => {
    it('should allow operators to be disabled', () => {
      const parser = new Parser({
        operators: {
          add: false,
          sin: false,
          remainder: false,
          divide: false
        }
      });
      expect(() => parser.parse('+1')).toThrow(/\+/);
      expect(() => parser.parse('1 + 2')).toThrow(/\+/);
      expect(parser.parse('sin(0)').toString()).toBe('sin(0)');
      expect(() => parser.evaluate('sin(0)')).toThrow(/sin/);
      expect(() => parser.parse('4 % 5')).toThrow(/%/);
      expect(() => parser.parse('4 / 5')).toThrow(/\//);
    });

    it('should allow operators to be explicitly enabled', () => {
      const parser = new Parser({
        operators: {
          add: true,
          sqrt: true,
          divide: true,
          in: true,
          assignment: true
        }
      });
      expect(parser.evaluate('+(-1)')).toBe(-1);
      expect(parser.evaluate('sqrt(16)')).toBe(4);
      expect(parser.evaluate('4 / 6')).toBe(2 / 3);
      expect(parser.evaluate('3 in array', { array: [1, 2, 3] })).toBe(true);
      expect(parser.evaluate('x = 4', { x: 2 })).toBe(4);
    });

    it('should allow addition operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          add: false
        }
      });

      expect(() => parser.parse('2 + 3')).toThrow(/\+/);
    });

    it('should allow comparison operators to be disabled', () => {
      const parser = new Parser({
        operators: {
          comparison: false
        }
      });

      expect(() => parser.parse('1 == 1')).toThrow(/=/);
      expect(() => parser.parse('1 != 2')).toThrow(/!/);
      expect(() => parser.parse('1 > 0')).toThrow(/>/);
      expect(() => parser.parse('1 >= 0')).toThrow(/>/);
      expect(() => parser.parse('1 < 2')).toThrow(/</);
      expect(() => parser.parse('1 <= 2')).toThrow(/</);
    });

    it('should allow concatenate operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          concatenate: false
        }
      });

      expect(() => parser.parse('"as" | "df"')).toThrow(/\|/);
    });

    it('should allow conditional operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          conditional: false
        }
      });

      expect(() => parser.parse('true ? 1 : 0')).toThrow(/\?/);
    });

    it('should allow division operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          divide: false
        }
      });

      expect(() => parser.parse('2 / 3')).toThrow(/\//);
    });

    it('should allow factorial operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          factorial: false
        }
      });

      expect(() => parser.parse('5!')).toThrow(/!/);
    });

    it('should allow in operator to be enabled', () => {
      const parser = new Parser({
        operators: {
          in: true
        }
      });

      expect(() => parser.parse('5 * in')).toThrow();
      expect(parser.evaluate('5 in a', { a: [2, 3, 5] })).toBe(true);
    });

    it('should allow in operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          in: false
        }
      });

      expect(() => parser.parse('5 in a')).toThrow();
      expect(parser.evaluate('5 * in', { in: 3 })).toBe(15);
    });

    it('should allow logical operators to be disabled', () => {
      const parser = new Parser({
        operators: {
          logical: false
        }
      });

      expect(() => parser.parse('true and true')).toThrow();
      expect(() => parser.parse('true or false')).toThrow();
      expect(() => parser.parse('not false')).toThrow();

      expect(parser.evaluate('and * or + not', { and: 3, or: 5, not: 2 })).toBe(17);
    });

    it('should allow multiplication operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          multiply: false
        }
      });

      expect(() => parser.parse('3 * 4')).toThrow(/\*/);
    });

    it('should allow power operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          power: false
        }
      });

      expect(() => parser.parse('3 ^ 4')).toThrow(/\^/);
    });

    it('should allow remainder operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          remainder: false
        }
      });

      expect(() => parser.parse('3 % 2')).toThrow(/%/);
    });

    it('should allow subtraction operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          subtract: false
        }
      });

      expect(() => parser.parse('5 - 3')).toThrow(/-/);
    });

    it('should allow assignment operator to be enabled', () => {
      const parser = new Parser({
        operators: {
          assignment: true
        }
      });

      expect(() => parser.parse('a =')).toThrow();
      expect(parser.evaluate('a = 5', {})).toBe(5);
    });

    it('should allow assignment operator to be disabled', () => {
      const parser = new Parser({
        operators: {
          assignment: false
        }
      });

      expect(() => parser.parse('a = 5')).toThrow();
    });

    it('should allow assignment operator by default', () => {
      const parser = new Parser();

      expect(parser.evaluate('a = 5', {})).toBe(5);
    });

    it('should allow arrays to be enabled', () => {
      const parser = new Parser({
        operators: {
          array: true
        }
      });

      expect(parser.evaluate('[1, 2, 3]')).toEqual([1, 2, 3]);
      expect(parser.evaluate('a[0]', { a: [4, 2] })).toBe(4);
    });

    it('should allow arrays to be disabled', () => {
      const parser = new Parser({
        operators: {
          array: false
        }
      });

      expect(() => parser.parse('[1, 2, 3]')).toThrow(/\[/);
      expect(() => parser.parse('a[0]')).toThrow(/\[/);
    });

    it('should allow functions to be disabled', () => {
      const parser = new Parser({
        operators: {
          fndef: false
        }
      });
      const obj: any = {};
      expect(() => parser.parse('f(x) = x * x')).toThrow(/function definition is not permitted/);
      expect('f' in obj).toBe(false);
      expect('x' in obj).toBe(false);
    });

    it('should allow functions to be enabled', () => {
      const parser = new Parser({
        operators: {
          fndef: true
        }
      });
      const obj: any = {};
      expect(parser.evaluate('f(x) = x * x', obj) instanceof Function).toBe(true);
      expect(obj.f instanceof Function).toBe(true);
      expect(obj.f(3)).toBe(9);
    });

    it('disabling assignment should disable function definition', () => {
      const parser = new Parser({
        operators: {
          assignment: false
        }
      });
      const obj: any = {};
      expect(() => parser.parse('f(x) = x * x')).toThrow();
      expect('f' in obj).toBe(false);
      expect('x' in obj).toBe(false);
    });
  });

  describe('member access configuration', () => {
    it('should disallow member access', () => {
      const parser = new Parser({ allowMemberAccess: false });
      expect(() => parser.evaluate('min.bind')).toThrow(/member access is not permitted/);
      expect(() => parser.evaluate('min.bind()')).toThrow(/member access is not permitted/);
      expect(() => parser.evaluate('32 + min.bind')).toThrow(/member access is not permitted/);
      expect(() => parser.evaluate('a.b', { a: { b: 2 } })).toThrow(/member access is not permitted/);
    });
  });

  describe('token position tracking in error reporting', () => {
    const parser = new Parser();

    it('should track token positions correctly', () => {
      expect(() => parser.parse('@23')).toThrow(/parse error \[1:1]/);
      expect(() => parser.parse('\n@23')).toThrow(/parse error \[2:1]/);
      expect(() => parser.parse('1@3')).toThrow(/parse error \[1:2]/);
      expect(() => parser.parse('12@')).toThrow(/parse error \[1:3]/);
      expect(() => parser.parse('12@\n')).toThrow(/parse error \[1:3]/);
      expect(() => parser.parse('@23 +\n45 +\n6789')).toThrow(/parse error \[1:1]/);
      expect(() => parser.parse('1@3 +\n45 +\n6789')).toThrow(/parse error \[1:2]/);
      expect(() => parser.parse('12@ +\n45 +\n6789')).toThrow(/parse error \[1:3]/);
      expect(() => parser.parse('123 +\n@5 +\n6789')).toThrow(/parse error \[2:1]/);
      expect(() => parser.parse('123 +\n4@ +\n6789')).toThrow(/parse error \[2:2]/);
      expect(() => parser.parse('123 +\n45@+\n6789')).toThrow(/parse error \[2:3]/);
      expect(() => parser.parse('123 +\n45 +\n@789')).toThrow(/parse error \[3:1]/);
      expect(() => parser.parse('123 +\n45 +\n6@89')).toThrow(/parse error \[3:2]/);
      expect(() => parser.parse('123 +\n45 +\n67@9')).toThrow(/parse error \[3:3]/);
      expect(() => parser.parse('123 +\n45 +\n679@')).toThrow(/parse error \[3:4]/);
      expect(() => parser.parse('123 +\n\n679@')).toThrow(/parse error \[3:4]/);
      expect(() => parser.parse('123 +\n\n\n\n\n679@')).toThrow(/parse error \[6:4]/);
    });
  });
});
