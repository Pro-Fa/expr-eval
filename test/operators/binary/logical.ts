import { describe, it, expect } from 'vitest';
import {
  andOperator,
  orOperator,
  inOperator,
  notInOperator
} from '../../../src/operators/binary/logical.js';

describe('Binary Logical Operators', () => {
  describe('andOperator', () => {
    it('should return true when both operands are truthy', () => {
      expect(andOperator(1, 1)).toBe(true);
      expect(andOperator(true, 'hello')).toBe(true);
      expect(andOperator([], {})).toBe(true);
    });

    it('should return false when first operand is falsy', () => {
      expect(andOperator(0, 1)).toBe(false);
      expect(andOperator(false, true)).toBe(false);
      expect(andOperator(null, 'hello')).toBe(false);
      expect(andOperator(undefined, 1)).toBe(false);
      expect(andOperator('', 'hello')).toBe(false);
    });

    it('should return false when second operand is falsy', () => {
      expect(andOperator(1, 0)).toBe(false);
      expect(andOperator(true, false)).toBe(false);
      expect(andOperator('hello', null)).toBe(false);
      expect(andOperator(1, undefined)).toBe(false);
      expect(andOperator('hello', '')).toBe(false);
    });

    it('should return false when both operands are falsy', () => {
      expect(andOperator(0, 0)).toBe(false);
      expect(andOperator(false, false)).toBe(false);
      expect(andOperator(null, undefined)).toBe(false);
      expect(andOperator('', 0)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(andOperator(NaN, 1)).toBe(false);
      expect(andOperator(1, NaN)).toBe(false);
      expect(andOperator(-0, 1)).toBe(false);
      expect(andOperator(1, -0)).toBe(false);
    });
  });

  describe('orOperator', () => {
    it('should return true when first operand is truthy', () => {
      expect(orOperator(1, 0)).toBe(true);
      expect(orOperator(true, false)).toBe(true);
      expect(orOperator('hello', null)).toBe(true);
      expect(orOperator([], undefined)).toBe(true);
    });

    it('should return true when second operand is truthy', () => {
      expect(orOperator(0, 1)).toBe(true);
      expect(orOperator(false, true)).toBe(true);
      expect(orOperator(null, 'hello')).toBe(true);
      expect(orOperator(undefined, [])).toBe(true);
    });

    it('should return true when both operands are truthy', () => {
      expect(orOperator(1, 1)).toBe(true);
      expect(orOperator(true, 'hello')).toBe(true);
      expect(orOperator([], {})).toBe(true);
    });

    it('should return false when both operands are falsy', () => {
      expect(orOperator(0, 0)).toBe(false);
      expect(orOperator(false, false)).toBe(false);
      expect(orOperator(null, undefined)).toBe(false);
      expect(orOperator('', 0)).toBe(false);
      expect(orOperator(null, null)).toBe(false);
      expect(orOperator(undefined, undefined)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(orOperator(NaN, 0)).toBe(false);
      expect(orOperator(0, NaN)).toBe(false);
      expect(orOperator(-0, 0)).toBe(false);
      expect(orOperator(NaN, null)).toBe(false);
    });
  });

  describe('inOperator', () => {
    it('should return true when element is in array', () => {
      expect(inOperator(1, [1, 2, 3])).toBe(true);
      expect(inOperator('a', ['a', 'b', 'c'])).toBe(true);
      expect(inOperator(true, [true, false])).toBe(true);
    });

    it('should return false when element is not in array', () => {
      expect(inOperator(4, [1, 2, 3])).toBe(false);
      expect(inOperator('d', ['a', 'b', 'c'])).toBe(false);
      expect(inOperator(null, [1, 2, 3])).toBe(false);
    });

    it('should return false when array is undefined', () => {
      expect(inOperator(1, undefined)).toBe(false);
      expect(inOperator('a', undefined)).toBe(false);
      expect(inOperator(null, undefined)).toBe(false);
      expect(inOperator(undefined, undefined)).toBe(false);
    });

    it('should return false when array is empty', () => {
      expect(inOperator(1, [])).toBe(false);
      expect(inOperator('a', [])).toBe(false);
      expect(inOperator(null, [])).toBe(false);
    });

    it('should handle nested arrays and objects', () => {
      // Note: contains uses deep equality, not reference equality
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const nestedArray = [arr1, arr2];
      expect(inOperator(arr1, nestedArray)).toBe(true);

      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const objArray = [obj1, obj2];
      expect(inOperator(obj1, objArray)).toBe(true);

      expect(inOperator([1, 3], [[1, 2], [3, 4]])).toBe(false);
    });
  });

  describe('notInOperator', () => {
    it('should return false when element is in array', () => {
      expect(notInOperator(1, [1, 2, 3])).toBe(false);
      expect(notInOperator('a', ['a', 'b', 'c'])).toBe(false);
      expect(notInOperator(true, [true, false])).toBe(false);
    });

    it('should return true when element is not in array', () => {
      expect(notInOperator(4, [1, 2, 3])).toBe(true);
      expect(notInOperator('d', ['a', 'b', 'c'])).toBe(true);
      expect(notInOperator(null, [1, 2, 3])).toBe(true);
    });

    it('should return true when array is undefined', () => {
      expect(notInOperator(1, undefined)).toBe(true);
      expect(notInOperator('a', undefined)).toBe(true);
      expect(notInOperator(null, undefined)).toBe(true);
      expect(notInOperator(undefined, undefined)).toBe(true);
    });

    it('should return true when array is empty', () => {
      expect(notInOperator(1, [])).toBe(true);
      expect(notInOperator('a', [])).toBe(true);
      expect(notInOperator(null, [])).toBe(true);
    });

    it('should handle nested arrays and objects', () => {
      // Note: contains uses deep equality, not reference equality
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const nestedArray = [arr1, arr2];
      expect(notInOperator(arr1, nestedArray)).toBe(false);

      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const objArray = [obj1, obj2];
      expect(notInOperator(obj1, objArray)).toBe(false);

      expect(notInOperator([1, 3], [[1, 2], [3, 4]])).toBe(true);
    });
  });

  describe('Edge cases and type handling', () => {
    it('should handle mixed types in and operator', () => {
      expect(andOperator('0', true)).toBe(true); // both truthy
      expect(andOperator(0, 'true')).toBe(false); // first falsy
    });

    it('should handle mixed types in or operator', () => {
      expect(orOperator('0', false)).toBe(true); // first truthy
      expect(orOperator(0, 'false')).toBe(true); // second truthy
    });

    it('should handle special values in in operator', () => {
      expect(inOperator(0, [0, 1, 2])).toBe(true);
      expect(inOperator(false, [false, true])).toBe(true);
      expect(inOperator('', ['', 'hello'])).toBe(true);
      expect(inOperator(null, [null, undefined])).toBe(true);
      expect(inOperator(undefined, [null, undefined])).toBe(true);
    });

    it('should handle special values in notIn operator', () => {
      expect(notInOperator(0, [1, 2, 3])).toBe(true);
      expect(notInOperator(false, [true])).toBe(true);
      expect(notInOperator('', ['hello', 'world'])).toBe(true);
      expect(notInOperator(null, [1, 2, 3])).toBe(true);
      expect(notInOperator(undefined, [1, 2, 3])).toBe(true);
    });
  });
});
