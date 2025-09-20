/* global describe, it */

import assert from 'assert';
import { Parser } from '../dist/index.mjs';

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
