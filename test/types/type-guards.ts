import { expect, describe, it } from 'vitest';
import {
  isPrimitive,
  isFunction,
  isValueObject,
  isValueArray,
  isNumeric
} from '../../src/types/type-guards.js';
import type { Value } from '../../src/types/values.js';

describe('Type Guards', () => {
  describe('isPrimitive', () => {
    it('should return true for null', () => {
      expect(isPrimitive(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isPrimitive(undefined)).toBe(true);
    });

    it('should return true for numbers', () => {
      expect(isPrimitive(42)).toBe(true);
      expect(isPrimitive(3.14)).toBe(true);
      expect(isPrimitive(0)).toBe(true);
      expect(isPrimitive(-5)).toBe(true);
      expect(isPrimitive(NaN)).toBe(true);
      expect(isPrimitive(Infinity)).toBe(true);
    });

    it('should return true for strings', () => {
      expect(isPrimitive('')).toBe(true);
      expect(isPrimitive('hello')).toBe(true);
      expect(isPrimitive('123')).toBe(true);
    });

    it('should return true for booleans', () => {
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
    });

    it('should return false for objects', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive({ a: 1 })).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive([1, 2, 3])).toBe(false);
    });

    it('should return false for functions', () => {
      const syncFunc = (x: number) => x * 2;
      const asyncFunc = async (x: number) => x * 2;
      expect(isPrimitive(syncFunc)).toBe(false);
      expect(isPrimitive(asyncFunc)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for sync functions', () => {
      const syncFunc = (x: number) => x * 2;
      expect(isFunction(syncFunc)).toBe(true);
    });

    it('should return true for async functions', () => {
      const asyncFunc = async (x: number) => x * 2;
      expect(isFunction(asyncFunc)).toBe(true);
    });

    it('should return true for built-in functions', () => {
      expect(isFunction(Math.sin)).toBe(true);
      expect(isFunction(parseInt)).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(42)).toBe(false);
      expect(isFunction('function')).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
    });
  });

  describe('isValueObject', () => {
    it('should return true for plain objects', () => {
      expect(isValueObject({})).toBe(true);
      expect(isValueObject({ a: 1, b: 2 })).toBe(true);
      expect(isValueObject({ nested: { value: true } })).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValueObject(null)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isValueObject([])).toBe(false);
      expect(isValueObject([1, 2, 3])).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isValueObject(42)).toBe(false);
      expect(isValueObject('string')).toBe(false);
      expect(isValueObject(true)).toBe(false);
      expect(isValueObject(undefined)).toBe(false);
    });

    it('should return false for functions', () => {
      const syncFunc = (x: number) => x * 2;
      expect(isValueObject(syncFunc)).toBe(false);
      expect(isValueObject(Math.sin)).toBe(false);
    });
  });

  describe('isValueArray', () => {
    it('should return true for empty arrays', () => {
      expect(isValueArray([])).toBe(true);
    });

    it('should return true for arrays with elements', () => {
      expect(isValueArray([1, 2, 3])).toBe(true);
      expect(isValueArray(['a', 'b', 'c'])).toBe(true);
      expect(isValueArray([true, false])).toBe(true);
    });

    it('should return true for nested arrays', () => {
      expect(isValueArray([[1, 2], [3, 4]])).toBe(true);
    });

    it('should return true for mixed type arrays', () => {
      expect(isValueArray([1, 'a', true, null])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isValueArray(null)).toBe(false);
      expect(isValueArray(undefined)).toBe(false);
      expect(isValueArray({})).toBe(false);
      expect(isValueArray(42)).toBe(false);
      expect(isValueArray('string')).toBe(false);
      expect(isValueArray(true)).toBe(false);
      const syncFunc = (x: number) => x * 2;
      expect(isValueArray(syncFunc)).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should return true for valid numbers', () => {
      expect(isNumeric(42)).toBe(true);
      expect(isNumeric(3.14)).toBe(true);
      expect(isNumeric(0)).toBe(true);
      expect(isNumeric(-5)).toBe(true);
      expect(isNumeric(Infinity)).toBe(true);
      expect(isNumeric(-Infinity)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumeric(NaN)).toBe(false);
    });

    it('should return true for numeric strings', () => {
      expect(isNumeric('42')).toBe(true);
      expect(isNumeric('3.14')).toBe(true);
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('-5')).toBe(true);
      expect(isNumeric('123.456')).toBe(true);
    });

    it('should return true for numeric strings with whitespace', () => {
      expect(isNumeric(' 42 ')).toBe(true);
      expect(isNumeric('\t123\n')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isNumeric('hello')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('abc123')).toBe(false);
      expect(isNumeric('')).toBe(false);
      expect(isNumeric(' ')).toBe(false);
      expect(isNumeric('\t\n')).toBe(false);
    });

    it('should return false for non-string, non-number values', () => {
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
      expect(isNumeric(true)).toBe(false);
      expect(isNumeric(false)).toBe(false);
      expect(isNumeric({})).toBe(false);
      expect(isNumeric([])).toBe(false);
      const syncFunc = (x: number) => x * 2;
      expect(isNumeric(syncFunc)).toBe(false);
    });

    it('should handle edge cases for numeric strings', () => {
      expect(isNumeric('1e10')).toBe(true);
      expect(isNumeric('1E-5')).toBe(true);
      expect(isNumeric('0x10')).toBe(true);
      expect(isNumeric('0b101')).toBe(true);
      expect(isNumeric('0o777')).toBe(true);
    });
  });

  describe('type guard narrowing', () => {
    it('should narrow types correctly with isPrimitive', () => {
      const value: Value = 42;

      if (isPrimitive(value)) {
        // TypeScript should know value is Primitive here
        expect(typeof value).toBe('number');
      }
    });

    it('should narrow types correctly with isFunction', () => {
      const value: Value = Math.sin;

      if (isFunction(value)) {
        // TypeScript should know value is ExpressionFunction here
        expect(typeof value).toBe('function');
        expect(typeof value(Math.PI / 2)).toBe('number');
      }
    });

    it('should narrow types correctly with isValueObject', () => {
      const value: Value = { test: 123 };

      if (isValueObject(value)) {
        // TypeScript should know value is ValueObject here
        expect(typeof value).toBe('object');
        expect(value.test).toBe(123);
      }
    });

    it('should narrow types correctly with isValueArray', () => {
      const value: Value = [1, 2, 3];

      if (isValueArray(value)) {
        // TypeScript should know value is ValueArray here
        expect(Array.isArray(value)).toBe(true);
        expect(value.length).toBe(3);
      }
    });
  });
});
