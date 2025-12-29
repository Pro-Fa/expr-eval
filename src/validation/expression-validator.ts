/**
 * Validation utilities for expression evaluation
 *
 * This module provides comprehensive validation functions for ensuring
 * safe and correct expression evaluation including security checks
 * and type validation.
 */

import { AccessError, FunctionError } from '../types/errors.js';
import type { OperatorFunction } from '../types/index.js';

/**
 * Set of dangerous property names that could lead to prototype pollution
 */
const DANGEROUS_PROPERTIES = new Set(['__proto__', 'prototype', 'constructor']);

/**
 * Safe Math functions that are allowed by default.
 * These are immutable references to the standard Math object methods.
 */
const SAFE_MATH_FUNCTIONS: ReadonlySet<Function> = new Set([
  Math.abs,
  Math.acos,
  Math.asin,
  Math.atan,
  Math.atan2,
  Math.ceil,
  Math.cos,
  Math.exp,
  Math.floor,
  Math.log,
  Math.max,
  Math.min,
  Math.pow,
  Math.random,
  Math.round,
  Math.sin,
  Math.sqrt,
  Math.tan,
  Math.log10,
  Math.log2,
  Math.log1p,
  Math.expm1,
  Math.cosh,
  Math.sinh,
  Math.tanh,
  Math.acosh,
  Math.asinh,
  Math.atanh,
  Math.hypot,
  Math.trunc,
  Math.sign,
  Math.cbrt,
  Math.clz32,
  Math.imul,
  Math.fround
]);

/**
 * Validation utilities for expression evaluation
 */
export class ExpressionValidator {
  /**
   * Validates variable name to prevent prototype pollution
   */
  static validateVariableName(variableName: string, expressionString: string): void {
    if (DANGEROUS_PROPERTIES.has(variableName)) {
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
   * Validates member access to prevent prototype pollution attacks.
   * Blocks access to __proto__, prototype, and constructor properties.
   *
   * @param propertyName - The property name being accessed
   * @param expressionString - The full expression string for error context
   * @throws {AccessError} When trying to access dangerous prototype properties
   */
  static validateMemberAccess(propertyName: string, expressionString: string): void {
    if (DANGEROUS_PROPERTIES.has(propertyName)) {
      throw new AccessError(
        `Prototype access detected in member expression`,
        {
          propertyName,
          expression: expressionString
        }
      );
    }
  }

  /**
   * Checks if a function is allowed to be called.
   * Only functions explicitly registered in expr.functions or safe Math functions are allowed.
   *
   * @param fn - The function to check
   * @param registeredFunctions - The registered functions from the expression's parser
   * @returns true if the function is allowed, false otherwise
   */
  static isAllowedFunction(fn: unknown, registeredFunctions: Record<string, OperatorFunction>): boolean {
    if (typeof fn !== 'function') {
      return true; // Non-functions are not subject to function call restrictions
    }

    // Check if it's a safe Math function
    if (SAFE_MATH_FUNCTIONS.has(fn as Function)) {
      return true;
    }

    // Check if it's registered in expr.functions
    for (const key in registeredFunctions) {
      if (Object.prototype.hasOwnProperty.call(registeredFunctions, key) && registeredFunctions[key] === fn) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validates that a function is allowed to be called.
   * Throws an error if the function is not in the allowed list.
   *
   * @param fn - The function to validate
   * @param registeredFunctions - The registered functions from the expression's parser
   * @param expressionString - The full expression string for error context
   * @throws {FunctionError} When trying to call an unregistered function
   */
  static validateAllowedFunction(
    fn: unknown,
    registeredFunctions: Record<string, OperatorFunction>,
    expressionString: string
  ): void {
    if (typeof fn === 'function' && !this.isAllowedFunction(fn, registeredFunctions)) {
      throw new FunctionError(
        'Calling unregistered functions is not allowed for security reasons',
        {
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
