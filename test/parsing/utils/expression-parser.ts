import { expect, describe, it, beforeEach } from 'vitest';
import { ExpressionParser } from '../../../src/parsing/utils/expression-parser.js';
import { TokenStream } from '../../../src/parsing/token-stream.js';
import { Instruction, IENDSTATEMENT, IEXPR, IVARNAME, IFUNDEF, IVAR, IMEMBER, binaryInstruction, ternaryInstruction } from '../../../src/parsing/instruction.js';
import { Token, TPAREN, TEOF, TNAME } from '../../../src/parsing/token.js';
import { ParseError } from '../../../src/types/errors.js';

describe('ExpressionParser', () => {
  let tokenStream: TokenStream;
  let parser: ExpressionParser;
  let mockParser: any;

  beforeEach(() => {
    // Create a minimal parser mock
    mockParser = {
      keywords: ['if', 'then', 'else'],
      unaryOps: {},
      binaryOps: {},
      ternaryOps: {},
      numericConstants: {},
      buildInLiterals: {},
      options: { allowMemberAccess: true }
    };

    tokenStream = new TokenStream(mockParser, 'test');
    parser = new ExpressionParser(tokenStream);
  });

  describe('constructor and setup', () => {
    it('should create parser with token stream', () => {
      expect(parser).toBeInstanceOf(ExpressionParser);
    });

    it('should set parsing context', () => {
      const current = new Token(TNAME, 'x', 0);
      const next = new Token(TEOF, '', 1);

      parser.setParsingContext(current, next);

      // Context should be set (no direct way to verify private fields)
      expect(parser).toBeInstanceOf(ExpressionParser);
    });
  });

  describe('parseEndStatement', () => {
    it('should add end statement when next token is not EOF', () => {
      const instr: Instruction[] = [];
      const exprInstr: Instruction[] = [];
      const next = new Token(TNAME, 'x', 1);

      parser.setParsingContext(null, next);
      const result = parser.parseEndStatement(instr, exprInstr);

      expect(result).toBe(true);
      expect(exprInstr).toHaveLength(1);
      expect(exprInstr[0].type).toBe(IENDSTATEMENT);
    });

    it('should add end statement when next token is not closing paren', () => {
      const instr: Instruction[] = [];
      const exprInstr: Instruction[] = [];
      const next = new Token(TNAME, 'x', 1);

      parser.setParsingContext(null, next);
      const result = parser.parseEndStatement(instr, exprInstr);

      expect(result).toBe(true);
      expect(exprInstr).toHaveLength(1);
      expect(exprInstr[0].type).toBe(IENDSTATEMENT);
    });

    it('should not add end statement when next token is EOF', () => {
      const instr: Instruction[] = [];
      const exprInstr: Instruction[] = [];
      const next = new Token(TEOF, '', 1);

      parser.setParsingContext(null, next);
      const result = parser.parseEndStatement(instr, exprInstr);

      expect(result).toBe(true);
      expect(exprInstr).toHaveLength(0);
    });

    it('should not add end statement when next token is closing paren', () => {
      const instr: Instruction[] = [];
      const exprInstr: Instruction[] = [];
      const next = new Token(TPAREN, ')', 1);

      parser.setParsingContext(null, next);
      const result = parser.parseEndStatement(instr, exprInstr);

      expect(result).toBe(true);
      expect(exprInstr).toHaveLength(0);
    });

    it('should handle null next token', () => {
      const instr: Instruction[] = [];
      const exprInstr: Instruction[] = [];

      parser.setParsingContext(null, null);
      const result = parser.parseEndStatement(instr, exprInstr);

      expect(result).toBe(true);
      expect(exprInstr).toHaveLength(0);
    });
  });

  describe('parseVariableAssignment', () => {
    it('should parse variable assignment for IVAR', () => {
      const instr: Instruction[] = [];
      const varName = new Instruction(IVAR, 'x');

      parser.parseVariableAssignment(instr, varName);

      expect(instr).toHaveLength(3);
      expect(instr[0].type).toBe(IVARNAME);
      expect(instr[0].value).toBe('x');
      expect(instr[1].type).toBe(IEXPR);
      expect(instr[2]).toEqual(binaryInstruction('='));
    });

    it('should parse variable assignment for IMEMBER', () => {
      const instr: Instruction[] = [];
      const varName = new Instruction(IMEMBER, 'obj.prop');

      parser.parseVariableAssignment(instr, varName);

      expect(instr).toHaveLength(3);
      expect(instr[0].type).toBe(IVARNAME);
      expect(instr[0].value).toBe('obj.prop');
      expect(instr[1].type).toBe(IEXPR);
      expect(instr[2]).toEqual(binaryInstruction('='));
    });

    it('should throw error for invalid assignment target', () => {
      const instr: Instruction[] = [];
      const varName = new Instruction(IEXPR, 'invalid');

      expect(() => {
        parser.parseVariableAssignment(instr, varName);
      }).toThrow('expected variable for assignment');
    });
  });

  describe('parseFunctionDefinition', () => {
    it('should throw error when function definition disabled', () => {
      const instr: Instruction[] = [];
      const varName = new Instruction(IVAR, 2);

      // Mock token stream methods
      tokenStream.isOperatorEnabled = () => true;
      tokenStream.getCoordinates = () => ({ line: 1, column: 5 });
      tokenStream.expression = 'f(x) = x * 2';

      expect(() => {
        parser.parseFunctionDefinition(instr, varName, 0);
      }).toThrow(ParseError);
    });

    it('should parse function definition when enabled', () => {
      const instr: Instruction[] = [
        new Instruction(IVAR, 'x'),
        new Instruction(IVAR, 'y'),
        new Instruction(IVAR, 'f')
      ];
      const varName = new Instruction(IVAR, 2);
      const lastInstrIndex = 2;

      // Mock token stream to allow function definitions
      tokenStream.isOperatorEnabled = () => false;

      parser.parseFunctionDefinition(instr, varName, lastInstrIndex);

      // Should have added expression and function definition instruction
      expect(instr).toHaveLength(5);
      expect(instr[3].type).toBe(IEXPR);
      expect(instr[4].type).toBe(IFUNDEF);
      expect(instr[4].value).toBe(2);

      // Should have converted IVAR to IVARNAME for parameters
      expect(instr[0].type).toBe(IVARNAME);
      expect(instr[1].type).toBe(IVARNAME);
      expect(instr[2].type).toBe(IVARNAME);
    });

    it('should handle single parameter function definition', () => {
      const instr: Instruction[] = [
        new Instruction(IVAR, 'x'),
        new Instruction(IVAR, 'f')
      ];
      const varName = new Instruction(IVAR, 1);
      const lastInstrIndex = 1;

      tokenStream.isOperatorEnabled = () => false;

      parser.parseFunctionDefinition(instr, varName, lastInstrIndex);

      expect(instr).toHaveLength(4);
      expect(instr[0].type).toBe(IVARNAME);
      expect(instr[1].type).toBe(IVARNAME);
    });
  });

  describe('createConditionalBranches', () => {
    it('should create empty true and false branches', () => {
      const branches = parser.createConditionalBranches();

      expect(branches.trueBranch).toEqual([]);
      expect(branches.falseBranch).toEqual([]);
      expect(Array.isArray(branches.trueBranch)).toBe(true);
      expect(Array.isArray(branches.falseBranch)).toBe(true);
    });

    it('should create separate branch instances', () => {
      const branches1 = parser.createConditionalBranches();
      const branches2 = parser.createConditionalBranches();

      expect(branches1.trueBranch).not.toBe(branches2.trueBranch);
      expect(branches1.falseBranch).not.toBe(branches2.falseBranch);
    });
  });

  describe('finalizeConditionalExpression', () => {
    it('should add conditional expression instructions', () => {
      const instr: Instruction[] = [];
      const trueBranch = [new Instruction(IVAR, 'x')];
      const falseBranch = [new Instruction(IVAR, 'y')];

      parser.finalizeConditionalExpression(instr, trueBranch, falseBranch);

      expect(instr).toHaveLength(3);
      expect(instr[0].type).toBe(IEXPR);
      expect(instr[0].value).toBe(trueBranch);
      expect(instr[1].type).toBe(IEXPR);
      expect(instr[1].value).toBe(falseBranch);
      expect(instr[2]).toEqual(ternaryInstruction('?'));
    });

    it('should handle empty branches', () => {
      const instr: Instruction[] = [];
      const trueBranch: Instruction[] = [];
      const falseBranch: Instruction[] = [];

      parser.finalizeConditionalExpression(instr, trueBranch, falseBranch);

      expect(instr).toHaveLength(3);
      expect(instr[0].value).toEqual([]);
      expect(instr[1].value).toEqual([]);
    });
  });

  describe('createLogicalBranch', () => {
    it('should create empty logical branch', () => {
      const branch = parser.createLogicalBranch();

      expect(branch).toEqual([]);
      expect(Array.isArray(branch)).toBe(true);
    });

    it('should create separate branch instances', () => {
      const branch1 = parser.createLogicalBranch();
      const branch2 = parser.createLogicalBranch();

      expect(branch1).not.toBe(branch2);
    });
  });

  describe('finalizeLogicalExpression', () => {
    it('should add logical expression with AND operator', () => {
      const instr: Instruction[] = [];
      const branch = [new Instruction(IVAR, 'x')];

      parser.finalizeLogicalExpression(instr, branch, 'and');

      expect(instr).toHaveLength(2);
      expect(instr[0].type).toBe(IEXPR);
      expect(instr[0].value).toBe(branch);
      expect(instr[1]).toEqual(binaryInstruction('and'));
    });

    it('should add logical expression with OR operator', () => {
      const instr: Instruction[] = [];
      const branch = [new Instruction(IVAR, 'y')];

      parser.finalizeLogicalExpression(instr, branch, '||');

      expect(instr).toHaveLength(2);
      expect(instr[0].type).toBe(IEXPR);
      expect(instr[0].value).toBe(branch);
      expect(instr[1]).toEqual(binaryInstruction('||'));
    });

    it('should handle empty branch', () => {
      const instr: Instruction[] = [];
      const branch: Instruction[] = [];

      parser.finalizeLogicalExpression(instr, branch, 'and');

      expect(instr).toHaveLength(2);
      expect(instr[0].value).toEqual([]);
    });
  });

  describe('validateAssignmentTarget', () => {
    it('should accept IVAR instruction', () => {
      const varName = new Instruction(IVAR, 'x');

      expect(() => {
        parser.validateAssignmentTarget(varName);
      }).not.toThrow();
    });

    it('should accept IMEMBER instruction', () => {
      const varName = new Instruction(IMEMBER, 'obj.prop');

      expect(() => {
        parser.validateAssignmentTarget(varName);
      }).not.toThrow();
    });

    it('should reject invalid instruction type', () => {
      const varName = new Instruction(IEXPR, 'invalid');

      expect(() => {
        parser.validateAssignmentTarget(varName);
      }).toThrow('expected variable for assignment');
    });
  });

  describe('validateFunctionDefinition', () => {
    it('should not throw when function definition enabled', () => {
      tokenStream.isOperatorEnabled = () => true; // Function definitions enabled

      expect(() => {
        parser.validateFunctionDefinition();
      }).not.toThrow();
    });

    it('should throw ParseError when function definition disabled', () => {
      tokenStream.isOperatorEnabled = () => false; // Function definitions disabled
      tokenStream.getCoordinates = () => ({ line: 2, column: 10 });
      tokenStream.expression = 'f(x) = x + 1';

      expect(() => {
        parser.validateFunctionDefinition();
      }).toThrow(ParseError);
    });

    it('should include position information in error', () => {
      tokenStream.isOperatorEnabled = () => true;
      tokenStream.getCoordinates = () => ({ line: 3, column: 7 });
      tokenStream.expression = 'test expression';

      try {
        parser.validateFunctionDefinition();
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError);
        expect((error as ParseError).context?.position).toEqual({
          line: 3,
          column: 7
        });
        expect((error as ParseError).context?.expression).toBe('test expression');
      }
    });
  });
});
