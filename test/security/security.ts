/**
 * Security tests for CVE-2025-12735, CVE-2025-13204, and related vulnerabilities
 *
 * These tests verify that the library is protected against:
 * 1. CVE-2025-12735: Code injection via arbitrary function calls in evaluation context
 * 2. CVE-2025-13204: Prototype pollution via __proto__, prototype, constructor access
 * 3. Bypass vulnerabilities via member function calls (Issue #289)
 */

import { describe, it, expect } from 'vitest';
import { Parser } from '../../index';
import { AccessError, FunctionError } from '../../src/types/errors';

describe('Security Tests', () => {
  describe('CVE-2025-12735: Code Injection Prevention', () => {
    it('should block direct function calls passed via context', () => {
      const parser = new Parser();
      const dangerousContext = {
        dangerousFunc: () => 'pwned'
      };

      expect(() => parser.evaluate('dangerousFunc()', dangerousContext))
        .toThrow(FunctionError);
    });

    it('should block variable access to functions passed via context', () => {
      const parser = new Parser();
      const dangerousContext = {
        exec: () => 'pwned'
      };

      expect(() => parser.evaluate('exec("whoami")', dangerousContext))
        .toThrow(FunctionError);
    });

    it('should allow registered functions in parser.functions', () => {
      const parser = new Parser();
      parser.functions.safeFunc = (x: number) => x * 2;

      expect(parser.evaluate('safeFunc(5)')).toBe(10);
    });

    it('should allow safe Math functions', () => {
      const parser = new Parser();

      expect(parser.evaluate('sin(0)')).toBe(0);
      expect(parser.evaluate('cos(0)')).toBe(1);
      expect(parser.evaluate('abs(-5)')).toBe(5);
      expect(parser.evaluate('sqrt(4)')).toBe(2);
      expect(parser.evaluate('pow(2, 3)')).toBe(8);
    });

    it('should allow inline-defined functions (IFUNDEF)', () => {
      const parser = new Parser();

      expect(parser.evaluate('(f(x) = x * 2)(5)')).toBe(10);
      expect(parser.evaluate('f(x) = x * x; f(4)')).toBe(16);
    });

    it('should allow recursive inline functions', () => {
      const parser = new Parser();

      // Factorial function
      expect(parser.evaluate('(f(x) = x > 1 ? x * f(x - 1) : 1)(5)')).toBe(120);
    });
  });

  describe('CVE-2025-13204: Prototype Pollution Prevention', () => {
    it('should block __proto__ access in member expressions', () => {
      const parser = new Parser();

      expect(() => parser.evaluate('x.__proto__', { x: {} }))
        .toThrow(AccessError);
    });

    it('should block prototype access in member expressions', () => {
      const parser = new Parser();

      expect(() => parser.evaluate('x.prototype', { x: function(): number { return 0; } }))
        .toThrow(); // Can throw AccessError or FunctionError depending on the function check
    });

    it('should block __proto__ access in variable names', () => {
      const parser = new Parser();

      expect(() => parser.evaluate('__proto__', { '__proto__': {} }))
        .toThrow(AccessError);
    });

    it('should block prototype access in variable names', () => {
      const parser = new Parser();

      expect(() => parser.evaluate('prototype', { prototype: {} }))
        .toThrow(AccessError);
    });

    it('should block constructor access in variable names', () => {
      const parser = new Parser();

      expect(() => parser.evaluate('constructor', { constructor: {} }))
        .toThrow();
    });
  });

  describe('Issue #289: Member Function Call Bypass Prevention', () => {
    it('should block member function calls on nested objects', () => {
      const parser = new Parser();
      const dangerousContext = {
        obj: {
          dangerousMethod: () => 'pwned via member'
        }
      };

      expect(() => parser.evaluate('obj.dangerousMethod()', dangerousContext))
        .toThrow(FunctionError);
    });

    it('should block deeply nested dangerous function calls', () => {
      const parser = new Parser();
      const dangerousContext = {
        level1: {
          level2: {
            exec: () => 'pwned deeply'
          }
        }
      };

      expect(() => parser.evaluate('level1.level2.exec()', dangerousContext))
        .toThrow(FunctionError);
    });

    it('should allow safe member access on objects', () => {
      const parser = new Parser();
      const safeContext = {
        user: {
          name: 'John',
          age: 30
        }
      };

      expect(parser.evaluate('user.name', safeContext)).toBe('John');
      expect(parser.evaluate('user.age', safeContext)).toBe(30);
    });

    it('should allow safe nested member access', () => {
      const parser = new Parser();
      const safeContext = {
        data: {
          info: {
            value: 42
          }
        }
      };

      expect(parser.evaluate('data.info.value', safeContext)).toBe(42);
    });
  });

  describe('PoC Attacks from Security Reports', () => {
    it('PoC: VU#263614 - deny child exec process', () => {
      const parser = new Parser();
      const context = {
        exec: () => 'executed'
      };

      expect(() => parser.evaluate('exec("whoami")', context))
        .toThrow(FunctionError);
    });

    it('PoC: Issue #289 by @baoquanh - nested dangerous function', () => {
      const parser = new Parser();
      const baoquanh = {
        test: {
          write: () => 'file written'
        }
      };

      expect(() => parser.evaluate('test.write("pwned.txt", "Hello!")', baoquanh))
        .toThrow(FunctionError);
    });

    it('PoC: write file via context - should be blocked', () => {
      const parser = new Parser();
      const context = {
        write: () => 'wrote file'
      };

      expect(() => parser.evaluate('write("pwned.txt", "Hello!")', context))
        .toThrow(FunctionError);
    });
  });

  describe('Safe Operations', () => {
    it('should still allow normal arithmetic expressions', () => {
      const parser = new Parser();

      expect(parser.evaluate('2 + 3')).toBe(5);
      expect(parser.evaluate('10 - 5')).toBe(5);
      expect(parser.evaluate('4 * 5')).toBe(20);
      expect(parser.evaluate('20 / 4')).toBe(5);
    });

    it('should still allow variables with primitive values', () => {
      const parser = new Parser();

      expect(parser.evaluate('x + y', { x: 10, y: 20 })).toBe(30);
      expect(parser.evaluate('name', { name: 'test' })).toBe('test');
      expect(parser.evaluate('flag', { flag: true })).toBe(true);
    });

    it('should still allow array access', () => {
      const parser = new Parser();

      expect(parser.evaluate('arr[0]', { arr: [1, 2, 3] })).toBe(1);
      expect(parser.evaluate('arr[1] + arr[2]', { arr: [1, 2, 3] })).toBe(5);
    });

    it('should still allow built-in functions', () => {
      const parser = new Parser();

      expect(parser.evaluate('min(5, 3)')).toBe(3);
      expect(parser.evaluate('max(5, 3)')).toBe(5);
      expect(parser.evaluate('floor(3.7)')).toBe(3);
      expect(parser.evaluate('ceil(3.2)')).toBe(4);
    });

    it('should still allow string operations', () => {
      const parser = new Parser();

      expect(parser.evaluate('"hello" + " " + "world"')).toBe('hello world');
      expect(parser.evaluate('length "test"')).toBe(4);
    });

    it('should still allow conditional expressions', () => {
      const parser = new Parser();

      expect(parser.evaluate('x > 5 ? "big" : "small"', { x: 10 })).toBe('big');
      expect(parser.evaluate('x > 5 ? "big" : "small"', { x: 3 })).toBe('small');
    });

    it('should still allow logical operators', () => {
      const parser = new Parser();

      expect(parser.evaluate('true and false')).toBe(false);
      expect(parser.evaluate('true or false')).toBe(true);
      expect(parser.evaluate('not true')).toBe(false);
    });
  });
});
