/**
 * Parser configuration types and operator definitions
 */

/**
 * Available operator configurations
 */
export const OPERATOR_CONFIGS = {
  add: 'add',
  comparison: 'comparison',
  concatenate: 'concatenate',
  conditional: 'conditional',
  divide: 'divide',
  factorial: 'factorial',
  logical: 'logical',
  multiply: 'multiply',
  power: 'power',
  remainder: 'remainder',
  subtract: 'subtract',
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  asin: 'asin',
  acos: 'acos',
  atan: 'atan',
  sinh: 'sinh',
  cosh: 'cosh',
  tanh: 'tanh',
  asinh: 'asinh',
  acosh: 'acosh',
  atanh: 'atanh',
  sqrt: 'sqrt',
  log: 'log',
  ln: 'ln',
  lg: 'lg',
  log10: 'log10',
  abs: 'abs',
  ceil: 'ceil',
  floor: 'floor',
  round: 'round',
  trunc: 'trunc',
  exp: 'exp',
  length: 'length',
  in: 'in',
  random: 'random',
  min: 'min',
  max: 'max',
  assignment: 'assignment',
  fndef: 'fndef',
  cbrt: 'cbrt',
  expm1: 'expm1',
  log1p: 'log1p',
  sign: 'sign',
  log2: 'log2',
  coalesce: 'coalesce',
  conversion: 'conversion'
} as const;

/**
 * Type for operator configuration keys
 */
export type OperatorConfigKey = keyof typeof OPERATOR_CONFIGS;

/**
 * Type for operator configuration object
 */
export type OperatorConfig = Partial<Record<OperatorConfigKey, boolean>>;

/**
 * Parser configuration options
 */
export interface ParserOptions {
    readonly allowMemberAccess?: boolean;
    readonly operators?: OperatorConfig;
}

/**
 * Utility type for partial parser options
 */
export type PartialParserOptions = Partial<ParserOptions>;

/**
 * Extract operator names from ParserOptions
 */
export type OperatorName = keyof NonNullable<ParserOptions['operators']>;

/**
 * Unary operators supported by the parser
 */
export type UnaryOperator =
    | '-'
    | '+'
    | '!'
    | 'abs'
    | 'acos'
    | 'acosh'
    | 'asin'
    | 'asinh'
    | 'atan'
    | 'atanh'
    | 'cbrt'
    | 'ceil'
    | 'cos'
    | 'cosh'
    | 'exp'
    | 'expm1'
    | 'floor'
    | 'length'
    | 'lg'
    | 'ln'
    | 'log'
    | 'log1p'
    | 'log2'
    | 'log10'
    | 'not'
    | 'round'
    | 'sign'
    | 'sin'
    | 'sinh'
    | 'sqrt'
    | 'tan'
    | 'tanh'
    | 'trunc';

/**
 * Binary operators supported by the parser
 */
export type BinaryOperator =
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '^'
    | '||'
    | '=='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | '='
    | '[xxx]'
    | 'and'
    | 'in'
    | 'or'
    | '??'
    | 'as';

/**
 * Operator function type
 */
export type OperatorFunction = (...args: any[]) => any;

/**
 * Symbol/variable extraction options
 */
export interface SymbolOptions {
    readonly withMembers?: boolean;
}
