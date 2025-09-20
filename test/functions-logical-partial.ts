/* global describe, it */

import assert from 'assert';
import { Parser } from '../dist/index.mjs';

describe('Logical and Comparison Operators TypeScript Test', function () {
  describe('< (less than)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 < 3'), true);
      assert.strictEqual(parser.evaluate('3 < 2'), false);
      assert.strictEqual(parser.evaluate('3 < 3'), false);
      assert.strictEqual(parser.evaluate('-1 < 0'), true);
    });
  });

  describe('> (greater than)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('3 > 2'), true);
      assert.strictEqual(parser.evaluate('2 > 3'), false);
      assert.strictEqual(parser.evaluate('3 > 3'), false);
      assert.strictEqual(parser.evaluate('1 > -1'), true);
    });
  });

  describe('<= (less than or equal)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('2 <= 3'), true);
      assert.strictEqual(parser.evaluate('3 <= 3'), true);
      assert.strictEqual(parser.evaluate('4 <= 3'), false);
    });
  });

  describe('>= (greater than or equal)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('3 >= 2'), true);
      assert.strictEqual(parser.evaluate('3 >= 3'), true);
      assert.strictEqual(parser.evaluate('2 >= 3'), false);
    });
  });

  describe('and operator', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('1 and 1'), true);
      assert.strictEqual(parser.evaluate('1 and 0'), false);
      assert.strictEqual(parser.evaluate('0 and 1'), false);
      assert.strictEqual(parser.evaluate('0 and 0'), false);
      assert.strictEqual(parser.evaluate('true and true'), true);
      assert.strictEqual(parser.evaluate('true and false'), false);
    });
  });

  describe('or operator', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('1 or 0'), true);
      assert.strictEqual(parser.evaluate('0 or 1'), true);
      assert.strictEqual(parser.evaluate('1 or 1'), true);
      assert.strictEqual(parser.evaluate('0 or 0'), false);
      assert.strictEqual(parser.evaluate('true or false'), true);
      assert.strictEqual(parser.evaluate('false or false'), false);
    });
  });

  describe('not operator', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('not 1'), false);
      assert.strictEqual(parser.evaluate('not 0'), true);
      assert.strictEqual(parser.evaluate('not true'), false);
      assert.strictEqual(parser.evaluate('not false'), true);
      assert.strictEqual(parser.evaluate('not "text"'), false);
      assert.strictEqual(parser.evaluate('not ""'), true);
    });
  });

  describe('in operator', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('"a" in ["a", "b"]'), true);
      assert.strictEqual(parser.evaluate('"c" in ["a", "b"]'), false);
      assert.strictEqual(parser.evaluate('3 in [1, 2, 3]'), true);
      assert.strictEqual(parser.evaluate('4 in [1, 2, 3]'), false);
    });
  });

  describe('? : (conditional operator)', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('1 ? 2 : 3'), 2);
      assert.strictEqual(parser.evaluate('0 ? 2 : 3'), 3);
      assert.strictEqual(parser.evaluate('true ? "yes" : "no"'), 'yes');
      assert.strictEqual(parser.evaluate('false ? "yes" : "no"'), 'no');
    });
    it('should handle nested conditionals', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('1 ? 2 : 0 ? 3 : 4'), 2);
      assert.strictEqual(parser.evaluate('0 ? 2 : 1 ? 3 : 4'), 3);
      assert.strictEqual(parser.evaluate('0 ? 2 : 0 ? 3 : 4'), 4);
    });
  });

  describe('| (concatenation)', function () {
    it('should concatenate strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('"hello" | " " | "world"'), 'hello world');
      assert.strictEqual(parser.evaluate('"a" | "b" | "c"'), 'abc');
    });
    it('should concatenate arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('[1, 2] | [3, 4]'), [1, 2, 3, 4]);
      assert.deepStrictEqual(parser.evaluate('[1] | [2] | [3]'), [1, 2, 3]);
    });
  });
});
