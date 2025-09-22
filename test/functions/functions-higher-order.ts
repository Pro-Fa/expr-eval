/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Higher-Order Functions TypeScript Test', function () {
  describe('filter(f, array)', function () {
    it('should work on an empty array', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(random, [])'), []);
    });
    it('should call built-in functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(not, [1, 0, false, true, 2, ""])'), [0, false, '']);
    });
    it('should call self-defined functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(x) = x > 2; filter(f, [1, 2, 0, 3, -1, 4])'), [3, 4]);
      assert.deepStrictEqual(parser.evaluate('f(x) = x > 2; filter(f, [1, 2, 0, 1.9, -1, -4])'), []);
    });
    it('should call self-defined functions with index', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(a, i) = a <= i; filter(f, [1,0,5,3,2])'), [0, 3, 2]);
      assert.deepStrictEqual(parser.evaluate('f(a, i) = i > 3; filter(f, [9,0,5,6,1,2,3,4])'), [1, 2, 3, 4]);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, i) = i > 3; filter(f, undefined)'), undefined);
    });
  });

  describe('fold(f, init, array)', function () {
    it('should return the initial value on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold(atan2, 15, [])'), 15);
    });
    it('should call built-in functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold(max, -1, [1, 3, 5, 4, 2, 0])'), 5);
      assert.strictEqual(parser.evaluate('fold(min, 10, [1, 3, 5, 4, 2, 0, -2, -1])'), -2);
    });
    it('should call self-defined functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; fold(f, 1, [1, 2, 3, 4, 5])'), 120);
    });
    it('should call self-defined functions with index', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, b, i) = a*i + b; fold(f, 100, [1,3,5,7,9])'), 193);
    });
    it('should start with the accumulator', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; fold(f, 0, [1, 2, 3, 4, 5])'), 0);
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; fold(f, 1, [1, 2, 3, 4, 5])'), 120);
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; fold(f, 2, [1, 2, 3, 4, 5])'), 240);
      assert.strictEqual(parser.evaluate('f(a, b) = a*b; fold(f, 3, [1, 2, 3, 4, 5])'), 360);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(a) = a*a; fold(f, 3, undefined)'), undefined);
    });
  });

  describe('map(f, a)', function () {
    it('should work on empty arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(abs, [])'), []);
    });
    it('should call built-in functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(abs, [-1, -2, 3])'), [1, 2, 3]);
    });
    it('should call self-defined functions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(x) = x * x; map(f, [1, 2, 3])'), [1, 4, 9]);
    });
    it('should call self-defined functions with index', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('f(value, index) = value + index; map(f, [10, 20, 30])'), [10, 21, 32]);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('map(abs, undefined)'), undefined);
    });
  });

  describe('gamma(x)', function () {
    it('returns exact answer for integers', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('gamma(1)'), 1);
      assert.strictEqual(parser.evaluate('gamma(2)'), 1);
      assert.strictEqual(parser.evaluate('gamma(3)'), 2);
      assert.strictEqual(parser.evaluate('gamma(4)'), 6);
      assert.strictEqual(parser.evaluate('gamma(5)'), 24);
    });
    it('returns approximation for fractions', function () {
      const parser = new Parser();
      const result = parser.evaluate('gamma(1.5)') as number;
      assert.ok(Math.abs(result - 0.8862269254527579) < 1e-10);
    });
    it('handles NaN and infinity correctly', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('gamma(0)'), Infinity);
      assert.strictEqual(parser.evaluate('gamma(-1)'), Infinity);
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('gamma(undefined)'), undefined);
    });
  });

  describe('roundTo()', function () {
    it('should handle roundTo(663)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(663)'), 663);
    });
    it('should handle roundTo(663, 0)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(663, 0)'), 663);
    });
    it('should handle roundTo(662.79)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(662.79)'), 663);
    });
    it('should handle roundTo(662.79, 1)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(662.79, 1)'), 662.8);
    });
    it('should handle roundTo(662.5, 1)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(662.5, 1)'), 662.5);
    });
    it('should handle roundTo(54.1, -1)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(54.1, -1)'), 50);
    });
    it('should handle roundTo(-23.67, 1)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(-23.67, 1)'), -23.7);
    });
    it('should handle roundTo(1.005, 2)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(1.005, 2)'), 1.01);
    });
    it('should make roundTo(-23, 1.2) NaN', function () {
      const parser = new Parser();
      assert.ok(Number.isNaN(parser.evaluate('roundTo(-23, 1.2)') as number));
    });
    it('should make roundTo(-23, "blah") NaN', function () {
      const parser = new Parser();
      assert.ok(Number.isNaN(parser.evaluate('roundTo(-23, "blah")') as number));
    });
    it('should handle roundTo(undefined, 2)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('roundTo(undefined, 2)'), undefined);
    });
  });

  describe('fac(n)', function () {
    it('should return n!', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fac(0)'), 1);
      assert.strictEqual(parser.evaluate('fac(1)'), 1);
      assert.strictEqual(parser.evaluate('fac(2)'), 2);
      assert.strictEqual(parser.evaluate('fac(3)'), 6);
      assert.strictEqual(parser.evaluate('fac(4)'), 24);
      assert.strictEqual(parser.evaluate('fac(5)'), 120);
      assert.strictEqual(parser.evaluate('fac(10)'), 3628800);
    });
    it('fac(undefined) evaluates to undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fac(undefined)'), undefined);
    });
  });
});
