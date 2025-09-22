import type { Value } from '../types';

/**
 * Handlers for logical operations
 */
export class LogicalOperationHandler {
  /**
   * Handles logical AND operation with short-circuit evaluation
   */
  static handleAnd(leftOperand: Value, rightOperand: Value): Value {
    return leftOperand ? rightOperand : leftOperand;
  }

  /**
   * Handles logical OR operation with short-circuit evaluation
   */
  static handleOr(leftOperand: Value, rightOperand: Value): Value {
    return leftOperand || rightOperand;
  }

  /**
   * Determines if an operator is a logical operator
   */
  static isLogicalOperator(operator: string): boolean {
    return operator === '&&' || operator === '||' || operator === 'and' || operator === 'or';
  }

  /**
   * Handles all logical operations
   */
  static handle(operator: string, leftOperand: Value, rightOperand: Value): Value {
    switch (operator) {
      case '&&':
      case 'and':
        return this.handleAnd(leftOperand, rightOperand);
      case '||':
      case 'or':
        return this.handleOr(leftOperand, rightOperand);
      default:
        throw new Error(`Unknown logical operator: ${operator}`);
    }
  }
}

/**
 * Handlers for ternary operations
 */
export class TernaryOperationHandler {
  /**
   * Handles ternary conditional operation (? :)
   */
  static handleConditional(condition: Value, trueValue: Value, falseValue: Value): Value {
    return condition ? trueValue : falseValue;
  }

  /**
   * Determines if an operator is a ternary operator
   */
  static isTernaryOperator(operator: string): boolean {
    return operator === '?';
  }

  /**
   * Handles all ternary operations
   */
  static handle(operator: string, condition: Value, trueValue: Value, falseValue: Value): Value {
    if (operator === '?') {
      return this.handleConditional(condition, trueValue, falseValue);
    }

    throw new Error(`Unknown ternary operator: ${operator}`);
  }
}
