/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Array-First Argument Order', function () {
  describe('map(array, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map([1, 2, 3], x => x * 2)'), [2, 4, 6]);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x * 2, [1, 2, 3])'), [2, 4, 6]);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map([-1, -2, 3], abs)'), [1, 2, 3]);
    });
    it('should work with array-first and self-defined functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(x) = x * x; map([1, 2, 3], f)'), [1, 4, 9]);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map([10, 20, 30], (val, idx) => val + idx)'), [10, 21, 32]);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('map(undefined, x => x * 2)'), undefined);
    });
  });

  describe('filter(array, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter([1, 2, 3, 4, 5], x => x > 2)'), [3, 4, 5]);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(x => x > 2, [1, 2, 3, 4, 5])'), [3, 4, 5]);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter([1, 0, false, true, 2, ""], not)'), [0, false, '']);
    });
    it('should work with array-first and self-defined functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(x) = x > 2; filter([1, 2, 0, 3, -1, 4], f)'), [3, 4]);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter([1, 0, 5, 3, 2], (a, i) => a <= i)'), [0, 3, 2]);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('filter(undefined, x => x > 0)'), undefined);
    });
  });

  describe('fold(array, init, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold([1, 2, 3, 4, 5], 0, (acc, x) => acc + x)'), 15);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold((acc, x) => acc + x, 0, [1, 2, 3, 4, 5])'), 15);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold([1, 3, 5, 4, 2, 0], -1, max)'), 5);
    });
    it('should work with array-first and self-defined functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, b) = a * b; fold([1, 2, 3, 4, 5], 1, f)'), 120);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold([1, 3, 5, 7, 9], 100, (a, b, i) => a * i + b)'), 193);
    });
    it('should return the initial value on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold([], 15, atan2)'), 15);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold(undefined, 0, (a, b) => a + b)'), undefined);
    });
  });

  describe('reduce(array, init, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reduce([1, 2, 3, 4], 0, (acc, x) => acc + x)'), 10);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reduce((acc, x) => acc + x, 0, [1, 2, 3, 4])'), 10);
    });
  });

  describe('find(array, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find([1, 2, 3, 4], x => x > 2)'), 3);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find(x => x > 2, [1, 2, 3, 4])'), 3);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find([1, 2, 0, 3], not)'), 0);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find([10, 20, 30, 40, 50], (a, i) => i > 2)'), 40);
    });
    it('should return undefined if not found', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find([1, 2, 3, 4], x => x > 10)'), undefined);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find(undefined, x => x > 0)'), undefined);
    });
  });

  describe('some(array, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some([1, 2, 3, 4], x => x > 2)'), true);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some(x => x > 2, [1, 2, 3, 4])'), true);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some([1, 2, 0, 3], not)'), true);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some([10, 20, 30], (a, i) => i > 1)'), true);
    });
    it('should return false if none match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some([1, 2, 3, 4], x => x > 10)'), false);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some(undefined, x => x > 0)'), undefined);
    });
  });

  describe('every(array, f)', function () {
    it('should work with array-first order', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every([1, 2, 3, 4], x => x > 0)'), true);
    });
    it('should still work with function-first order (backwards compatible)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every(x => x > 0, [1, 2, 3, 4])'), true);
    });
    it('should work with array-first and built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every([0, false, ""], not)'), true);
    });
    it('should work with array-first and index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every([10, 20, 30], (a, i) => i < 5)'), true);
    });
    it('should return false if any do not match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every([1, 2, 3, 4], x => x > 2)'), false);
    });
    it('should return undefined for array-first with undefined array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every(undefined, x => x > 0)'), undefined);
    });
    it('should return true on empty arrays (vacuous truth)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every([], x => x > 0)'), true);
    });
  });

  describe('Complex expressions with array-first order', function () {
    it('should work with nested map calls', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map([[1, 2], [3, 4]], row => map(row, x => x * 2))'),
        [[2, 4], [6, 8]]
      );
    });
    it('should work with chained operations', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(filter([1, 2, 3, 4, 5], x => x > 2), x => x * 2)'),
        [6, 8, 10]
      );
    });
    it('should work with fold and filter combination', function () {
      const parser = new Parser();
      assert.strictEqual(
        parser.evaluate('fold(filter([1, 2, 3, 4, 5], x => x % 2 == 0), 0, (acc, x) => acc + x)'),
        6
      );
    });
    it('should work with variable arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(items, x => x * 2)', { items: [1, 2, 3] }),
        [2, 4, 6]
      );
    });
    it('should work with object property access', function () {
      const parser = new Parser();
      const users = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
      assert.deepStrictEqual(
        parser.evaluate('map(users, x => x.name)', { users }),
        ['Alice', 'Bob']
      );
    });
    it('should work with find and object filtering', function () {
      const parser = new Parser();
      const users = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
      const result = parser.evaluate('find(users, x => x.age > 26)', { users });
      assert.ok(result !== undefined);
      assert.strictEqual((result as { name: string }).name, 'Bob');
    });
  });
});
