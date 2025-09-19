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

// Factory functions for common instruction types
export function unaryInstruction(value: any): Instruction {
  return new Instruction(IOP1, value);
}

export function binaryInstruction(value: any): Instruction {
  return new Instruction(IOP2, value);
}

export function ternaryInstruction(value: any): Instruction {
  return new Instruction(IOP3, value);
}
