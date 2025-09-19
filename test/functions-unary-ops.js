/* global describe, it */

'use strict';

import assert from 'assert';
import { Parser } from '../dist/index.mjs';

describe('Unary Operators', function () {
  describe('-', function () {
    it('should return the negation of the input value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('-(5)'), -5);
      assert.strictEqual(parser.evaluate('-(-5)'), 5);
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('-(undefined)'), undefined);
      assert.strictEqual(parser.evaluate('-undefined'), undefined);
    });
  });

  describe('+', function () {
    it('should return the input value as a number', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('+5'), 5);
      assert.strictEqual(parser.evaluate('+"5"'), 5);
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('+(undefined)'), undefined);
      assert.strictEqual(parser.evaluate('+undefined'), undefined);
    });
  });

  describe('!', function () {
    it('should return n!', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('!0'), 1);
      assert.strictEqual(parser.evaluate('!1'), 1);
      assert.strictEqual(parser.evaluate('!2'), 2);
      assert.ok(Math.abs(parser.evaluate('!2.5') - 3.323350970447843) <= 1e-14);
      assert.strictEqual(parser.evaluate('!3'), 6);
      assert.strictEqual(parser.evaluate('!4'), 24);
    });
    it('should return undefined if the input is undefined', function () {
      assert.strictEqual(Parser.evaluate('!(undefined)'), undefined);
      assert.strictEqual(Parser.evaluate('!undefined'), undefined);
    });
  });

  describe('abs', function () {
    it('should return absolute value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('abs 5'), 5);
      assert.strictEqual(parser.evaluate('abs -5'), 5);
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('abs (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('abs undefined'), undefined);
    });
  });

  describe('acos', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('acos 0'), Math.acos(0));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('acos (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('acos undefined'), undefined);
    });
  });

  describe('acosh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('acosh 2'), Math.acosh(2));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('acosh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('acosh undefined'), undefined);
    });
  });

  describe('asin', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('asin 0'), Math.asin(0));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('asin (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('asin undefined'), undefined);
    });
  });

  describe('asinh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('asinh 2'), Math.asinh(2));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('asinh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('asinh undefined'), undefined);
    });
  });

  describe('atan', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('atan 0'), Math.atan(0));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('atan (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('atan undefined'), undefined);
    });
  });

  describe('atanh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('atanh 2'), Math.atanh(2));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('atanh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('atanh undefined'), undefined);
    });
  });

  describe('cbrt', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cbrt 27'), Math.cbrt(27));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cbrt (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('cbrt undefined'), undefined);
    });
  });

  describe('ceil', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('ceil 1.4'), Math.ceil(1.4));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('ceil (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('ceil undefined'), undefined);
    });
  });

  describe('cos', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cos 1'), Math.cos(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cos (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('cos undefined'), undefined);
    });
  });

  describe('cosh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cosh 1'), Math.cosh(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('cosh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('cosh undefined'), undefined);
    });
  });

  describe('exp', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('exp 7'), Math.exp(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('exp (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('exp undefined'), undefined);
    });
  });

  describe('expm1', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('expm1 7'), Math.expm1(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('expm1 (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('expm1 undefined'), undefined);
    });
  });

  describe('floor', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('floor 1.4'), Math.floor(1.4));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('floor (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('floor undefined'), undefined);
    });
  });

  describe('length', function () {
    it('should return the correct value for array inputs', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('length [0, 1, 2]'), 3);
    });
    it('should return the correct value for string inputs', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('length "abc"'), 3);
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('length (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('length undefined'), undefined);
    });
  });

  describe('lg', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('lg 7'), Math.log10(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('lg (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('lg undefined'), undefined);
    });
  });

  describe('ln', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('ln 7'), Math.log(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('ln (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('ln undefined'), undefined);
    });
  });

  describe('log', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log 7'), Math.log(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('log undefined'), undefined);
    });
  });

  describe('log1p', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log1p 7'), Math.log1p(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log1p (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('log1p undefined'), undefined);
    });
  });

  describe('log2', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log2 7'), Math.log2(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log2 (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('log2 undefined'), undefined);
    });
  });

  describe('log10', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log10 7'), Math.log10(7));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('log10 (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('log10 undefined'), undefined);
    });
  });

  describe('not', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('not true'), false);
      assert.strictEqual(parser.evaluate('not false'), true);
      assert.strictEqual(parser.evaluate('not undefined'), true);
      assert.strictEqual(parser.evaluate('not 0'), true);
      assert.strictEqual(parser.evaluate('not 10'), false);
    });
  });

  describe('round', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('round 1.4'), Math.round(1.4));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('round (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('round undefined'), undefined);
    });
  });

  describe('sign', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sign 1.4'), Math.sign(1.4));
      assert.strictEqual(parser.evaluate('sign -1.4'), Math.sign(-1.4));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sign (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('sign undefined'), undefined);
    });
  });

  describe('sin', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sin 1'), Math.sin(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sin (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('sin undefined'), undefined);
    });
  });

  describe('sinh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sinh 1'), Math.sinh(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sinh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('sinh undefined'), undefined);
    });
  });

  describe('sqrt', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sqrt 9'), Math.sqrt(9));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('sqrt (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('sqrt undefined'), undefined);
    });
  });

  describe('tan', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('tan 1'), Math.tan(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('tan (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('tan undefined'), undefined);
    });
  });

  describe('tanh', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('tanh 1'), Math.tanh(1));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('tanh (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('tanh undefined'), undefined);
    });
  });

  describe('trunc', function () {
    it('should return the correct value', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('trunc 1.4'), Math.trunc(1.4));
    });
    it('should return undefined if the input is undefined', function () {
      var parser = new Parser();
      assert.strictEqual(parser.evaluate('trunc (undefined)'), undefined);
      assert.strictEqual(parser.evaluate('trunc undefined'), undefined);
    });
  });
});
