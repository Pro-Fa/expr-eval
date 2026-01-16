// cSpell:words TEOF fndef
import { TEOF } from './token.js';
import { TokenStream } from './token-stream.js';
import { ParserState } from './parser-state.js';
import { Expression } from '../core/expression.js';
import type { Value, VariableResolveResult, Values } from '../types/values.js';
import type { Instruction } from './instruction.js';
import type { OperatorFunction } from '../types/parser.js';
import { atan2, condition, fac, filter, fold, gamma, hypot, indexOf, join, map, max, min, random, roundTo, sum, json, stringLength, isEmpty, stringContains, startsWith, endsWith, searchCount, trim, toUpper, toLower, toTitle, split, repeat, reverse, left, right, replace, replaceFirst, naturalSort, toNumber, toBoolean, padLeft, padRight, padBoth, slice, urlEncode, base64Encode, coalesceString } from '../functions/index.js';
import {
  add,
  sub,
  mul,
  div,
  mod,
  pow,
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
  notInOperator,
  coalesce,
  asOperator
} from '../operators/binary/index.js';
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
} from '../operators/unary/index.js';

/**
 * Parser options configuration
 */
interface ParserOptions {
  allowMemberAccess?: boolean;
  operators?: Record<string, boolean>;
}

/**
 * Variable resolver function type for custom variable resolution
 */
type VariableResolver = (token: string) => VariableResolveResult;

export class Parser {
  public options: ParserOptions;
  public keywords: string[];
  public unaryOps: Record<string, OperatorFunction>;
  public binaryOps: Record<string, OperatorFunction>;
  public ternaryOps: Record<string, OperatorFunction>;
  public functions: Record<string, OperatorFunction>;
  public numericConstants: Record<string, Value>;
  public buildInLiterals: Record<string, Value>;
  public resolve: VariableResolver;

  /**
   * Creates a new Parser instance with the specified options.
   *
   * @param options - Configuration options for the parser
   * @example
   * ```typescript
   * const parser = new Parser({
   *   allowMemberAccess: false,
   *   operators: { add: true, multiply: true }
   * });
   * ```
   */
  constructor(options?: ParserOptions) {
    this.options = options || { operators: { conversion: false } };
    this.keywords = [
      'case',
      'when',
      'then',
      'else',
      'end'
    ] as const;
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
      'not in': notInOperator,
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
      json: json,
      random: random,
      roundTo: roundTo,
      sum: sum,
      // String manipulation functions
      length: stringLength,
      isEmpty: isEmpty,
      contains: stringContains,
      startsWith: startsWith,
      endsWith: endsWith,
      searchCount: searchCount,
      trim: trim,
      toUpper: toUpper,
      toLower: toLower,
      toTitle: toTitle,
      split: split,
      repeat: repeat,
      reverse: reverse,
      left: left,
      right: right,
      replace: replace,
      replaceFirst: replaceFirst,
      naturalSort: naturalSort,
      toNumber: toNumber,
      toBoolean: toBoolean,
      padLeft: padLeft,
      padRight: padRight,
      padBoth: padBoth,
      slice: slice,
      urlEncode: urlEncode,
      base64Encode: base64Encode,
      coalesce: coalesceString
    };

    this.numericConstants = {
      E: Math.E,
      PI: Math.PI
    };

    this.buildInLiterals = {
      true: true,
      false: false,
      null: null
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
    this.resolve = (): VariableResolveResult => undefined;
  }

  /**
   * Parses a mathematical expression into an Expression object.
   *
   * @param expr - The mathematical expression string to parse
   * @returns An Expression object that can be evaluated
   * @throws {ParseError} When the expression contains syntax errors
   * @example
   * ```typescript
   * const parser = new Parser();
   * const expression = parser.parse('2 + 3 * x');
   * const result = expression.evaluate({ x: 4 }); // Returns 14
   * ```
   */
  parse(expr: string): Expression {
    const instr: Instruction[] = [];
    const parserState = new ParserState(
      this,
      new TokenStream(this, expr),
      { allowMemberAccess: this.options.allowMemberAccess }
    );

    parserState.parseExpression(instr);
    parserState.expect(TEOF, 'EOF');

    return new Expression(instr, this);
  }

  /**
   * Parses and immediately evaluates a mathematical expression.
   * This is a convenience method equivalent to `parser.parse(expr).evaluate(variables)`.
   *
   * @param expr - The mathematical expression string to evaluate
   * @param variables - Optional object containing variable values
   * @returns The result of evaluating the expression
   * @throws {ParseError} When the expression contains syntax errors
   * @throws {VariableError} When the expression references undefined variables
   * @throws {EvaluationError} When runtime evaluation fails
   * @example
   * ```typescript
   * const parser = new Parser();
   * const result = parser.evaluate('2 + 3 * x', { x: 4 }); // Returns 14
   * ```
   */
  evaluate(expr: string, variables?: Values): Value | Promise<Value> {
    return this.parse(expr).evaluate(variables);
  }

  private static readonly optionNameMap: Record<string, string> = {
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
  } as const;

  private static getOptionName(op: string): string {
    return Parser.optionNameMap.hasOwnProperty(op) ? Parser.optionNameMap[op] : op;
  }

  /**
   * Checks if a specific operator is enabled in this parser's configuration.
   *
   * @param op - The operator to check
   * @returns True if the operator is enabled, false otherwise
   * @example
   * ```typescript
   * const parser = new Parser({ operators: { add: false } });
   * console.log(parser.isOperatorEnabled('+')); // false
   * console.log(parser.isOperatorEnabled('*')); // true (default enabled)
   * ```
   */
  isOperatorEnabled(op: string): boolean {
    const optionName = Parser.getOptionName(op);
    const operators = this.options.operators || {};

    return !(optionName in operators) || !!operators[optionName];
  }

  // Static methods for the shared parser instance
  private static sharedParser = new Parser();

  /**
   * Parses a mathematical expression using the default shared parser instance.
   * This is a static convenience method.
   *
   * @param expr - The mathematical expression string to parse
   * @returns An Expression object that can be evaluated
   * @throws {ParseError} When the expression contains syntax errors
   * @example
   * ```typescript
   * const expression = Parser.parse('2 + 3 * x');
   * const result = expression.evaluate({ x: 4 }); // Returns 14
   * ```
   */
  static parse(expr: string): Expression {
    return Parser.sharedParser.parse(expr);
  }

  /**
   * Parses and immediately evaluates a mathematical expression using the default shared parser instance.
   * This is a static convenience method equivalent to `Parser.parse(expr).evaluate(variables)`.
   *
   * @param expr - The mathematical expression string to evaluate
   * @param variables - Optional object containing variable values
   * @returns The result of evaluating the expression
   * @throws {ParseError} When the expression contains syntax errors
   * @throws {VariableError} When the expression references undefined variables
   * @throws {EvaluationError} When runtime evaluation fails
   * @example
   * ```typescript
   * const result = Parser.evaluate('2 + 3 * x', { x: 4 }); // Returns 14
   * ```
   */
  static evaluate(expr: string, variables?: Values): Value | Promise<Value> {
    return Parser.sharedParser.parse(expr).evaluate(variables);
  }
}
