// cSpell:words ISCALAR IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND

/**
 * Instruction types for the expression evaluator's bytecode-style representation.
 *
 * The parser converts expressions into a sequence of instructions that are
 * executed by the evaluator in a stack-based manner (reverse polish notation).
 *
 * Instruction type naming convention:
 * - I = Instruction prefix
 * - SCALAR = scalar literal
 * - OP1/OP2/OP3 = unary/binary/ternary operators
 * - VAR = variable reference
 * - FUNCALL = function call
 * - etc.
 */

/** Scalar literal instruction */
export const ISCALAR = 'ISCALAR' as const;
/** Unary operator instruction (e.g., negation, factorial) */
export const IOP1 = 'IOP1' as const;
/** Binary operator instruction (e.g., +, -, *, /) */
export const IOP2 = 'IOP2' as const;
/** Ternary operator instruction (e.g., conditional ?) */
export const IOP3 = 'IOP3' as const;
/** Variable reference instruction */
export const IVAR = 'IVAR' as const;
/** Variable name instruction (used in assignments) */
export const IVARNAME = 'IVARNAME' as const;
/** Function call instruction */
export const IFUNCALL = 'IFUNCALL' as const;
/** Function definition instruction */
export const IFUNDEF = 'IFUNDEF' as const;
/** Expression instruction (for lazy evaluation) */
export const IEXPR = 'IEXPR' as const;
/** Expression evaluator instruction (compiled expression) */
export const IEXPREVAL = 'IEXPREVAL' as const;
/** Member access instruction (e.g., obj.property) */
export const IMEMBER = 'IMEMBER' as const;
/** End of statement instruction (for multi-statement expressions) */
export const IENDSTATEMENT = 'IENDSTATEMENT' as const;
/** Array literal instruction */
export const IARRAY = 'IARRAY' as const;
/** Undefined value instruction */
export const IUNDEFINED = 'IUNDEFINED' as const;
/** CASE condition instruction (for CASE WHEN without input) */
export const ICASECOND = 'ICASECOND' as const;
/** CASE match instruction (for CASE $input WHEN) */
export const ICASEMATCH = 'ICASEMATCH' as const;
/** WHEN condition instruction */
export const IWHENCOND = 'IWHENCOND' as const;
/** WHEN match instruction */
export const IWHENMATCH = 'IWHENMATCH' as const;
/** CASE ELSE instruction */
export const ICASEELSE = 'ICASEELSE' as const;
/** Object property instruction */
export const IPROPERTY = 'IPROPERTY' as const;
/** Object start instruction */
export const IOBJECT = 'IOBJECT' as const;
/** Object end instruction */
export const IOBJECTEND = 'IOBJECTEND' as const;

/**
 * Union type for all instruction types
 */
export type InstructionType =
  | typeof ISCALAR
  | typeof IOP1
  | typeof IOP2
  | typeof IOP3
  | typeof IVAR
  | typeof IVARNAME
  | typeof IFUNCALL
  | typeof IFUNDEF
  | typeof IEXPR
  | typeof IEXPREVAL
  | typeof IMEMBER
  | typeof IENDSTATEMENT
  | typeof IARRAY
  | typeof IUNDEFINED
  | typeof ICASECOND
  | typeof ICASEMATCH
  | typeof IWHENCOND
  | typeof IWHENMATCH
  | typeof ICASEELSE
  | typeof IPROPERTY
  | typeof IOBJECT
  | typeof IOBJECTEND;

/**
 * Discriminated union types for better type safety
 */
export interface NumberInstruction {
  type: typeof ISCALAR;
  value: number;
}

export interface UnaryOpInstruction {
  type: typeof IOP1;
  value: string;
}

export interface BinaryOpInstruction {
  type: typeof IOP2;
  value: string;
}

export interface TernaryOpInstruction {
  type: typeof IOP3;
  value: string;
}

export interface VariableInstruction {
  type: typeof IVAR;
  value: string;
}

export interface VarNameInstruction {
  type: typeof IVARNAME;
  value: string;
}

export interface FunctionCallInstruction {
  type: typeof IFUNCALL;
  value: number; // argument count
}

export interface FunctionDefInstruction {
  type: typeof IFUNDEF;
  value: number; // parameter count
}

export interface ExpressionInstruction {
  type: typeof IEXPR;
  value: Instruction[];
}

export interface ExpressionEvalInstruction {
  type: typeof IEXPREVAL;
  value: any; // function that evaluates expression
}

export interface MemberInstruction {
  type: typeof IMEMBER;
  value: string;
}

export interface EndStatementInstruction {
  type: typeof IENDSTATEMENT;
  value: any;
}

export interface ArrayInstruction {
  type: typeof IARRAY;
  value: number; // array length
}

export interface UndefinedInstruction {
  type: typeof IUNDEFINED;
  value: undefined;
}

export interface CaseCondInstruction {
  type: typeof ICASECOND;
  value: number; // case count
}

export interface CaseMatchInstruction {
  type: typeof ICASEMATCH;
  value: number; // case count
}

export interface WhenCondInstruction {
  type: typeof IWHENCOND;
  value: number; // when index
}

export interface WhenMatchInstruction {
  type: typeof IWHENMATCH;
  value: number; // when index
}

export interface CaseElseInstruction {
  type: typeof ICASEELSE;
  value: any;
}

export interface PropertyInstruction {
  type: typeof IPROPERTY;
  value: string;
}

export interface ObjectInstruction {
  type: typeof IOBJECT;
  value: any;
}

export interface ObjectEndInstruction {
  type: typeof IOBJECTEND;
  value: any;
}

// Union of all specific instruction types
export type TypedInstruction =
  | NumberInstruction
  | UnaryOpInstruction
  | BinaryOpInstruction
  | TernaryOpInstruction
  | VariableInstruction
  | VarNameInstruction
  | FunctionCallInstruction
  | FunctionDefInstruction
  | ExpressionInstruction
  | ExpressionEvalInstruction
  | MemberInstruction
  | EndStatementInstruction
  | ArrayInstruction
  | UndefinedInstruction
  | CaseCondInstruction
  | CaseMatchInstruction
  | WhenCondInstruction
  | WhenMatchInstruction
  | CaseElseInstruction
  | PropertyInstruction
  | ObjectInstruction
  | ObjectEndInstruction;

// Instruction class with TypeScript types
export class Instruction {
  public type: InstructionType;
  public value: any;

  constructor(type: InstructionType, value?: any) {
    this.type = type;
    this.value = (type === IUNDEFINED) ? undefined : value;
  }

  /**
   * Type guard to check if this instruction is a specific type
   */
  is<T extends InstructionType>(type: T): this is Extract<TypedInstruction, { type: T }> {
    return this.type === type;
  }

  /**
   * Type-safe value accessor for specific instruction types
   */
  getValue<T extends InstructionType>(type: T): Extract<TypedInstruction, { type: T }>['value'] {
    if (this.type === type) {
      return this.value;
    }
    throw new Error(`Expected instruction type ${type}, got ${this.type}`);
  }

  toString(): string {
    switch (this.type) {
      case ISCALAR:
      case IOP1:
      case IOP2:
      case IOP3:
      case IVAR:
      case IVARNAME:
      case IENDSTATEMENT:
        return this.value;
      case IFUNCALL:
        return 'CALL ' + this.value;
      case IFUNDEF:
        return 'DEF ' + this.value;
      case IARRAY:
        return 'ARRAY ' + this.value;
      case IMEMBER:
        return '.' + this.value;
      case IUNDEFINED:
        return 'undefined';
      case ICASECOND:
        return `CASE ${this.value}`;
      case ICASEMATCH:
        return `CASE ${this.value}`;
      case IWHENCOND:
        return `WHEN ${this.value}`;
      case IWHENMATCH:
        return `WHEN ${this.value}`;
      case ICASEELSE:
        return 'ELSE';
      case IPROPERTY:
        return `PROPERTY ${this.value}`;
      case IOBJECT:
        return `OBJECT ${this.value}`;
      default:
        return 'Invalid Instruction';
    }
  }
}

// Factory functions for common instruction types with better type safety
export function unaryInstruction(value: string): Instruction {
  return new Instruction(IOP1, value);
}

export function binaryInstruction(value: string): Instruction {
  return new Instruction(IOP2, value);
}

export function ternaryInstruction(value: string): Instruction {
  return new Instruction(IOP3, value);
}

export function numberInstruction(value: number): Instruction {
  return new Instruction(ISCALAR, value);
}

export function scalarInstruction(value: boolean | null): Instruction {
  return new Instruction(ISCALAR, value);
}

export function variableInstruction(value: string): Instruction {
  return new Instruction(IVAR, value);
}

export function functionCallInstruction(argCount: number): Instruction {
  return new Instruction(IFUNCALL, argCount);
}

export function arrayInstruction(length: number): Instruction {
  return new Instruction(IARRAY, length);
}

export function memberInstruction(property: string): Instruction {
  return new Instruction(IMEMBER, property);
}
