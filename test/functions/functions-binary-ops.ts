/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Binary Operators TypeScript Test', function () {
  describe('+ (addition)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 + 2'), 4);
      assert.strictEqual(parser.evaluate('2 + -6'), -4);
      assert.strictEqual(parser.evaluate('0 + 5'), 5);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 + undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined + 2'), undefined);
    });
    it('should concatenate non-numeric strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('"hello" + "world"'), 'helloworld');
      assert.strictEqual(parser.evaluate('"foo" + "bar"'), 'foobar');
      assert.strictEqual(parser.evaluate('"test" + "123"'), 'test123');
    });
    it('should add numeric strings as numbers', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('"5" + "3"'), 8);
      assert.strictEqual(parser.evaluate('"10" + "20"'), 30);
      assert.strictEqual(parser.evaluate('"0" + "5"'), 5);
    });
    it('should concatenate arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('[1, 2] + [3, 4]'), [1, 2, 3, 4]);
      assert.deepStrictEqual(parser.evaluate('[1] + [2, 3]'), [1, 2, 3]);
      assert.deepStrictEqual(parser.evaluate('[] + [1, 2]'), [1, 2]);
    });
    it('should merge objects', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('{a: 1} + {b: 2}'), { a: 1, b: 2 });
      assert.deepStrictEqual(parser.evaluate('{x: 10} + {y: 20}'), { x: 10, y: 20 });
      assert.deepStrictEqual(parser.evaluate('{a: 1, b: 2} + {c: 3}'), { a: 1, b: 2, c: 3 });
    });
    it('should handle object merging with overlapping keys', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('{a: 1} + {a: 2}'), { a: 2 });
      assert.deepStrictEqual(parser.evaluate('{x: 10, y: 20} + {y: 30}'), { x: 10, y: 30 });
    });
    it('should handle null values correctly', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('null + null'), {});
    });
    it('should convert numeric values to numbers before adding', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('true + 1'), 2);
      assert.strictEqual(parser.evaluate('false + 5'), 5);
      assert.strictEqual(parser.evaluate('1 + true'), 2);
    });
    it('should throw error for incompatible types', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('5 + [1, 2]'), /Cannot add values of incompatible types/);
      assert.throws(() => parser.evaluate('"text" + {a: 1}'), /Cannot add values of incompatible types/);
      assert.throws(() => parser.evaluate('[1, 2] + {a: 1}'), /Cannot add values of incompatible types/);
      assert.throws(() => parser.evaluate('5 + {x: 1}'), /Cannot add values of incompatible types/);
    });
  });

  describe('- (subtraction)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('10 - 6'), 4);
      assert.strictEqual(parser.evaluate('8 - 12'), -4);
      assert.strictEqual(parser.evaluate('0 - 5'), -5);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 - undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined - 2'), undefined);
    });
  });

  describe('* (multiplication)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 * 2'), 4);
      assert.strictEqual(parser.evaluate('2 * -2'), -4);
      assert.strictEqual(parser.evaluate('0 * 5'), 0);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 * undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined * 2'), undefined);
    });
  });

  describe('/ (division)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('12 / 3'), 4);
      assert.strictEqual(parser.evaluate('10 / -5'), -2);
      assert.strictEqual(parser.evaluate('0 / 5'), 0);
    });
    it('divide by 0', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('1 / 0'), Infinity);
      assert.strictEqual(parser.evaluate('-1 / 0'), -Infinity);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 / undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined / 2'), undefined);
    });
  });

  describe('% (modulus)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('10 % 3'), 1);
      assert.strictEqual(parser.evaluate('8 % 4'), 0);
      assert.strictEqual(parser.evaluate('7 % 2'), 1);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('8 % undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined % 2'), undefined);
    });
  });

  describe('^ (power)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 ^ 3'), 8);
      assert.strictEqual(parser.evaluate('5 ^ 2'), 25);
      assert.strictEqual(parser.evaluate('3 ^ 0'), 1);
    });
    it('should return undefined if any input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 ^ undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined ^ 3'), undefined);
    });
  });

  describe('== (equality)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('5 == 5'), true);
      assert.strictEqual(parser.evaluate('3 == 4'), false);
      assert.strictEqual(parser.evaluate('"hello" == "hello"'), true);
      assert.strictEqual(parser.evaluate('undefined == undefined'), true);
      assert.strictEqual(parser.evaluate('undefined == 1'), false);
    });
  });

  describe('!= (inequality)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('5 != 3'), true);
      assert.strictEqual(parser.evaluate('4 != 4'), false);
      assert.strictEqual(parser.evaluate('"a" != "b"'), true);
      assert.strictEqual(parser.evaluate('undefined != undefined'), false);
      assert.strictEqual(parser.evaluate('undefined != 1'), true);
    });
  });
});
