/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Advanced Functions TypeScript Test', function () {
  describe('atan2(y, x)', function () {
    it('should return atan(y / x)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('atan2(1, 1)'), Math.atan2(1, 1));
      assert.strictEqual(parser.evaluate('atan2(1, 0)'), Math.atan2(1, 0));
      assert.strictEqual(parser.evaluate('atan2(0, 1)'), Math.atan2(0, 1));
      assert.strictEqual(parser.evaluate('atan2(-1, -1)'), Math.atan2(-1, -1));
    });
    it('should return undefined if one of the input values is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('atan2(undefined, 1)'), undefined);
      assert.strictEqual(parser.evaluate('atan2(1, undefined)'), undefined);
    });
  });

  describe('hypot(a, b, ...)', function () {
    it('should return the hypotenuse', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('hypot(3, 4)'), Math.hypot(3, 4));
      assert.strictEqual(parser.evaluate('hypot(5, 12)'), Math.hypot(5, 12));
      assert.strictEqual(parser.evaluate('hypot(1, 1, 1)'), Math.hypot(1, 1, 1));
    });
    it('should return undefined if one of the input values is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('hypot(undefined, 4)'), undefined);
      assert.strictEqual(parser.evaluate('hypot(3, undefined)'), undefined);
    });
  });

  describe('pow(x, y)', function () {
    it('should return x^y', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('pow(2, 3)'), Math.pow(2, 3));
      assert.strictEqual(parser.evaluate('pow(4, 0.5)'), Math.pow(4, 0.5));
      assert.strictEqual(parser.evaluate('pow(5, -1)'), Math.pow(5, -1));
    });
    it('should return undefined if one of the input values is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('pow(undefined, 3)'), undefined);
      assert.strictEqual(parser.evaluate('pow(2, undefined)'), undefined);
    });
  });

  describe('max(a, b, ...)', function () {
    it('should return the largest value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('max(1, 2)'), Math.max(1, 2));
      assert.strictEqual(parser.evaluate('max(5, 3, 8, 1)'), Math.max(5, 3, 8, 1));
      assert.strictEqual(parser.evaluate('max(-1, -5, -2)'), Math.max(-1, -5, -2));
    });
    it('should return undefined if one of the input values is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('max(undefined, 2)'), undefined);
      assert.strictEqual(parser.evaluate('max(1, undefined)'), undefined);
    });
  });

  describe('min(a, b, ...)', function () {
    it('should return the smallest value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('min(1, 2)'), Math.min(1, 2));
      assert.strictEqual(parser.evaluate('min(5, 3, 8, 1)'), Math.min(5, 3, 8, 1));
      assert.strictEqual(parser.evaluate('min(-1, -5, -2)'), Math.min(-1, -5, -2));
    });
    it('should return undefined if one of the input values is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('min(undefined, 2)'), undefined);
      assert.strictEqual(parser.evaluate('min(1, undefined)'), undefined);
    });
  });

  describe('random()', function () {
    it('should return a number from zero to 1', function () {
      const parser = new Parser();
      const result1 = parser.evaluate('random()') as number;
      const result2 = parser.evaluate('random()') as number;

      assert.strictEqual(typeof result1, 'number');
      assert.strictEqual(typeof result2, 'number');
      assert.ok(result1 >= 0 && result1 < 1);
      assert.ok(result2 >= 0 && result2 < 1);
    });
    it('should return different numbers', function () {
      const parser = new Parser();
      const results = new Set<number>();
      for (let i = 0; i < 100; i++) {
        results.add(parser.evaluate('random()') as number);
      }
      assert.ok(results.size > 50); // Should have many unique values
    });
  });

  describe('if(p, t, f)', function () {
    it('should return correct conditional values', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('if(1, 1, 0)'), 1);
      assert.strictEqual(parser.evaluate('if(0, 1, 0)'), 0);
      assert.strictEqual(parser.evaluate('if(1==1 or 2==1, 39, 0)'), 39);
      assert.strictEqual(parser.evaluate('if(1==1 or 1==2, -4 + 8, 0)'), 4);
      assert.strictEqual(parser.evaluate('if(3 && 6, if(45 > 5 * 11, 3 * 3, 2.4), 0)'), 2.4);
    });
    it('should handle undefined conditions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('if(1==undefined, 10, 0)'), 0);
      assert.strictEqual(parser.evaluate('if(2 > 5, 1, undefined)'), undefined);
    });
  });
});
