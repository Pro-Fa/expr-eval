import { Instruction, IENDSTATEMENT, IEXPR, IVARNAME, IFUNDEF, IMEMBER, IVAR, binaryInstruction, ternaryInstruction } from '../instruction.js';
import { Token, TPAREN, TEOF } from '../token.js';
import { ParseError } from '../../types/errors.js';
import { TokenStream } from '../token-stream.js';

/**
 * Utility class for handling complex expression parsing operations
 * Extracts reusable parsing logic to improve maintainability
 */
export class ExpressionParser {
  private tokens: TokenStream;
  private current: Token | null = null;
  private nextToken: Token | null = null;

  constructor(tokens: TokenStream) {
    this.tokens = tokens;
  }

  /**
   * Sets the current parsing context
   */
  setParsingContext(current: Token | null, nextToken: Token | null): void {
    this.current = current;
    this.nextToken = nextToken;
  }

  /**
   * Handles semicolon-terminated expressions and end statements
   */
  parseEndStatement(instr: Instruction[], exprInstr: Instruction[]): boolean {
    if (this.nextToken && this.nextToken.type !== TEOF &&
        !(this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
      exprInstr.push(new Instruction(IENDSTATEMENT));
    }
    return true;
  }

  /**
   * Handles variable assignment within expressions
   */
  parseVariableAssignment(instr: Instruction[], varName: Instruction): void {
    if (varName.type !== IVAR && varName.type !== IMEMBER) {
      throw new Error('expected variable for assignment');
    }

    const varValue: Instruction[] = [];
    // Note: Actual parsing would be handled by the main parser
    instr.push(new Instruction(IVARNAME, varName.value));
    instr.push(new Instruction(IEXPR, varValue));
    instr.push(binaryInstruction('='));
  }

  /**
   * Handles function definition assignment
   */
  parseFunctionDefinition(instr: Instruction[], varName: Instruction, lastInstrIndex: number): void {
    if (this.tokens.isOperatorEnabled('()=')) {
      const coords = this.tokens.getCoordinates();
      throw new ParseError(
        'function definition is not permitted',
        {
          position: { line: coords.line, column: coords.column },
          expression: this.tokens.expression
        }
      );
    }

    // Convert variable references to variable names for function parameters
    for (let i = 0, len = (varName.value as number) + 1; i < len; i++) {
      const index = lastInstrIndex - i;
      if (instr[index].type === IVAR) {
        instr[index] = new Instruction(IVARNAME, instr[index].value);
      }
    }

    const varValue: Instruction[] = [];
    // Note: Actual parsing would be handled by the main parser
    instr.push(new Instruction(IEXPR, varValue));
    instr.push(new Instruction(IFUNDEF, varName.value));
  }

  /**
   * Creates conditional expression branches for ternary operations
   */
  createConditionalBranches(): { trueBranch: Instruction[], falseBranch: Instruction[] } {
    return {
      trueBranch: [],
      falseBranch: []
    };
  }

  /**
   * Finalizes conditional expression with proper instruction ordering
   */
  finalizeConditionalExpression(instr: Instruction[], trueBranch: Instruction[], falseBranch: Instruction[]): void {
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(ternaryInstruction('?'));
  }

  /**
   * Creates logical operation branches for AND/OR operations
   */
  createLogicalBranch(): Instruction[] {
    return [];
  }

  /**
   * Finalizes logical expression with proper instruction ordering
   */
  finalizeLogicalExpression(instr: Instruction[], branch: Instruction[], operator: string): void {
    instr.push(new Instruction(IEXPR, branch));
    instr.push(binaryInstruction(operator));
  }

  /**
   * Validates that a variable assignment target is valid
   */
  validateAssignmentTarget(varName: Instruction): void {
    if (varName.type !== IVAR && varName.type !== IMEMBER) {
      throw new Error('expected variable for assignment');
    }
  }

  /**
   * Validates that function definition is allowed
   */
  validateFunctionDefinition(): void {
    if (this.tokens.isOperatorEnabled('()=')) {
      return;
    }

    const coords = this.tokens.getCoordinates();
    throw new ParseError(
      'function definition is not permitted',
      {
        position: { line: coords.line, column: coords.column },
        expression: this.tokens.expression
      }
    );
  }
}
