import { Instruction, IVAR, IMEMBER, IFUNCALL, IVARNAME, IEXPR, IFUNDEF, binaryInstruction } from '../instruction.js';
import { ParseError } from '../../types/errors.js';
import { TokenStream } from '../token-stream.js';

/**
 * Utility class for handling variable assignment and function definition parsing
 * Separates assignment logic from the main parser for better maintainability
 */
export class AssignmentParser {
  private tokens: TokenStream;

  constructor(tokens: TokenStream) {
    this.tokens = tokens;
  }

  /**
   * Processes variable assignment operation
   * Handles both simple variable assignment and complex member assignment
   */
  processVariableAssignment(instr: Instruction[], varName: Instruction, varValue: Instruction[]): void {
    this.validateVariableAssignmentTarget(varName);

    instr.push(new Instruction(IVARNAME, varName.value));
    instr.push(new Instruction(IEXPR, varValue));
    instr.push(binaryInstruction('='));
  }

  /**
   * Processes function definition assignment
   * Handles conversion of parameters and function body setup
   */
  processFunctionDefinition(instr: Instruction[], varName: Instruction, varValue: Instruction[], lastInstrIndex: number): void {
    this.validateFunctionDefinitionPermission();
    this.convertParametersToVariableNames(instr, varName, lastInstrIndex);

    instr.push(new Instruction(IEXPR, varValue));
    instr.push(new Instruction(IFUNDEF, varName.value));
  }

  /**
   * Validates that the assignment target is a valid variable or member access
   */
  private validateVariableAssignmentTarget(varName: Instruction): void {
    if (varName.type !== IVAR && varName.type !== IMEMBER) {
      throw new Error('expected variable for assignment');
    }
  }

  /**
   * Validates that function definition is permitted in current context
   */
  private validateFunctionDefinitionPermission(): void {
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

  /**
   * Converts function parameters from variable references to variable names
   */
  private convertParametersToVariableNames(instr: Instruction[], varName: Instruction, lastInstrIndex: number): void {
    const parameterCount = (varName.value as number) + 1;

    for (let i = 0; i < parameterCount; i++) {
      const instructionIndex = lastInstrIndex - i;
      const instruction = instr[instructionIndex];

      if (instruction && instruction.type === IVAR) {
        instr[instructionIndex] = new Instruction(IVARNAME, instruction.value);
      }
    }
  }

  /**
   * Determines if an instruction represents a function call assignment
   */
  isFunctionCallAssignment(varName: Instruction): boolean {
    return varName.type === IFUNCALL;
  }

  /**
   * Determines if an instruction represents a variable assignment
   */
  isVariableAssignment(varName: Instruction): boolean {
    return varName.type === IVAR || varName.type === IMEMBER;
  }

  /**
   * Creates a new variable value instruction array
   */
  createVariableValueArray(): Instruction[] {
    return [];
  }
}
