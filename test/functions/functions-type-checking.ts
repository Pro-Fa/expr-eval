/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Type Checking Functions TypeScript Test', function () {
  describe('isArray(value)', function () {
    it('should return true for arrays', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isArray([])'), true);
      assert.strictEqual(parser.evaluate('isArray([1, 2, 3])'), true);
      assert.strictEqual(parser.evaluate('isArray(["a", "b"])'), true);
    });
    it('should return false for non-arrays', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isArray(123)'), false);
      assert.strictEqual(parser.evaluate('isArray("hello")'), false);
      assert.strictEqual(parser.evaluate('isArray(true)'), false);
      assert.strictEqual(parser.evaluate('isArray(null)'), false);
      assert.strictEqual(parser.evaluate('isArray(undefined)'), false);
      assert.strictEqual(parser.evaluate('isArray({a: 1})'), false);
    });
  });

  describe('isObject(value)', function () {
    it('should return true for objects', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isObject({})'), true);
      assert.strictEqual(parser.evaluate('isObject({a: 1, b: 2})'), true);
    });
    it('should return false for arrays', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isObject([])'), false);
      assert.strictEqual(parser.evaluate('isObject([1, 2, 3])'), false);
    });
    it('should return false for null', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isObject(null)'), false);
    });
    it('should return false for primitives', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isObject(123)'), false);
      assert.strictEqual(parser.evaluate('isObject("hello")'), false);
      assert.strictEqual(parser.evaluate('isObject(true)'), false);
      assert.strictEqual(parser.evaluate('isObject(undefined)'), false);
    });
  });

  describe('isNumber(value)', function () {
    it('should return true for numbers', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isNumber(123)'), true);
      assert.strictEqual(parser.evaluate('isNumber(0)'), true);
      assert.strictEqual(parser.evaluate('isNumber(-42.5)'), true);
      assert.strictEqual(parser.evaluate('isNumber(3.14)'), true);
    });
    it('should return false for non-numbers', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isNumber("123")'), false);
      assert.strictEqual(parser.evaluate('isNumber(true)'), false);
      assert.strictEqual(parser.evaluate('isNumber([])'), false);
      assert.strictEqual(parser.evaluate('isNumber({})'), false);
      assert.strictEqual(parser.evaluate('isNumber(null)'), false);
      assert.strictEqual(parser.evaluate('isNumber(undefined)'), false);
    });
  });

  describe('isString(value)', function () {
    it('should return true for strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isString("hello")'), true);
      assert.strictEqual(parser.evaluate('isString("")'), true);
      assert.strictEqual(parser.evaluate('isString("123")'), true);
    });
    it('should return false for non-strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isString(123)'), false);
      assert.strictEqual(parser.evaluate('isString(true)'), false);
      assert.strictEqual(parser.evaluate('isString([])'), false);
      assert.strictEqual(parser.evaluate('isString({})'), false);
      assert.strictEqual(parser.evaluate('isString(null)'), false);
      assert.strictEqual(parser.evaluate('isString(undefined)'), false);
    });
  });

  describe('isBoolean(value)', function () {
    it('should return true for booleans', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isBoolean(true)'), true);
      assert.strictEqual(parser.evaluate('isBoolean(false)'), true);
    });
    it('should return false for non-booleans', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isBoolean(0)'), false);
      assert.strictEqual(parser.evaluate('isBoolean(1)'), false);
      assert.strictEqual(parser.evaluate('isBoolean("true")'), false);
      assert.strictEqual(parser.evaluate('isBoolean([])'), false);
      assert.strictEqual(parser.evaluate('isBoolean({})'), false);
      assert.strictEqual(parser.evaluate('isBoolean(null)'), false);
      assert.strictEqual(parser.evaluate('isBoolean(undefined)'), false);
    });
  });

  describe('isNull(value)', function () {
    it('should return true for null', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isNull(null)'), true);
    });
    it('should return false for non-null values', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isNull(0)'), false);
      assert.strictEqual(parser.evaluate('isNull("")'), false);
      assert.strictEqual(parser.evaluate('isNull(false)'), false);
      assert.strictEqual(parser.evaluate('isNull([])'), false);
      assert.strictEqual(parser.evaluate('isNull({})'), false);
      assert.strictEqual(parser.evaluate('isNull(undefined)'), false);
    });
  });

  describe('isUndefined(value)', function () {
    it('should return true for undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isUndefined(undefined)'), true);
      assert.strictEqual(parser.evaluate('isUndefined(x)', { x: undefined }), true);
    });
    it('should return false for defined values', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isUndefined(0)'), false);
      assert.strictEqual(parser.evaluate('isUndefined("")'), false);
      assert.strictEqual(parser.evaluate('isUndefined(false)'), false);
      assert.strictEqual(parser.evaluate('isUndefined([])'), false);
      assert.strictEqual(parser.evaluate('isUndefined({})'), false);
      assert.strictEqual(parser.evaluate('isUndefined(null)'), false);
    });
  });

  describe('isFunction(value)', function () {
    it('should return true for functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('f(x) = x * 2; isFunction(f)'), true);
      assert.strictEqual(parser.evaluate('isFunction(abs)'), true);
      assert.strictEqual(parser.evaluate('isFunction(max)'), true);
    });
    it('should return false for non-functions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isFunction(123)'), false);
      assert.strictEqual(parser.evaluate('isFunction("hello")'), false);
      assert.strictEqual(parser.evaluate('isFunction(true)'), false);
      assert.strictEqual(parser.evaluate('isFunction([])'), false);
      assert.strictEqual(parser.evaluate('isFunction({})'), false);
      assert.strictEqual(parser.evaluate('isFunction(null)'), false);
      assert.strictEqual(parser.evaluate('isFunction(undefined)'), false);
    });
  });

  describe('Type checking combined usage', function () {
    it('should work in conditional expressions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('if(isArray([1,2]), "array", "not array")'), 'array');
      assert.strictEqual(parser.evaluate('if(isNumber(42), "number", "not number")'), 'number');
      assert.strictEqual(parser.evaluate('if(isString("test"), "string", "not string")'), 'string');
    });
    it('should work with filter', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(isNumber, [1, "a", 2, "b", 3])'), [1, 2, 3]);
    });
    it('should work with some and every', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('some(isString, [1, 2, "hello", 3])'), true);
      assert.strictEqual(parser.evaluate('every(isNumber, [1, 2, 3])'), true);
      assert.strictEqual(parser.evaluate('every(isNumber, [1, "a", 3])'), false);
    });
  });
});
