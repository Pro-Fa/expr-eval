/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('New Array Functions TypeScript Test', function () {
  describe('reduce(f, init, array)', function () {
    it('should work as an alias for fold', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reduce(max, -1, [1, 3, 5, 4, 2, 0])'), 5);
      assert.strictEqual(parser.evaluate('reduce(min, 10, [1, 3, 5, 4, 2, 0, -2, -1])'), -2);
    });
    it('should call self-defined functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; reduce(f, 1, [1, 2, 3, 4, 5])'), 120);
    });
    it('should return the initial value on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reduce(max, 15, [])'), 15);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(a) = a*a; reduce(f, 3, undefined)'), undefined);
    });
  });

  describe('find(f, array)', function () {
    it('should return the first matching element', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 2; find(f, [1, 2, 3, 4])'), 3);
      assert.strictEqual(parser.evaluate('f(x) = x > 10; find(f, [5, 12, 8, 20])'), 12);
    });
    it('should return undefined if no match is found', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 10; find(f, [1, 2, 3, 4])'), undefined);
    });
    it('should return undefined on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; find(f, [])'), undefined);
    });
    it('should work with built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('find(not, [1, 2, 0, 3])'), 0);
    });
    it('should work with index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, i) = i > 2; find(f, [10, 20, 30, 40, 50])'), 40);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; find(f, undefined)'), undefined);
    });
  });

  describe('some(f, array)', function () {
    it('should return true if at least one element matches', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 2; some(f, [1, 2, 3, 4])'), true);
      assert.strictEqual(parser.evaluate('f(x) = x < 0; some(f, [1, -5, 3, 4])'), true);
    });
    it('should return false if no elements match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 10; some(f, [1, 2, 3, 4])'), false);
    });
    it('should return false on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; some(f, [])'), false);
    });
    it('should work with built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some(not, [1, 2, 0, 3])'), true);
      assert.strictEqual(parser.evaluate('some(not, [1, 2, 3])'), false);
    });
    it('should work with index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, i) = i > 5; some(f, [10, 20, 30])'), false);
      assert.strictEqual(parser.evaluate('f(a, i) = i > 1; some(f, [10, 20, 30])'), true);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; some(f, undefined)'), undefined);
    });
  });

  describe('every(f, array)', function () {
    it('should return true if all elements match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; every(f, [1, 2, 3, 4])'), true);
    });
    it('should return false if any element does not match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 2; every(f, [1, 2, 3, 4])'), false);
    });
    it('should return true on an empty array (vacuous truth)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; every(f, [])'), true);
    });
    it('should work with built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('every(not, [0, false, ""])'), true);
      assert.strictEqual(parser.evaluate('every(not, [0, 1, false])'), false);
    });
    it('should work with index parameter', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, i) = i < 5; every(f, [10, 20, 30])'), true);
      assert.strictEqual(parser.evaluate('f(a, i) = i < 2; every(f, [10, 20, 30])'), false);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x > 0; every(f, undefined)'), undefined);
    });
  });

  describe('unique(array)', function () {
    it('should remove duplicate numbers', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('unique([1, 2, 2, 3, 3, 3, 4])'), [1, 2, 3, 4]);
    });
    it('should remove duplicate strings', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('unique(["a", "b", "a", "c", "b"])'), ['a', 'b', 'c']);
    });
    it('should work on empty arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('unique([])'), []);
    });
    it('should work on arrays with no duplicates', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('unique([1, 2, 3])'), [1, 2, 3]);
    });
    it('should handle mixed types', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('unique([1, "1", 2, "2", 1])'), [1, '1', 2, '2']);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('unique(undefined)'), undefined);
    });
  });

  describe('distinct(array)', function () {
    it('should work as an alias for unique', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('distinct([1, 2, 2, 3, 3, 3, 4])'), [1, 2, 3, 4]);
      assert.deepStrictEqual(parser.evaluate('distinct(["a", "b", "a", "c", "b"])'), ['a', 'b', 'c']);
    });
    it('should work on empty arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('distinct([])'), []);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('distinct(undefined)'), undefined);
    });
  });
});
