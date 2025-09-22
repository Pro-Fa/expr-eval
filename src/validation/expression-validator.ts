/**
 * Validation utilities for expression evaluation
 *
 * This module provides comprehensive validation functions for ensuring
 * safe and correct expression evaluation including security checks
 * and type validation.
 */

import { AccessError, FunctionError } from '../types/errors.js';

/**
 * Validation utilities for expression evaluation
 */
export class ExpressionValidator {
  /**
   * Validates variable name to prevent prototype pollution
   */
  static validateVariableName(variableName: string, expressionString: string): void {
    if (/^__proto__|prototype|constructor$/.test(variableName)) {
      throw new AccessError(
        'Prototype access detected',
        {
          propertyName: variableName,
          expression: expressionString
        }
      );
    }
  }

  /**
   * Validates function call parameters
   */
  static validateFunctionCall(functionValue: any, functionName: string, expressionString: string): void {
    if (typeof functionValue !== 'function') {
      throw new FunctionError(
        `${functionValue} is not a function`,
        {
          functionName: String(functionValue),
          expression: expressionString
        }
      );
    }
  }

  /**
   * Validates array access with proper error context
   */
  static validateArrayAccess(parent: any, index: any): void {
    if (Array.isArray(parent) && !Number.isInteger(index)) {
      throw new Error(`Array can only be indexed with integers. Received: ${index}`);
    }
  }

  /**
   * Validates that required parameters are present
   */
  static validateRequiredParameter(value: any, parameterName: string): void {
    if (value === undefined || value === null) {
      throw new Error(`Required parameter '${parameterName}' is missing`);
    }
  }

  /**
   * Validates expression evaluation stack parity
   */
  static validateStackParity(stackLength: number): void {
    if (stackLength > 1) {
      throw new Error('invalid Expression (parity)');
    }
  }
}
