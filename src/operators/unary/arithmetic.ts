/**
 * Unary arithmetic operators
 * Handles unary mathematical operations: -, +, and basic math functions
 */
import type { Value } from '../../types';

/**
 * Negation operator - returns the negative of a number
 */
export function neg(a: number | undefined): number | undefined {
  return a === undefined ? undefined : -a;
}

/**
 * Positive operator - converts value to number
 * Overloaded for better type inference
 */
export function pos(a: undefined): undefined;
export function pos(a: number): number;
export function pos(a: string): number;
export function pos(a: boolean): number;
export function pos(a: Value): number | undefined;
export function pos(a: Value): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  const result = Number(a);

  return isNaN(result) ? undefined : result;
}

export function abs(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.abs(a);
}

export function ceil(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.ceil(a);
}

export function floor(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.floor(a);
}

export function round(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.round(a);
}

export function sign(x: number | undefined): number | undefined {
  if (x === undefined) {
    return undefined;
  }
  if (Math.sign) {
    return Math.sign(x);
  } else {
    return ((x > 0 ? 1 : 0) - (x < 0 ? 1 : 0)) || +x;
  }
}

export function sqrt(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.sqrt(a);
}

export function trunc(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  if (Math.trunc) {
    return Math.trunc(a);
  } else {
    return a < 0 ? Math.ceil(a) : Math.floor(a);
  }
}

const ONE_THIRD = 1 / 3;
export function cbrt(x: number | undefined): number | undefined {
  if (x === undefined) {
    return undefined;
  }

  if (Math.cbrt) {
    return Math.cbrt(x);
  } else {
    return x < 0 ? -Math.pow(-x, ONE_THIRD) : Math.pow(x, ONE_THIRD);
  }
}

export function exp(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.exp(a);
}

export function expm1(x: number | undefined): number | undefined {
  if (x === undefined) {
    return undefined;
  }

  if (Math.expm1) {
    return Math.expm1(x);
  } else {
    return Math.exp(x) - 1;
  }
}

export function log(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  return Math.log(a);
}

export function log1p(x: number | undefined): number | undefined {
  if (x === undefined) {
    return undefined;
  }

  if (Math.log1p) {
    return Math.log1p(x);
  } else {
    return Math.log(1 + x);
  }
}

export function log2(x: number | undefined): number | undefined {
  if (x === undefined) {
    return undefined;
  }

  if (Math.log2) {
    return Math.log2(x);
  } else {
    return Math.log(x) / Math.LN2;
  }
}

export function log10(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }

  if (Math.log10) {
    return Math.log10(a);
  } else {
    return Math.log(a) * Math.LOG10E;
  }
}
