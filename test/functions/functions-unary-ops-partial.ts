/* global describe, it */

import assert from 'assert';
import { Parser } from '../../dist/index.mjs';

describe('Unary Operators TypeScript Test', function () {
  describe('- (negation)', function () {
    it('should return the negation of the input value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('-(5)'), -5);
      assert.strictEqual(parser.evaluate('-(-5)'), 5);
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('-(undefined)'), undefined);
      assert.strictEqual(parser.evaluate('-undefined'), undefined);
    });
  });

  describe('+ (unary plus)', function () {
    it('should return the input value as a number', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('+(5)'), 5);
      assert.strictEqual(parser.evaluate('+(-5)'), -5);
      assert.strictEqual(parser.evaluate('+"3"'), 3);
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('+(undefined)'), undefined);
      assert.strictEqual(parser.evaluate('+undefined'), undefined);
    });
  });

  describe('! (factorial)', function () {
    it('should return n!', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('0!'), 1);
      assert.strictEqual(parser.evaluate('1!'), 1);
      assert.strictEqual(parser.evaluate('2!'), 2);
      assert.strictEqual(parser.evaluate('3!'), 6);
      assert.strictEqual(parser.evaluate('4!'), 24);
      assert.strictEqual(parser.evaluate('5!'), 120);
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('undefined!'), undefined);
    });
  });

  describe('abs', function () {
    it('should return absolute value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('abs(5)'), 5);
      assert.strictEqual(parser.evaluate('abs(-5)'), 5);
      assert.strictEqual(parser.evaluate('abs(0)'), 0);
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('abs(undefined)'), undefined);
    });
  });

  describe('sin', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sin(0)'), Math.sin(0));
      assert.strictEqual(parser.evaluate('sin(PI/2)'), Math.sin(Math.PI / 2));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sin(undefined)'), undefined);
    });
  });

  describe('cos', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('cos(0)'), Math.cos(0));
      assert.strictEqual(parser.evaluate('cos(PI)'), Math.cos(Math.PI));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('cos(undefined)'), undefined);
    });
  });

  describe('tan', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('tan(0)'), Math.tan(0));
      assert.strictEqual(parser.evaluate('tan(PI/4)'), Math.tan(Math.PI / 4));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('tan(undefined)'), undefined);
    });
  });

  describe('acos', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('acos(1)'), Math.acos(1));
      assert.strictEqual(parser.evaluate('acos(0)'), Math.acos(0));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('acos(undefined)'), undefined);
    });
  });

  describe('asin', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('asin(0)'), Math.asin(0));
      assert.strictEqual(parser.evaluate('asin(1)'), Math.asin(1));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('asin(undefined)'), undefined);
    });
  });

  describe('atan', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('atan(0)'), Math.atan(0));
      assert.strictEqual(parser.evaluate('atan(1)'), Math.atan(1));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('atan(undefined)'), undefined);
    });
  });

  describe('ceil', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('ceil(4.2)'), Math.ceil(4.2));
      assert.strictEqual(parser.evaluate('ceil(-4.2)'), Math.ceil(-4.2));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('ceil(undefined)'), undefined);
    });
  });

  describe('floor', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('floor(4.9)'), Math.floor(4.9));
      assert.strictEqual(parser.evaluate('floor(-4.1)'), Math.floor(-4.1));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('floor(undefined)'), undefined);
    });
  });

  describe('round', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('round(4.5)'), Math.round(4.5));
      assert.strictEqual(parser.evaluate('round(4.3)'), Math.round(4.3));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('round(undefined)'), undefined);
    });
  });

  describe('sqrt', function () {
    it('should return the correct value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sqrt(9)'), Math.sqrt(9));
      assert.strictEqual(parser.evaluate('sqrt(16)'), Math.sqrt(16));
    });
    it('should return undefined if the input is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('sqrt(undefined)'), undefined);
    });
  });
});
