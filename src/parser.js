/* eslint-disable no-prototype-builtins */
/* eslint-disable quote-props */
// cSpell:words TEOF fndef
import { TEOF } from './token';
import { TokenStream } from './token-stream';
import { ParserState } from './parser-state';
import { Expression } from './expression';
import { atan2, condition, fac, filter, fold, gamma, hypot, indexOf, join, map, max, min, pow, random, roundTo, sum } from './functions';
import {
  add,
  sub,
  mul,
  div,
  mod,
  concat,
  equal,
  notEqual,
  greaterThan,
  lessThan,
  greaterThanEqual,
  lessThanEqual,
  setVar,
  arrayIndexOrProperty,
  andOperator,
  orOperator,
  inOperator,
  coalesce,
  asOperator
} from './functions-binary-ops';
import {
  pos,
  abs,
  acos,
  sinh,
  tanh,
  asin,
  asinh,
  acosh,
  atan,
  atanh,
  cbrt,
  ceil,
  cos,
  cosh,
  exp,
  floor,
  log,
  log10,
  neg,
  not,
  round,
  sin,
  sqrt,
  tan,
  trunc,
  length,
  sign,
  expm1,
  log1p,
  log2
} from './functions-unary-ops';

export function Parser(options) {
  this.options = options || { operators: { conversion: false } };
  this.keywords = [
    'case',
    'when',
    'then',
    'else',
    'end'
  ];
  this.unaryOps = {
    '-': neg,
    '+': pos,
    '!': fac,
    abs: abs,
    acos: acos,
    acosh: acosh,
    asin: asin,
    asinh: asinh,
    atan: atan,
    atanh: atanh,
    // 11
    cbrt: cbrt,
    ceil: ceil,
    cos: cos,
    cosh: cosh,
    exp: exp,
    expm1: expm1,
    floor: floor,
    length: length,
    lg: log10,
    ln: log,
    // 21
    log: log,
    log1p: log1p,
    log2: log2,
    log10: log10,
    not: not,
    round: round,
    sign: sign,
    sin: sin,
    sinh: sinh,
    sqrt: sqrt,
    // 31
    tan: tan,
    tanh: tanh,
    trunc: trunc
  };

  this.binaryOps = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
    '%': mod,
    '^': pow,
    '|': concat,
    '==': equal,
    '!=': notEqual,
    '>': greaterThan,
    // 11
    '<': lessThan,
    '>=': greaterThanEqual,
    '<=': lessThanEqual,
    '=': setVar,
    '[': arrayIndexOrProperty,
    and: andOperator,
    '&&': andOperator,
    in: inOperator,
    or: orOperator,
    '||': orOperator,
    '??': coalesce,
    'as': asOperator
  };

  this.ternaryOps = {
    '?': condition
  };

  this.functions = {
    atan2: atan2,
    fac: fac,
    filter: filter,
    fold: fold,
    gamma: gamma,
    hypot: hypot,
    indexOf: indexOf,
    if: condition,
    join: join,
    map: map,
    max: max,
    min: min,
    pow: pow,
    pyt: hypot, // backward compat
    random: random,
    roundTo: roundTo,
    sum: sum
  };

  this.consts = {
    E: Math.E,
    PI: Math.PI,
    'true': true,
    'false': false
  };

  // A callback that evaluate will call if it doesn't recognize a variable.  The default
  // implementation returns undefined to indicate that it won't resolve the variable.  This
  // gives the code using the Parser a chance to resolve unrecognized variables to add support for
  // things like $myVar, $$myVar, %myVar%, etc.  For example when an expression is evaluated a variables
  // object could be passed in and $myVar could resolve to a property of that object.
  // The return value can be any of:
  // - { alias: "xxx" } the token is an alias for xxx, i.e. use xxx as the token.
  // - { value: <something> } use <something> as the value for the variable
  // - any other value is treated as the value to use for the token.
  this.resolve = _token => undefined;
}

Parser.prototype.parse = function (expr) {
  var instr = [];
  var parserState = new ParserState(
    this,
    new TokenStream(this, expr),
    { allowMemberAccess: this.options.allowMemberAccess }
  );

  parserState.parseExpression(instr);
  parserState.expect(TEOF, 'EOF');

  return new Expression(instr, this);
};

Parser.prototype.evaluate = function (expr, variables) {
  return this.parse(expr).evaluate(variables);
};

var sharedParser = new Parser();

Parser.parse = function (expr) {
  return sharedParser.parse(expr);
};

Parser.evaluate = function (expr, variables) {
  return sharedParser.parse(expr).evaluate(variables);
};

var optionNameMap = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '%': 'remainder',
  '^': 'power',
  '!': 'factorial',
  '<': 'comparison',
  '>': 'comparison',
  '<=': 'comparison',
  '>=': 'comparison',
  '==': 'comparison',
  '!=': 'comparison',
  '|': 'concatenate',
  'and': 'logical',
  'or': 'logical',
  'not': 'logical',
  '&&': 'logical',
  '||': 'logical',
  '?': 'conditional',
  ':': 'conditional',
  '=': 'assignment',
  '[': 'array',
  '()=': 'fndef',
  '??': 'coalesce',
  'as': 'conversion'
};

function getOptionName(op) {
  return optionNameMap.hasOwnProperty(op) ? optionNameMap[op] : op;
}

Parser.prototype.isOperatorEnabled = function (op) {
  var optionName = getOptionName(op);
  var operators = this.options.operators || {};

  return !(optionName in operators) || !!operators[optionName];
};
