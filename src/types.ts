// Core primitive types
export type Primitive = number | string | boolean | null | undefined;

// Function types for expression evaluation
export type SyncFunction = (...args: Value[]) => Value;
export type AsyncFunction = (...args: Value[]) => Promise<Value>;
export type ExpressionFunction = SyncFunction | AsyncFunction | ((...args: any[]) => Value | Promise<Value>);

// Object and array types (recursive)
export interface ValueObject {
    [propertyName: string]: Value;
}

export type ValueArray = Value[];

// Core value types that can be used in expressions
export type Value =
    | Primitive
    | ExpressionFunction
    | ValueObject
    | ValueArray;

// Values object for variable evaluation
export interface Values {
    [propertyName: string]: Value;
}

// ============================================================================
// Utility Types and Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a primitive type
 */
export function isPrimitive(value: Value): value is Primitive {
  return value === null || value === undefined ||
           typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
}

/**
 * Type guard to check if a value is a function
 */
export function isFunction(value: Value): value is ExpressionFunction {
  return typeof value === 'function';
}

/**
 * Type guard to check if a value is an object (but not array or null)
 */
export function isValueObject(value: Value): value is ValueObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is an array
 */
export function isValueArray(value: Value): value is ValueArray {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is numeric (number or numeric string)
 */
export function isNumeric(value: Value): value is number | string {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'string') {
    return !isNaN(Number(value)) && value.trim() !== '';
  }
  return false;
}

/**
 * Utility type for partial parser options
 */
export type PartialParserOptions = Partial<ParserOptions>;

/**
 * Utility type for readonly Values
 */
export type ReadonlyValues = Readonly<Values>;

/**
 * Extract operator names from ParserOptions
 */
export type OperatorName = keyof NonNullable<ParserOptions['operators']>;

// ============================================================================
// Parser Configuration Types
// ============================================================================

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

// Parser configuration options
export interface ParserOptions {
    readonly allowMemberAccess?: boolean;
    readonly operators?: OperatorConfig;
}

// Unary operators supported by the parser
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

// Binary operators supported by the parser
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

// Symbol/variable extraction options
export interface SymbolOptions {
    readonly withMembers?: boolean;
}

// Variable resolver result types
export interface VariableAlias {
    readonly alias: string;
}

export interface VariableValue {
    readonly value: Value;
}

export type VariableResolveResult = VariableAlias | VariableValue | Value | undefined;

// Operator function type
export type OperatorFunction = (...args: any[]) => any;

// ============================================================================
// Error Handling Types
// ============================================================================

/**
 * Error codes for different types of expression errors
 */
export const ERROR_CODES = {
  PARSE_ERROR: 'PARSE_ERROR',
  EVALUATION_ERROR: 'EVALUATION_ERROR',
  ARGUMENT_ERROR: 'ARGUMENT_ERROR',
  ACCESS_ERROR: 'ACCESS_ERROR',
  VARIABLE_ERROR: 'VARIABLE_ERROR',
  FUNCTION_ERROR: 'FUNCTION_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Position information for error reporting
 */
export interface ErrorPosition {
    readonly line: number;
    readonly column: number;
}

/**
 * Error context interface for better error reporting
 */
export interface ErrorContext {
    readonly expression?: string;
    readonly position?: ErrorPosition;
    readonly token?: string;
    readonly variableName?: string;
    readonly functionName?: string;
    readonly propertyName?: string;
    readonly expectedType?: string;
    readonly receivedType?: string;
    readonly argumentIndex?: number;
}

// ============================================================================
// Custom Error Types
// ============================================================================

/**
 * Base class for all expression evaluation errors
 */
export abstract class ExpressionError extends Error {
    abstract readonly code: ErrorCode;

    constructor(
      message: string,
        public readonly context: Partial<ErrorContext> = {}
    ) {
      super(message);
      this.name = this.constructor.name;

      // Maintain proper stack trace for where our error was thrown (only available on V8)
      if ((Error as any).captureStackTrace) {
        (Error as any).captureStackTrace(this, this.constructor);
      }
    }

    /**
     * Get the expression that caused this error
     */
    get expression(): string | undefined {
      return this.context.expression;
    }

    /**
     * Get the position where this error occurred
     */
    get position(): ErrorPosition | undefined {
      return this.context.position;
    }
}

/**
 * Thrown when there are syntax errors during expression parsing
 */
export class ParseError extends ExpressionError {
  readonly code = ERROR_CODES.PARSE_ERROR;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context);
  }

  override toString(): string {
    if (this.context.position) {
      return `${this.name} [${this.context.position.line}:${this.context.position.column}]: ${this.message}`;
    }
    return `${this.name}: ${this.message}`;
  }
}

/**
 * Thrown when there are runtime errors during expression evaluation
 */
export class EvaluationError extends ExpressionError {
  readonly code = ERROR_CODES.EVALUATION_ERROR;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context);
  }

  /**
     * Get the variable name that caused this error
     */
  get variableName(): string | undefined {
    return this.context.variableName;
  }
}

/**
 * Thrown when function arguments have invalid types or counts
 */
export class ArgumentError extends ExpressionError {
  readonly code = ERROR_CODES.ARGUMENT_ERROR;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context);
  }

  /**
     * Get the function name that caused this error
     */
  get functionName(): string | undefined {
    return this.context.functionName;
  }

  /**
     * Get the expected argument type
     */
  get expectedType(): string | undefined {
    return this.context.expectedType;
  }

  /**
     * Get the received argument type
     */
  get receivedType(): string | undefined {
    return this.context.receivedType;
  }

  /**
     * Get the argument index that caused this error
     */
  get argumentIndex(): number | undefined {
    return this.context.argumentIndex;
  }
}

/**
 * Thrown when trying to access object properties in a restricted context
 */
export class AccessError extends ExpressionError {
  readonly code = ERROR_CODES.ACCESS_ERROR;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context);
  }

  /**
     * Get the property name that caused this error
     */
  get propertyName(): string | undefined {
    return this.context.propertyName;
  }
}

/**
 * Thrown when an unknown variable is referenced
 */
export class VariableError extends ExpressionError {
  readonly code = ERROR_CODES.VARIABLE_ERROR;

  constructor(
    variableName: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(`undefined variable: ${variableName}`, {
      ...context,
      variableName
    });
  }

  /**
     * Get the variable name that caused this error
     */
  get variableName(): string {
    return this.context.variableName!;
  }
}

/**
 * Thrown when a function is not found or not callable
 */
export class FunctionError extends ExpressionError {
  readonly code = ERROR_CODES.FUNCTION_ERROR;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context);
  }

  /**
     * Get the function name that caused this error
     */
  get functionName(): string | undefined {
    return this.context.functionName;
  }
}
