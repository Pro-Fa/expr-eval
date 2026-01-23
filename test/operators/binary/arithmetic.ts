import { describe, it, expect } from 'vitest';
import {
  add,
  sub,
  mul,
  div,
  mod,
  pow
} from '../../../src/operators/binary/arithmetic.js';

describe('Binary Arithmetic Operators', () => {
  describe('add', () => {
    describe('with numbers', () => {
      it('should add two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
        expect(add(10, 20)).toBe(30);
      });

      it('should add two negative numbers', () => {
        expect(add(-2, -3)).toBe(-5);
        expect(add(-10, -20)).toBe(-30);
      });

      it('should add positive and negative numbers', () => {
        expect(add(5, -3)).toBe(2);
        expect(add(-5, 3)).toBe(-2);
      });

      it('should handle zero', () => {
        expect(add(0, 5)).toBe(5);
        expect(add(5, 0)).toBe(5);
        expect(add(0, 0)).toBe(0);
      });

      it('should handle floating point numbers', () => {
        expect(add(1.5, 2.5)).toBe(4);
        expect(add(0.1, 0.2)).toBeCloseTo(0.3);
      });

      it('should handle special numeric values', () => {
        expect(add(Infinity, 1)).toBe(Infinity);
        expect(add(-Infinity, 1)).toBe(-Infinity);
        expect(add(Infinity, -Infinity)).toBeNaN();
        expect(add(NaN, 1)).toBeNaN();
        expect(add(1, NaN)).toBeNaN();
      });
    });

    describe('with undefined', () => {
      it('should return undefined when first operand is undefined', () => {
        expect(add(undefined, 5)).toBe(undefined);
        expect(add(undefined, 'hello')).toBe(undefined);
        expect(add(undefined, [1, 2])).toBe(undefined);
        expect(add(undefined, { a: 1 })).toBe(undefined);
      });

      it('should return undefined when second operand is undefined', () => {
        expect(add(5, undefined)).toBe(undefined);
        expect(add('hello', undefined)).toBe(undefined);
        expect(add([1, 2], undefined)).toBe(undefined);
        expect(add({ a: 1 }, undefined)).toBe(undefined);
      });

      it('should return undefined when both operands are undefined', () => {
        expect(add(undefined, undefined)).toBe(undefined);
      });
    });

    describe('with strings', () => {
      it('should add numeric strings as numbers', () => {
        expect(add('2', '3')).toBe(5);
        expect(add('10', '20')).toBe(30);
        expect(add('1.5', '2.5')).toBe(4);
      });

      it('should add number and numeric string', () => {
        expect(add(2, '3')).toBe(5);
        expect(add('2', 3)).toBe(5);
      });

      it('should concatenate when string cannot be converted to number', () => {
        expect(add('hello', 'world')).toBe('helloworld');
        expect(add('hello', ' world')).toBe('hello world');
      });

      it('should concatenate when one string is non-numeric', () => {
        expect(add('hello', 5)).toBe('hello5');
        expect(add(5, 'hello')).toBe('5hello');
        expect(add('abc', '123')).toBe('abc123');
        expect(add('123', 'abc')).toBe('123abc');
      });

      it('should handle empty strings', () => {
        expect(add('', '')).toBe(0); // Empty string converts to 0
        expect(add('', '5')).toBe(5);
        expect(add('5', '')).toBe(5);
        expect(add('', 'hello')).toBe('hello');
        expect(add('hello', '')).toBe('hello');
      });

      it('should handle whitespace strings', () => {
        expect(add('  ', '  ')).toBe(0); // Whitespace converts to 0
        expect(add('  5  ', '  3  ')).toBe(8);
      });
    });

    describe('with arrays', () => {
      it('should concatenate two arrays', () => {
        expect(add([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
        expect(add(['a', 'b'], ['c', 'd'])).toEqual(['a', 'b', 'c', 'd']);
      });

      it('should handle empty arrays', () => {
        expect(add([], [])).toEqual([]);
        expect(add([1, 2], [])).toEqual([1, 2]);
        expect(add([], [3, 4])).toEqual([3, 4]);
      });

      it('should concatenate arrays with mixed types', () => {
        expect(add([1, 'a'], [true, null])).toEqual([1, 'a', true, null]);
      });

      it('should concatenate nested arrays', () => {
        expect(add([[1, 2]], [[3, 4]])).toEqual([[1, 2], [3, 4]]);
      });

      it('should not mutate original arrays', () => {
        const a = [1, 2];
        const b = [3, 4];
        const result = add(a, b);
        expect(result).toEqual([1, 2, 3, 4]);
        expect(a).toEqual([1, 2]);
        expect(b).toEqual([3, 4]);
      });
    });

    describe('with objects', () => {
      it('should merge two objects', () => {
        expect(add({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
      });

      it('should handle empty objects', () => {
        expect(add({}, {})).toEqual({});
        expect(add({ a: 1 }, {})).toEqual({ a: 1 });
        expect(add({}, { b: 2 })).toEqual({ b: 2 });
      });

      it('should override properties with second object (shallow merge)', () => {
        expect(add({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
      });

      it('should handle nested objects (shallow merge)', () => {
        const result = add({ a: { x: 1 } }, { b: { y: 2 } });
        expect(result).toEqual({ a: { x: 1 }, b: { y: 2 } });
      });

      it('should not mutate original objects', () => {
        const a = { x: 1 };
        const b = { y: 2 };
        const result = add(a, b);
        expect(result).toEqual({ x: 1, y: 2 });
        expect(a).toEqual({ x: 1 });
        expect(b).toEqual({ y: 2 });
      });
    });

    describe('with incompatible types', () => {
      it('should throw error when adding number and array', () => {
        expect(() => add(5, [1, 2])).toThrow('Cannot add values of incompatible types');
        expect(() => add([1, 2], 5)).toThrow('Cannot add values of incompatible types');
      });

      it('should throw error when adding number and object', () => {
        expect(() => add(5, { a: 1 })).toThrow('Cannot add values of incompatible types');
        expect(() => add({ a: 1 }, 5)).toThrow('Cannot add values of incompatible types');
      });

      it('should throw error when adding array and object', () => {
        expect(() => add([1, 2], { a: 1 })).toThrow('Cannot add values of incompatible types');
        expect(() => add({ a: 1 }, [1, 2])).toThrow('Cannot add values of incompatible types');
      });

      it('should throw error when adding boolean and array', () => {
        expect(() => add(true, [1, 2])).toThrow('Cannot add values of incompatible types');
        expect(() => add([1, 2], false)).toThrow('Cannot add values of incompatible types');
      });

      it('should throw error when adding boolean and object', () => {
        expect(() => add(true, { a: 1 })).toThrow('Cannot add values of incompatible types');
        expect(() => add({ a: 1 }, false)).toThrow('Cannot add values of incompatible types');
      });
    });
  });
});
