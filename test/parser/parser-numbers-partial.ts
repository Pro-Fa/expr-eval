import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Parser Numbers Tests - Converted from parser.js
// Tests for number parsing including decimals, scientific notation, hex, binary

describe('Parser Numbers TypeScript Test', () => {
  [
    { name: 'normal parse()', parser: new Parser() },
    { name: 'disallowing member access', parser: new Parser({ allowMemberAccess: false }) }
  ].forEach(({ name, parser }) => {
    describe(name, () => {
      describe('number parsing', () => {
        it('should parse simple numbers correctly', () => {
          expect(parser.evaluate('123')).toBe(123);
          expect(parser.evaluate('123.456')).toBe(123.456);
          expect(parser.evaluate('.456')).toBe(0.456);
          expect(parser.evaluate('456.')).toBe(456);
        });

        it('should parse scientific notation correctly', () => {
          expect(parser.evaluate('1e2')).toBe(100);
          expect(parser.evaluate('1E2')).toBe(100);
          expect(parser.evaluate('1e+2')).toBe(100);
          expect(parser.evaluate('1e-2')).toBe(0.01);
          expect(parser.evaluate('1.5e2')).toBe(150);
          expect(parser.evaluate('1.5E2')).toBe(150);
          expect(parser.evaluate('1.5e+2')).toBe(150);
          expect(parser.evaluate('1.5e-2')).toBe(0.015);
          expect(parser.evaluate('.5e2')).toBe(50);
          expect(parser.evaluate('.5E2')).toBe(50);
          expect(parser.evaluate('.5e+2')).toBe(50);
          expect(parser.evaluate('.5e-2')).toBe(0.005);
          expect(parser.evaluate('5.e2')).toBe(500);
          expect(parser.evaluate('5.E2')).toBe(500);
          expect(parser.evaluate('5.e+2')).toBe(500);
          expect(parser.evaluate('5.e-2')).toBe(0.05);
          expect(parser.evaluate('5e10')).toBe(50000000000);
          expect(parser.evaluate('5E10')).toBe(50000000000);
          expect(parser.evaluate('5e+10')).toBe(50000000000);
          expect(parser.evaluate('5e-10')).toBe(5e-10);
          expect(parser.evaluate('123e10')).toBe(1230000000000);
          expect(parser.evaluate('123E10')).toBe(1230000000000);
          expect(parser.evaluate('123e+10')).toBe(1230000000000);
          expect(parser.evaluate('123e-10')).toBe(123e-10);
          expect(parser.evaluate('123.456e10')).toBe(1234560000000);
          expect(parser.evaluate('123.456E10')).toBe(1234560000000);
          expect(parser.evaluate('123.456e+10')).toBe(1234560000000);
          expect(parser.evaluate('123.456e-10')).toBe(123.456e-10);
        });

        it('should parse hexadecimal numbers correctly', () => {
          expect(parser.evaluate('0x0')).toBe(0x0);
          expect(parser.evaluate('0x1')).toBe(0x1);
          expect(parser.evaluate('0xA')).toBe(0xA);
          expect(parser.evaluate('0xF')).toBe(0xF);
          expect(parser.evaluate('0x123')).toBe(0x123);
          expect(parser.evaluate('0x123ABCD')).toBe(0x123ABCD);
          expect(parser.evaluate('0xDEADBEEF')).toBe(0xDEADBEEF);
          expect(parser.evaluate('0xdeadbeef')).toBe(0xdeadbeef);
          expect(parser.evaluate('0xABCDEF')).toBe(0xABCDEF);
          expect(parser.evaluate('0xabcdef')).toBe(0xABCDEF);
          expect(parser.evaluate('0x1e+4')).toBe(0x1e + 4);
          expect(parser.evaluate('0x1E+4')).toBe(0x1e + 4);
          expect(parser.evaluate('0x1e-4')).toBe(0x1e - 4);
          expect(parser.evaluate('0x1E-4')).toBe(0x1e - 4);
          expect(parser.evaluate('0xFFFFFFFF')).toBe(Math.pow(2, 32) - 1);
          expect(parser.evaluate('0x100000000')).toBe(Math.pow(2, 32));
          expect(parser.evaluate('0x1FFFFFFFFFFFFF')).toBe(Math.pow(2, 53) - 1);
          expect(parser.evaluate('0x20000000000000')).toBe(Math.pow(2, 53));
        });

        it('should parse binary numbers correctly', () => {
          expect(parser.evaluate('0b0')).toBe(0);
          expect(parser.evaluate('0b1')).toBe(1);
          expect(parser.evaluate('0b01')).toBe(1);
          expect(parser.evaluate('0b10')).toBe(2);
          expect(parser.evaluate('0b100')).toBe(4);
          expect(parser.evaluate('0b101')).toBe(5);
          expect(parser.evaluate('0b10101')).toBe(21);
          expect(parser.evaluate('0b10111')).toBe(23);
          expect(parser.evaluate('0b11111')).toBe(31);
          expect(parser.evaluate('0b11111111111111111111111111111111')).toBe(Math.pow(2, 32) - 1);
          expect(parser.evaluate('0b100000000000000000000000000000000')).toBe(Math.pow(2, 32));
          expect(parser.evaluate('0b11111111111111111111111111111111111111111111111111111')).toBe(Math.pow(2, 53) - 1);
          expect(parser.evaluate('0b100000000000000000000000000000000000000000000000000000')).toBe(Math.pow(2, 53));
        });

        it('should fail on invalid numbers', () => {
          expect(() => parser.parse('123..')).toThrow();
          expect(() => parser.parse('0..123')).toThrow();
          expect(() => parser.parse('0..')).toThrow();
          expect(() => parser.parse('.0.')).toThrow();
          expect(() => parser.parse('.')).toThrow();
          expect(() => parser.parse('1.23e')).toThrow();
          expect(() => parser.parse('1.23e+')).toThrow();
          expect(() => parser.parse('1.23e-')).toThrow();
          expect(() => parser.parse('1.23e++4')).toThrow();
          expect(() => parser.parse('1.23e--4')).toThrow();
          expect(() => parser.parse('1.23e+-4')).toThrow();
          expect(() => parser.parse('1.23e4-')).toThrow();
          expect(() => parser.parse('1.23ee4')).toThrow();
          expect(() => parser.parse('1.23ee.4')).toThrow();
          expect(() => parser.parse('1.23e4.0')).toThrow();
          expect(() => parser.parse('123e.4')).toThrow();
        });

        it('should fail on invalid hexadecimal numbers', () => {
          expect(() => parser.parse('0x')).toThrow();
          expect(() => parser.parse('0x + 1')).toThrow();
          expect(() => parser.parse('0x1.23')).toThrow();
          expect(() => parser.parse('0xG')).toThrow();
          expect(() => parser.parse('0xx0')).toThrow();
          expect(() => parser.parse('0x1g')).toThrow();
          expect(() => parser.parse('1x0')).toThrow();
        });

        it('should fail on invalid binary numbers', () => {
          expect(() => parser.parse('0b')).toThrow();
          expect(() => parser.parse('0b + 1')).toThrow();
          expect(() => parser.parse('0b1.1')).toThrow();
          expect(() => parser.parse('0b2')).toThrow();
          expect(() => parser.parse('0bb0')).toThrow();
          expect(() => parser.parse('0b1e+1')).toThrow();
          expect(() => parser.parse('1b0')).toThrow();
        });

        it('should handle numbers starting with 0 but not followed by x/X/b/B/o/O', () => {
          expect(parser.evaluate('0')).toBe(0);
          expect(parser.evaluate('01')).toBe(1);
          expect(parser.evaluate('012')).toBe(12);
          expect(parser.evaluate('0123')).toBe(123);
          expect(parser.evaluate('01234')).toBe(1234);
          expect(parser.evaluate('012345')).toBe(12345);
          expect(parser.evaluate('0123456')).toBe(123456);
          expect(parser.evaluate('01234567')).toBe(1234567);
          expect(parser.evaluate('012345678')).toBe(12345678);
          expect(parser.evaluate('0123456789')).toBe(123456789);
        });

        it('should handle very large numbers', () => {
          expect(parser.evaluate('999999999999999999999')).toBe(999999999999999999999);
          expect(parser.evaluate('1e308')).toBe(1e308);
          expect(parser.evaluate('1e-324')).toBe(1e-324);
        });

        it('should handle infinity and special values', () => {
          expect(parser.evaluate('1e309')).toBe(Infinity);
          expect(parser.evaluate('1e400')).toBe(Infinity);
          expect(parser.evaluate('-1e309')).toBe(-Infinity);
          expect(parser.evaluate('-1e400')).toBe(-Infinity);
        });

        it('should handle numbers with multiple decimal points as invalid', () => {
          expect(() => parser.parse('1.2.3')).toThrow();
          expect(() => parser.parse('1..2')).toThrow();
          expect(() => parser.parse('.1.')).toThrow();
        });

        it('should distinguish variables vs scientific notation', () => {
          expect(parser.evaluate('e1', { e1: 42 })).toBe(42);
          expect(parser.evaluate('e+1', { e: 12 })).toBe(13);
          expect(parser.evaluate('2E5')).toBe(200000);
        });
      });
    });
  });
});
