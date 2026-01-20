/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Object Functions TypeScript Test', function () {
  describe('merge(obj1, obj2, ...)', function () {
    it('should return empty object when called with no arguments', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('merge()'), {});
    });

    it('should return the object when called with one argument', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('merge({a: 1})'), { a: 1 });
    });

    it('should merge two objects', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('merge({a: 1}, {b: 2})'), { a: 1, b: 2 });
    });

    it('should override duplicate keys with later arguments', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('merge({a: 1, b: 2}, {b: 3, c: 4})'), { a: 1, b: 3, c: 4 });
    });

    it('should merge three or more objects', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('merge({a: 1}, {b: 2}, {c: 3})'),
        { a: 1, b: 2, c: 3 }
      );
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('merge({a: 1}, undefined)'), undefined);
      assert.strictEqual(parser.evaluate('merge(undefined, {a: 1})'), undefined);
    });

    it('should work with variables', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('merge(obj1, obj2)', { obj1: { x: 10 }, obj2: { y: 20 } }),
        { x: 10, y: 20 }
      );
    });
  });

  describe('keys(obj)', function () {
    it('should return empty array for empty object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('keys({})'), []);
    });

    it('should return keys of an object', function () {
      const parser = new Parser();
      const result = parser.evaluate('keys({a: 1, b: 2, c: 3})') as string[];
      assert.strictEqual(result.length, 3);
      assert(result.includes('a'));
      assert(result.includes('b'));
      assert(result.includes('c'));
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('keys(undefined)'), undefined);
    });

    it('should work with variables', function () {
      const parser = new Parser();
      const result = parser.evaluate('keys(obj)', { obj: { foo: 'bar', baz: 42 } }) as string[];
      assert.strictEqual(result.length, 2);
      assert(result.includes('foo'));
      assert(result.includes('baz'));
    });
  });

  describe('values(obj)', function () {
    it('should return empty array for empty object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('values({})'), []);
    });

    it('should return values of an object', function () {
      const parser = new Parser();
      const result = parser.evaluate('values({a: 1, b: 2, c: 3})') as number[];
      assert.strictEqual(result.length, 3);
      assert(result.includes(1));
      assert(result.includes(2));
      assert(result.includes(3));
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('values(undefined)'), undefined);
    });

    it('should work with variables', function () {
      const parser = new Parser();
      const result = parser.evaluate('values(obj)', { obj: { foo: 'bar', baz: 42 } });
      assert(Array.isArray(result));
      assert.strictEqual((result as any[]).length, 2);
      assert((result as any[]).includes('bar'));
      assert((result as any[]).includes(42));
    });
  });

  describe('flatten(obj)', function () {
    it('should return empty object for empty object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('flatten({})'), {});
    });

    it('should return same object for flat object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('flatten({a: 1, b: 2})'), { a: 1, b: 2 });
    });

    it('should flatten nested object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('flatten(obj)', { obj: { foo: { bar: 1 } } }),
        { foo_bar: 1 }
      );
    });

    it('should flatten deeply nested object', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('flatten(obj)', { obj: { a: { b: { c: 1 } } } }),
        { a_b_c: 1 }
      );
    });

    it('should handle mixed nested and flat keys', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('flatten(obj)', { obj: { a: 1, b: { c: 2, d: 3 }, e: 4 } }),
        { a: 1, b_c: 2, b_d: 3, e: 4 }
      );
    });

    it('should preserve arrays as values', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('flatten(obj)', { obj: { a: { b: [1, 2, 3] } } }),
        { a_b: [1, 2, 3] }
      );
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('flatten(undefined)'), undefined);
    });

    it('should use custom separator when provided', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('flatten(obj, ".")', { obj: { foo: { bar: 1 } } }),
        { 'foo.bar': 1 }
      );
    });
  });
});
