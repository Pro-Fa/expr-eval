import { describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Setup
const parser = new Parser();

// Helper function for floating-point comparisons with delta
function assertCloseTo(actual: number, expected: number, delta: number = 1e-14): void {
  const diff = Math.abs(actual - expected);
  if (diff > delta) {
    throw new Error(`Expected ${expected} ± ${delta}, but got ${actual} (diff: ${diff})`);
  }
}

function isNaN(value: number): boolean {
  return Number.isNaN(value);
}

describe('% operator', () => {
  it('has the correct precedence', () => {
    strictEqual(parser.parse('a + b % c ^ d').toString(), '(a + (b % (c ^ d)))');
    strictEqual(parser.parse('a + b * c % d').toString(), '(a + ((b * c) % d))');
    strictEqual(parser.parse('a + b % c * d').toString(), '(a + ((b % c) * d))');
    strictEqual(parser.parse('a + b % c % d').toString(), '(a + ((b % c) % d))');
  });

  it('returns the correct value', () => {
    strictEqual(parser.evaluate('0 % 5') as number, 0);
    strictEqual(parser.evaluate('1 % 5') as number, 1);
    strictEqual(parser.evaluate('2 % 5') as number, 2);
    strictEqual(parser.evaluate('3 % 5') as number, 3);
    strictEqual(parser.evaluate('4 % 5') as number, 4);
    strictEqual(parser.evaluate('5 % 5') as number, 0);
    strictEqual(parser.evaluate('6 % 5') as number, 1);
    strictEqual(parser.evaluate('-2 % 5') as number, -2);
    strictEqual(parser.evaluate('-6 % 5') as number, -1);
  });

  it('returns NaN for 0 divisor', () => {
    ok(isNaN(parser.evaluate('0 % 0') as number));
    ok(isNaN(parser.evaluate('1 % 0') as number));
    ok(isNaN(parser.evaluate('-1 % 0') as number));
  });
});

describe('-x', () => {
  it('has the correct precedence', () => {
    strictEqual(parser.parse('-2^3').toString(), '(-(2 ^ 3))');
    strictEqual(parser.parse('-(2)^3').toString(), '(-(2 ^ 3))');
    strictEqual(parser.parse('-2 * 3').toString(), '((-2) * 3)');
    strictEqual(parser.parse('-2 + 3').toString(), '((-2) + 3)');
    strictEqual(parser.parse('- - 1').toString(), '(-(-1))');
  });

  it('negates its argument', () => {
    strictEqual(parser.evaluate('-0') as number, 0);
    strictEqual(parser.evaluate('-0.5') as number, -0.5);
    strictEqual(parser.evaluate('-1') as number, -1);
    strictEqual(parser.evaluate('-123') as number, -123);
    strictEqual(parser.evaluate('-(-1)') as number, 1);
  });

  it('converts its argument to a number', () => {
    strictEqual(parser.evaluate('-"123"') as number, -123);
  });
});

describe('+x', () => {
  it('has the correct precedence', () => {
    strictEqual(parser.parse('+2^3').toString(), '(+(2 ^ 3))');
    strictEqual(parser.parse('+(2)^3').toString(), '(+(2 ^ 3))');
    strictEqual(parser.parse('+2 * 3').toString(), '((+2) * 3)');
    strictEqual(parser.parse('+2 + 3').toString(), '((+2) + 3)');
    strictEqual(parser.parse('+ + 1').toString(), '(+(+1))');
  });

  it('returns its argument', () => {
    strictEqual(parser.evaluate('+0') as number, 0);
    strictEqual(parser.evaluate('+0.5') as number, 0.5);
    strictEqual(parser.evaluate('+1') as number, 1);
    strictEqual(parser.evaluate('+123') as number, 123);
    strictEqual(parser.evaluate('+(+1)') as number, 1);
  });

  it('converts its argument to a number', () => {
    strictEqual(parser.evaluate('+"123"') as number, 123);
  });
});

describe('x!', () => {
  it('has the correct precedence', () => {
    strictEqual(parser.parse('2^3!').toString(), '(2 ^ (3!))');
    strictEqual(parser.parse('-5!').toString(), '(-(5!))');
    strictEqual(parser.parse('4!^3').toString(), '((4!) ^ 3)');
    strictEqual(parser.parse('sqrt(4)!').toString(), '((sqrt 4)!)');
    strictEqual(parser.parse('sqrt 4!').toString(), '(sqrt (4!))');
    strictEqual(parser.parse('x!!').toString(), '((x!)!)');
  });

  it('returns exact answer for integers', () => {
    strictEqual(parser.evaluate('(-10)!') as number, Infinity);
    strictEqual(parser.evaluate('(-2)!') as number, Infinity);
    strictEqual(parser.evaluate('(-1)!') as number, Infinity);
    strictEqual(parser.evaluate('0!') as number, 1);
    strictEqual(parser.evaluate('1!') as number, 1);
    strictEqual(parser.evaluate('2!') as number, 2);
    strictEqual(parser.evaluate('3!') as number, 6);
    strictEqual(parser.evaluate('4!') as number, 24);
    strictEqual(parser.evaluate('5!') as number, 120);
    strictEqual(parser.evaluate('6!') as number, 720);
    strictEqual(parser.evaluate('7!') as number, 5040);
    strictEqual(parser.evaluate('8!') as number, 40320);
    strictEqual(parser.evaluate('9!') as number, 362880);
    strictEqual(parser.evaluate('10!') as number, 3628800);
    strictEqual(parser.evaluate('25!') as number, 1.5511210043330984e+25);
    strictEqual(parser.evaluate('50!') as number, 3.0414093201713376e+64);
    strictEqual(parser.evaluate('100!') as number, 9.332621544394418e+157);
    strictEqual(parser.evaluate('170!') as number, 7.257415615308004e+306);
    strictEqual(parser.evaluate('171!') as number, Infinity);
  });

  it('returns approximation for fractions', () => {
    const delta = 1e-14;
    assertCloseTo(parser.evaluate('(-2.5)!') as number, 2.36327180120735, delta);
    assertCloseTo(parser.evaluate('(-1.5)!') as number, -3.54490770181103, delta);
    assertCloseTo(parser.evaluate('(-0.75)!') as number, 3.625609908221908, delta);
    assertCloseTo(parser.evaluate('(-0.5)!') as number, 1.772453850905516, delta);
    assertCloseTo(parser.evaluate('(-0.25)!') as number, 1.225416702465177, delta);
    assertCloseTo(parser.evaluate('0.25!') as number, 0.906402477055477, delta);
    assertCloseTo(parser.evaluate('0.5!') as number, 0.886226925452758, delta);
    assertCloseTo(parser.evaluate('0.75!') as number, 0.9190625268488832, delta);
    assertCloseTo(parser.evaluate('1.5!') as number, 1.329340388179137, delta);
    assertCloseTo(parser.evaluate('84.9!') as number, 1.8056411593417e128, 1e115);
    assertCloseTo(parser.evaluate('85.1!') as number, 4.395670640362208e128, 1e115);
    assertCloseTo(parser.evaluate('98.6!') as number, 1.483280675613632e155, 1e142);
    strictEqual(parser.evaluate('171.35!') as number, Infinity);
    strictEqual(parser.evaluate('172.5!') as number, Infinity);
  });

  it('handles NaN and infinity correctly', () => {
    ok(isNaN(parser.evaluate('(0/0)!') as number));
    strictEqual(parser.evaluate('(1/0)!') as number, Infinity);
    ok(isNaN(parser.evaluate('(-1/0)!') as number));
  });
});

describe('[] operator', () => {
  it('a[0]', () => {
    strictEqual(Parser.evaluate('a[0]', { a: [4, 3, 2, 1] }), 4);
  });

  it('a[0.1] on array', () => {
    throws(() => {
      Parser.evaluate('a[0.1]', { a: [4, 3, 2, 1] });
    }, 'Array can only be indexed with integers. Received: 0.1');
  });

  it('a[0.1] on object', () => {
    strictEqual(Parser.evaluate('a[0.1]', { a: { 0.1: 4, 1: 3 } }), 4);
  });

  it('a[3]', () => {
    strictEqual(Parser.evaluate('a[3]', { a: [4, 3, 2, 1] }), 1);
  });

  it('a[3 - 2]', () => {
    strictEqual(Parser.evaluate('a[3 - 2]', { a: [4, 3, 2, 1] }), 3);
  });

  it('a["foo"]', () => {
    strictEqual(Parser.evaluate('a["foo"]', { a: { foo: 'bar' } }), 'bar');
  });

  it('a[2]^3', () => {
    strictEqual(Parser.evaluate('a[2]^3', { a: [1, 2, 3, 4] }), 27);
  });
});

// Helper functions for assertions
function strictEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, but got ${actual}`);
  }
}

function ok(value: any): void {
  if (!value) {
    throw new Error(`Expected truthy value, but got ${value}`);
  }
}

function throws(fn: () => void, expectedError: string): void {
  try {
    fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (error instanceof Error && error.message === expectedError) {
      return;
    }
    throw new Error(`Expected error "${expectedError}", but got "${error instanceof Error ? error.message : error}"`);
  }
}
