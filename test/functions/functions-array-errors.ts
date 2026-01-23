/* global describe, it */

import { Parser } from '../../index';
import { expect } from 'vitest';

describe('Array Function Error Messages', function () {
  describe('filter()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('filter(42, [1, 2, 3])')).toThrow(
        /filter\(predicate, array\) expects a function as first argument, got number/
      );
      expect(() => parser.evaluate('filter(42, [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(x) = x > 0; filter(f, "not an array")')).toThrow(
        /filter\(predicate, array\) expects an array as second argument, got string/
      );
      expect(() => parser.evaluate('f(x) = x > 0; filter(f, "not an array")')).toThrow(/Example:/);
    });
  });

  describe('map()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('map("not a function", [1, 2, 3])')).toThrow(
        /map\(mapper, array\) expects a function as first argument, got string/
      );
      expect(() => parser.evaluate('map("not a function", [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(x) = x * 2; map(f, 123)')).toThrow(
        /map\(mapper, array\) expects an array as second argument, got number/
      );
    });
  });

  describe('fold()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('fold(null, 0, [1, 2, 3])', { null: null })).toThrow(
        /fold\(reducer, initial, array\) expects a function as first argument, got null/
      );
      expect(() => parser.evaluate('fold(null, 0, [1, 2, 3])', { null: null })).toThrow(/Example:/);
    });

    it('should provide user-friendly error when third argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(a, b) = a + b; fold(f, 0, {a: 1})')).toThrow(
        /fold\(reducer, initial, array\) expects an array as third argument, got object/
      );
    });
  });

  describe('reduce()', function () {
    it('should provide user-friendly error from fold when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('reduce(true, 0, [1, 2, 3])')).toThrow(
        /fold\(reducer, initial, array\) expects a function as first argument, got boolean/
      );
    });
  });

  describe('find()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('find([1, 2], [1, 2, 3])')).toThrow(
        /find\(predicate, array\) expects a function as first argument, got array/
      );
      expect(() => parser.evaluate('find([1, 2], [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(x) = x > 0; find(f, 99)')).toThrow(
        /find\(predicate, array\) expects an array as second argument, got number/
      );
    });
  });

  describe('some()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('some(5, [1, 2, 3])')).toThrow(
        /some\(predicate, array\) expects a function as first argument, got number/
      );
    });

    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(x) = x > 0; some(f, "string")')).toThrow(
        /some\(predicate, array\) expects an array as second argument, got string/
      );
    });
  });

  describe('every()', function () {
    it('should provide user-friendly error when first argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('every({a: 1}, [1, 2, 3])')).toThrow(
        /every\(predicate, array\) expects a function as first argument, got object/
      );
    });

    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('f(x) = x > 0; every(f, false)')).toThrow(
        /every\(predicate, array\) expects an array as second argument, got boolean/
      );
    });
  });

  describe('indexOf()', function () {
    it('should provide user-friendly error when second argument is not an array or string', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('indexOf(1, 123)')).toThrow(
        /indexOf\(target, arrayOrString\) expects a string or array as second argument, got number/
      );
      expect(() => parser.evaluate('indexOf(1, 123)')).toThrow(/Example:/);
    });
  });

  describe('join()', function () {
    it('should provide user-friendly error when second argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('join(", ", "not array")')).toThrow(
        /join\(separator, array\) expects an array as second argument, got string/
      );
      expect(() => parser.evaluate('join(", ", "not array")')).toThrow(/Example:/);
    });
  });

  describe('sum()', function () {
    it('should provide user-friendly error when argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('sum(42)')).toThrow(
        /sum\(array\) expects an array as argument, got number/
      );
      expect(() => parser.evaluate('sum(42)')).toThrow(/Example:/);
    });
  });

  describe('count()', function () {
    it('should provide user-friendly error when argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('count("string")')).toThrow(
        /count\(array\) expects an array as argument, got string/
      );
      expect(() => parser.evaluate('count("string")')).toThrow(/Example:/);
    });
  });

  describe('unique()', function () {
    it('should provide user-friendly error when argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('unique(123)')).toThrow(
        /unique\(array\) expects an array as argument, got number/
      );
      expect(() => parser.evaluate('unique(123)')).toThrow(/Example:/);
    });
  });

  describe('distinct()', function () {
    it('should provide user-friendly error from unique when argument is not an array', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('distinct({a: 1})')).toThrow(
        /unique\(array\) expects an array as argument, got object/
      );
    });
  });
});
