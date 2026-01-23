/* global describe, it */

import assert from 'assert';
import { Parser } from '../../index';

describe('Arrow Function Support', function () {
  describe('Single parameter arrow functions (x => expr)', function () {
    it('should work with map function', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x * 2, [1, 2, 3])'), [2, 4, 6]);
    });

    it('should work with filter function', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(x => x > 2, [1, 2, 3, 4])'), [3, 4]);
    });

    it('should work with complex expressions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x * x + 1, [1, 2, 3])'), [2, 5, 10]);
    });

    it('should work with member access', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(x => x.value, items)', { items: [{ value: 1 }, { value: 2 }, { value: 3 }] }),
        [1, 2, 3]
      );
    });

    it('should work with nested member access', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(x => x.user.name, items)', {
          items: [{ user: { name: 'Alice' } }, { user: { name: 'Bob' } }]
        }),
        ['Alice', 'Bob']
      );
    });

    it('should work with comparison in body', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('filter(x => x.age > 25, users)', {
          users: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 20 }, { name: 'Charlie', age: 35 }]
        }),
        [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]
      );
    });

    it('should work with boolean expressions', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter(x => x and true, [true, false, true])'), [true, true]);
    });

    it('should work with ternary in body', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x > 2 ? 1 : 0, [1, 2, 3, 4])'), [0, 0, 1, 1]);
    });

    it('should work with undefined values', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('map(x => x * 2, undefined)'), undefined);
    });
  });

  describe('Multi-parameter arrow functions ((x, y) => expr)', function () {
    it('should work with fold function', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold((acc, x) => acc + x, 0, [1, 2, 3, 4, 5])'), 15);
    });

    it('should work with fold for multiplication', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold((acc, x) => acc * x, 1, [1, 2, 3, 4, 5])'), 120);
    });

    it('should work with index parameter in map', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map((x, i) => x + i, [10, 20, 30])'), [10, 21, 32]);
    });

    it('should work with index parameter in filter', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('filter((x, i) => i > 1, [10, 20, 30, 40])'), [30, 40]);
    });

    it('should work with three parameters in fold', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('fold((acc, x, i) => acc + x * i, 0, [1, 2, 3, 4])'), 20);
    });

    it('should handle multi-parameter with member access', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map((item, idx) => item.value + idx, items)', {
          items: [{ value: 10 }, { value: 20 }, { value: 30 }]
        }),
        [10, 21, 32]
      );
    });
  });

  describe('Empty parameter arrow functions (() => expr)', function () {
    it('should create a zero-argument function', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('(() => 42)()'), 42);
    });

    it('should work with complex expressions', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('(() => 2 + 3 * 4)()'), 14);
    });
  });

  describe('Nested arrow functions', function () {
    it('should work with nested map calls', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(row => map(x => x * 2, row), matrix)', {
          matrix: [[1, 2], [3, 4]]
        }),
        [[2, 4], [6, 8]]
      );
    });

    it('should work with deeply nested arrays', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(a => map(b => map(c => c + 1, b), a), data)', {
          data: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
        }),
        [[[2, 3], [4, 5]], [[6, 7], [8, 9]]]
      );
    });
  });

  describe('Arrow functions with operators', function () {
    it('should work with arithmetic operators', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x + 1 - 2 * 3 / 2, [10, 20, 30])'), [8, 18, 28]);
    });

    it('should work with concatenation operator', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(x => x | "!", ["hello", "world"])'),
        ['hello!', 'world!']
      );
    });

    it('should work with comparison operators', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x == 2, [1, 2, 3])'), [false, true, false]);
      assert.deepStrictEqual(parser.evaluate('map(x => x != 2, [1, 2, 3])'), [true, false, true]);
      assert.deepStrictEqual(parser.evaluate('map(x => x >= 2, [1, 2, 3])'), [false, true, true]);
      assert.deepStrictEqual(parser.evaluate('map(x => x <= 2, [1, 2, 3])'), [true, true, false]);
    });
  });

  describe('Arrow functions with built-in functions in body', function () {
    it('should work with abs', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => abs(x), [-1, -2, 3])'), [1, 2, 3]);
    });

    it('should work with floor and ceil', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => floor(x), [1.5, 2.7, 3.1])'), [1, 2, 3]);
      assert.deepStrictEqual(parser.evaluate('map(x => ceil(x), [1.5, 2.7, 3.1])'), [2, 3, 4]);
    });

    it('should work with length', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => length(x), ["a", "ab", "abc"])'), [1, 2, 3]);
    });
  });

  describe('Arrow functions vs traditional function definition', function () {
    it('should produce same results as f(x) = expr syntax', function () {
      const parser = new Parser();
      // Traditional syntax
      const traditional = parser.evaluate('f(x) = x * 2; map(f, [1, 2, 3])');
      // Arrow syntax
      const arrow = parser.evaluate('map(x => x * 2, [1, 2, 3])');
      assert.deepStrictEqual(arrow, traditional);
    });

    it('should produce same results with multi-parameter', function () {
      const parser = new Parser();
      // Traditional syntax
      const traditional = parser.evaluate('f(a, b) = a + b; fold(f, 0, [1, 2, 3, 4, 5])');
      // Arrow syntax
      const arrow = parser.evaluate('fold((a, b) => a + b, 0, [1, 2, 3, 4, 5])');
      assert.deepStrictEqual(arrow, traditional);
    });
  });

  describe('Arrow function toString()', function () {
    it('should serialize single parameter arrow function', function () {
      const parser = new Parser();
      const expr = parser.parse('map(x => x * 2, arr)');
      const str = expr.toString();
      assert.ok(str.includes('=>'), 'Should contain arrow operator');
    });

    it('should serialize multi-parameter arrow function', function () {
      const parser = new Parser();
      const expr = parser.parse('fold((a, b) => a + b, 0, arr)');
      const str = expr.toString();
      assert.ok(str.includes('=>'), 'Should contain arrow operator');
    });
  });

  describe('Edge cases', function () {
    it('should work with single element array', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x * 2, [5])'), [10]);
    });

    it('should work with empty array', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => x * 2, [])'), []);
    });

    it('should work with variables from outer scope', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('map(x => x * multiplier, [1, 2, 3])', { multiplier: 10 }),
        [10, 20, 30]
      );
    });

    it('should handle arrow function in variable assignment', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('fn = x => x * 2; map(fn, [1, 2, 3])'), [2, 4, 6]);
    });

    it('should handle arrow function with parenthesized body', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map(x => (x + 1) * 2, [1, 2, 3])'), [4, 6, 8]);
    });

    it('should handle whitespace variations', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('map( x => x * 2 , [1, 2, 3])'), [2, 4, 6]);
      assert.deepStrictEqual(parser.evaluate('map(x=>x*2,[1,2,3])'), [2, 4, 6]);
    });
  });
});
