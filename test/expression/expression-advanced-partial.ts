import { describe, it, expect } from 'vitest';
import { Parser } from '../../index';

describe('Expression Advanced Features TypeScript Test', () => {
  describe('function definitions', () => {
    it('should handle f(x) = x * x', () => {
      const parser = new Parser();
      const obj: { f: any } = { f: null };
      const result = parser.evaluate('f(x) = x * x', obj);
      expect(typeof result).toBe('function');
      expect(typeof obj.f).toBe('function');
      expect(obj.f(3)).toBe(9);
    });

    it('should handle (f(x) = x * x)(3)', () => {
      const parser = new Parser();
      expect(parser.evaluate('(f(x) = x * x)(3)')).toBe(9);
    });

    it('should handle y = 5; f(x) = x * y', () => {
      const parser = new Parser();
      const obj: { f: any } = { f: null };
      const result = parser.evaluate('y = 5; f(x) = x * y', obj);
      expect(typeof result).toBe('function');
      expect(typeof obj.f).toBe('function');
      expect(obj.f(3)).toBe(15);
    });

    it('should handle y = 5; (f(x) = x * y)(3)', () => {
      const parser = new Parser();
      expect(parser.evaluate('y = 5; (f(x) = x * y)(3)')).toBe(15);
    });
  });

  describe('recursive functions', () => {
    it('should handle (f(x) = x > 1 ? x*f(x-1) : 1)(5)', () => {
      const parser = new Parser();
      expect(parser.evaluate('(f(x) = x > 1 ? x*f(x-1) : 1)(5)')).toBe(120);
      expect(parser.evaluate('(f(x) = x > 1 ? x*f(x-1) : 1); f(6)')).toBe(720);
    });

    it('should handle f(x) = x > 1 ? x*f(x-1) : 1; f(6); f(5)', () => {
      const parser = new Parser();
      expect(parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1; f(6)')).toBe(720);
      expect(parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1; f(6); f(5)')).toBe(120);
    });

    it('should handle recursive factorial function', () => {
      const parser = new Parser();
      const obj: { f: any } = { f: null };
      const result = parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1', obj);
      expect(typeof result).toBe('function');
      expect(typeof obj.f).toBe('function');
      expect(obj.f(6)).toBe(720);
      expect(obj.f(5)).toBe(120);
      expect(obj.f(4)).toBe(24);
      expect(obj.f(3)).toBe(6);
    });
  });

  describe('sequential operations', () => {
    it('should handle 3 ; 2 ; 1', () => {
      expect(Parser.evaluate('3 ; 2 ; 1')).toBe(1);
    });

    it('should handle 3 ; 2 ; 1 ;', () => {
      expect(Parser.evaluate('3 ; 2 ; 1 ;')).toBe(1);
    });

    it('should handle x = 3 ; y = 4 ; z = x * y', () => {
      const parser = new Parser();
      expect(parser.evaluate('x = 3 ; y = 4 ; z = x * y')).toBe(12);
    });

    it('should handle x=3;y=4;z=x*y;', () => {
      const parser = new Parser();
      expect(parser.evaluate('x=3;y=4;z=x*y;')).toBe(12);
    });

    it('should handle 1 + (( 3 ; 4 ) + 5)', () => {
      const parser = new Parser();
      expect(parser.evaluate('1 + (( 3 ; 4 ) + 5)')).toBe(10);
    });

    it('should handle 2+(x=3;y=4;z=x*y)+5', () => {
      const parser = new Parser();
      expect(parser.evaluate('2+(x=3;y=4;z=x*y)+5')).toBe(19);
    });
  });

  describe('undefined support', () => {
    it('should parse undefined', () => {
      expect(Parser.evaluate('undefined')).toBeUndefined();
      expect(Parser.evaluate('x = undefined; x')).toBeUndefined();
    });

    it('should fail to parse undefined as a custom function', () => {
      expect(() => Parser.evaluate('undefined()')).toThrow(/undefined is not a function/);
      expect(() => Parser.evaluate('x = undefined(); x')).toThrow(/undefined is not a function/);
    });
  });

  describe('string concatenation with + operator', () => {
    it('should concatenate strings', () => {
      const parser = new Parser();
      expect(parser.evaluate('"abc" + "def" + "ghi"')).toBe('abcdefghi');
    });
  });

  describe('async custom functions', () => {
    it('should handle external functions', () => {
      const parser = new Parser();
      (parser.functions as any).doIt = function (value: number) {
        return value + value;
      };
      expect(parser.evaluate('doIt(2)')).toBe(4);
    });

    it('should handle external async functions', async () => {
      const parser = new Parser();
      (parser.functions as any).doIt = function (value: number) {
        return new Promise((resolve) => setTimeout(() => resolve(value + value), 10));
      };
      const promise = parser.evaluate('x = doIt(2); x + 3');
      expect(typeof promise === 'object' && typeof (promise as any).then === 'function').toBe(true);
      const result = await promise;
      expect(result).toBe(7);

      expect(await parser.evaluate('doIt(3) + 4')).toBe(10);
    });

    it('should handle custom function that returns null without breaking isPromise', () => {
      const parser = new Parser();
      (parser.functions as any).doIt = () => null;
      const result = parser.evaluate('x = doIt(); x');
      expect(result).toBeNull();
    });
  });

  describe('object properties', () => {
    const parser = new Parser();
    const obj = {
      thingy: {
        array: [{ value: 10 }],
        foo: 5
      },
      someKey: 'array',
      numericKey: 0
    };

    it('should handle basic property access', () => {
      expect(parser.evaluate('thingy.array[0].value', obj)).toBe(10);
      expect(parser.evaluate('thingy.array[numericKey].value', obj)).toBe(10);
      expect(parser.evaluate('thingy.array[12 * numericKey].value', obj)).toBe(10);
    });

    it('should handle non-existent properties', () => {
      expect(parser.evaluate('thingy.doesNotExist', obj)).toBeUndefined();
      expect(parser.evaluate('thingy.doesNotExist[0]', obj)).toBeUndefined();
      expect(parser.evaluate('thingy.doesNotExist[0].childArray[1].notHere.alsoNotHere', obj)).toBeUndefined();
      expect(parser.evaluate('thingy.array[0].value.doesNotExist', obj)).toBeUndefined();

      expect(parser.evaluate('thingy.doesNotExist ?? 1', obj)).toBe(1);
      expect(parser.evaluate('thingy.array[0].value.doesNotExist ?? 1', obj)).toBe(1);
      expect(parser.evaluate('thingy.doesNotExist[0].childArray[1].notHere.alsoNotHere ?? 1', obj)).toBe(1);
    });

    it('should handle non-existent array elements', () => {
      expect(parser.evaluate('thingy.array[1]', obj)).toBeUndefined();
      expect(parser.evaluate('thingy.array[1].value', obj)).toBeUndefined();

      expect(parser.evaluate('thingy.array[1] ?? 1', obj)).toBe(1);
      expect(parser.evaluate('thingy.array[1].value ?? 1', obj)).toBe(1);
    });

    it('should handle bracket notation', () => {
      expect(parser.evaluate('thingy["foo"]', obj)).toBe(5);
      expect(parser.evaluate('thingy["array"][0].value', obj)).toBe(10);
      expect(parser.evaluate('thingy[someKey][0].value', obj)).toBe(10);
      expect(parser.evaluate('thingy["array"][numericKey].value', obj)).toBe(10);
    });

    it('should handle bracket notation for non-existent properties', () => {
      expect(parser.evaluate('thingy["array"][1]', obj)).toBeUndefined();
      expect(parser.evaluate('thingy["doesNotExist"][0]', obj)).toBeUndefined();
    });
  });

  describe('custom variable resolution', () => {
    it('should support custom variable resolution using aliases', () => {
      const parser = new Parser();
      const obj = { variables: { a: 5, b: 1 } };
      (parser as any).resolve = (token: string) =>
        token === '$v' ? { alias: 'variables' } : undefined;
      expect(parser.evaluate('$v.a + variables.b', obj)).toBe(6);
    });

    it('should throw an undefined variable error if custom variable resolution returns an alias that does not exist', () => {
      const parser = new Parser();
      const obj = { variables: { a: 5, b: 1 } };
      (parser as any).resolve = (token: string) =>
        token === '$v' ? { alias: 'abc' } : undefined;
      expect(() => parser.evaluate('$v.a + variables.b', obj)).toThrow(/undefined variable: \$v/);
    });

    it('should support custom variable resolution using values', () => {
      const parser = new Parser();
      const obj = { variables: { a: 5, b: 1 } };
      (parser as any).resolve = (token: string) =>
        token.startsWith('$') ? { value: (obj.variables as any)[token.substring(1)] } : undefined;
      expect(parser.evaluate('$a + $b')).toBe(6);
    });

    it('should support custom variable resolution values of undefined', () => {
      const parser = new Parser();
      const obj = { variables: { a: 5, b: 1 } };
      (parser as any).resolve = (token: string) =>
        token.startsWith('$') ? { value: (obj.variables as any)[token.substring(1)] } : undefined;
      expect(parser.evaluate('$a + $c')).toBeUndefined();
    });

    it('should support child properties in custom variable resolution values', () => {
      const parser = new Parser();
      const obj = {
        variables1: { a: 5, b: 1 },
        variables2: { b: { c: 6 } }
      };
      (parser as any).resolve = (token: string) => {
        if (token.startsWith('$$')) {
          return { value: (obj.variables2 as any)[token.substring(2)] };
        } else if (token.startsWith('$')) {
          return { value: (obj.variables1 as any)[token.substring(1)] };
        } else {
          return undefined;
        }
      };
      expect(parser.evaluate('$b + $$b.c')).toBe(7);
    });
  });

  describe('?? (nullish coalescing) operator', () => {
    it('should succeed with variables set to undefined', () => {
      expect(Parser.evaluate('x = undefined; x + 1')).toBeUndefined();
      expect(Parser.evaluate('x = undefined; x ?? 3 + 1')).toBe(4);
    });

    it('should handle y = x ?? 2 + 4', () => {
      expect(Parser.evaluate('y = x ?? 2 + 4', { x: undefined })).toBe(6);
      expect(Parser.evaluate('y = x ?? 2 + 4', { x: 3 })).toBe(7);
    });

    it('should handle (a / b * 10) ?? 0 (divide by 0)', () => {
      expect(Parser.evaluate('(a / b * 10) ?? 0', { a: 5, b: 0 })).toBe(0);
    });

    it('should be disabled by the coalesce option', () => {
      const parser = new Parser({ operators: { coalesce: false } });
      expect(() => parser.evaluate('1 ?? 2')).toThrow(/Unknown character/);
    });
  });

  describe('as operator', () => {
    it('should be disabled by default', () => {
      expect(() => Parser.evaluate('"1.6" as "abc"')).toThrow();
    });

    it('should work when enabled', () => {
      const parser = new Parser({ operators: { conversion: true } });
      expect(parser.evaluate('"1.6" as "number"')).toBe(1.6);
    });
  });
});
