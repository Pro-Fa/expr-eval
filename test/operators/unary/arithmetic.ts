import { describe, it, expect } from 'vitest';
import {
  neg,
  pos,
  abs,
  ceil,
  floor,
  round,
  sign,
  sqrt,
  trunc,
  cbrt,
  exp,
  expm1,
  log,
  log1p,
  log2,
  log10
} from '../../../src/operators/unary/arithmetic.js';

describe('Unary Arithmetic Operators', () => {
  describe('neg (negation)', () => {
    it('should return negative of positive number', () => {
      expect(neg(5)).toBe(-5);
      expect(neg(42)).toBe(-42);
    });

    it('should return positive of negative number', () => {
      expect(neg(-5)).toBe(5);
      expect(neg(-42)).toBe(42);
    });

    it('should handle zero', () => {
      expect(neg(0)).toBe(-0);
      expect(neg(-0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(neg(undefined)).toBe(undefined);
    });

    it('should handle special values', () => {
      expect(neg(Infinity)).toBe(-Infinity);
      expect(neg(-Infinity)).toBe(Infinity);
      expect(isNaN(neg(NaN) as number)).toBe(true);
    });
  });

  describe('pos (positive/conversion)', () => {
    it('should return number unchanged', () => {
      expect(pos(5)).toBe(5);
      expect(pos(-5)).toBe(-5);
      expect(pos(0)).toBe(0);
    });

    it('should convert string to number', () => {
      expect(pos('5')).toBe(5);
      expect(pos('-5')).toBe(-5);
      expect(pos('0')).toBe(0);
      expect(pos('3.14')).toBe(3.14);
    });

    it('should convert boolean to number', () => {
      expect(pos(true)).toBe(1);
      expect(pos(false)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(pos(undefined)).toBe(undefined);
    });

    it('should return undefined for non-numeric strings', () => {
      expect(pos('hello')).toBe(undefined);
      expect(pos('abc123')).toBe(undefined);
      expect(pos('')).toBe(0); // empty string converts to 0
    });

    it('should handle null and convert to 0', () => {
      expect(pos(null)).toBe(0);
    });

    it('should handle arrays and objects by returning undefined', () => {
      expect(pos([])).toBe(0); // empty array converts to 0
      expect(pos([1])).toBe(1); // single element array
      expect(pos([1, 2])).toBe(undefined); // multi-element array
      expect(pos({})).toBe(undefined); // object
    });
  });

  describe('abs (absolute value)', () => {
    it('should return absolute value of positive numbers', () => {
      expect(abs(5)).toBe(5);
      expect(abs(42)).toBe(42);
    });

    it('should return absolute value of negative numbers', () => {
      expect(abs(-5)).toBe(5);
      expect(abs(-42)).toBe(42);
    });

    it('should handle zero', () => {
      expect(abs(0)).toBe(0);
      expect(abs(-0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(abs(undefined)).toBe(undefined);
    });

    it('should handle special values', () => {
      expect(abs(Infinity)).toBe(Infinity);
      expect(abs(-Infinity)).toBe(Infinity);
      expect(isNaN(abs(NaN) as number)).toBe(true);
    });
  });

  describe('ceil (ceiling)', () => {
    it('should round up to nearest integer', () => {
      expect(ceil(3.2)).toBe(4);
      expect(ceil(3.8)).toBe(4);
      expect(ceil(-3.2)).toBe(-3);
      expect(ceil(-3.8)).toBe(-3);
    });

    it('should return integer unchanged', () => {
      expect(ceil(5)).toBe(5);
      expect(ceil(-5)).toBe(-5);
      expect(ceil(0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(ceil(undefined)).toBe(undefined);
    });
  });

  describe('floor (floor)', () => {
    it('should round down to nearest integer', () => {
      expect(floor(3.2)).toBe(3);
      expect(floor(3.8)).toBe(3);
      expect(floor(-3.2)).toBe(-4);
      expect(floor(-3.8)).toBe(-4);
    });

    it('should return integer unchanged', () => {
      expect(floor(5)).toBe(5);
      expect(floor(-5)).toBe(-5);
      expect(floor(0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(floor(undefined)).toBe(undefined);
    });
  });

  describe('round (round)', () => {
    it('should round to nearest integer', () => {
      expect(round(3.2)).toBe(3);
      expect(round(3.8)).toBe(4);
      expect(round(-3.2)).toBe(-3);
      expect(round(-3.8)).toBe(-4);
      expect(round(3.5)).toBe(4);
      expect(round(-3.5)).toBe(-3);
    });

    it('should return integer unchanged', () => {
      expect(round(5)).toBe(5);
      expect(round(-5)).toBe(-5);
      expect(round(0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(round(undefined)).toBe(undefined);
    });
  });

  describe('sign', () => {
    it('should return 1 for positive numbers', () => {
      expect(sign(5)).toBe(1);
      expect(sign(0.1)).toBe(1);
      expect(sign(Infinity)).toBe(1);
    });

    it('should return -1 for negative numbers', () => {
      expect(sign(-5)).toBe(-1);
      expect(sign(-0.1)).toBe(-1);
      expect(sign(-Infinity)).toBe(-1);
    });

    it('should return 0 for zero', () => {
      expect(sign(0)).toBe(0);
      expect(sign(-0)).toBe(-0);
    });

    it('should return NaN for NaN', () => {
      expect(isNaN(sign(NaN) as number)).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      expect(sign(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalSign = Math.sign;
      // temporarily remove Math.sign to test fallback
      delete (Math as any).sign;

      expect(sign(5)).toBe(1);
      expect(sign(-5)).toBe(-1);
      expect(sign(0)).toBe(0);
      expect(sign(-0)).toBe(-0);
      expect(isNaN(sign(NaN) as number)).toBe(true);

      // Restore original
      Math.sign = originalSign;
    });
  });

  describe('sqrt (square root)', () => {
    it('should return square root of positive numbers', () => {
      expect(sqrt(4)).toBe(2);
      expect(sqrt(9)).toBe(3);
      expect(sqrt(16)).toBe(4);
      expect(sqrt(0)).toBe(0);
    });

    it('should return NaN for negative numbers', () => {
      expect(isNaN(sqrt(-1) as number)).toBe(true);
      expect(isNaN(sqrt(-4) as number)).toBe(true);
    });

    it('should return undefined for undefined input', () => {
      expect(sqrt(undefined)).toBe(undefined);
    });

    it('should handle special values', () => {
      expect(sqrt(Infinity)).toBe(Infinity);
      expect(isNaN(sqrt(NaN) as number)).toBe(true);
    });
  });

  describe('trunc (truncate)', () => {
    it('should truncate towards zero', () => {
      expect(trunc(3.2)).toBe(3);
      expect(trunc(3.8)).toBe(3);
      expect(trunc(-3.2)).toBe(-3);
      expect(trunc(-3.8)).toBe(-3);
    });

    it('should return integer unchanged', () => {
      expect(trunc(5)).toBe(5);
      expect(trunc(-5)).toBe(-5);
      expect(trunc(0)).toBe(0);
    });

    it('should return undefined for undefined input', () => {
      expect(trunc(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalTrunc = Math.trunc;
      // temporarily remove Math.trunc to test fallback
      delete (Math as any).trunc;

      expect(trunc(3.2)).toBe(3);
      expect(trunc(3.8)).toBe(3);
      expect(trunc(-3.2)).toBe(-3);
      expect(trunc(-3.8)).toBe(-3);
      expect(trunc(0)).toBe(0);

      // Restore original
      Math.trunc = originalTrunc;
    });
  });

  describe('cbrt (cube root)', () => {
    it('should return cube root of positive numbers', () => {
      expect(cbrt(8)).toBe(2);
      expect(cbrt(27)).toBe(3);
      expect(cbrt(0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(cbrt(-8)).toBe(-2);
      expect(cbrt(-27)).toBe(-3);
    });

    it('should return undefined for undefined input', () => {
      expect(cbrt(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalCbrt = Math.cbrt;
      // temporarily remove Math.cbrt to test fallback
      delete (Math as any).cbrt;

      expect(cbrt(8)).toBeCloseTo(2);
      expect(cbrt(27)).toBeCloseTo(3);
      expect(cbrt(-8)).toBeCloseTo(-2);
      expect(cbrt(-27)).toBeCloseTo(-3);
      expect(cbrt(0)).toBe(0);

      // Restore original
      Math.cbrt = originalCbrt;
    });
  });

  describe('exp (exponential)', () => {
    it('should return e raised to the power of x', () => {
      expect(exp(0)).toBe(1);
      expect(exp(1)).toBeCloseTo(Math.E);
      expect(exp(2)).toBeCloseTo(Math.E * Math.E);
    });

    it('should return undefined for undefined input', () => {
      expect(exp(undefined)).toBe(undefined);
    });

    it('should handle special values', () => {
      expect(exp(Infinity)).toBe(Infinity);
      expect(exp(-Infinity)).toBe(0);
      expect(isNaN(exp(NaN) as number)).toBe(true);
    });
  });

  describe('expm1 (exp(x) - 1)', () => {
    it('should return exp(x) - 1', () => {
      expect(expm1(0)).toBe(0);
      expect(expm1(1)).toBeCloseTo(Math.E - 1);
    });

    it('should return undefined for undefined input', () => {
      expect(expm1(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalExpm1 = Math.expm1;
      // temporarily remove Math.expm1 to test fallback
      delete (Math as any).expm1;

      expect(expm1(0)).toBe(0);
      expect(expm1(1)).toBeCloseTo(Math.E - 1);

      // Restore original
      Math.expm1 = originalExpm1;
    });
  });

  describe('log (natural logarithm)', () => {
    it('should return natural logarithm', () => {
      expect(log(1)).toBe(0);
      expect(log(Math.E)).toBeCloseTo(1);
    });

    it('should return undefined for undefined input', () => {
      expect(log(undefined)).toBe(undefined);
    });

    it('should handle special values', () => {
      expect(log(0)).toBe(-Infinity);
      expect(isNaN(log(-1) as number)).toBe(true);
      expect(log(Infinity)).toBe(Infinity);
    });
  });

  describe('log1p (log(1 + x))', () => {
    it('should return log(1 + x)', () => {
      expect(log1p(0)).toBe(0);
      expect(log1p(Math.E - 1)).toBeCloseTo(1);
    });

    it('should return undefined for undefined input', () => {
      expect(log1p(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalLog1p = Math.log1p;
      // temporarily remove Math.log1p to test fallback
      delete (Math as any).log1p;

      expect(log1p(0)).toBe(0);
      expect(log1p(Math.E - 1)).toBeCloseTo(1);

      // Restore original
      Math.log1p = originalLog1p;
    });
  });

  describe('log2 (base-2 logarithm)', () => {
    it('should return base-2 logarithm', () => {
      expect(log2(1)).toBe(0);
      expect(log2(2)).toBe(1);
      expect(log2(8)).toBe(3);
    });

    it('should return undefined for undefined input', () => {
      expect(log2(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalLog2 = Math.log2;
      // temporarily remove Math.log2 to test fallback
      delete (Math as any).log2;

      expect(log2(1)).toBe(0);
      expect(log2(2)).toBeCloseTo(1);
      expect(log2(8)).toBeCloseTo(3);

      // Restore original
      Math.log2 = originalLog2;
    });
  });

  describe('log10 (base-10 logarithm)', () => {
    it('should return base-10 logarithm', () => {
      expect(log10(1)).toBe(0);
      expect(log10(10)).toBe(1);
      expect(log10(100)).toBe(2);
    });

    it('should return undefined for undefined input', () => {
      expect(log10(undefined)).toBe(undefined);
    });

    // Test fallback implementation
    it('should work with fallback implementation', () => {
      const originalLog10 = Math.log10;
      // temporarily remove Math.log10 to test fallback
      delete (Math as any).log10;

      expect(log10(1)).toBe(0);
      expect(log10(10)).toBeCloseTo(1);
      expect(log10(100)).toBeCloseTo(2);

      // Restore original
      Math.log10 = originalLog10;
    });
  });

  describe('Edge cases and comprehensive coverage', () => {
    it('should handle all functions with undefined input', () => {
      const functions = [
        neg, abs, ceil, floor, round, sign, sqrt, trunc,
        cbrt, exp, expm1, log, log1p, log2, log10
      ];

      functions.forEach(fn => {
        expect(fn(undefined)).toBe(undefined);
      });
    });

    it('should handle pos function overloads correctly', () => {
      // Test all the overloaded cases
      expect(pos(undefined)).toBe(undefined);
      expect(pos(42)).toBe(42);
      expect(pos('42')).toBe(42);
      expect(pos(true)).toBe(1);
      expect(pos(false)).toBe(0);
    });

    it('should handle very large and very small numbers', () => {
      expect(abs(Number.MAX_VALUE)).toBe(Number.MAX_VALUE);
      expect(abs(Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
      expect(sqrt(Number.MAX_VALUE)).toBe(Math.sqrt(Number.MAX_VALUE));
    });
  });
});
