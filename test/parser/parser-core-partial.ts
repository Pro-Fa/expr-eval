import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Parser Core Functionality Tests - Converted from parser.js
// Tests for basic parsing functionality including comments, whitespace, variables, strings, arrays

describe('Parser Core Functionality TypeScript Test', () => {
  [
    { name: 'normal parse()', parser: new Parser() },
    { name: 'disallowing member access', parser: new Parser({ allowMemberAccess: false }) }
  ].forEach(({ name, parser }) => {
    describe(name, () => {
      describe('comments and whitespace', () => {
        it('should skip comments', () => {
          expect(parser.evaluate('2/* comment */+/* another comment */3')).toBe(5);
          expect(parser.evaluate('2/* comment *///* another comment */3')).toBe(2 / 3);
          expect(parser.evaluate('/* comment at the beginning */2 + 3/* unterminated comment')).toBe(5);
          expect(parser.evaluate('2 +/* comment\n with\n multiple\n lines */3')).toBe(5);
        });

        it('should ignore whitespace', () => {
          expect(parser.evaluate(' 3\r + \n \t 4 ')).toBe(7);
        });
      });

      describe('variable parsing', () => {
        it('should accept variables starting with E', () => {
          expect(parser.parse('2 * ERGONOMIC').evaluate({ ERGONOMIC: 1000 })).toBe(2000);
        });

        it('should accept variables starting with PI', () => {
          expect(parser.parse('1 / PITTSBURGH').evaluate({ PITTSBURGH: 2 })).toBe(0.5);
        });

        it('should parse variables that start with operators', () => {
          expect(parser.parse('org > 5').toString()).toBe('(org > 5)');
          expect(parser.parse('android * 2').toString()).toBe('(android * 2)');
          expect(parser.parse('single == 1').toString()).toBe('(single == 1)');
        });

        it('should parse valid variable names correctly', () => {
          expect(parser.parse('a').variables()).toEqual(['a']);
          expect(parser.parse('abc').variables()).toEqual(['abc']);
          expect(parser.parse('a+b').variables()).toEqual(['a', 'b']);
          expect(parser.parse('ab+c').variables()).toEqual(['ab', 'c']);
          expect(parser.parse('a1').variables()).toEqual(['a1']);
          expect(parser.parse('a_1').variables()).toEqual(['a_1']);
          expect(parser.parse('a_').variables()).toEqual(['a_']);
          expect(parser.parse('a_c').variables()).toEqual(['a_c']);
          expect(parser.parse('A').variables()).toEqual(['A']);
          expect(parser.parse('ABC').variables()).toEqual(['ABC']);
          expect(parser.parse('A+B').variables()).toEqual(['A', 'B']);
          expect(parser.parse('AB+C').variables()).toEqual(['AB', 'C']);
          expect(parser.parse('A1').variables()).toEqual(['A1']);
          expect(parser.parse('A_1').variables()).toEqual(['A_1']);
          expect(parser.parse('A_').variables()).toEqual(['A_']);
          expect(parser.parse('A_C').variables()).toEqual(['A_C']);
          expect(parser.parse('abc123').variables()).toEqual(['abc123']);
          expect(parser.parse('abc123+def456*ghi789/jkl0').variables()).toEqual(['abc123', 'def456', 'ghi789', 'jkl0']);
          expect(parser.parse('_').variables()).toEqual(['_']);
          expect(parser.parse('_x').variables()).toEqual(['_x']);
          expect(parser.parse('$x').variables()).toEqual(['$x']);
          expect(parser.parse('$xyz').variables()).toEqual(['$xyz']);
          expect(parser.parse('$a_sdf').variables()).toEqual(['$a_sdf']);
          expect(parser.parse('$xyz_123').variables()).toEqual(['$xyz_123']);
          expect(parser.parse('_xyz_123').variables()).toEqual(['_xyz_123']);
        });

        it('should not parse invalid variables', () => {
          expect(() => parser.parse('a$x')).toThrow();
          expect(() => parser.parse('ab$')).toThrow();
        });

        it('should not parse a single $ as a variable', () => {
          expect(() => parser.parse('$')).toThrow();
        });

        it('should not allow leading digits in variable names', () => {
          expect(() => parser.parse('1a')).toThrow();
          expect(() => parser.parse('1_')).toThrow();
          expect(() => parser.parse('1_a')).toThrow();
        });

        it('should not allow leading digits or _ after $ in variable names', () => {
          expect(() => parser.parse('$0')).toThrow();
          expect(() => parser.parse('$1a')).toThrow();
          expect(() => parser.parse('$_')).toThrow();
          expect(() => parser.parse('$_x')).toThrow();
        });
      });

      describe('basic syntax errors', () => {
        it('should fail on empty parentheses', () => {
          expect(() => parser.parse('5/()')).toThrow();
        });

        it('should fail on 5/', () => {
          expect(() => parser.parse('5/')).toThrow();
        });

        it('should fail on unknown characters', () => {
          expect(() => parser.parse('1 + @')).toThrow();
        });

        it('should fail with partial operators', () => {
          expect(() => parser.parse('2 = 2')).toThrow();
          expect(() => parser.parse('2 ! 3')).toThrow();
          expect(() => parser.parse('1 o 0')).toThrow();
          expect(() => parser.parse('1 an 2')).toThrow();
          expect(() => parser.parse('1 a 2')).toThrow();
        });
      });

      describe('undefined parsing', () => {
        it('should parse undefined', () => {
          expect(parser.evaluate('undefined')).toBe(undefined);
        });
      });

      describe('string parsing', () => {
        it('should parse strings', () => {
          expect(parser.evaluate('\'asdf\'')).toBe('asdf');
          expect(parser.evaluate('"asdf"')).toBe('asdf');
          expect(parser.evaluate('""')).toBe('');
          expect(parser.evaluate('\'\'')).toBe('');
          expect(parser.evaluate('"  "')).toBe('  ');
          expect(parser.evaluate('"a\nb\tc"')).toBe('a\nb\tc');
          expect(parser.evaluate('"Nested \'single quotes\'"')).toBe('Nested \'single quotes\'');
          expect(parser.evaluate('\'Nested "double quotes"\'')).toBe('Nested "double quotes"');
          expect(parser.evaluate('\'Single quotes \\\'inside\\\' single quotes\'')).toBe('Single quotes \'inside\' single quotes');
          expect(parser.evaluate('"Double quotes \\"inside\\" double quotes"')).toBe('Double quotes "inside" double quotes');
          expect(parser.evaluate('"\n"')).toBe('\n');
          expect(parser.evaluate('"\\\'\\"\\\\\/\\b\\f\\n\\r\\t\\u1234"')).toBe('\'"\\/\b\f\n\r\t\u1234');
          expect(parser.evaluate('"\'\\"\\\\\\/\\b\\f\\n\\r\\t\\u1234"')).toBe('\'"\\/\b\f\n\r\t\u1234');
          expect(parser.evaluate('\'\\\'\\"\\\\\/\\b\\f\\n\\r\\t\\u1234\'')).toBe('\'"\\/\b\f\n\r\t\u1234');
          expect(parser.evaluate('\'\\\'"\\\\\\/\\b\\f\\n\\r\\t\\u1234\'')).toBe('\'"\\/\b\f\n\r\t\u1234');
          expect(parser.evaluate('"\\uFFFF"')).toBe('\uFFFF');
          expect(parser.evaluate('"\\u0123"')).toBe('\u0123');
          expect(parser.evaluate('"\\u4567"')).toBe('\u4567');
          expect(parser.evaluate('"\\u89ab"')).toBe('\u89ab');
          expect(parser.evaluate('"\\ucdef"')).toBe('\ucdef');
          expect(parser.evaluate('"\\uABCD"')).toBe('\uABCD');
          expect(parser.evaluate('"\\uEF01"')).toBe('\uEF01');
          expect(parser.evaluate('"\\u11111"')).toBe('\u11111');
        });

        it('should fail on bad strings', () => {
          expect(() => parser.parse('\'asdf"')).toThrow();
          expect(() => parser.parse('"asdf\'')).toThrow();
          expect(() => parser.parse('"asdf')).toThrow();
          expect(() => parser.parse('\'asdf')).toThrow();
          expect(() => parser.parse('\'asdf\\')).toThrow();
          expect(() => parser.parse('\'')).toThrow();
          expect(() => parser.parse('"')).toThrow();
          expect(() => parser.parse('"\\x"')).toThrow();
          expect(() => parser.parse('"\\u123"')).toThrow();
          expect(() => parser.parse('"\\u12"')).toThrow();
          expect(() => parser.parse('"\\u1"')).toThrow();
          expect(() => parser.parse('"\\uGGGG"')).toThrow();
        });
      });

      describe('array parsing', () => {
        it('should parse arrays correctly', () => {
          expect(parser.evaluate('[1, 2, 3]')).toEqual([1, 2, 3]);
        });

        it('should parse empty arrays correctly', () => {
          expect(parser.evaluate('[]')).toEqual([]);
        });

        it('should fail with missing ]', () => {
          expect(() => parser.parse('[1, 2')).toThrow();
        });
      });

      describe('function-like operator parsing', () => {
        it('should parse operators that look like functions as function calls', () => {
          expect(parser.parse('sin x').evaluate({ x: 1 })).toBe(Math.sin(1));
          expect(parser.parse('cos x').evaluate({ x: 1 })).toBe(Math.cos(1));
          expect(parser.parse('tan x').evaluate({ x: 1 })).toBe(Math.tan(1));
          expect(parser.parse('not x').evaluate({ x: 1 })).toBe(false);
        });

        it('should parse named prefix operators as function names at the end of expressions', () => {
          const expectedValues = [
            ['sin', Math.sin],
            ['cos', Math.cos],
            ['tan', Math.tan],
            ['asin', Math.asin],
            ['acos', Math.acos],
            ['atan', Math.atan],
            ['sinh', Math.sinh],
            ['cosh', Math.cosh],
            ['tanh', Math.tanh],
            ['asinh', Math.asinh],
            ['acosh', Math.acosh],
            ['atanh', Math.atanh],
            ['sqrt', Math.sqrt],
            ['log', Math.log],
            ['ln', Math.log],
            ['log10', Math.log10],
            ['abs', Math.abs],
            ['ceil', Math.ceil],
            ['floor', Math.floor],
            ['round', Math.round],
            ['trunc', Math.trunc],
            ['exp', Math.exp],
            ['sign', Math.sign]
          ];

          expectedValues.forEach(([name, mathFunc]) => {
            expect(parser.parse(`${name} 2`).evaluate()).toBe((mathFunc as Function)(2));
            expect(parser.parse(`1 + ${name} 2`).evaluate()).toBe(1 + (mathFunc as Function)(2));
            expect(parser.parse(`${name} 2 + 1`).evaluate()).toBe((mathFunc as Function)(2) + 1);
            expect(parser.parse(`1 + ${name} 2 + 1`).evaluate()).toBe(1 + (mathFunc as Function)(2) + 1);
            expect(parser.parse(`${name}(2)`).evaluate()).toBe((mathFunc as Function)(2));
            expect(parser.parse(`1 + ${name}(2)`).evaluate()).toBe(1 + (mathFunc as Function)(2));
            expect(parser.parse(`${name}(2) + 1`).evaluate()).toBe((mathFunc as Function)(2) + 1);
            expect(parser.parse(`1 + ${name}(2) + 1`).evaluate()).toBe(1 + (mathFunc as Function)(2) + 1);
          });

          // Special case for 'not' operator
          expect(parser.parse('not 0').evaluate()).toBe(true);
          expect(parser.parse('1 + not 0').evaluate()).toBe(2);
          expect(parser.parse('not 0 + 1').evaluate()).toBe(2);
          expect(parser.parse('1 + not 0 + 1').evaluate()).toBe(3);
          expect(parser.parse('not(0)').evaluate()).toBe(true);
          expect(parser.parse('1 + not(0)').evaluate()).toBe(2);
          expect(parser.parse('not(0) + 1').evaluate()).toBe(2);
          expect(parser.parse('1 + not(0) + 1').evaluate()).toBe(3);
        });

        it('unary + and - should not be parsed as function calls', () => {
          expect(parser.parse('+2').evaluate()).toBe(2);
          expect(parser.parse('-2').evaluate()).toBe(-2);
        });

        it('should treat ∙ and • as * operators', () => {
          expect(parser.evaluate('2 ∙ 3')).toBe(6);
          expect(parser.evaluate('2 • 3')).toBe(6);
        });
      });

      describe('token position tracking', () => {
        it('should track token positions correctly', () => {
          expect(() => parser.parse('@23')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('\n@23')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('1@3')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('12@')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('12@\n')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('@23 +\n45 +\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('1@3 +\n45 +\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('12@ +\n45 +\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n@5 +\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n4@ +\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n45@+\n6789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n45 +\n@789')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n45 +\n6@89')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n45 +\n67@9')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n45 +\n679@')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n\n679@')).toThrow(/Unknown character "@"/);
          expect(() => parser.parse('123 +\n\n\n\n\n679@')).toThrow(/Unknown character "@"/);
        });
      });
    });
  });
});
