/**
 * Unary trigonometric functions
 * Handles trigonometric and hyperbolic functions
 */

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
