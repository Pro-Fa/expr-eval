// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND

export var INUMBER = 'INUMBER';
export var IOP1 = 'IOP1';
export var IOP2 = 'IOP2';
export var IOP3 = 'IOP3';
export var IVAR = 'IVAR';
export var IVARNAME = 'IVARNAME';
export var IFUNCALL = 'IFUNCALL';
export var IFUNDEF = 'IFUNDEF';
export var IEXPR = 'IEXPR';
export var IEXPREVAL = 'IEXPREVAL';
export var IMEMBER = 'IMEMBER';
export var IENDSTATEMENT = 'IENDSTATEMENT';
export var IARRAY = 'IARRAY';
export var IUNDEFINED = 'IUNDEFINED';
export var ICASECOND = 'ICASECOND';
export var ICASEMATCH = 'ICASEMATCH';
export var IWHENCOND = 'IWHENCOND';
export var IWHENMATCH = 'IWHENMATCH';
export var ICASEELSE = 'ICASEELSE';
export var IPROPERTY = 'IPROPERTY';
export var IOBJECT = 'IOBJECT';
export var IOBJECTEND = 'IOBJECTEND';

export function Instruction(type, value) {
  this.type = type;
  if (type === IUNDEFINED) {
    this.value = undefined;
  } else {
    // this.value = (value !== undefined && value !== null) ? value : 0;
    // We want to allow undefined values.
    this.value = (value !== null) ? value : 0;
  }
}

Instruction.prototype.toString = function () {
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
};

export function unaryInstruction(value) {
  return new Instruction(IOP1, value);
}

export function binaryInstruction(value) {
  return new Instruction(IOP2, value);
}

export function ternaryInstruction(value) {
  return new Instruction(IOP3, value);
}
