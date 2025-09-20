/* eslint-disable array-bracket-spacing */
/* global describe, it */

'use strict';

import assert from 'assert';
import { Parser } from '../dist/index.mjs';

describe('Expression', function () {
  describe('evaluate()', function () {
    describe('core features', () => {
      it('2 ^ x', function () {
        assert.strictEqual(Parser.evaluate('2 ^ x', { x: 3 }), 8);
      });

      it('2 * x + 1', function () {
        assert.strictEqual(Parser.evaluate('2 * x + 1', { x: 3 }), 7);
      });

      it('2 + 3 * x', function () {
        assert.strictEqual(Parser.evaluate('2 + 3 * x', { x: 4 }), 14);
      });

      it('(2 + 3) * x', function () {
        assert.strictEqual(Parser.evaluate('(2 + 3) * x', { x: 4 }), 20);
      });

      it('2-3^x', function () {
        assert.strictEqual(Parser.evaluate('2-3^x', { x: 4 }), -79);
      });

      it('-2-3^x', function () {
        assert.strictEqual(Parser.evaluate('-2-3^x', { x: 4 }), -83);
      });

      it('-3^x', function () {
        assert.strictEqual(Parser.evaluate('-3^x', { x: 4 }), -81);
      });

      it('(-3)^x', function () {
        assert.strictEqual(Parser.evaluate('(-3)^x', { x: 4 }), 81);
      });

      it('2 ^ x.y', function () {
        assert.strictEqual(Parser.evaluate('2^x.y', { x: { y: 3 } }), 8);
      });

      it('2 + 3 * foo.bar.baz', function () {
        assert.strictEqual(Parser.evaluate('2 + 3 * foo.bar.baz', { foo: { bar: { baz: 4 } } }), 14);
      });

      it('10/-1', function () {
        assert.strictEqual(Parser.evaluate('10/-1'), -10);
      });

      it('10*-1', function () {
        assert.strictEqual(Parser.evaluate('10*-1'), -10);
      });

      it('10*-x', function () {
        assert.strictEqual(Parser.evaluate('10*-x', { x: 1 }), -10);
      });

      it('10+-1', function () {
        assert.strictEqual(Parser.evaluate('10+-1'), 9);
      });

      it('10/+1', function () {
        assert.strictEqual(Parser.evaluate('10/+1'), 10);
      });

      it('10*+1', function () {
        assert.strictEqual(Parser.evaluate('10*+1'), 10);
      });

      it('10*+x', function () {
        assert.strictEqual(Parser.evaluate('10*+x', { x: 1 }), 10);
      });

      it('10+ +1', function () {
        assert.strictEqual(Parser.evaluate('10+ +1'), 11);
      });

      it('10/-2', function () {
        assert.strictEqual(Parser.evaluate('10/-2'), -5);
      });

      it('2^-4', function () {
        assert.strictEqual(Parser.evaluate('2^-4'), 1 / 16);
      });

      it('2^(-4)', function () {
        assert.strictEqual(Parser.evaluate('2^(-4)'), 1 / 16);
      });

      it('\'as\' | \'df\'', function () {
        assert.strictEqual(Parser.evaluate('\'as\' | \'df\''), 'asdf');
      });

      it('[1, 2] | [3, 4] | [5, 6]', function () {
        assert.deepStrictEqual(Parser.evaluate('[1, 2] | [3, 4] | [5, 6]'), [ 1, 2, 3, 4, 5, 6 ]);
      });

      it('should fail with undefined variables', function () {
        assert.throws(function () { Parser.evaluate('x + 1'); }, Error);
      });

      it('x = 3 * 2 + 1', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('x = 3 * 2 + 1'), 7);
      });

      it('x = x * 2 + 1', function () {
        var parser = new Parser();
        var obj = {};
        parser.evaluate('x = 3 * 2 + 1', obj);
        assert.strictEqual(parser.evaluate('x = x * 2 + 1', obj), 15);
      });

      it('y = x = x * 2 + 1', function () {
        var parser = new Parser();
        var obj = {};
        parser.evaluate('x = 3 * 2 + 1', obj);
        assert.strictEqual(parser.evaluate('y = x = x * 2 + 1', obj), 15);
        assert.strictEqual(15, obj.x);
        assert.strictEqual(15, obj.y);
      });

      it('y = y = 2*z', function () {
        var parser = new Parser();
        var obj = { y: 5, z: 3 };
        assert.strictEqual(parser.evaluate('x = y = 2*z', obj), 6);
        assert.strictEqual(6, obj.x);
        assert.strictEqual(6, obj.y);
        assert.strictEqual(3, obj.z);
      });

      it('f(x) = x * x', function () {
        var parser = new Parser();
        var obj = { f: null };
        assert.strictEqual(parser.evaluate('f(x) = x * x', obj) instanceof Function, true);
        assert.strictEqual(obj.f instanceof Function, true);
        assert.strictEqual(obj.f(3), 9);
      });

      it('(f(x) = x * x)(3)', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('(f(x) = x * x)(3)'), 9);
      });

      it('y = 5; f(x) = x * y', function () {
        var parser = new Parser();
        var obj = { f: null };
        assert.strictEqual(parser.evaluate('y = 5; f(x) = x * y', obj) instanceof Function, true);
        assert.strictEqual(obj.f instanceof Function, true);
        assert.strictEqual(obj.f(3), 15);
      });

      it('y = 5; (f(x) = x * y)(3)', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('y = 5; (f(x) = x * y)(3)'), 15);
      });

      it('(f(x) = x > 1 ? x*f(x-1) : 1)(5)', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('(f(x) = x > 1 ? x*f(x-1) : 1)(5)'), 120);
        assert.strictEqual(parser.evaluate('(f(x) = x > 1 ? x*f(x-1) : 1); f(6)'), 720);
      });

      it('f(x) = x > 1 ? x*f(x-1) : 1; f(6); f(5)', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1; f(6)'), 720);
        assert.strictEqual(parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1; f(6); f(5)'), 120);
      });

      it('f(x) = x > 1 ? x*f(x-1) : 1', function () {
        var parser = new Parser();
        var obj = { f: null };
        assert.strictEqual(parser.evaluate('f(x) = x > 1 ? x*f(x-1) : 1', obj) instanceof Function, true);
        assert.strictEqual(obj.f instanceof Function, true);
        assert.strictEqual(obj.f(6), 720);
        assert.strictEqual(obj.f(5), 120);
        assert.strictEqual(obj.f(4), 24);
        assert.strictEqual(obj.f(3), 6);
      });

      it('3 ; 2 ; 1', function () {
        assert.strictEqual(Parser.evaluate('3 ; 2 ; 1'), 1);
      });

      it('3 ; 2 ; 1 ;', function () {
        assert.strictEqual(Parser.evaluate('3 ; 2 ; 1 ;'), 1);
      });

      it('x = 3 ; y = 4 ; z = x * y', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('x = 3 ; y = 4 ; z = x * y'), 12);
      });

      it('x=3;y=4;z=x*y;', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('x=3;y=4;z=x*y;'), 12);
      });

      it('1 + (( 3 ; 4 ) + 5)', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('1 + (( 3 ; 4 ) + 5)'), 10);
      });

      it('2+(x=3;y=4;z=x*y)+5', function () {
        var parser = new Parser();
        assert.strictEqual(parser.evaluate('2+(x=3;y=4;z=x*y)+5'), 19);
      });

      it('[1, 2, 3]', function () {
        assert.deepStrictEqual(Parser.evaluate('[1, 2, 3]'), [1, 2, 3]);
      });

      it('[1, 2, 3, [4, [5, 6]]]', function () {
        assert.deepStrictEqual(Parser.evaluate('[1, 2, 3, [4, [5, 6]]]'), [1, 2, 3, [4, [5, 6]]]);
      });

      it('["a", ["b", ["c"]], true, 1 + 2 + 3]', function () {
        assert.deepStrictEqual(Parser.evaluate('["a", ["b", ["c"]], true, 1 + 2 + 3]'), ['a', ['b', ['c']], true, 6]);
      });

      it('should fail trying to call a non-function', function () {
        assert.throws(function () { Parser.evaluate('f()', { f: 2 }); }, Error);
      });

      it('$x * $y_+$a1*$z - $b2', function () {
        assert.strictEqual(Parser.evaluate('$x * $y_+$a1*$z - $b2', { $a1: 3, $b2: 5, $x: 7, $y_: 9, $z: 11 }), 91);
      });

      it('max(conf.limits.lower, conf.limits.upper)', function () {
        assert.strictEqual(Parser.evaluate('max(conf.limits.lower, conf.limits.upper)', { conf: { limits: { lower: 4, upper: 9 } } }), 9);
      });

      it('fn.max(conf.limits.lower, conf.limits.upper)', function () {
        assert.strictEqual(Parser.evaluate('fn.max(conf.limits.lower, conf.limits.upper)', { fn: { max: Math.max }, conf: { limits: { lower: 4, upper: 9 } } }), 9);
      });

      it('[1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]', function () {
        assert.strictEqual(JSON.stringify(Parser.evaluate('[1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]')), JSON.stringify([1, 5, 20, 6 / 7, [8, 9, 10], '11']));
      });

      it('1 ? 1 : 0', function () {
        assert.strictEqual(Parser.evaluate('1 ? 1 : 0'), 1);
      });

      it('0 ? 1 : 0', function () {
        assert.strictEqual(Parser.evaluate('0 ? 1 : 0'), 0);
      });

      it('1==1 or 2==1 ? 39 : 0', function () {
        assert.strictEqual(Parser.evaluate('1==1 or 2==1 ? 39 : 0'), 39);
      });

      it('1==1 or 1==2 ? -4 + 8 : 0', function () {
        assert.strictEqual(Parser.evaluate('1==1 or 1==2 ? -4 + 8 : 0'), 4);
      });

      it('3 and 6 ? 45 > 5 * 11 ? 3 * 3 : 2.4 : 0', function () {
        assert.strictEqual(Parser.evaluate('3 and 6 ? 45 > 5 * 11 ? 3 * 3 : 2.4 : 0'), 2.4);
      });
    });

    describe('fork features', () => {
      describe('undefined support', () => {
        it('should parse undefined', function () {
          assert.strictEqual(Parser.evaluate('undefined'), undefined);
          assert.strictEqual(Parser.evaluate('x = undefined; x'), undefined);
        });

        it('should fail to parse undefined as a custom function', function () {
          // undefined is not a function
          assert.throws(() => Parser.evaluate('undefined()'), /undefined is not a function/);
          assert.throws(() => Parser.evaluate('x = undefined(); x'), /undefined is not a function/);
        });
      });

      it('concatenate strings with + operator', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('"abc" + "def" + "ghi"'), 'abcdefghi');
      });

      describe('async custom functions', () => {
        it('external functions', function () {
          const parser = new Parser();
          parser.functions.doIt = function (value) {
            return value + value;
          };
          assert.strictEqual(parser.evaluate('doIt(2)'), 4);
        });
        it('external async functions', async function () {
          const parser = new Parser();
          parser.functions.doIt = function (value) {
            return new Promise((resolve) => setTimeout(() => resolve(value + value), 100));
          };
          const promise = parser.evaluate('x = doIt(2); x + 3');
          // Since doIt returns a promise evaluate should also return a promise.
          assert.strictEqual(typeof promise === 'object' && typeof promise.then === 'function', true);
          // To get the final expression value we have to await on the promise.
          const result = await promise;
          assert.strictEqual(result, 7);

          assert.strictEqual(await parser.evaluate('doIt(3) + 4'), 10);
        });
        it('custom function that returns null should not break isPromise', () => {
          // There was a bug in isPromise() where null would break it (because typeof null is 'object', which would
          // then make isPromise look at null.then which blew up).  This proves that bug was fixed.
          const parser = new Parser();
          parser.functions.doIt = () => null;
          const result = parser.evaluate('x = doIt(); x');
          assert.strictEqual(result, null);
        });
      });

      describe('Object properties', function () {
        var parser = new Parser();
        var obj = { thingy: { array: [{ value: 10 }], foo: 5 }, someKey: 'array', numericKey: 0 };

        it('control', function () {
          assert.strictEqual(parser.evaluate('thingy.array[0].value', obj), 10);
          assert.strictEqual(parser.evaluate('thingy.array[numericKey].value', obj), 10);
          assert.strictEqual(parser.evaluate('thingy.array[12 * numericKey].value', obj), 10);
        });

        it('non-existent properties', function () {
          assert.strictEqual(parser.evaluate('thingy.doesNotExist', obj), undefined);
          assert.strictEqual(parser.evaluate('thingy.doesNotExist[0]', obj), undefined);
          assert.strictEqual(parser.evaluate('thingy.doesNotExist[0].childArray[1].notHere.alsoNotHere', obj), undefined);
          assert.strictEqual(parser.evaluate('thingy.array[0].value.doesNotExist', obj), undefined);

          assert.strictEqual(parser.evaluate('thingy.doesNotExist ?? 1', obj), 1);
          assert.strictEqual(parser.evaluate('thingy.array[0].value.doesNotExist ?? 1', obj), 1);
          assert.strictEqual(parser.evaluate('thingy.doesNotExist[0].childArray[1].notHere.alsoNotHere ?? 1', obj), 1);
        });
        it('non-existent array elements', function () {
          assert.strictEqual(parser.evaluate('thingy.array[1]', obj), undefined);
          assert.strictEqual(parser.evaluate('thingy.array[1].value', obj), undefined);

          assert.strictEqual(parser.evaluate('thingy.array[1] ?? 1', obj), 1);
          assert.strictEqual(parser.evaluate('thingy.array[1].value ?? 1', obj), 1);
        });

        it('bracket notation', function () {
          assert.strictEqual(parser.evaluate('thingy["foo"]', obj), 5);
          assert.strictEqual(parser.evaluate('thingy["array"][0].value', obj), 10);
          assert.strictEqual(parser.evaluate('thingy[someKey][0].value', obj), 10);
          assert.strictEqual(parser.evaluate('thingy["array"][numericKey].value', obj), 10);
        });

        it('bracket notation for non-existent properties', function () {
          assert.strictEqual(parser.evaluate('thingy["array"][1]', obj), undefined);
          assert.strictEqual(parser.evaluate('thingy["doesNotExist"][0]', obj), undefined);
        });
      });

      describe('custom variable resolution', () => {
        it('should support custom variable resolution using aliases', function () {
          const parser = new Parser();
          const obj = { variables: { a: 5, b: 1 } };
          parser.resolve = token =>
            token === '$v' ? { alias: 'variables' } : undefined;
          assert.strictEqual(parser.evaluate('$v.a + variables.b', obj), 6);
        });
        it('should throw an undefined variable error if custom variable resolution returns an alias that does not exist', function () {
          const parser = new Parser();
          const obj = { variables: { a: 5, b: 1 } };
          parser.resolve = token =>
            token === '$v' ? { alias: 'abc' } : undefined;
          assert.throws(function () { parser.evaluate('$v.a + variables.b', obj); }, /undefined variable: \$v/);
        });
        it('should support custom variable resolution using values', function () {
          const parser = new Parser();
          const obj = { variables: { a: 5, b: 1 } };
          parser.resolve = token =>
            token.startsWith('$') ? { value: obj.variables[token.substring(1)] } : undefined;
          assert.strictEqual(parser.evaluate('$a + $b'), 6);
        });
        it('should support custom variable resolution values of undefined', function () {
          const parser = new Parser();
          const obj = { variables: { a: 5, b: 1 } };
          parser.resolve = token =>
            token.startsWith('$') ? { value: obj.variables[token.substring(1)] } : undefined;
          assert.strictEqual(parser.evaluate('$a + $c'), undefined);
        });
        it('should support child properties in custom variable resolution values', function () {
          const parser = new Parser();
          const obj = {
            variables1: { a: 5, b: 1 },
            variables2: { b: { c: 6 } }
          };
          parser.resolve = token => {
            if (token.startsWith('$$')) {
              return { value: obj.variables2[token.substring(2)] };
            } else if (token.startsWith('$')) {
              return { value: obj.variables1[token.substring(1)] };
            } else {
              return undefined;
            }
          };
          assert.strictEqual(parser.evaluate('$b + $$b.c'), 7);
        });
      });

      describe('?? operator', () => {
        it('should succeed with variables set to undefined', function () {
          assert.strictEqual(Parser.evaluate('x = undefined; x + 1'), undefined);
          assert.strictEqual(Parser.evaluate('x = undefined; x ?? 3 + 1'), 4);
        });
        it('y = x ?? 2 + 4', function () {
          assert.strictEqual(Parser.evaluate('y = x ?? 2 + 4', { x: undefined }), 6);
          assert.strictEqual(Parser.evaluate('y = x ?? 2 + 4', { x: 3 }), 7);
        });
        it('(a / b * 10) ?? 0 (divide by 0)', function () {
          assert.strictEqual(Parser.evaluate('(a / b * 10) ?? 0', { a: 5, b: 0 }), 0);
        });
        it('should be disabled by the coalesce option', () => {
          const parser = new Parser({ operators: { coalesce: false } });
          assert.throws(() => parser.evaluate('1 ?? 2'), /Unknown character/);
        });
      });

      describe('as operator', () => {
        // Full test coverage is in functions-binary-ops.js.
        it('should be disabled by default', function () {
          assert.throws(() => Parser.evaluate('"1.6" as "abc"'));
        });
        it('works when enabled', function () {
          const parser = new Parser({ operators: { conversion: true } });
          assert.strictEqual(parser.evaluate('"1.6" as "number"'), 1.6);
        });
      });

      describe('CASE statements', () => {
        describe('switch style cases', () => {
          it('empty case', function () {
            const parser = new Parser();
            const expr = `
              case x
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), undefined);
          });
          it('no whens', function () {
            const parser = new Parser();
            const expr = `
              case x
                else 'too-big'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'too-big');
          });
          it('no else', function () {
            const parser = new Parser();
            const expr = `
              case x
                when 1 then 'one'
                when 1+1 then 'two'
                when 1+1+1 then 'three'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'one');
            assert.strictEqual(parser.evaluate(expr, { x: 2 }), 'two');
            assert.strictEqual(parser.evaluate(expr, { x: 3 }), 'three');
            assert.strictEqual(parser.evaluate(expr, { x: 4 }), undefined);
          });
          it('simple case', function () {
            const parser = new Parser();
            const expr = `
              case x
                when 1 then 'one'
                when 1+1 then 'two'
                when 1+1+1 then 'three'
                else 'too-big'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'one');
            assert.strictEqual(parser.evaluate(expr, { x: 2 }), 'two');
            assert.strictEqual(parser.evaluate(expr, { x: 3 }), 'three');
            assert.strictEqual(parser.evaluate(expr, { x: 4 }), 'too-big');
          });
          it('case within a larger expression', function () {
            const parser = new Parser();
            const expr = `
              case x
                when "one" then 1
                when "two" then 1+1
                when "three" then 1+1+1
                else 0
              end * 5
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 'one' }), 5);
            assert.strictEqual(parser.evaluate(expr, { x: 'two' }), 10);
            assert.strictEqual(parser.evaluate(expr, { x: 'three' }), 15);
            assert.strictEqual(parser.evaluate(expr, { x: 'four' }), 0);
          });
          it('expression variable assigned to a case', function () {
            const parser = new Parser();
            const expr = `
              y = case x
                when "one" then 1
                when "two" then 2
                when "three" then 3
                else 0
              end;
              y * 5
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 'one' }), 5);
            assert.strictEqual(parser.evaluate(expr, { x: 'two' }), 10);
            assert.strictEqual(parser.evaluate(expr, { x: 'three' }), 15);
            assert.strictEqual(parser.evaluate(expr, { x: 'four' }), 0);
          });
        });
        describe('if/else/if style cases', () => {
          it('empty case', function () {
            const parser = new Parser();
            const expr = `
              case
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), undefined);
          });
          it('no whens', function () {
            const parser = new Parser();
            const expr = `
              case
                else 'too-big'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'too-big');
          });
          it('no else', function () {
            const parser = new Parser();
            const expr = `
              case
                when x == 1 then 'one'
                when x == 1+1 then 'two'
                when x == 1+1+1 then 'three'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'one');
            assert.strictEqual(parser.evaluate(expr, { x: 2 }), 'two');
            assert.strictEqual(parser.evaluate(expr, { x: 3 }), 'three');
            assert.strictEqual(parser.evaluate(expr, { x: 4 }), undefined);
          });
          it('simple case', function () {
            const parser = new Parser();
            const expr = `
              case
                when x == 1 then 'one'
                when x == 1+1 then 'two'
                when x == 1+1+1 then 'three'
                else 'too-big'
              end
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 1 }), 'one');
            assert.strictEqual(parser.evaluate(expr, { x: 2 }), 'two');
            assert.strictEqual(parser.evaluate(expr, { x: 3 }), 'three');
            assert.strictEqual(parser.evaluate(expr, { x: 4 }), 'too-big');
          });
          it('case within a larger expression', function () {
            const parser = new Parser();
            const expr = `
              case
                when x > y then "gt"
                when x < y then "lt"
                else "eq"
              end + "$"
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 2, y: 1 }), 'gt$');
            assert.strictEqual(parser.evaluate(expr, { x: 1, y: 2 }), 'lt$');
            assert.strictEqual(parser.evaluate(expr, { x: 1, y: 1 }), 'eq$');
          });
          it('expression variable assigned to a case', function () {
            const parser = new Parser();
            const expr = `
              y = case x
                when "one" then 1
                when "two" then 2
                when "three" then 3
                else 0
              end;
              y * 5
            `;
            assert.strictEqual(parser.evaluate(expr, { x: 'one' }), 5);
            assert.strictEqual(parser.evaluate(expr, { x: 'two' }), 10);
            assert.strictEqual(parser.evaluate(expr, { x: 'three' }), 15);
            assert.strictEqual(parser.evaluate(expr, { x: 'four' }), 0);
          });
        });
        describe('invalid case block', () => {
          it('missing when', () => {
            assert.throws(() => Parser.evaluate('case true then 5 end'), /invalid case block/);
            assert.throws(() => Parser.evaluate('case then 5 end'), /invalid case block/);
          });
          it('missing then', () => {
            assert.throws(() => Parser.evaluate('case true when 5 end'), /case block missing when/);
            assert.throws(() => Parser.evaluate('case when 5 end'), /case block missing when/);
          });
          it('missing end', () => {
            assert.throws(() => Parser.evaluate('case true when 5 then 6'), /invalid case block/);
            assert.throws(() => Parser.evaluate('case when 5 then 6'), /invalid case block/);
          });
          it('else followed by when', () => {
            assert.throws(() => Parser.evaluate('case true else "abc" when true then "def" end'), /invalid case block/);
            assert.throws(() => Parser.evaluate('case else "abc" when true then "def" end'), /invalid case block/);
          });
        });
      });

      describe('object construction', () => {
        it('empty object', function () {
          const parser = new Parser();
          const expr = '{}';
          var result = parser.evaluate(expr);
          assert.notStrictEqual(result, { });
        });
        it('simple object', function () {
          const parser = new Parser();
          const expr = '{ a: 1, b: 2, c: 3 }';
          var result = parser.evaluate(expr);
          assert.notStrictEqual(result, { a: 1, b: 2, c: 3 });
        });
        it('should allow comma after last property', function () {
          const parser = new Parser();
          const expr = '{ a: 1, b: 2, c: 3, }';
          var result = parser.evaluate(expr);
          assert.notStrictEqual(result, { a: 1, b: 2, c: 3 });
        });
        it('should allow nested objects', function () {
          const parser = new Parser();
          const expr = `{
            a: 1,
            b: {
              y: 'first',
              z: 'second',
            },
            c: 3,
          }`;
          var result = parser.evaluate(expr);
          assert.notStrictEqual(result, { a: 1, b: { y: 'first', z: 'second' }, c: 3 });
        });
        it('should allow arrays with nested objects', function () {
          const parser = new Parser();
          const expr = `{
            a: 1,
            b: [
              { value: 1 * 10 },
              { value: 2 * 10 },
              { value: 3 * 10 }
            ],
            c: 3,
          }`;
          var result = parser.evaluate(expr);
          assert.notStrictEqual(result, { a: 1, b: { y: 'first', z: 'second' }, c: 3 });
        });
        it('should allow expressions for property values', function () {
          const parser = new Parser();
          const expr = `{
            a: x * 3,
            b: {
              /*this x should be a property and not the x on the input object*/
              x: "first" + "_" + "second",
              y: min(x, 0),
            },
            c: [0, 1, 2, x],
          }`;
          const result = parser.evaluate(expr, { x: 3 });
          assert.notStrictEqual(result, {
            a: 15,
            b: {
              x: 'first_second',
              z: 0
            },
            c: [0, 1, 2, 3]
          });
        });
        it('should support passing objects to custom functions', function () {
          const parser = new Parser();
          parser.functions.doIt = o => o.x + o.y;
          const expr = 'doIt({ x: 3, y: 4, z: 8 })';
          assert.strictEqual(parser.evaluate(expr), 7);
        });
      });

      describe('extra logical operators', () => {
        it('false or true', function () {
          assert.deepStrictEqual(Parser.evaluate('false or true'), true);
        });

        it('false || true', function () {
          assert.deepStrictEqual(Parser.evaluate('false || true'), true);
        });

        it('false and true', function () {
          assert.deepStrictEqual(Parser.evaluate('false and true'), false);
        });

        it('false && true', function () {
          assert.deepStrictEqual(Parser.evaluate('false && true'), false);
        });
      });
    });
  });

  describe('substitute()', function () {
    var parser = new Parser();

    var expr = parser.parse('2 * x + 1');
    var expr2 = expr.substitute('x', '4 * x');
    it('((2*(4*x))+1)', function () {
      assert.strictEqual(expr2.evaluate({ x: 3 }), 25);
    });

    var expr3 = expr.substitute('x', '4 * x.y.z');
    it('((2*(4*x.y.z))+1)', function () {
      assert.strictEqual(expr3.evaluate({ x: { y: { z: 3 } } }), 25);
    });

    var expr4 = parser.parse('-x').substitute('x', '-4 + y');
    it('-(-4 + y)', function () {
      assert.strictEqual(expr4.toString(), '(-((-4) + y))');
      assert.strictEqual(expr4.evaluate({ y: 2 }), 2);
    });

    var expr5 = parser.parse('x + y').substitute('y', 'x ? 1 : 2');
    it('x + (x ? 1 : 2)', function () {
      assert.strictEqual(expr5.toString(), '(x + (x ? (1) : (2)))');
      assert.strictEqual(expr5.evaluate({ x: 3 }), 4);
      assert.strictEqual(expr5.evaluate({ x: 0 }), 2);
    });

    var expr6 = parser.parse('x ? y : z').substitute('y', 'x');
    it('x ? x : z', function () {
      assert.strictEqual(expr6.toString(), '(x ? (x) : (z))');
      assert.strictEqual(expr6.evaluate({ x: 1, z: 2 }), 1);
      assert.strictEqual(expr6.evaluate({ x: 0, z: 2 }), 2);
    });

    var expr7 = expr.substitute('x', parser.parse('4 * x'));
    it('should substitute expressions', function () {
      assert.strictEqual(expr7.toString(), '((2 * (4 * x)) + 1)');
      assert.strictEqual(expr7.evaluate({ x: 3 }), 25);
    });

    var expr8 = parser.parse('x = x + 1').substitute('x', '7');
    it('should not replace assigned variables', function () {
      assert.strictEqual(expr8.toString(), '(x = ((7 + 1)))');
      var vars = { x: 42 };
      assert.strictEqual(expr8.evaluate(vars), 8);
      assert.strictEqual(vars.x, 8);
    });

    var expr9 = parser.parse('undefined ?? y + z').substitute('y', 'x');
    it('x ? x : z', function () {
      assert.strictEqual(expr9.toString(), '((undefined ?? x) + z)');
      assert.strictEqual(expr9.evaluate({ x: 1, z: 2 }), 3);
      assert.strictEqual(expr9.evaluate({ x: 0, z: 2 }), 2);
    });
  });

  describe('simplify()', function () {
    var expr = Parser.parse('x * (y * atan(1))').simplify({ y: 4 });
    it('(x*3.141592653589793)', function () {
      assert.strictEqual(expr.toString(), '(x * 3.141592653589793)');
    });

    it('6.283185307179586', function () {
      assert.strictEqual(expr.simplify({ x: 2 }).toString(), '6.283185307179586');
    });

    it('(x/2) ? y : z', function () {
      assert.strictEqual(Parser.parse('(x/2) ? y : z').simplify({ x: 4 }).toString(), '(2 ? (y) : (z))');
    });

    it('x ? (y + 1) : z', function () {
      assert.strictEqual(Parser.parse('x ? (y + 1) : z').simplify({ y: 2 }).toString(), '(x ? (3) : (z))');
    });

    it('x ? y : (z * 4)', function () {
      assert.strictEqual(Parser.parse('x ? y : (z * 4)').simplify({ z: 3 }).toString(), '(x ? (y) : (12))');
    });

    it('x = 2*x', function () {
      assert.strictEqual(new Parser().parse('x = 2*x').simplify({ x: 3 }).toString(), '(x = (6))');
    });

    it('y = x ?? 2 + 4', function () {
      assert.strictEqual(new Parser().parse('y = x ?? 2 + 4').simplify({ x: 3 }).toString(), '(y = (7))');
      assert.strictEqual(new Parser().evaluate('y = x ?? 2 + 4', { x: undefined }), 6);
      assert.strictEqual(new Parser().parse('y = x ?? 2 + 4').simplify({ x: undefined }).toString(), '(y = (6))');
    });

    it('(f(x) = x * y)(3)', function () {
      assert.strictEqual(new Parser().parse('(f(x) = x * y)(3)').simplify({ y: 5 }).toString(), '(f(x) = ((x * 5)))(3)');
    });

    it('a[2] + b[3]', function () {
      assert.strictEqual(Parser.parse('a[2] + b[3]').simplify({ a: [ 0, 0, 5, 0 ], b: [ 0, 0, 0, 4, 0 ] }).toString(), '9');
      assert.strictEqual(Parser.parse('a[2] + b[3]').simplify({ a: [ 0, 0, 5, 0 ] }).toString(), '(5 + b[3])');
      assert.strictEqual(Parser.parse('a[2] + b[5 - 2]').simplify({ b: [ 0, 0, 0, 4, 0 ] }).toString(), '(a[2] + 4)');
      assert.strictEqual(Parser.parse('a[two] + b[3]').simplify({ a: [ 0, 0, 5, 0 ], b: [ 0, 0, 0, 4, 0 ] }).toString(), '([0, 0, 5, 0][two] + 4)');
      assert.strictEqual(Parser.parse('a[two] + b[3]').simplify({ a: [ 0, 'New\nLine', 5, 0 ], b: [ 0, 0, 0, 4, 0 ] }).toString(), '([0, "New\\nLine", 5, 0][two] + 4)');
    });
  });

  describe('variables()', function () {
    var expr = Parser.parse('x * (y * atan2(1, 2)) + z.y.x');
    it('["x", "y", "z.y.x"]', function () {
      assert.deepStrictEqual(expr.variables(), ['x', 'y', 'z']);
    });

    it('["x", "z.y.x"]', function () {
      assert.deepStrictEqual(expr.simplify({ y: 4 }).variables(), ['x', 'z']);
    });

    it('["x"]', function () {
      assert.deepStrictEqual(expr.simplify({ y: 4, z: { y: { x: 5 } } }).variables(), ['x']);
    });

    it('a or b ? c + d : e * f', function () {
      assert.deepStrictEqual(Parser.parse('a or b ? c + d : e * f').variables(), ['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('$x * $y_+$a1*$z - $b2', function () {
      assert.deepStrictEqual(Parser.parse('$x * $y_+$a1*$z - $b2').variables(), ['$x', '$y_', '$a1', '$z', '$b2']);
    });

    it('user.age + 2', function () {
      assert.deepStrictEqual(Parser.parse('user.age + 2').variables(), ['user']);
    });

    it('user.age + 2 with { withMembers: false } option', function () {
      assert.deepStrictEqual(Parser.parse('user.age + 2').variables({ withMembers: false }), ['user']);
    });

    it('user.age + 2 with { withMembers: true } option', function () {
      var expr = Parser.parse('user.age + 2');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['user.age']);
    });

    it('x.y ? x.y.z : default.z with { withMembers: true } option', function () {
      var expr = Parser.parse('x.y ? x.y.z : default.z');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['x.y.z', 'default.z', 'x.y']);
    });

    it('x + x.y + x.z with { withMembers: true } option', function () {
      var expr = Parser.parse('x + x.y + x.z');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['x', 'x.y', 'x.z']);
    });

    it('x.y < 3 ? 2 * x.y.z : default.z + 1 with { withMembers: true } option', function () {
      var expr = Parser.parse('x.y < 3 ? 2 * x.y.z : default.z + 1');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['x.y', 'x.y.z', 'default.z']);
    });

    it('user.age with { withMembers: true } option', function () {
      var expr = Parser.parse('user.age');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['user.age']);
    });

    it('x with { withMembers: true } option', function () {
      var expr = Parser.parse('x');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['x']);
    });

    it('x with { withMembers: false } option', function () {
      var expr = Parser.parse('x');
      assert.deepStrictEqual(expr.variables({ withMembers: false }), ['x']);
    });

    it('max(conf.limits.lower, conf.limits.upper) with { withMembers: false } option', function () {
      var expr = Parser.parse('max(conf.limits.lower, conf.limits.upper)');
      assert.deepStrictEqual(expr.variables({ withMembers: false }), ['conf']);
    });

    it('max(conf.limits.lower, conf.limits.upper) with { withMembers: true } option', function () {
      var expr = Parser.parse('max(conf.limits.lower, conf.limits.upper)');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['conf.limits.lower', 'conf.limits.upper']);
    });

    it('fn.max(conf.limits.lower, conf.limits.upper) with { withMembers: false } option', function () {
      var expr = Parser.parse('fn.max(conf.limits.lower, conf.limits.upper)');
      assert.deepStrictEqual(expr.variables({ withMembers: false }), ['fn', 'conf']);
    });

    it('fn.max(conf.limits.lower, conf.limits.upper) with { withMembers: true } option', function () {
      var expr = Parser.parse('fn.max(conf.limits.lower, conf.limits.upper)');
      assert.deepStrictEqual(expr.variables({ withMembers: true }), ['fn.max', 'conf.limits.lower', 'conf.limits.upper']);
    });

    it('x = y + z', function () {
      assert.deepStrictEqual(new Parser().parse('x = y + z').variables(), ['x', 'y', 'z']);
    });

    it('f(x, y, z) = x + y + z', function () {
      var parser = new Parser();
      assert.deepStrictEqual(parser.parse('f(x, y, z) = x + y + z').variables(), ['f', 'x', 'y', 'z']);
    });

    it('x = y ?? 3 + z', function () {
      assert.deepStrictEqual(new Parser().parse('x = y ?? 3 + z').variables(), ['x', 'y', 'z']);
    });
  });

  describe('symbols()', function () {
    var expr = Parser.parse('x * (y * atan2(1, 2)) + z.y.x');
    it('["x", "y", "z.y.x"]', function () {
      assert.deepStrictEqual(expr.symbols(), ['x', 'y', 'atan2', 'z']);
    });

    it('["x", "z.y.x"]', function () {
      assert.deepStrictEqual(expr.simplify({ y: 4 }).symbols(), ['x', 'atan2', 'z']);
    });

    it('["x"]', function () {
      assert.deepStrictEqual(expr.simplify({ y: 4, z: { y: { x: 5 } } }).symbols(), ['x', 'atan2']);
    });

    it('a or b ? c + d : e * f', function () {
      assert.deepStrictEqual(Parser.parse('a or b ? c + d : e * f').symbols(), ['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('user.age + 2', function () {
      assert.deepStrictEqual(Parser.parse('user.age + 2').symbols(), ['user']);
    });

    it('user.age + 2 with { withMembers: false } option', function () {
      assert.deepStrictEqual(Parser.parse('user.age + 2').symbols({ withMembers: false }), ['user']);
    });

    it('user.age + 2 with { withMembers: true } option', function () {
      var expr = Parser.parse('user.age + 2');
      assert.deepStrictEqual(expr.symbols({ withMembers: true }), ['user.age']);
    });

    it('x.y ? x.y.z : default.z with { withMembers: true } option', function () {
      var expr = Parser.parse('x.y ? x.y.z : default.z');
      assert.deepStrictEqual(expr.symbols({ withMembers: true }), ['x.y.z', 'default.z', 'x.y']);
    });

    it('x.y < 3 ? 2 * x.y.z : default.z + 1 with { withMembers: true } option', function () {
      var expr = Parser.parse('x.y < 3 ? 2 * x.y.z : default.z + 1');
      assert.deepStrictEqual(expr.symbols({ withMembers: true }), ['x.y', 'x.y.z', 'default.z']);
    });

    it('user.age with { withMembers: true } option', function () {
      var expr = Parser.parse('user.age');
      assert.deepStrictEqual(expr.symbols({ withMembers: true }), ['user.age']);
    });

    it('x with { withMembers: true } option', function () {
      var expr = Parser.parse('x');
      assert.deepStrictEqual(expr.symbols({ withMembers: true }), ['x']);
    });

    it('x with { withMembers: false } option', function () {
      var expr = Parser.parse('x');
      assert.deepStrictEqual(expr.symbols({ withMembers: false }), ['x']);
    });

    it('x = y + z', function () {
      assert.deepStrictEqual(new Parser().parse('x = y + z').symbols(), ['x', 'y', 'z']);
    });

    it('x = y ?? 3 + z', function () {
      assert.deepStrictEqual(new Parser().parse('x = y ?? 3 + z').symbols(), ['x', 'y', 'z']);
    });
  });

  describe('toString()', function () {
    var parser = new Parser();

    describe('core features', () => {
      it('2 ^ x', function () {
        assert.strictEqual(parser.parse('2 ^ x').toString(), '(2 ^ x)');
      });

      it('2 * x + 1', function () {
        assert.strictEqual(parser.parse('2 * x + 1').toString(), '((2 * x) + 1)');
      });

      it('2 + 3 * x', function () {
        assert.strictEqual(parser.parse('2 + 3 * x').toString(), '(2 + (3 * x))');
      });

      it('(2 + 3) * x', function () {
        assert.strictEqual(parser.parse('(2 + 3) * x').toString(), '((2 + 3) * x)');
      });

      it('2-3^x', function () {
        assert.strictEqual(parser.parse('2-3^x').toString(), '(2 - (3 ^ x))');
      });

      it('-2-3^x', function () {
        assert.strictEqual(parser.parse('-2-3^x').toString(), '((-2) - (3 ^ x))');
      });

      it('-3^x', function () {
        assert.strictEqual(parser.parse('-3^x').toString(), '(-(3 ^ x))');
      });

      it('(-3)^x', function () {
        assert.strictEqual(parser.parse('(-3)^x').toString(), '((-3) ^ x)');
      });

      it('2 ^ x.y', function () {
        assert.strictEqual(parser.parse('2^x.y').toString(), '(2 ^ x.y)');
      });

      it('2 + 3 * foo.bar.baz', function () {
        assert.strictEqual(parser.parse('2 + 3 * foo.bar.baz').toString(), '(2 + (3 * foo.bar.baz))');
      });

      it('sqrt 10/-1', function () {
        assert.strictEqual(parser.parse('sqrt 10/-1').toString(), '((sqrt 10) / (-1))');
      });

      it('10*-1', function () {
        assert.strictEqual(parser.parse('10*-1').toString(), '(10 * (-1))');
      });

      it('10+-1', function () {
        assert.strictEqual(parser.parse('10+-1').toString(), '(10 + (-1))');
      });

      it('10+ +1', function () {
        assert.strictEqual(parser.parse('10+ +1').toString(), '(10 + (+1))');
      });

      it('sin 2^-4', function () {
        assert.strictEqual(parser.parse('sin 2^-4').toString(), '(sin (2 ^ (-4)))');
      });

      it('a ? b : c', function () {
        assert.strictEqual(parser.parse('a ? b : c').toString(), '(a ? (b) : (c))');
      });

      it('a ? b : c ? d : e', function () {
        assert.strictEqual(parser.parse('a ? b : c ? d : e').toString(), '(a ? (b) : ((c ? (d) : (e))))');
      });

      it('a ? b ? c : d : e', function () {
        assert.strictEqual(parser.parse('a ? b ? c : d : e').toString(), '(a ? ((b ? (c) : (d))) : (e))');
      });

      it('a == 2 ? b + 1 : c * 2', function () {
        assert.strictEqual(parser.parse('a == 2 ? b + 1 : c * 2').toString(), '((a == 2) ? ((b + 1)) : ((c * 2)))');
      });

      it('floor(random() * 10)', function () {
        assert.strictEqual(parser.parse('floor(random() * 10)').toString(), '(floor (random() * 10))');
      });

      it('hypot(random(), max(2, x, y))', function () {
        assert.strictEqual(parser.parse('hypot(random(), max(2, x, y))').toString(), 'hypot(random(), max(2, x, y))');
      });

      it('not 0 or 1 and 2', function () {
        assert.strictEqual(parser.parse('not 0 or 1 and 2').toString(), '((not 0) or ((1 and (2))))');
      });

      it('a < b or c > d and e <= f or g >= h and i == j or k != l', function () {
        assert.strictEqual(parser.parse('a < b or c > d and e <= f or g >= h and i == j or k != l').toString(),
          '((((a < b) or (((c > d) and ((e <= f))))) or (((g >= h) and ((i == j))))) or ((k != l)))');
      });

      it('x = x + 1', function () {
        assert.strictEqual(parser.parse('x = x + 1').toString(), '(x = ((x + 1)))');
      });

      it('x = y = x + 1', function () {
        assert.strictEqual(parser.parse('x = y = x + 1').toString(), '(x = ((y = ((x + 1)))))');
      });

      it('3 ; 2 ; 1', function () {
        assert.strictEqual(parser.parse('3 ; 2 ; 1').toString(), '(3;(2;1))');
      });

      it('3 ; 2 ; 1 ;', function () {
        assert.strictEqual(parser.parse('3 ; 2 ; 1 ;').toString(), '(3;(2;(1)))');
      });

      it('x = 3 ; y = 4 ; z = x * y', function () {
        var parser = new Parser();
        assert.strictEqual(parser.parse('x = 3 ; y = 4 ; z = x * y').toString(), '((x = (3));((y = (4));(z = ((x * y)))))');
      });

      it('2+(x=3;y=4;z=x*y)+5', function () {
        var parser = new Parser();
        assert.strictEqual(parser.parse('2+(x=3;y=4;z=x*y)+5').toString(), '((2 + ((x = (3));((y = (4));(z = ((x * y)))))) + 5)');
      });

      it('[1, 2, 3]', function () {
        assert.strictEqual(Parser.parse('[1, 2, 3]').toString(), '[1, 2, 3]');
      });

      it('[1, 2, 3, [4, [5, 6]]]', function () {
        assert.strictEqual(Parser.parse('[1, 2, 3, [4, [5, 6]]]').toString(), '[1, 2, 3, [4, [5, 6]]]');
      });

      it('["a", ["b", ["c"]], true, 1 + 2 + 3]', function () {
        assert.strictEqual(Parser.parse('["a", ["b", ["c"]], true, 1 + 2 + 3]').toString(), '["a", ["b", ["c"]], true, ((1 + 2) + 3)]');
      });

      it('\'as\' | \'df\'', function () {
        assert.strictEqual(parser.parse('\'as\' | \'df\'').toString(), '("as" | "df")');
      });

      it('\'A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G\'', function () {
        assert.strictEqual(parser.parse('\'A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G\'').toString(), '"A\\bB\\tC\\nD\\fE\\r\'F\\\\G"');
      });

      it('negative numbers are parenthesized', function () {
        assert.strictEqual(parser.parse('x + y').simplify({ y: -2 }).toString(), '(x + (-2))');
        assert.strictEqual(parser.parse('x + (2 - 3)').simplify().toString(), '(x + (-1))');
      });

      it('(x - 1)!', function () {
        assert.strictEqual(parser.parse('(x - 1)!').toString(), '((x - 1)!)');
      });

      it('a[0]', function () {
        assert.strictEqual(parser.parse('a[0]').toString(), 'a[0]');
      });

      it('a[2 + 3]', function () {
        assert.strictEqual(parser.parse('a[2 + 3]').toString(), 'a[(2 + 3)]');
      });

      it('[1, 2+3, a, "5"]', function () {
        assert.strictEqual(parser.parse('[1, 2+3, a, "5"]').toString(), '[1, (2 + 3), a, "5"]');
      });
    });

    describe('fork features', () => {
      it('2 ?? 3 + 2', function () {
        assert.strictEqual(parser.parse('2 ?? 3 + 2').toString(), '((2 ?? 3) + 2)');
      });

      it('undefined ?? 3 + 2', function () {
        assert.strictEqual(parser.parse('undefined ?? 3 + 2').toString(), '((undefined ?? 3) + 2)');
      });

      it('as operator', function () {
        const parser = new Parser({ operators: { conversion: true } });
        assert.strictEqual(parser.parse('"1.6" as "number"').toString(), '("1.6" as "number")');
      });

      it('if/else/if case', function () {
        assert.strictEqual(
          parser.parse(
            'case when x > 0 then "greater" when x < 0 then "less" else "equal" end'
          ).toString(),
          'case when (x > 0) then "greater" when (x < 0) then "less" else "equal" end'
        );
      });

      it('switch case', function () {
        assert.strictEqual(
          parser.parse(
            'case x * x when 1 then "one" when 4 then "four" else "big" end'
          ).toString(),
          'case (x * x) when 1 then "one" when 4 then "four" else "big" end'
        );
      });

      it('object', () => {
        assert.strictEqual(
          parser.parse(
            '{ x: a + b, y: { key: a^b, value: getValue(a^b) }, z: c + "_extra" }'
          ).toString(),
          '{ x: (a + b), y: { key: (a ^ b), value: getValue((a ^ b)) }, z: (c + "_extra") }'
        );
      });
    });
  });

  describe('toJSFunction()', function () {
    var parser = new Parser();

    describe('core features', () => {
      it('2 ^ x', function () {
        var expr = parser.parse('2 ^ x');
        var f = expr.toJSFunction('x');
        assert.strictEqual(f(2), 4);
        assert.strictEqual(f(3), 8);
        assert.strictEqual(f(-1), 0.5);
      });

      it('x | y', function () {
        var expr = parser.parse('x | y');
        var f = expr.toJSFunction('x, y');
        assert.strictEqual(f(4, 2), '42');
      });

      it('[4, 3] | [1, 2]', function () {
        var expr = parser.parse('x | y');
        var f = expr.toJSFunction('x, y');
        assert.deepStrictEqual(f([ 4, 3 ], [ 1, 2 ]), [ 4, 3, 1, 2 ]);
      });

      it('x = x + 1', function () {
        var expr = parser.parse('x = x + 1');
        var f = expr.toJSFunction('x');
        assert.strictEqual(f(4), 5);
      });

      it('y = 4 ; z = x < 5 ? x * y : x / y', function () {
        var expr = parser.parse('y = 4 ; z = x < 5 ? x * y : x / y');
        var f = expr.toJSFunction('x');
        assert.strictEqual(f(3), 12);
      });

      it('(sqrt y) + max(3, 1) * (x ? -y : z)', function () {
        var expr = parser.parse('(sqrt y) + max(3, 1) * (x ? -y : z)');
        var f = expr.toJSFunction('x,y,z');
        assert.strictEqual(f(true, 4, 3), -10);
        assert.strictEqual(f(false, 4, 3), 11);
      });

      it('should throw when missing parameter', function () {
        var expr = parser.parse('x * (y * atan(1))');
        var f = expr.toJSFunction(['x', 'y']);
        assert.strictEqual(f(2, 4), 6.283185307179586);

        f = expr.toJSFunction(['y']);
        assert.throws(function () { return f(4); }, Error);
      });

      it('should simplify first', function () {
        var expr = parser.parse('x * (y * atan(1))');
        var f = expr.toJSFunction(['y'], { x: 2 });
        assert.strictEqual(f(4), 6.283185307179586);
      });

      it('2 * x + 1', function () {
        assert.strictEqual(parser.parse('2 * x + 1').toJSFunction('x')(4), 9);
      });

      it('2 + 3 * x', function () {
        assert.strictEqual(parser.parse('2 + 3 * x').toJSFunction('x')(5), 17);
      });

      it('2-3^x', function () {
        assert.strictEqual(parser.parse('2-3^x').toJSFunction('x')(2), -7);
      });

      it('-2-3^x', function () {
        assert.strictEqual(parser.parse('-2-3^x').toJSFunction('x')(2), -11);
      });

      it('-3^x', function () {
        assert.strictEqual(parser.parse('-3^x').toJSFunction('x')(4), -81);
      });

      it('(-3)^x', function () {
        assert.strictEqual(parser.parse('(-3)^x').toJSFunction('x')(4), 81);
      });

      it('2 ^ x.y', function () {
        assert.strictEqual(parser.parse('2^x.y').toJSFunction('x')({ y: 5 }), 32);
      });

      it('2 + 3 * foo.bar.baz', function () {
        assert.strictEqual(parser.parse('2 + 3 * foo.bar.baz').toJSFunction('foo')({ bar: { baz: 5 } }), 17);
      });

      it('sqrt 10/-1', function () {
        assert.strictEqual(parser.parse('sqrt 10/-1').toJSFunction()(), -Math.sqrt(10));
      });

      it('10*-1', function () {
        assert.strictEqual(parser.parse('10*-1').toJSFunction()(), -10);
      });

      it('10+-1', function () {
        assert.strictEqual(parser.parse('10+-1').toJSFunction()(), 9);
      });

      it('10+ +1', function () {
        assert.strictEqual(parser.parse('10+ +1').toJSFunction()(), 11);
      });

      it('sin 2^-4', function () {
        assert.strictEqual(parser.parse('sin 2^-4').toJSFunction('x')(4), Math.sin(1 / 16));
      });

      it('a ? b : c', function () {
        assert.strictEqual(parser.parse('a ? b : c').toJSFunction('a,b,c')(1, 2, 3), 2);
        assert.strictEqual(parser.parse('a ? b : c').toJSFunction('a,b,c')(0, 2, 3), 3);
      });

      it('a ? b : c ? d : e', function () {
        assert.strictEqual(parser.parse('a ? b : c ? d : e').toJSFunction('a,b,c,d,e')(1, 2, 3, 4, 5), 2);
        assert.strictEqual(parser.parse('a ? b : c ? d : e').toJSFunction('a,b,c,d,e')(0, 2, 3, 4, 5), 4);
        assert.strictEqual(parser.parse('a ? b : c ? d : e').toJSFunction('a,b,c,d,e')(0, 2, 0, 4, 5), 5);
        assert.strictEqual(parser.parse('a ? b : c ? d : e').toJSFunction('a,b,c,d,e')(1, 2, 0, 4, 5), 2);
      });

      it('a ? b ? c : d : e', function () {
        assert.strictEqual(parser.parse('a ? b ? c : d : e').toJSFunction('a,b,c,d,e')(1, 2, 3, 4, 5), 3);
        assert.strictEqual(parser.parse('a ? b ? c : d : e').toJSFunction('a,b,c,d,e')(0, 2, 3, 4, 5), 5);
        assert.strictEqual(parser.parse('a ? b ? c : d : e').toJSFunction('a,b,c,d,e')(1, 0, 3, 4, 5), 4);
        assert.strictEqual(parser.parse('a ? b ? c : d : e').toJSFunction('a,b,c,d,e')(0, 0, 3, 4, 5), 5);
      });

      it('a == 2 ? b + 1 : c * 2', function () {
        assert.strictEqual(parser.parse('a == 2 ? b + 1 : c * 2').toJSFunction('a,b,c')(2, 4, 8), 5);
        assert.strictEqual(parser.parse('a == 2 ? b + 1 : c * 2').toJSFunction('a,b,c')(1, 4, 8), 16);
        assert.strictEqual(parser.parse('a == 2 ? b + 1 : c * 2').toJSFunction('a,b,c')('2', 4, 8), 16);
      });

      it('floor(random() * 10)', function () {
        var fn = Parser.parse('floor(random() * 10)').toJSFunction();
        var counts = {};
          for (var i = 0; i < 1000; i++) {
            var x = fn();
            counts[x] = (counts[x] || 0) + 1;
          }
          for (i = 0; i < 10; i++) {
            assert.ok(counts[i] >= 85 && counts[i] <= 115);
          }
          assert.deepStrictEqual(Object.keys(counts).sort(), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
      });

      it('hypot(f(), max(2, x, y))', function () {
        assert.strictEqual(parser.parse('hypot(f(), max(2, x, y))').toJSFunction('f, x, y')(function () { return 3; }, 4, 1), 5);
      });

      it('not x or y and z', function () {
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(0, 0, 0), true);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(0, 0, 1), true);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(0, 1, 0), true);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(0, 1, 1), true);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(1, 0, 0), false);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(1, 0, 1), false);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(1, 1, 0), false);
        assert.strictEqual(parser.parse('not x or y and z').toJSFunction('x,y,z')(1, 1, 1), true);
      });

      it('a < b or c > d', function () {
        assert.strictEqual(parser.parse('a < b or c > d').toJSFunction('a,b,c,d')(1, 2, 3, 4), true);
        assert.strictEqual(parser.parse('a < b or c > d').toJSFunction('a,b,c,d')(2, 2, 3, 4), false);
        assert.strictEqual(parser.parse('a < b or c > d').toJSFunction('a,b,c,d')(2, 2, 5, 4), true);
      });

      it('e <= f or g >= h', function () {
        assert.strictEqual(parser.parse('e <= f or g >= h').toJSFunction('e,f,g,h')(1, 2, 3, 4), true);
        assert.strictEqual(parser.parse('e <= f or g >= h').toJSFunction('e,f,g,h')(2, 2, 3, 4), true);
        assert.strictEqual(parser.parse('e <= f or g >= h').toJSFunction('e,f,g,h')(3, 2, 5, 4), true);
        assert.strictEqual(parser.parse('e <= f or g >= h').toJSFunction('e,f,g,h')(3, 2, 4, 4), true);
        assert.strictEqual(parser.parse('e <= f or g >= h').toJSFunction('e,f,g,h')(3, 2, 3, 4), false);
      });

      it('i == j or k != l', function () {
        assert.strictEqual(parser.parse('i == j or k != l').toJSFunction('i,j,k,l')(1, 2, 3, 4), true);
        assert.strictEqual(parser.parse('i == j or k != l').toJSFunction('i,j,k,l')(2, 2, 3, 4), true);
        assert.strictEqual(parser.parse('i == j or k != l').toJSFunction('i,j,k,l')(1, 2, 4, 4), false);
        assert.strictEqual(parser.parse('i == j or k != l').toJSFunction('i,j,k,l')('2', 2, 4, 4), false);
        assert.strictEqual(parser.parse('i == j or k != l').toJSFunction('i,j,k,l')('2', 2, '4', 4), true);
      });

      it('short-circuits and', function () {
        assert.strictEqual(parser.parse('a and fail()').toJSFunction('a')(false), false);
      });

      it('short-circuits or', function () {
        assert.strictEqual(parser.parse('a or fail()').toJSFunction('a')(true), true);
      });

      it('\'as\' | s', function () {
        assert.strictEqual(parser.parse('\'as\' | s').toJSFunction('s')('df'), 'asdf');
        assert.strictEqual(parser.parse('\'as\' | s').toJSFunction('s')(4), 'as4');
      });

      it('\'A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G\'', function () {
        assert.strictEqual(parser.parse('\'A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G\'').toJSFunction()(), 'A\bB\tC\nD\fE\r\'F\\G');
      });

      it('"A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G"', function () {
        assert.strictEqual(parser.parse('"A\\bB\\tC\\nD\\fE\\r\\\'F\\\\G"').toJSFunction()(), 'A\bB\tC\nD\fE\r\'F\\G');
      });

      it('"\\u2028 and \\u2029"', function () {
        assert.strictEqual(parser.parse('"\\u2028 and \\u2029 \\u2028\\u2029"').toJSFunction()(), '\u2028 and \u2029 \u2028\u2029');
      });

      it('(x - 1)!', function () {
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(1), 1);
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(2), 1);
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(3), 2);
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(4), 6);
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(5), 24);
        assert.strictEqual(parser.parse('(x - 1)!').toJSFunction('x')(6), 120);
      });

      it('(f(x) = g(y) = x * y)(a)(b)', function () {
        var f = parser.parse('(f(x) = g(y) = x * y)(a)(b)').toJSFunction('a,b');
        assert.strictEqual(f(3, 4), 12);
        assert.strictEqual(f(4, 5), 20);
      });

      it('[x, y, z]', function () {
        assert.deepStrictEqual(parser.parse('[x, y, z]').toJSFunction('x,y,z')(1, 2, 3), [1, 2, 3]);
      });

      it('[x, [y, [z]]]', function () {
        assert.deepStrictEqual(parser.parse('[x, [y, [z]]]').toJSFunction('x,y,z')('abc', true, 3), ['abc', [true, [3]]]);
      });

      it('a[2]', function () {
        assert.strictEqual(parser.parse('a[2]').toJSFunction('a')([ 1, 2, 3 ]), 3);
      });

      it('a[2.9]', function () {
        assert.strictEqual(parser.parse('a[2.9]').toJSFunction('a')([ 1, 2, 3, 4, 5 ]), 3);
      });

      it('a[n]', function () {
        assert.strictEqual(parser.parse('a[n]').toJSFunction('a,n')([ 1, 2, 3 ], 0), 1);
        assert.strictEqual(parser.parse('a[n]').toJSFunction('a,n')([ 1, 2, 3 ], 1), 2);
        assert.strictEqual(parser.parse('a[n]').toJSFunction('a,n')([ 1, 2, 3 ], 2), 3);
      });

      it('a["foo"]', function () {
        assert.strictEqual(parser.parse('a["foo"]').toJSFunction('a')({ foo: 42 }), undefined);
      });

      it('[1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]', function () {
        var exp = parser.parse('[1, 2+3, 4*5, 6/7, [8, 9, 10], "1" | "1"]');
        assert.strictEqual(JSON.stringify(exp.toJSFunction()()), JSON.stringify([1, 5, 20, 6 / 7, [8, 9, 10], '11']));
      });
    });

    describe('fork features', () => {
      /*
      NOTE: Expressions with the following cannot be converted to JS functions.
        * case/when blocks
      */

      it('a ?? b + c', function () {
        assert.strictEqual(Parser.parse('a ?? b + c').toJSFunction('a,b,c')(1, 2, 3), 4);
        assert.strictEqual(Parser.parse('a ?? b + c').toJSFunction('a,b,c')(undefined, 2, 3), 5);
      });

      it('as operator', function () {
        const parser = new Parser({ operators: { conversion: true } });
        assert.strictEqual(parser.parse('"1.6" as "int"').toJSFunction()(), 2);
      });

      it('object', () => {
        var parser2 = new Parser();
        parser2.functions.getValue = v => `${v}`;
        assert.notStrictEqual(
          parser2.parse(
            '{ x: a + b, y: { key: a^b, value: getValue(a^b) }, z: c + "_extra" }'
          ).toJSFunction('a,b,c')(1, 2, 'c_value'),
          {
            x: 3,
            y: { key: 1, value: '1' },
            z: 'c_value_extra'
          }
        );
      });

      it('case is not supported', function () {
        assert.throws(
          () => {
            parser.parse(
              'case when x > 0 then "greater" when x < 0 then "less" else "equal" end'
            ).toJSFunction('x')(3);
          },
          /Unexpected token 'case'/
        );
      });
    });
  });
});
