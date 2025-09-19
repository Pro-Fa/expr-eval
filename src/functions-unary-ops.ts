export function neg(a: number | undefined): number | undefined {
  return a === undefined ? undefined : -a;
}

export function pos(a: any): number | undefined {
  return a === undefined ? undefined : Number(a);
}

// fac is in functions.js

export function abs(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.abs(a);
}

export function acos(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.acos(a);
}

export function acosh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.acosh) {
    return Math.acosh(a);
  } else {
    return Math.log(a + Math.sqrt((a * a) - 1));
  }
}

export function asin(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.asin(a);
}

export function asinh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.asinh) {
    return Math.asinh(a);
  } else {
    if (a === -Infinity) {
      return a;
    }
    return Math.log(a + Math.sqrt((a * a) + 1));
  }
}

export function atan(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.atan(a);
}

export function atanh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.atanh) {
    return Math.atanh(a);
  } else {
    return (Math.log((1 + a) / (1 - a)) / 2);
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

export function ceil(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.ceil(a);
}

export function cos(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.cos(a);
}

export function cosh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.cosh) {
    return Math.cosh(a);
  } else {
    return ((Math.exp(a) + Math.exp(-a)) / 2);
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

export function floor(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.floor(a);
}

export function length(s: any[] | string | number | undefined): number | undefined {
  if (s === undefined) {
    return undefined;
  }
  if (Array.isArray(s)) {
    return s.length;
  }
  return String(s).length;
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

export function not(a: any): boolean {
  return !a;
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

export function sin(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.sin(a);
}

export function sinh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.sinh) {
    return Math.sinh(a);
  } else {
    return ((Math.exp(a) - Math.exp(-a)) / 2);
  }
}

export function sqrt(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.sqrt(a);
}

export function tan(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  return Math.tan(a);
}

export function tanh(a: number | undefined): number | undefined {
  if (a === undefined) {
    return undefined;
  }
  if (Math.tanh) {
    return Math.tanh(a);
  } else {
    if (a === Infinity) {
      return 1;
    }
    if (a === -Infinity) {
      return -1;
    }
    return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
  }
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
