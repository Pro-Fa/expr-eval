/**
 * Error context utilities for creating rich error information
 */

import type { Token } from '../parsing/token.js';
import type { Value } from '../types/values.js';

/**
 * Context information for errors (legacy interface for backward compatibility)
 */
export interface LegacyErrorContext {
  expression?: string;
  token?: Token;
  operation?: string;
  values?: Value[];
  variableName?: string;
  functionName?: string;
  position?: {
    line: number;
    column: number;
    offset: number;
  };
}

/**
 * Builder for creating rich error contexts
 */
export class ErrorContextBuilder {
  private context: LegacyErrorContext = {};

  /**
   * Creates context for parsing errors
   */
  static forParsing(token: Token, expression: string): LegacyErrorContext {
    return {
      expression,
      token,
      position: {
        line: 1,
        column: token.index || 0,
        offset: token.index || 0
      }
    };
  }

  /**
   * Creates context for evaluation errors
   */
  static forEvaluation(operation: string, values: Value[], expression?: string): LegacyErrorContext {
    return {
      operation,
      values,
      expression
    };
  }

  /**
   * Creates context for variable access errors
   */
  static forVariableAccess(variableName: string, expression?: string): LegacyErrorContext {
    return {
      variableName,
      expression
    };
  }

  /**
   * Creates context for function call errors
   */
  static forFunctionCall(functionName: string, expression?: string): LegacyErrorContext {
    return {
      functionName,
      expression
    };
  }

  /**
   * Builder pattern methods for constructing complex contexts
   */
  withExpression(expression: string): this {
    this.context.expression = expression;
    return this;
  }

  withToken(token: Token): this {
    this.context.token = token;
    return this;
  }

  withOperation(operation: string): this {
    this.context.operation = operation;
    return this;
  }

  withValues(values: Value[]): this {
    this.context.values = values;
    return this;
  }

  withPosition(line: number, column: number, offset: number): this {
    this.context.position = { line, column, offset };
    return this;
  }

  build(): LegacyErrorContext {
    return { ...this.context };
  }
}
