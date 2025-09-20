// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND

// Instruction type constants
export const INUMBER = 'INUMBER' as const;
export const IOP1 = 'IOP1' as const;
export const IOP2 = 'IOP2' as const;
export const IOP3 = 'IOP3' as const;
export const IVAR = 'IVAR' as const;
export const IVARNAME = 'IVARNAME' as const;
export const IFUNCALL = 'IFUNCALL' as const;
export const IFUNDEF = 'IFUNDEF' as const;
export const IEXPR = 'IEXPR' as const;
export const IEXPREVAL = 'IEXPREVAL' as const;
export const IMEMBER = 'IMEMBER' as const;
export const IENDSTATEMENT = 'IENDSTATEMENT' as const;
export const IARRAY = 'IARRAY' as const;
export const IUNDEFINED = 'IUNDEFINED' as const;
export const ICASECOND = 'ICASECOND' as const;
export const ICASEMATCH = 'ICASEMATCH' as const;
export const IWHENCOND = 'IWHENCOND' as const;
export const IWHENMATCH = 'IWHENMATCH' as const;
export const ICASEELSE = 'ICASEELSE' as const;
export const IPROPERTY = 'IPROPERTY' as const;
export const IOBJECT = 'IOBJECT' as const;
export const IOBJECTEND = 'IOBJECTEND' as const;

// Union type for all instruction types
export type InstructionType =
  | typeof INUMBER
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

// Discriminated union types for better type safety
export interface NumberInstruction {
  type: typeof INUMBER;
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
    if (type === IUNDEFINED) {
      this.value = undefined;
    } else {
      // this.value = (value !== undefined && value !== null) ? value : 0;
      // We want to allow undefined values.
      this.value = (value !== null) ? value : 0;
    }
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
      case INUMBER:
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
  return new Instruction(INUMBER, value);
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
