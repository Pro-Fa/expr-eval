/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Array and String Functions TypeScript Test', function () {
  describe('sum(array)', function () {
    it('should return zero with an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sum([])'), 0);
    });
    it('should work on a single-element array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sum([5])'), 5);
    });
    it('should work on a multi-element array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sum([1, 2, 3, 4])'), 10);
      assert.strictEqual(parser.evaluate('sum([1.5, 2.5, 3.5])'), 7.5);
    });
    it('should return undefined if one of the arguments is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sum(undefined)'), undefined);
    });
    it('should return undefined if the array includes undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sum([1, undefined, 3])'), undefined);
    });
  });

  describe('count(array)', function () {
    it('should return zero with an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('count([])'), 0);
    });
    it('should work on a single-element array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('count([5])'), 1);
    });
    it('should work on a multi-element array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('count([1, 2, 3, 4])'), 4);
      assert.strictEqual(parser.evaluate('count(["a", "b", "c"])'), 3);
    });
    it('should return undefined if the argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('count(undefined)'), undefined);
    });
    it('should count arrays containing undefined elements', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('count([1, undefined, 3])'), 3);
    });
  });

  describe('join(sep, array)', function () {
    it('should return an empty string on an empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('join(",", [])'), '');
    });
    it('should work on a single-element array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('join(",", [1])'), '1');
    });
    it('should work on multi-element arrays', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('join(",", [1, 2, 3])'), '1,2,3');
      assert.strictEqual(parser.evaluate('join(" - ", ["a", "b", "c"])'), 'a - b - c');
    });
    it('should return undefined if one of the arguments is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('join(undefined, [1, 2])'), undefined);
      assert.strictEqual(parser.evaluate('join(",", undefined)'), undefined);
    });
  });

  describe('indexOf(target, array)', function () {
    it('should return -1 for empty array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf(1, [])'), -1);
    });
    it('should find values in the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf(2, [1, 2, 3])'), 1);
      assert.strictEqual(parser.evaluate('indexOf("b", ["a", "b", "c"])'), 1);
    });
    it('should find the first matching value in the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf(2, [1, 2, 3, 2])'), 1);
    });
    it('should return -1 for no match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf(5, [1, 2, 3])'), -1);
    });
    it('should return undefined if undefined is passed as the array', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf(1, undefined)'), undefined);
    });
  });

  describe('indexOf(target, string)', function () {
    it('should return -1 for indexOf("x", "")', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("x", "")'), -1);
    });
    it('should return 0 for indexOf("", *)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("", "hello")'), 0);
      assert.strictEqual(parser.evaluate('indexOf("", "")'), 0);
    });
    it('should find substrings in the string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("ell", "hello")'), 1);
      assert.strictEqual(parser.evaluate('indexOf("o", "hello")'), 4);
    });
    it('should find the first matching substring in the string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("l", "hello")'), 2);
    });
    it('should find the entire string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("hello", "hello")'), 0);
    });
    it('should return -1 for no match', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("xyz", "hello")'), -1);
    });
    it('should return undefined if undefined is passed as the string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('indexOf("x", undefined)'), undefined);
    });
  });

  describe('json(content)', function () {
    it('should stringify null as null', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('json(nullValue)', { nullValue: null }), 'null');
    });
    it('should stringify arrays', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('json([1, 2, 3])'), '[1,2,3]');
      assert.strictEqual(parser.evaluate('json(emptyArray)', { emptyArray: [] }), '[]');
    });
    it('should stringify objects', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('json({a: 1, b: 2})'), '{"a":1,"b":2}');
    });
  });
});
