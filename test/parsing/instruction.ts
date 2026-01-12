import { describe, it, expect } from 'vitest';
import {
  Instruction,
  unaryInstruction,
  binaryInstruction,
  ternaryInstruction,
  numberInstruction,
  variableInstruction,
  functionCallInstruction,
  arrayInstruction,
  memberInstruction,
  ISCALAR,
  IOP1,
  IOP2,
  IOP3,
  IVAR,
  IVARNAME,
  IFUNCALL,
  IFUNDEF,
  IARRAY,
  IMEMBER,
  IUNDEFINED,
  IENDSTATEMENT,
  ICASECOND,
  ICASEMATCH,
  IWHENCOND,
  IWHENMATCH,
  ICASEELSE,
  IPROPERTY,
  IOBJECT
} from '../../src/parsing/instruction.js';

describe('Instruction', () => {
  describe('constructor and basic properties', () => {
    it('should create instruction with type and value', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(instruction.type).toBe(ISCALAR);
      expect(instruction.value).toBe(42);
    });

    it('should handle null value correctly', () => {
      const instruction = new Instruction(ISCALAR, null);
      expect(instruction.value).toBe(null);
    });

    it('should preserve undefined value', () => {
      const instruction = new Instruction(IVAR, undefined);
      expect(instruction.value).toBe(undefined);
    });

    it('should preserve zero value', () => {
      const instruction = new Instruction(ISCALAR, 0);
      expect(instruction.value).toBe(0);
    });
  });

  describe('is() type guard method', () => {
    it('should correctly identify matching instruction type', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(instruction.is(ISCALAR)).toBe(true);
    });

    it('should correctly reject non-matching instruction type', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(instruction.is(IVAR)).toBe(false);
    });

    it('should work with all instruction types', () => {
      const types = [
        ISCALAR, IOP1, IOP2, IOP3, IVAR, IVARNAME, IFUNCALL, IFUNDEF,
        IARRAY, IMEMBER, IUNDEFINED, IENDSTATEMENT, ICASECOND, ICASEMATCH,
        IWHENCOND, IWHENMATCH, ICASEELSE, IPROPERTY, IOBJECT
      ];

      types.forEach(type => {
        const instruction = new Instruction(type, 'test');
        expect(instruction.is(type)).toBe(true);

        // Test that it returns false for a different type
        const otherType = types.find(t => t !== type) || ISCALAR;
        expect(instruction.is(otherType)).toBe(false);
      });
    });
  });

  describe('getValue() method', () => {
    it('should return value when type matches', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(instruction.getValue(ISCALAR)).toBe(42);
    });

    it('should throw error when type does not match', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(() => instruction.getValue(IVAR)).toThrow('Expected instruction type IVAR, got ISCALAR');
    });

    it('should work with string values', () => {
      const instruction = new Instruction(IVAR, 'myVariable');
      expect(instruction.getValue(IVAR)).toBe('myVariable');
    });

    it('should work with undefined values', () => {
      const instruction = new Instruction(IVAR, undefined);
      expect(instruction.getValue(IVAR)).toBe(undefined);
    });
  });

  describe('toString() method', () => {
    it('should return value string for ISCALAR', () => {
      const instruction = new Instruction(ISCALAR, 42);
      expect(instruction.toString()).toBe(42);
    });

    it('should return value string for IOP1', () => {
      const instruction = new Instruction(IOP1, '-');
      expect(instruction.toString()).toBe('-');
    });

    it('should return value string for IOP2', () => {
      const instruction = new Instruction(IOP2, '+');
      expect(instruction.toString()).toBe('+');
    });

    it('should return value string for IOP3', () => {
      const instruction = new Instruction(IOP3, '?');
      expect(instruction.toString()).toBe('?');
    });

    it('should return value string for IVAR', () => {
      const instruction = new Instruction(IVAR, 'x');
      expect(instruction.toString()).toBe('x');
    });

    it('should return value string for IVARNAME', () => {
      const instruction = new Instruction(IVARNAME, 'myVar');
      expect(instruction.toString()).toBe('myVar');
    });

    it('should return value string for IENDSTATEMENT', () => {
      const instruction = new Instruction(IENDSTATEMENT, ';');
      expect(instruction.toString()).toBe(';');
    });

    it('should return CALL prefix for IFUNCALL', () => {
      const instruction = new Instruction(IFUNCALL, 2);
      expect(instruction.toString()).toBe('CALL 2');
    });

    it('should return DEF prefix for IFUNDEF', () => {
      const instruction = new Instruction(IFUNDEF, 'myFunc');
      expect(instruction.toString()).toBe('DEF myFunc');
    });

    it('should return ARRAY prefix for IARRAY', () => {
      const instruction = new Instruction(IARRAY, 3);
      expect(instruction.toString()).toBe('ARRAY 3');
    });

    it('should return dot prefix for IMEMBER', () => {
      const instruction = new Instruction(IMEMBER, 'property');
      expect(instruction.toString()).toBe('.property');
    });

    it('should return undefined for IUNDEFINED', () => {
      const instruction = new Instruction(IUNDEFINED, null);
      expect(instruction.toString()).toBe('undefined');
    });

    it('should return CASE prefix for ICASECOND', () => {
      const instruction = new Instruction(ICASECOND, 'condition');
      expect(instruction.toString()).toBe('CASE condition');
    });

    it('should return CASE prefix for ICASEMATCH', () => {
      const instruction = new Instruction(ICASEMATCH, 'match');
      expect(instruction.toString()).toBe('CASE match');
    });

    it('should return WHEN prefix for IWHENCOND', () => {
      const instruction = new Instruction(IWHENCOND, 'condition');
      expect(instruction.toString()).toBe('WHEN condition');
    });

    it('should return WHEN prefix for IWHENMATCH', () => {
      const instruction = new Instruction(IWHENMATCH, 'match');
      expect(instruction.toString()).toBe('WHEN match');
    });

    it('should return ELSE for ICASEELSE', () => {
      const instruction = new Instruction(ICASEELSE, null);
      expect(instruction.toString()).toBe('ELSE');
    });

    it('should return PROPERTY prefix for IPROPERTY', () => {
      const instruction = new Instruction(IPROPERTY, 'name');
      expect(instruction.toString()).toBe('PROPERTY name');
    });

    it('should return OBJECT prefix for IOBJECT', () => {
      const instruction = new Instruction(IOBJECT, 5);
      expect(instruction.toString()).toBe('OBJECT 5');
    });

    it('should return Invalid Instruction for unknown type', () => {
      const instruction = new Instruction('UNKNOWN_TYPE' as any, 'value');
      expect(instruction.toString()).toBe('Invalid Instruction');
    });
  });

  describe('Factory functions', () => {
    it('should create unary instruction', () => {
      const instruction = unaryInstruction('-');
      expect(instruction.type).toBe(IOP1);
      expect(instruction.value).toBe('-');
    });

    it('should create binary instruction', () => {
      const instruction = binaryInstruction('+');
      expect(instruction.type).toBe(IOP2);
      expect(instruction.value).toBe('+');
    });

    it('should create ternary instruction', () => {
      const instruction = ternaryInstruction('?');
      expect(instruction.type).toBe(IOP3);
      expect(instruction.value).toBe('?');
    });

    it('should create number instruction', () => {
      const instruction = numberInstruction(42);
      expect(instruction.type).toBe(ISCALAR);
      expect(instruction.value).toBe(42);
    });

    it('should create variable instruction', () => {
      const instruction = variableInstruction('myVar');
      expect(instruction.type).toBe(IVAR);
      expect(instruction.value).toBe('myVar');
    });

    it('should create function call instruction', () => {
      const instruction = functionCallInstruction(3);
      expect(instruction.type).toBe(IFUNCALL);
      expect(instruction.value).toBe(3);
    });

    it('should create array instruction', () => {
      const instruction = arrayInstruction(5);
      expect(instruction.type).toBe(IARRAY);
      expect(instruction.value).toBe(5);
    });

    it('should create member instruction', () => {
      const instruction = memberInstruction('prop');
      expect(instruction.type).toBe(IMEMBER);
      expect(instruction.value).toBe('prop');
    });
  });

  describe('Edge cases and comprehensive coverage', () => {
    it('should handle numeric zero in number instruction', () => {
      const instruction = numberInstruction(0);
      expect(instruction.value).toBe(0);
      expect(instruction.toString()).toBe(0);
    });

    it('should handle empty string values', () => {
      const instruction = variableInstruction('');
      expect(instruction.value).toBe('');
      expect(instruction.toString()).toBe('');
    });

    it('should handle negative numbers', () => {
      const instruction = numberInstruction(-42);
      expect(instruction.value).toBe(-42);
      expect(instruction.toString()).toBe(-42);
    });

    it('should handle complex string values in toString', () => {
      const instruction = new Instruction(IFUNDEF, 'complexFunctionName');
      expect(instruction.toString()).toBe('DEF complexFunctionName');
    });

    it('should preserve boolean values', () => {
      const instruction = new Instruction(IVAR, false);
      expect(instruction.value).toBe(false);
    });

    it('should handle all instruction types with type guards', () => {
      const testCases = [
        { type: ISCALAR, value: 42 },
        { type: IOP1, value: 'abs' },
        { type: IOP2, value: '*' },
        { type: IOP3, value: '?' },
        { type: IVAR, value: 'variable' },
        { type: IVARNAME, value: 'varName' },
        { type: IFUNCALL, value: 2 },
        { type: IFUNDEF, value: 'func' },
        { type: IARRAY, value: 3 },
        { type: IMEMBER, value: 'member' },
        { type: IUNDEFINED, value: undefined },
        { type: IENDSTATEMENT, value: ';' },
        { type: ICASECOND, value: 'case' },
        { type: ICASEMATCH, value: 'match' },
        { type: IWHENCOND, value: 'when' },
        { type: IWHENMATCH, value: 'whenmatch' },
        { type: ICASEELSE, value: 0 },
        { type: IPROPERTY, value: 'prop' },
        { type: IOBJECT, value: 4 }
      ];

      testCases.forEach(({ type, value }) => {
        const instruction = new Instruction(type, value);
        expect(instruction.is(type)).toBe(true);
        expect(instruction.getValue(type)).toBe(value);
      });
    });
  });
});
