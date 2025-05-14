/* global describe, it */

'use strict';

var assert = require('assert');
var Parser = require('../dist/bundle').Parser;

describe('Binary Operators', function () {
  describe('+', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 + 2'), 4);
      assert.strictEqual(parser.evaluate('2 + -6'), -4);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 + undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined + 2'), undefined);
    });
  });

  describe('-', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('10 - 6'), 4);
      assert.strictEqual(parser.evaluate('8 - 12'), -4);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 - undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined - 2'), undefined);
    });
  });

  describe('*', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 * 2'), 4);
      assert.strictEqual(parser.evaluate('2 * -2'), -4);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 * undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined * 2'), undefined);
    });
  });

  describe('/', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('12 / 3'), 4);
      assert.strictEqual(parser.evaluate('12 / -3'), -4);
    });
    it('divide by 0', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('12 / 0'), Infinity);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 / undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined / 2'), undefined);
    });
  });

  describe('%', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('9 % 5'), 4);
      assert.strictEqual(parser.evaluate('-9 % 5'), -4);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('2 % undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined % 2'), undefined);
    });
  });

  describe('|', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('"a" | "b"'), 'ab');
      assert.deepStrictEqual(parser.evaluate('[0, 1] | [2, 3]'), [0, 1, 2, 3]);
    });
    it('should return undefined if any input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('"a" | undefined'), undefined);
      assert.strictEqual(parser.evaluate('undefined | "a"'), undefined);
    });
  });

  describe('==', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('1 == 1'), true);
      assert.strictEqual(parser.evaluate('"abc" == "abc"'), true);
      assert.strictEqual(parser.evaluate('true == true'), true);
      assert.strictEqual(parser.evaluate('undefined == undefined'), true);

      assert.strictEqual(parser.evaluate('1 == 2'), false);
      assert.strictEqual(parser.evaluate('"abc" == "def"'), false);
      assert.strictEqual(parser.evaluate('true == false'), false);
      assert.strictEqual(parser.evaluate('undefined == 1'), false);
    });
  });

  describe('!=', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('1 != 1'), false);
      assert.strictEqual(parser.evaluate('"abc" != "abc"'), false);
      assert.strictEqual(parser.evaluate('true != true'), false);
      assert.strictEqual(parser.evaluate('undefined != undefined'), false);

      assert.strictEqual(parser.evaluate('1 != 2'), true);
      assert.strictEqual(parser.evaluate('"abc" != "def"'), true);
      assert.strictEqual(parser.evaluate('true != false'), true);
      assert.strictEqual(parser.evaluate('undefined != 1'), true);
    });
  });

  describe('<', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('6 > 3'), true);
      assert.strictEqual(parser.evaluate('"def" > "abc"'), true);

      assert.strictEqual(parser.evaluate('3 > 3'), false);
      assert.strictEqual(parser.evaluate('"abc" > "abc"'), false);

      assert.strictEqual(parser.evaluate('3 > 6'), false);
      assert.strictEqual(parser.evaluate('"abc" > "def"'), false);

      assert.strictEqual(parser.evaluate('undefined > 5'), false);
      assert.strictEqual(parser.evaluate('5 > undefined'), false);
      assert.strictEqual(parser.evaluate('undefined > "abc"'), false);
      assert.strictEqual(parser.evaluate('"abc" > undefined'), false);
    });
  });

  describe('>', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('3 < 6'), true);
      assert.strictEqual(parser.evaluate('"abc" < "def"'), true);

      assert.strictEqual(parser.evaluate('3 < 3'), false);
      assert.strictEqual(parser.evaluate('"abc" < "abc"'), false);

      assert.strictEqual(parser.evaluate('6 < 3'), false);
      assert.strictEqual(parser.evaluate('"def" < "abc"'), false);

      assert.strictEqual(parser.evaluate('undefined < 5'), false);
      assert.strictEqual(parser.evaluate('5 < undefined'), false);
      assert.strictEqual(parser.evaluate('undefined < "abc"'), false);
      assert.strictEqual(parser.evaluate('"abc" < undefined'), false);
    });
  });

  describe('<=', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('6 >= 3'), true);
      assert.strictEqual(parser.evaluate('"def" >= "abc"'), true);

      assert.strictEqual(parser.evaluate('3 >= 3'), true);
      assert.strictEqual(parser.evaluate('"abc" >= "abc"'), true);

      assert.strictEqual(parser.evaluate('3 >= 6'), false);
      assert.strictEqual(parser.evaluate('"abc" >= "def"'), false);

      assert.strictEqual(parser.evaluate('undefined >= 5'), false);
      assert.strictEqual(parser.evaluate('5 >= undefined'), false);
      assert.strictEqual(parser.evaluate('undefined >= "abc"'), false);
      assert.strictEqual(parser.evaluate('"abc" >= undefined'), false);
    });
  });

  describe('>=', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('3 <= 6'), true);
      assert.strictEqual(parser.evaluate('"abc" <= "def"'), true);

      assert.strictEqual(parser.evaluate('3 <= 3'), true);
      assert.strictEqual(parser.evaluate('"abc" <= "abc"'), true);

      assert.strictEqual(parser.evaluate('6 <= 3'), false);
      assert.strictEqual(parser.evaluate('"def" <= "abc"'), false);

      assert.strictEqual(parser.evaluate('undefined <= 5'), false);
      assert.strictEqual(parser.evaluate('5 <= undefined'), false);
      assert.strictEqual(parser.evaluate('undefined <= "abc"'), false);
      assert.strictEqual(parser.evaluate('"abc" <= undefined'), false);
    });
  });

  describe('=', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('x = 2 + 2; x'), 4);
      assert.strictEqual(parser.evaluate('x = 2 - 6; x'), -4);
      assert.strictEqual(parser.evaluate('x = undefined; x'), undefined);
    });
  });

  describe('[]', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('x = [1, 2, 3]; x[1]'), 2);
      assert.strictEqual(parser.evaluate('x = [1, 2, 3]; x[undefined]'), 1);
    });
    it('should return undefined if the input array is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('x = undefined; x[0]'), undefined);
    });
  });

  describe('and', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('1 and 1'), true);
      assert.strictEqual(parser.evaluate('"abc" and "abc"'), true);
      assert.strictEqual(parser.evaluate('true and true'), true);

      assert.strictEqual(parser.evaluate('undefined and 1'), false);
      assert.strictEqual(parser.evaluate('1 and undefined'), false);
      assert.strictEqual(parser.evaluate('1 and 0'), false);
      assert.strictEqual(parser.evaluate('"abc" and ""'), false);
      assert.strictEqual(parser.evaluate('true and false'), false);

      assert.strictEqual(parser.evaluate('undefined and undefined'), false);
      assert.strictEqual(parser.evaluate('0 and 0'), false);
      assert.strictEqual(parser.evaluate('"" and ""'), false);
      assert.strictEqual(parser.evaluate('false and false'), false);
    });
  });

  describe('in', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('1 in [1, 2, 3]'), true);
      assert.strictEqual(parser.evaluate('undefined in [1, 2, 3, undefined]'), true);
      assert.strictEqual(parser.evaluate('"a" in "abcdef"'), true);

      assert.strictEqual(parser.evaluate('6 in [1, 2, 3]'), false);
      assert.strictEqual(parser.evaluate('undefined in [1, 2, 3]'), false);
      assert.strictEqual(parser.evaluate('"g" in "abcdef"'), false);

      assert.strictEqual(parser.evaluate('6 in undefined'), false);
      assert.strictEqual(parser.evaluate('undefined in undefined'), false);
      assert.strictEqual(parser.evaluate('"a" in undefined'), false);
    });
  });

  describe('or', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('1 or 1'), true);
      assert.strictEqual(parser.evaluate('"abc" or "abc"'), true);
      assert.strictEqual(parser.evaluate('true or true'), true);

      assert.strictEqual(parser.evaluate('undefined or 1'), true);
      assert.strictEqual(parser.evaluate('1 or undefined'), true);
      assert.strictEqual(parser.evaluate('1 or 0'), true);
      assert.strictEqual(parser.evaluate('"abc" or ""'), true);
      assert.strictEqual(parser.evaluate('true or false'), true);

      assert.strictEqual(parser.evaluate('undefined or undefined'), false);
      assert.strictEqual(parser.evaluate('0 or 0'), false);
      assert.strictEqual(parser.evaluate('"" or ""'), false);
      assert.strictEqual(parser.evaluate('false or false'), false);
    });
  });

  describe('??', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      // If the left side is defined then the left side is returned..
      assert.strictEqual(parser.evaluate('10 ?? 12'), 10);

      // If the left side is undefined then the right side is returned.
      assert.strictEqual(parser.evaluate('x = undefined; x ?? 12'), 12);
      // If the left side is Infinity (divide by zero) then the right side is returned.
      assert.strictEqual(parser.evaluate('x = 10 / 0; x'), Infinity);
      assert.strictEqual(parser.evaluate('x = 10 / 0; x ?? 12'), 12);
      // If the left side is NaN then the right side is returned.
      assert.strictEqual(parser.evaluate('x = sqrt -1; x'), Number.NaN);
      assert.strictEqual(parser.evaluate('x = sqrt -1; x ?? 12'), 12);

      // Should be able to chain multiple coalescing operators.
      assert.strictEqual(parser.evaluate('undefined ?? undefined ?? 12'), 12);

      // Test operator precedence.
      assert.strictEqual(parser.evaluate('x = undefined; 5 + x ?? 12'), 17);
      assert.strictEqual(parser.evaluate('x = undefined; x ?? true and 3'), true);
      assert.strictEqual(parser.evaluate('x = undefined; x ?? 0 and 3'), false);
    });
  });

  describe('as operator', () => {
    it('should be disabled by default', function () {
      assert.throws(() => Parser.evaluate('"1.6" as "abc"'));
    });
    it('"1.6" as "number"', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.strictEqual(parser.evaluate('"1.6" as "number"'), 1.6);
    });
    it('"1.6" as "int"', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.strictEqual(parser.evaluate('"1.6" as "int"'), 2);
    });
    it('"1.6" as "integer"', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.strictEqual(parser.evaluate('"1.6" as "integer"'), 2);
    });
    it('"1.6" as "boolean"', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.strictEqual(parser.evaluate('"1.6" as "boolean"'), true);
    });
    it('"" as "boolean"', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.strictEqual(parser.evaluate('"" as "boolean"'), false);
    });
    it('should throw an error for unknown right hand sides', function () {
      const parser = new Parser({ operators: { conversion: true } });
      assert.throws(() => parser.evaluate('"1.6" as "abc"'), /unknown type: abc/);
    });
    it('should allow operator overloading', function () {
      const parser = new Parser({ operators: { conversion: true } });
      parser.binaryOps.as = (a, _b) => a + '_suffix';
      assert.strictEqual(parser.evaluate('"abc" as "suffix"'), 'abc_suffix');
    });
  });
});
