import { Instruction, IEXPR, ternaryInstruction, binaryInstruction } from '../instruction.js';

/**
 * Utility class for handling conditional expression parsing
 * Manages ternary operations and branch creation for better code organization
 */
export class ConditionalExpressionParser {

  /**
   * Creates separate instruction arrays for true and false branches of ternary operation
   */
  createTernaryBranches(): { trueBranch: Instruction[], falseBranch: Instruction[] } {
    return {
      trueBranch: [],
      falseBranch: []
    };
  }

  /**
   * Finalizes ternary conditional expression by adding branch instructions
   * Follows the pattern: condition ? trueBranch : falseBranch
   */
  finalizeTernaryExpression(instr: Instruction[], trueBranch: Instruction[], falseBranch: Instruction[]): void {
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(ternaryInstruction('?'));
  }

  /**
   * Creates instruction array for logical operation branches (AND/OR)
   */
  createLogicalBranch(): Instruction[] {
    return [];
  }

  /**
   * Finalizes logical expression for OR operations
   * Implements short-circuit evaluation where right operand is only evaluated if left is false
   */
  finalizeOrExpression(instr: Instruction[], rightOperandBranch: Instruction[]): void {
    instr.push(new Instruction(IEXPR, rightOperandBranch));
    instr.push(binaryInstruction('or'));
  }

  /**
   * Finalizes logical expression for AND operations
   * Implements short-circuit evaluation where right operand is only evaluated if left is true
   */
  finalizeAndExpression(instr: Instruction[], rightOperandBranch: Instruction[]): void {
    instr.push(new Instruction(IEXPR, rightOperandBranch));
    instr.push(binaryInstruction('and'));
  }

  /**
   * Validates that conditional expression has proper structure
   */
  validateTernaryStructure(hasTrueBranch: boolean, hasFalseBranch: boolean): void {
    if (!hasTrueBranch || !hasFalseBranch) {
      throw new Error('Invalid ternary expression: missing true or false branch');
    }
  }

  /**
   * Optimizes conditional expression structure if possible
   * Could be extended to handle constant folding or other optimizations
   */
  optimizeConditionalExpression(trueBranch: Instruction[], falseBranch: Instruction[]): { optimized: boolean, trueBranch: Instruction[], falseBranch: Instruction[] } {
    // Basic structure validation - could be extended with optimizations
    return {
      optimized: false,
      trueBranch,
      falseBranch
    };
  }
}
