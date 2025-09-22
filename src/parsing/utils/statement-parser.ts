import { Instruction, IENDSTATEMENT, IEXPR } from '../instruction.js';
import { Token, TEOF, TPAREN } from '../token.js';

/**
 * Utility class for handling statement parsing operations
 * Manages end-of-statement detection and statement termination logic
 */
export class StatementParser {

  /**
   * Determines if an end statement instruction should be added
   * Based on the next token and expression context
   */
  shouldAddEndStatement(nextToken: Token | null): boolean {
    return nextToken !== null &&
           nextToken.type !== TEOF &&
           !(nextToken.type === TPAREN && nextToken.value === ')');
  }

  /**
   * Creates an end statement instruction for expression termination
   */
  createEndStatement(): Instruction {
    return new Instruction(IENDSTATEMENT);
  }

  /**
   * Creates an expression instruction wrapping the provided instruction array
   */
  createExpressionInstruction(expressionInstructions: Instruction[]): Instruction {
    return new Instruction(IEXPR, expressionInstructions);
  }

  /**
   * Determines if parsing should continue based on the current token
   */
  shouldContinueParsing(nextToken: Token | null): boolean {
    return nextToken !== null && nextToken.type !== TEOF;
  }

  /**
   * Processes statement termination with proper instruction ordering
   */
  processStatementTermination(
    mainInstructions: Instruction[],
    expressionInstructions: Instruction[],
    nextToken: Token | null
  ): void {
    if (this.shouldAddEndStatement(nextToken)) {
      expressionInstructions.push(this.createEndStatement());
    }

    mainInstructions.push(this.createExpressionInstruction(expressionInstructions));
  }

  /**
   * Validates statement structure for proper termination
   */
  validateStatementStructure(expressionInstructions: Instruction[]): void {
    if (expressionInstructions.length === 0) {
      throw new Error('Empty expression in statement');
    }
  }

  /**
   * Optimizes statement structure if possible
   * Could be extended to handle redundant instruction elimination
   */
  optimizeStatementStructure(expressionInstructions: Instruction[]): Instruction[] {
    // Basic validation - could be extended with optimizations
    return expressionInstructions;
  }

  /**
   * Creates a new instruction array for building expressions
   */
  createInstructionArray(): Instruction[] {
    return [];
  }
}
