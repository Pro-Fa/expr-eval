import { expect, describe, it } from 'vitest';
import { random } from '../../src/functions/utility/random.js';

describe('random function', () => {
  it('should return a number between 0 and 1 when no argument provided', () => {
    const result = random();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it('should return a number between 0 and specified maximum', () => {
    const max = 10;
    const result = random(max);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(max);
  });

  it('should return a number between 0 and 1 when 0 is provided', () => {
    const result = random(0);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it('should handle negative numbers', () => {
    const max = -5;
    const result = random(max);
    expect(result).toBeGreaterThanOrEqual(max);
    expect(result).toBeLessThanOrEqual(0);
  });

  it('should handle undefined explicitly', () => {
    const result = random(undefined);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });
});
