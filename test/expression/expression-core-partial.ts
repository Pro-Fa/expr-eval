import { describe, it, expect } from 'vitest';
import { Parser } from '../../dist/index.mjs';

describe('Expression Core Features TypeScript Test', () => {
  describe('basic arithmetic evaluation', () => {
    it('should evaluate 2 ^ x', () => {
      expect(Parser.evaluate('2 ^ x', { x: 3 })).toBe(8);
    });

    it('should evaluate 2 * x + 1', () => {
      expect(Parser.evaluate('2 * x + 1', { x: 3 })).toBe(7);
    });

    it('should evaluate 2 + 3 * x', () => {
      expect(Parser.evaluate('2 + 3 * x', { x: 4 })).toBe(14);
    });

    it('should evaluate (2 + 3) * x', () => {
      expect(Parser.evaluate('(2 + 3) * x', { x: 4 })).toBe(20);
    });

    it('should evaluate 2-3^x', () => {
      expect(Parser.evaluate('2-3^x', { x: 4 })).toBe(-79);
    });

    it('should evaluate -2-3^x', () => {
      expect(Parser.evaluate('-2-3^x', { x: 4 })).toBe(-83);
    });

    it('should evaluate -3^x', () => {
      expect(Parser.evaluate('-3^x', { x: 4 })).toBe(-81);
    });

    it('should evaluate (-3)^x', () => {
      expect(Parser.evaluate('(-3)^x', { x: 4 })).toBe(81);
    });
  });

  describe('member access and complex expressions', () => {
    it('should evaluate 2 ^ x.y', () => {
      expect(Parser.evaluate('2^x.y', { x: { y: 3 } })).toBe(8);
    });

    it('should evaluate 2 + 3 * foo.bar.baz', () => {
      expect(Parser.evaluate('2 + 3 * foo.bar.baz', { foo: { bar: { baz: 4 } } })).toBe(14);
    });

    it('should handle max(conf.limits.lower, conf.limits.upper)', () => {
      expect(Parser.evaluate('max(conf.limits.lower, conf.limits.upper)', { conf: { limits: { lower: 4, upper: 9 } } })).toBe(9);
    });

    it('should handle fn.max(conf.limits.lower, conf.limits.upper)', () => {
      expect(Parser.evaluate('fn.max(conf.limits.lower, conf.limits.upper)', { fn: { max: Math.max }, conf: { limits: { lower: 4, upper: 9 } } })).toBe(9);
    });

    it('should handle $x * $y_+$a1*$z - $b2', () => {
      expect(Parser.evaluate('$x * $y_+$a1*$z - $b2', { $a1: 3, $b2: 5, $x: 7, $y_: 9, $z: 11 })).toBe(91);
    });
  });

  describe('unary operators', () => {
    it('should handle 10/-1', () => {
      expect(Parser.evaluate('10/-1')).toBe(-10);
    });

    it('should handle 10*-1', () => {
      expect(Parser.evaluate('10*-1')).toBe(-10);
    });

    it('should handle 10*-x', () => {
      expect(Parser.evaluate('10*-x', { x: 1 })).toBe(-10);
    });

    it('should handle 10+-1', () => {
      expect(Parser.evaluate('10+-1')).toBe(9);
    });

    it('should handle 10/+1', () => {
      expect(Parser.evaluate('10/+1')).toBe(10);
    });

    it('should handle 10*+1', () => {
      expect(Parser.evaluate('10*+1')).toBe(10);
    });

    it('should handle 10*+x', () => {
      expect(Parser.evaluate('10*+x', { x: 1 })).toBe(10);
    });

    it('should handle 10+ +1', () => {
      expect(Parser.evaluate('10+ +1')).toBe(11);
    });

    it('should handle 10/-2', () => {
      expect(Parser.evaluate('10/-2')).toBe(-5);
    });

    it('should handle 2^-4', () => {
      expect(Parser.evaluate('2^-4')).toBe(1 / 16);
    });

    it('should handle 2^(-4)', () => {
      expect(Parser.evaluate('2^(-4)')).toBe(1 / 16);
    });
  });

  describe('string and array concatenation', () => {
    it('should concatenate strings with | operator', () => {
      expect(Parser.evaluate("'as' | 'df'")).toBe('asdf');
    });

    it('should concatenate arrays with | operator', () => {
      expect(Parser.evaluate('[1, 2] | [3, 4] | [5, 6]')).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('variable assignment', () => {
    it('should handle x = 3 * 2 + 1', () => {
      const parser = new Parser();
      expect(parser.evaluate('x = 3 * 2 + 1')).toBe(7);
    });

    it('should handle x = x * 2 + 1', () => {
      const parser = new Parser();
      const obj: Record<string, number> = {};
      parser.evaluate('x = 3 * 2 + 1', obj);
      expect(parser.evaluate('x = x * 2 + 1', obj)).toBe(15);
    });

    it('should handle y = x = x * 2 + 1', () => {
      const parser = new Parser();
      const obj: Record<string, number> = {};
      parser.evaluate('x = 3 * 2 + 1', obj);
      expect(parser.evaluate('y = x = x * 2 + 1', obj)).toBe(15);
      expect(obj.x).toBe(15);
      expect(obj.y).toBe(15);
    });

    it('should handle y = y = 2*z', () => {
      const parser = new Parser();
      const obj = { y: 5, z: 3, x: 0 };
      expect(parser.evaluate('x = y = 2*z', obj)).toBe(6);
      expect(obj.x).toBe(6);
      expect(obj.y).toBe(6);
      expect(obj.z).toBe(3);
    });
  });

  describe('conditional expressions', () => {
    it('should evaluate 1 ? 1 : 0', () => {
      expect(Parser.evaluate('1 ? 1 : 0')).toBe(1);
    });

    it('should evaluate 0 ? 1 : 0', () => {
      expect(Parser.evaluate('0 ? 1 : 0')).toBe(0);
    });

    it('should evaluate 1==1 or 2==1 ? 39 : 0', () => {
      expect(Parser.evaluate('1==1 or 2==1 ? 39 : 0')).toBe(39);
    });

    it('should evaluate 1==1 or 1==2 ? -4 + 8 : 0', () => {
      expect(Parser.evaluate('1==1 or 1==2 ? -4 + 8 : 0')).toBe(4);
    });

    it('should evaluate complex nested conditionals', () => {
      expect(Parser.evaluate('3 and 6 ? 45 > 5 * 11 ? 3 * 3 : 2.4 : 0')).toBe(2.4);
    });
  });

  describe('array literals', () => {
    it('should handle [1, 2, 3]', () => {
      expect(Parser.evaluate('[1, 2, 3]')).toEqual([1, 2, 3]);
    });

    it('should handle nested arrays [1, 2, 3, [4, [5, 6]]]', () => {
      expect(Parser.evaluate('[1, 2, 3, [4, [5, 6]]]')).toEqual([1, 2, 3, [4, [5, 6]]]);
    });

    it('should handle mixed arrays ["a", ["b", ["c"]], true, 1 + 2 + 3]', () => {
      expect(Parser.evaluate('["a", ["b", ["c"]], true, 1 + 2 + 3]')).toEqual(['a', ['b', ['c']], true, 6]);
    });

    it('should handle complex array expression [1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]', () => {
      const result = Parser.evaluate('[1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]');
      expect(JSON.stringify(result)).toBe(JSON.stringify([1, 5, 20, 6 / 7, [8, 9, 10], '11']));
    });
  });

  describe('error handling', () => {
    it('should fail with undefined variables', () => {
      expect(() => Parser.evaluate('x + 1')).toThrow();
    });

    it('should fail trying to call a non-function', () => {
      expect(() => Parser.evaluate('f()', { f: 2 })).toThrow();
    });
  });
});
