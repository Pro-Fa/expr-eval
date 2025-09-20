import { expect, describe, it } from 'vitest';
import { Parser } from '../../index.js';

// Helper function for floating point comparisons
function assertCloseTo(actual: number, expected: number, delta: number = 1e-14): void {
  expect(Math.abs(expected - actual)).toBeLessThanOrEqual(delta);
}

// Trigonometric Functions Tests - Converted from operators.js
// Tests for sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh

describe('Trigonometric Functions TypeScript Test', () => {
  const parser = new Parser();

  describe('sin(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('sin 0')).toBe(0);
      assertCloseTo(0.479425538604203, parser.evaluate('sin 0.5'), delta);
      assertCloseTo(0.8414709848078965, parser.evaluate('sin 1'), delta);
      assertCloseTo(-0.8414709848078965, parser.evaluate('sin -1'), delta);
      assertCloseTo(0.7071067811865475, parser.evaluate('sin(PI/4)'), delta);
      assertCloseTo(1, parser.evaluate('sin(PI/2)'), delta);
      assertCloseTo(0.7071067811865475, parser.evaluate('sin(3*PI/4)'), delta);
      assertCloseTo(0, parser.evaluate('sin PI'), delta);
      assertCloseTo(0, parser.evaluate('sin(2*PI)'), delta);
      assertCloseTo(0, parser.evaluate('sin(-PI)'), delta);
      assertCloseTo(-1, parser.evaluate('sin(3*PI/2)'), delta);
      assertCloseTo(0.6502878401571168, parser.evaluate('sin 15'), delta);
    });
  });

  describe('cos(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('cos 0')).toBe(1);
      assertCloseTo(0.8775825618903728, parser.evaluate('cos 0.5'), delta);
      assertCloseTo(0.5403023058681398, parser.evaluate('cos 1'), delta);
      assertCloseTo(0.5403023058681398, parser.evaluate('cos -1'), delta);
      assertCloseTo(0.7071067811865475, parser.evaluate('cos(PI/4)'), delta);
      assertCloseTo(0, parser.evaluate('cos(PI/2)'), delta);
      assertCloseTo(-0.7071067811865475, parser.evaluate('cos(3*PI/4)'), delta);
      assertCloseTo(-1, parser.evaluate('cos PI'), delta);
      assertCloseTo(1, parser.evaluate('cos(2*PI)'), delta);
      assertCloseTo(-1, parser.evaluate('cos -PI'), delta);
      assertCloseTo(0, parser.evaluate('cos(3*PI/2)'), delta);
      assertCloseTo(-0.7596879128588213, parser.evaluate('cos 15'), delta);
    });
  });

  describe('tan(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('tan 0')).toBe(0);
      assertCloseTo(0.5463024898437905, parser.evaluate('tan 0.5'), delta);
      assertCloseTo(1.5574077246549023, parser.evaluate('tan 1'), delta);
      assertCloseTo(-1.5574077246549023, parser.evaluate('tan -1'), delta);
      assertCloseTo(1, parser.evaluate('tan(PI/4)'), delta);
      expect(parser.evaluate('tan(PI/2)')).toBeGreaterThan(1e16);
      assertCloseTo(-1, parser.evaluate('tan(3*PI/4)'), delta);
      assertCloseTo(0, parser.evaluate('tan PI'), delta);
      assertCloseTo(0, parser.evaluate('tan(2*PI)'), delta);
      assertCloseTo(0, parser.evaluate('tan -PI'), delta);
      expect(parser.evaluate('tan(3*PI/2)')).toBeGreaterThan(1e15);
      assertCloseTo(-0.8559934009085188, parser.evaluate('tan 15'), delta);
    });
  });

  describe('asin(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('asin 0')).toBe(0);
      assertCloseTo(0.5235987755982989, parser.evaluate('asin 0.5'), delta);
      assertCloseTo(-0.5235987755982989, parser.evaluate('asin -0.5'), delta);
      assertCloseTo(Math.PI / 2, parser.evaluate('asin 1'), delta);
      assertCloseTo(-Math.PI / 2, parser.evaluate('asin -1'), delta);
      assertCloseTo(0.9033391107665127, parser.evaluate('asin(PI/4)'), delta);
      expect(isNaN(parser.evaluate('asin 1.1'))).toBe(true);
      expect(isNaN(parser.evaluate('asin -1.1'))).toBe(true);
    });
  });

  describe('acos(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('acos 0')).toBe(Math.PI / 2);
      assertCloseTo(1.0471975511965979, parser.evaluate('acos 0.5'), delta);
      assertCloseTo(2.0943951023931957, parser.evaluate('acos -0.5'), delta);
      assertCloseTo(0, parser.evaluate('acos 1'), delta);
      assertCloseTo(Math.PI, parser.evaluate('acos -1'), delta);
      assertCloseTo(0.6674572160283838, parser.evaluate('acos(PI/4)'), delta);
      expect(isNaN(parser.evaluate('acos 1.1'))).toBe(true);
      expect(isNaN(parser.evaluate('acos -1.1'))).toBe(true);
    });
  });

  describe('atan(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('atan 0')).toBe(0);
      assertCloseTo(parser.evaluate('atan 0.5'), 0.4636476090008061, delta);
      assertCloseTo(parser.evaluate('atan -0.5'), -0.4636476090008061, delta);
      assertCloseTo(parser.evaluate('atan 1'), Math.PI / 4, delta);
      assertCloseTo(parser.evaluate('atan -1'), -Math.PI / 4, delta);
      assertCloseTo(parser.evaluate('atan(PI/4)'), 0.6657737500283538, delta);
      assertCloseTo(parser.evaluate('atan PI'), 1.2626272556789118, delta);
      assertCloseTo(parser.evaluate('atan -PI'), -1.2626272556789118, delta);
      expect(parser.evaluate('atan(1/0)')).toBe(Math.PI / 2);
      expect(parser.evaluate('atan(-1/0)')).toBe(-Math.PI / 2);
      assertCloseTo(parser.evaluate('atan 10'), 1.4711276743037347, delta);
      assertCloseTo(1.5607966601082315, parser.evaluate('atan 100'), delta);
      assertCloseTo(1.5697963271282298, parser.evaluate('atan 1000'), delta);
      assertCloseTo(1.5702963268365633, parser.evaluate('atan 2000'), delta);
    });
  });

  describe('sinh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('sinh 0')).toBe(0);
      assertCloseTo(0.5210953054937474, parser.evaluate('sinh 0.5'), delta);
      assertCloseTo(-0.5210953054937474, parser.evaluate('sinh -0.5'), delta);
      assertCloseTo(1.1752011936438014, parser.evaluate('sinh 1'), delta);
      assertCloseTo(-1.1752011936438014, parser.evaluate('sinh -1'), delta);
      assertCloseTo(0.8686709614860095, parser.evaluate('sinh(PI/4)'), delta);
      assertCloseTo(2.3012989023072947, parser.evaluate('sinh(PI/2)'), delta);
      assertCloseTo(5.227971924677803, parser.evaluate('sinh(3*PI/4)'), delta);
      assertCloseTo(11.548739357257748, parser.evaluate('sinh PI'), delta * 10);
      assertCloseTo(267.74489404101644, parser.evaluate('sinh(2*PI)'), delta * 1000);
      assertCloseTo(-11.548739357257748, parser.evaluate('sinh -PI'), delta * 10);
      assertCloseTo(55.65439759941754, parser.evaluate('sinh(3*PI/2)'), delta * 100);
      assertCloseTo(1634508.6862359024, parser.evaluate('sinh 15'), delta * 1000000);
      expect(parser.evaluate('sinh(1 / 0)')).toBe(Infinity);
      expect(parser.evaluate('sinh(-1 / 0)')).toBe(-Infinity);
    });
  });

  describe('cosh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('cosh 0')).toBe(1);
      assertCloseTo(1.1276259652063807, parser.evaluate('cosh 0.5'), delta);
      assertCloseTo(1.1276259652063807, parser.evaluate('cosh -0.5'), delta);
      assertCloseTo(1.5430806348152437, parser.evaluate('cosh 1'), delta);
      assertCloseTo(1.5430806348152437, parser.evaluate('cosh -1'), delta);
      assertCloseTo(1.324609089252006, parser.evaluate('cosh(PI/4)'), delta);
      assertCloseTo(2.509178478658057, parser.evaluate('cosh(PI/2)'), delta);
      assertCloseTo(5.3227521495199595, parser.evaluate('cosh(3*PI/4)'), delta);
      assertCloseTo(11.591953275521522, parser.evaluate('cosh PI'), delta * 10);
      assertCloseTo(267.7467614837483, parser.evaluate('cosh(2*PI)'), delta * 1000);
      assertCloseTo(11.591953275521522, parser.evaluate('cosh -PI'), delta * 10);
      assertCloseTo(55.663380890438695, parser.evaluate('cosh(3*PI/2)'), delta * 100);
      assertCloseTo(1634508.6862362078, parser.evaluate('cosh 15'), delta * 1e7);
      expect(parser.evaluate('cosh(1 / 0)')).toBe(Infinity);
      expect(parser.evaluate('cosh(-1 / 0)')).toBe(Infinity);
    });
  });

  describe('tanh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('tanh 0')).toBe(0);
      assertCloseTo(0.000009999999999621023, parser.evaluate('tanh 0.00001'), delta);
      assertCloseTo(0.24491866240370924, parser.evaluate('tanh 0.25'), delta);
      assertCloseTo(-0.24491866240370924, parser.evaluate('tanh -0.25'), delta);
      assertCloseTo(0.4621171572600098, parser.evaluate('tanh 0.5'), delta);
      assertCloseTo(-0.4621171572600098, parser.evaluate('tanh -0.5'), delta);
      assertCloseTo(0.7615941559557649, parser.evaluate('tanh 1'), delta);
      assertCloseTo(-0.7615941559557649, parser.evaluate('tanh -1'), delta);
      assertCloseTo(0.6557942026326725, parser.evaluate('tanh(PI/4)'), delta);
      assertCloseTo(0.9171523356672744, parser.evaluate('tanh(PI/2)'), delta);
      assertCloseTo(0.9962720762207501, parser.evaluate('tanh PI'), delta);
      assertCloseTo(-0.9962720762207501, parser.evaluate('tanh -PI'), delta);
      assertCloseTo(0.9999930253396105, parser.evaluate('tanh(2*PI)'), delta);
      assertCloseTo(0.9999999999998128, parser.evaluate('tanh 15'), delta);
      assertCloseTo(-0.9999999999998128, parser.evaluate('tanh -15'), delta);
      assertCloseTo(0.9999999999999748, parser.evaluate('tanh 16'), delta);
      assertCloseTo(0.9999999999999966, parser.evaluate('tanh 17'), delta);
      expect(parser.evaluate('tanh 20')).toBe(1);
      expect(parser.evaluate('tanh -20')).toBe(-1);
      expect(parser.evaluate('tanh 100')).toBe(1);
      expect(parser.evaluate('tanh -100')).toBe(-1);
      expect(parser.evaluate('tanh(1 / 0)')).toBe(1);
      expect(parser.evaluate('tanh(-1 / 0)')).toBe(-1);
    });
  });

  describe('asinh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('asinh 0')).toBe(0);
      assertCloseTo(0.48121182505960347, parser.evaluate('asinh 0.5'), delta);
      assertCloseTo(-0.48121182505960347, parser.evaluate('asinh -0.5'), delta);
      assertCloseTo(0.881373587019543, parser.evaluate('asinh 1'), delta);
      assertCloseTo(-0.881373587019543, parser.evaluate('asinh -1'), delta);
      assertCloseTo(0.7212254887267799, parser.evaluate('asinh(PI/4)'), delta);
      assertCloseTo(1.233403117511217, parser.evaluate('asinh(PI/2)'), delta);
      assertCloseTo(1.5924573728585427, parser.evaluate('asinh(3*PI/4)'), delta);
      assertCloseTo(1.8622957433108482, parser.evaluate('asinh PI'), delta);
      assertCloseTo(2.537297501373361, parser.evaluate('asinh(2*PI)'), delta);
      assertCloseTo(-1.8622957433108482, parser.evaluate('asinh -PI'), delta);
      assertCloseTo(2.2544145929927146, parser.evaluate('asinh(3*PI/2)'), delta);
      assertCloseTo(3.4023066454805946, parser.evaluate('asinh 15'), delta);
      assertCloseTo(5.298342365610589, parser.evaluate('asinh 100'), delta);
      assertCloseTo(7.600902709541988, parser.evaluate('asinh 1000'), delta);
      expect(parser.evaluate('asinh(1 / 0)')).toBe(Infinity);
      expect(parser.evaluate('asinh(-1 / 0)')).toBe(-Infinity);
    });
  });

  describe('acosh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(isNaN(parser.evaluate('acosh 0'))).toBe(true);
      expect(isNaN(parser.evaluate('acosh 0.5'))).toBe(true);
      expect(isNaN(parser.evaluate('acosh -0.5'))).toBe(true);
      expect(isNaN(parser.evaluate('acosh -1'))).toBe(true);
      expect(parser.evaluate('acosh 1')).toBe(0);
      assertCloseTo(1.0232274785475506, parser.evaluate('acosh(PI/2)'), delta);
      assertCloseTo(1.5017757950235857, parser.evaluate('acosh(3*PI/4)'), delta);
      assertCloseTo(1.8115262724608532, parser.evaluate('acosh PI'), delta);
      assertCloseTo(2.524630659933467, parser.evaluate('acosh(2*PI)'), delta);
      assertCloseTo(2.2318892530580827, parser.evaluate('acosh(3*PI/2)'), delta);
      assertCloseTo(3.4000844141133393, parser.evaluate('acosh 15'), delta);
      assertCloseTo(5.298292365610485, parser.evaluate('acosh 100'), delta);
      assertCloseTo(7.600902209541989, parser.evaluate('acosh 1000'), delta);
      expect(parser.evaluate('acosh(1 / 0)')).toBe(Infinity);
      expect(isNaN(parser.evaluate('acosh(-1 / 0)'))).toBe(true);
    });
  });

  describe('atanh(x)', () => {
    it('returns the correct value', () => {
      const delta = 1e-15;
      expect(parser.evaluate('atanh 0')).toBe(0);
      assertCloseTo(0.25541281188299536, parser.evaluate('atanh 0.25'), delta);
      assertCloseTo(-0.25541281188299536, parser.evaluate('atanh -0.25'), delta);
      assertCloseTo(0.5493061443340549, parser.evaluate('atanh 0.5'), delta);
      assertCloseTo(-0.5493061443340549, parser.evaluate('atanh -0.5'), delta);
      expect(parser.evaluate('atanh 1')).toBe(Infinity);
      expect(parser.evaluate('atanh -1')).toBe(-Infinity);
      expect(isNaN(parser.evaluate('atanh 1.001'))).toBe(true);
      expect(isNaN(parser.evaluate('atanh -1.001'))).toBe(true);
      expect(isNaN(parser.evaluate('atanh(1 / 0)'))).toBe(true);
      expect(isNaN(parser.evaluate('atanh(-1 / 0)'))).toBe(true);
    });
  });
});
