import { describe, it, expect } from 'vitest';
import { Parser } from '../../index';

describe('Expression Fork Features TypeScript Test', () => {
  describe('CASE statements', () => {
    describe('switch style cases', () => {
      it('should handle empty case', () => {
        const parser = new Parser();
        const expr = `
          case x
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBeUndefined();
      });

      it('should handle no whens', () => {
        const parser = new Parser();
        const expr = `
          case x
            else 'too-big'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('too-big');
      });

      it('should handle no else', () => {
        const parser = new Parser();
        const expr = `
          case x
            when 1 then 'one'
            when 1+1 then 'two'
            when 1+1+1 then 'three'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('one');
        expect(parser.evaluate(expr, { x: 2 })).toBe('two');
        expect(parser.evaluate(expr, { x: 3 })).toBe('three');
        expect(parser.evaluate(expr, { x: 4 })).toBeUndefined();
      });

      it('should handle simple case', () => {
        const parser = new Parser();
        const expr = `
          case x
            when 1 then 'one'
            when 1+1 then 'two'
            when 1+1+1 then 'three'
            else 'too-big'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('one');
        expect(parser.evaluate(expr, { x: 2 })).toBe('two');
        expect(parser.evaluate(expr, { x: 3 })).toBe('three');
        expect(parser.evaluate(expr, { x: 4 })).toBe('too-big');
      });

      it('should handle case within a larger expression', () => {
        const parser = new Parser();
        const expr = `
          case x
            when "one" then 1
            when "two" then 1+1
            when "three" then 1+1+1
            else 0
          end * 5
        `;
        expect(parser.evaluate(expr, { x: 'one' })).toBe(5);
        expect(parser.evaluate(expr, { x: 'two' })).toBe(10);
        expect(parser.evaluate(expr, { x: 'three' })).toBe(15);
        expect(parser.evaluate(expr, { x: 'four' })).toBe(0);
      });

      it('should handle expression variable assigned to a case', () => {
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
        expect(parser.evaluate(expr, { x: 'one' })).toBe(5);
        expect(parser.evaluate(expr, { x: 'two' })).toBe(10);
        expect(parser.evaluate(expr, { x: 'three' })).toBe(15);
        expect(parser.evaluate(expr, { x: 'four' })).toBe(0);
      });
    });

    describe('if/else/if style cases', () => {
      it('should handle empty case', () => {
        const parser = new Parser();
        const expr = `
          case
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBeUndefined();
      });

      it('should handle no whens', () => {
        const parser = new Parser();
        const expr = `
          case
            else 'too-big'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('too-big');
      });

      it('should handle no else', () => {
        const parser = new Parser();
        const expr = `
          case
            when x == 1 then 'one'
            when x == 1+1 then 'two'
            when x == 1+1+1 then 'three'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('one');
        expect(parser.evaluate(expr, { x: 2 })).toBe('two');
        expect(parser.evaluate(expr, { x: 3 })).toBe('three');
        expect(parser.evaluate(expr, { x: 4 })).toBeUndefined();
      });

      it('should handle simple case', () => {
        const parser = new Parser();
        const expr = `
          case
            when x == 1 then 'one'
            when x == 1+1 then 'two'
            when x == 1+1+1 then 'three'
            else 'too-big'
          end
        `;
        expect(parser.evaluate(expr, { x: 1 })).toBe('one');
        expect(parser.evaluate(expr, { x: 2 })).toBe('two');
        expect(parser.evaluate(expr, { x: 3 })).toBe('three');
        expect(parser.evaluate(expr, { x: 4 })).toBe('too-big');
      });

      it('should handle case within a larger expression', () => {
        const parser = new Parser();
        const expr = `
          case
            when x > y then "gt"
            when x < y then "lt"
            else "eq"
          end + "$"
        `;
        expect(parser.evaluate(expr, { x: 2, y: 1 })).toBe('gt$');
        expect(parser.evaluate(expr, { x: 1, y: 2 })).toBe('lt$');
        expect(parser.evaluate(expr, { x: 1, y: 1 })).toBe('eq$');
      });

      it('should handle expression variable assigned to a case', () => {
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
        expect(parser.evaluate(expr, { x: 'one' })).toBe(5);
        expect(parser.evaluate(expr, { x: 'two' })).toBe(10);
        expect(parser.evaluate(expr, { x: 'three' })).toBe(15);
        expect(parser.evaluate(expr, { x: 'four' })).toBe(0);
      });
    });

    describe('invalid case block', () => {
      it('should throw error for missing when', () => {
        expect(() => Parser.evaluate('case true then 5 end')).toThrow(/invalid case block/);
        expect(() => Parser.evaluate('case then 5 end')).toThrow(/invalid case block/);
      });

      it('should throw error for missing then', () => {
        expect(() => Parser.evaluate('case true when 5 end')).toThrow(/case block missing when/);
        expect(() => Parser.evaluate('case when 5 end')).toThrow(/case block missing when/);
      });

      it('should throw error for missing end', () => {
        expect(() => Parser.evaluate('case true when 5 then 6')).toThrow(/invalid case block/);
        expect(() => Parser.evaluate('case when 5 then 6')).toThrow(/invalid case block/);
      });

      it('should throw error for else followed by when', () => {
        expect(() => Parser.evaluate('case true else "abc" when true then "def" end')).toThrow(/invalid case block/);
        expect(() => Parser.evaluate('case else "abc" when true then "def" end')).toThrow(/invalid case block/);
      });
    });
  });

  describe('object construction', () => {
    it('should handle empty object', () => {
      const parser = new Parser();
      const expr = '{}';
      const result = parser.evaluate(expr);
      expect(typeof result).toBe('object');
      expect(result).toEqual({});
    });

    it('should handle simple object', () => {
      const parser = new Parser();
      const expr = '{ a: 1, b: 2, c: 3 }';
      const result = parser.evaluate(expr);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should allow comma after last property', () => {
      const parser = new Parser();
      const expr = '{ a: 1, b: 2, c: 3, }';
      const result = parser.evaluate(expr);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should allow nested objects', () => {
      const parser = new Parser();
      const expr = `{
        a: 1,
        b: {
          y: 'first',
          z: 'second',
        },
        c: 3,
      }`;
      const result = parser.evaluate(expr);
      expect(result).toEqual({ a: 1, b: { y: 'first', z: 'second' }, c: 3 });
    });

    it('should allow arrays with nested objects', () => {
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
      const result = parser.evaluate(expr);
      expect(result).toEqual({
        a: 1,
        b: [
          { value: 10 },
          { value: 20 },
          { value: 30 }
        ],
        c: 3,
      });
    });

    it('should allow expressions for property values', () => {
      const parser = new Parser();
      const expr = `{
        a: x * 3,
        b: {
          x: "first" + "_" + "second",
          y: min(x, 0),
        },
        c: [0, 1, 2, x],
      }`;
      const result = parser.evaluate(expr, { x: 3 });
      expect(result).toEqual({
        a: 9,
        b: {
          x: 'first_second',
          y: 0
        },
        c: [0, 1, 2, 3]
      });
    });

    it('should support passing objects to custom functions', () => {
      const parser = new Parser();
      (parser.functions as any).doIt = (o: any) => o.x + o.y;
      const expr = 'doIt({ x: 3, y: 4, z: 8 })';
      expect(parser.evaluate(expr)).toBe(7);
    });
  });

  describe('extra logical operators', () => {
    it('should handle false or true', () => {
      expect(Parser.evaluate('false or true')).toBe(true);
    });

    it('should handle false || true', () => {
      expect(Parser.evaluate('false || true')).toBe(true);
    });

    it('should handle false and true', () => {
      expect(Parser.evaluate('false and true')).toBe(false);
    });

    it('should handle false && true', () => {
      expect(Parser.evaluate('false && true')).toBe(false);
    });
  });
});
