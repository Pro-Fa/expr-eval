/**
 * Error handling types and custom error classes for expression evaluation
 */

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
