/* global describe, it */

import { Parser } from '../../index';
import { expect } from 'vitest';

describe('Array Function Error Messages', function () {
  describe('filter()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('filter(42, [1, 2, 3])')).toThrow(
        /filter\(array, predicate\) expects an array and a function/
      );
      expect(() => parser.evaluate('filter(42, [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('filter([1, 2, 3], "not a function")')).toThrow(
        /filter\(array, predicate\) expects an array and a function/
      );
      expect(() => parser.evaluate('filter([1, 2, 3], "not a function")')).toThrow(/Example:/);
    });
  });

  describe('map()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('map("not a function", [1, 2, 3])')).toThrow(
        /map\(array, mapper\) expects an array and a function/
      );
      expect(() => parser.evaluate('map("not a function", [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('map([1, 2, 3], 123)')).toThrow(
        /map\(array, mapper\) expects an array and a function/
      );
    });
  });

  describe('fold()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('fold(null, 0, [1, 2, 3])', { null: null })).toThrow(
        /fold\(array, initial, reducer\) expects an array, initial value, and a function/
      );
      expect(() => parser.evaluate('fold(null, 0, [1, 2, 3])', { null: null })).toThrow(/Example:/);
    });

    it('should provide user-friendly error when third argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('fold([1, 2, 3], 0, {a: 1})')).toThrow(
        /fold\(array, initial, reducer\) expects an array, initial value, and a function/
      );
    });
  });

  describe('reduce()', function () {
    it('should provide user-friendly error from fold when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('reduce(true, 0, [1, 2, 3])')).toThrow(
        /fold\(array, initial, reducer\) expects an array, initial value, and a function/
      );
    });
  });

  describe('find()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('find([1, 2], [1, 2, 3])')).toThrow(
        /find\(array, predicate\) expects an array and a function/
      );
      expect(() => parser.evaluate('find([1, 2], [1, 2, 3])')).toThrow(/Example:/);
    });

    it('should provide user-friendly error when second argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('find([1, 2, 3], 99)')).toThrow(
        /find\(array, predicate\) expects an array and a function/
      );
    });
  });

  describe('some()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('some(5, [1, 2, 3])')).toThrow(
        /some\(array, predicate\) expects an array and a function/
      );
    });

    it('should provide user-friendly error when second argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('some([1, 2, 3], "string")')).toThrow(
        /some\(array, predicate\) expects an array and a function/
      );
    });
  });

  describe('every()', function () {
    it('should provide user-friendly error when arguments are invalid', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('every({a: 1}, [1, 2, 3])')).toThrow(
        /every\(array, predicate\) expects an array and a function/
      );
    });

    it('should provide user-friendly error when second argument is not a function', function () {
      const parser = new Parser();
      expect(() => parser.evaluate('every([1, 2, 3], false)')).toThrow(
        /every\(array, predicate\) expects an array and a function/
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
