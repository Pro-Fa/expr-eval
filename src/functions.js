// cSpell:words larg escopecz

export function atan2(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return Math.atan2(a, b);
}

export function condition(cond, yep, nope) {
  return cond ? yep : nope;
}

export function fac(a) { // a!
  if (a === undefined) return undefined;
  return gamma(a + 1);
}

export function filter(f, a) {
  if (a === undefined) return undefined;
  if (typeof f !== 'function') {
    throw new Error('First argument to filter is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to filter is not an array');
  }
  return a.filter(function (x, i) {
    return f(x, i);
  });
}

export function fold(f, init, a) {
  if (a === undefined) return undefined;
  if (typeof f !== 'function') {
    throw new Error('First argument to fold is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to fold is not an array');
  }
  return a.reduce(function (acc, x, i) {
    return f(acc, x, i);
  }, init);
}

var GAMMA_G = 4.7421875;
var GAMMA_P = [
  0.99999999999999709182,
  57.156235665862923517, -59.597960355475491248,
  14.136097974741747174, -0.49191381609762019978,
  0.33994649984811888699e-4,
  0.46523628927048575665e-4, -0.98374475304879564677e-4,
  0.15808870322491248884e-3, -0.21026444172410488319e-3,
  0.21743961811521264320e-3, -0.16431810653676389022e-3,
  0.84418223983852743293e-4, -0.26190838401581408670e-4,
  0.36899182659531622704e-5
];

// Gamma function from math.js
export function gamma(n) {
  if (n === undefined) return undefined;
  var t, x;

  if (isInteger(n)) {
    if (n <= 0) {
      return isFinite(n) ? Infinity : NaN;
    }

    if (n > 171) {
      return Infinity; // Will overflow
    }

    var value = n - 2;
    var res = n - 1;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res === 0) {
      res = 1; // 0! is per definition 1
    }

    return res;
  }

  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  }

  if (n >= 171.35) {
    return Infinity; // will overflow
  }

  if (n > 85.0) { // Extended Stirling Approx
    var twoN = n * n;
    var threeN = twoN * n;
    var fourN = threeN * n;
    var fiveN = fourN * n;
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
      (1 + (1 / (12 * n)) + (1 / (288 * twoN)) - (139 / (51840 * threeN)) -
      (571 / (2488320 * fourN)) + (163879 / (209018880 * fiveN)) +
      (5246819 / (75246796800 * fiveN * n)));
  }

  --n;
  x = GAMMA_P[0];
  for (var i = 1; i < GAMMA_P.length; ++i) {
    x += GAMMA_P[i] / (n + i);
  }

  t = n + GAMMA_G + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

export function hypot() {
  if ([...arguments].findIndex(v => v === undefined) > -1) return undefined;
  if (Math.hypot) {
    return Math.hypot.apply(Math, arguments);
  } else {
    var sum = 0;
    var larg = 0;
    for (var i = 0; i < arguments.length; i++) {
      var arg = Math.abs(arguments[i]);
      var div;
      if (larg < arg) {
        div = larg / arg;
        sum = (sum * div * div) + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else {
        sum += arg;
      }
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
}

export function indexOf(target, s) {
  if (s === undefined) return undefined;
  if (!(Array.isArray(s) || typeof s === 'string')) {
    throw new Error('Second argument to indexOf is not a string or array');
  }

  return s.indexOf(target);
}

export function join(sep, a) {
  if (sep === undefined || a === undefined) return undefined;
  if (!Array.isArray(a)) {
    throw new Error('Second argument to join is not an array');
  }

  return a.join(sep);
}

export function json(content) {
  if (content === undefined) return undefined;
  return JSON.stringify(content);
}

export function map(f, a) {
  if (a === undefined) return undefined;
  if (typeof f !== 'function') {
    throw new Error('First argument to map is not a function');
  }
  if (!Array.isArray(a)) {
    throw new Error('Second argument to map is not an array');
  }
  return a.map(function (x, i) {
    return f(x, i);
  });
}

export function max(array) {
  if (arguments.length === 1 && Array.isArray(array)) {
    if (array.includes(undefined)) return undefined;
    return Math.max.apply(Math, array);
  } else {
    if ([...arguments].includes(undefined)) return undefined;
    return Math.max.apply(Math, arguments);
  }
}

export function min(array) {
  if (arguments.length === 1 && Array.isArray(array)) {
    if (array.includes(undefined)) return undefined;
    return Math.min.apply(Math, array);
  } else {
    if ([...arguments].includes(undefined)) return undefined;
    return Math.min.apply(Math, arguments);
  }
}

export function pow(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return Math.pow(a, b);
}

export function random(a) {
  return Math.random() * (a || 1);
}

/**
* Decimal adjustment of a number.
* From @escopecz.
*
* @param {Number} value The number.
* @param {Integer} exp  The exponent (the 10 logarithm of the adjustment base).
* @return {Number} The adjusted value.
*/
export function roundTo(value, exp) {
  if (value === undefined) return undefined;

  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  value = +value;
  exp = -(+exp);
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

export function sum(array) {
  if (array === undefined) return undefined;
  if (!Array.isArray(array)) {
    throw new Error('Sum argument is not an array');
  }
  if (array.includes(undefined)) return undefined;

  return array.reduce(function (total, value) {
    return total + (value === undefined ? 0 : Number(value));
  }, 0);
}

//
// privates
//

function isInteger(value) {
  if (value === undefined) return false;
  return isFinite(value) && (value === Math.round(value));
}
