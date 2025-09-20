import { describe, it, expect } from 'vitest';
import {
  Parser,
  ExpressionError,
  ParseError,
  AccessError,
  VariableError,
  FunctionError
} from '../../index';

describe('Expression Error Types Test', () => {
  const parser = new Parser();

  describe('Error hierarchy and inheritance', () => {
    it('should have correct inheritance chain for ParseError', () => {
      expect(() => parser.parse('2 +')).toThrow(ParseError);

      try {
        parser.parse('2 +');  // Incomplete expression
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        expect(error).toBeInstanceOf(ExpressionError);
        expect(error).toBeInstanceOf(Error);
        const parseError = error as ParseError;
        expect(parseError.name).toBe('ParseError');
        expect(parseError.code).toBe('PARSE_ERROR');
      }
    });

    it('should have correct inheritance chain for VariableError', () => {
      expect(() => parser.evaluate('undefined_variable + 1')).toThrow(VariableError);

      try {
        parser.evaluate('undefined_variable + 1');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        expect(error).toBeInstanceOf(ExpressionError);
        expect(error).toBeInstanceOf(Error);
        const varError = error as VariableError;
        expect(varError.name).toBe('VariableError');
        expect(varError.code).toBe('VARIABLE_ERROR');
      }
    });

    it('should have correct inheritance chain for AccessError', () => {
      const restrictiveParser = new Parser({ allowMemberAccess: false });
      expect(() => restrictiveParser.evaluate('obj.property')).toThrow(AccessError);

      try {
        restrictiveParser.evaluate('obj.property');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        expect(error).toBeInstanceOf(ExpressionError);
        expect(error).toBeInstanceOf(Error);
        const accessError = error as AccessError;
        expect(accessError.name).toBe('AccessError');
        expect(accessError.code).toBe('ACCESS_ERROR');
      }
    });

    it('should have correct inheritance chain for FunctionError', () => {
      expect(() => parser.evaluate('notAFunction()', { notAFunction: 42 })).toThrow(FunctionError);

      try {
        parser.evaluate('notAFunction()', { notAFunction: 42 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(FunctionError);
        expect(error).toBeInstanceOf(ExpressionError);
        expect(error).toBeInstanceOf(Error);
        const funcError = error as FunctionError;
        expect(funcError.name).toBe('FunctionError');
        expect(funcError.code).toBe('FUNCTION_ERROR');
      }
    });
  });

  describe('ParseError specific functionality', () => {
    it('should include position information in ParseError', () => {
      try {
        parser.parse('2 +');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.position).toBeDefined();
        expect(parseError.position!.line).toBe(1);
        expect(parseError.position!.column).toBe(4);
      }
    });

    it('should track position correctly for multi-line expressions', () => {
      try {
        parser.parse('1 +\n2 *\n@');  // Invalid character on line 3
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.position).toBeDefined();
        expect(parseError.position!.line).toBe(3);
        expect(parseError.position!.column).toBe(1);
      }
    });

    it('should include expression context in ParseError', () => {
      const expression = '2 + incomplete';
      try {
        parser.parse(expression);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.expression).toBe(expression);
      }
    });

    it('should handle unexpected tokens properly', () => {
      try {
        parser.parse('2 @');  // @ is not a valid token
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.message).toMatch(/unknown character/i);
        expect(parseError.position).toBeDefined();
      }
    });

    it('should handle missing closing parentheses', () => {
      try {
        parser.parse('(2 + 3');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.message).toMatch(/expected/i);
      }
    });

    it('should handle missing closing brackets', () => {
      try {
        parser.parse('[1, 2, 3');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.message).toMatch(/expected/i);
      }
    });
  });

  describe('VariableError specific functionality', () => {
    it('should include variable name in VariableError', () => {
      try {
        parser.evaluate('unknownVar + 5');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('unknownVar');
        expect(varError.message).toMatch(/undefined variable: unknownVar/);
      }
    });

    it('should handle complex variable references', () => {
      try {
        parser.evaluate('known + unknown + another', { known: 5 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('unknown');
      }
    });

    it('should include expression context in VariableError', () => {
      const expression = 'x * y + z';
      try {
        parser.evaluate(expression, { x: 1, y: 2 });  // z is missing
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        // Expression is toString() formatted, so expect parentheses
        expect(varError.expression).toBe('((x * y) + z)');
        expect(varError.variableName).toBe('z');
      }
    });

    it('should handle special variable names with $', () => {
      try {
        parser.evaluate('$special + regular', { regular: 5 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('$special');
      }
    });
  });

  describe('FunctionError specific functionality', () => {
    it('should include function name in FunctionError', () => {
      try {
        parser.evaluate('notAFunction()', { notAFunction: 42 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(FunctionError);
        const funcError = error as FunctionError;
        expect(funcError.functionName).toBe('42');
        expect(funcError.message).toMatch(/42 is not a function/);
      }
    });

    it('should handle attempts to call undefined values', () => {
      try {
        parser.evaluate('undefinedFunc()');
      } catch (error: unknown) {
        // This would be caught as a VariableError first, which is correct behavior
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('undefinedFunc');
      }
    });

    it('should handle attempts to call null values', () => {
      try {
        parser.evaluate('nullFunc()', { nullFunc: null });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(FunctionError);
        const funcError = error as FunctionError;
        expect(funcError.functionName).toBe('null');
        expect(funcError.message).toMatch(/null is not a function/);
      }
    });

    it('should include expression context in FunctionError', () => {
      const expression = 'invalidFunc() + 5';
      try {
        parser.evaluate(expression, { invalidFunc: 'string' });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(FunctionError);
        const funcError = error as FunctionError;
        expect(funcError.expression).toBe('(invalidFunc() + 5)');
        expect(funcError.functionName).toBe('string');
      }
    });
  });

  describe('AccessError specific functionality', () => {
    it('should handle member access restrictions', () => {
      const restrictiveParser = new Parser({ allowMemberAccess: false });
      try {
        restrictiveParser.evaluate('obj.prop');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        const accessError = error as AccessError;
        expect(accessError.message).toMatch(/member access is not permitted/);
      }
    });

    it('should handle prototype access security', () => {
      try {
        parser.evaluate('__proto__');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        const accessError = error as AccessError;
        expect(accessError.propertyName).toBe('__proto__');
        expect(accessError.message).toMatch(/prototype access detected/i);
      }
    });

    it('should handle constructor access security', () => {
      try {
        parser.evaluate('constructor');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        const accessError = error as AccessError;
        expect(accessError.propertyName).toBe('constructor');
        expect(accessError.message).toMatch(/prototype access detected/i);
      }
    });

    it('should handle prototype property access security', () => {
      try {
        parser.evaluate('prototype');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        const accessError = error as AccessError;
        expect(accessError.propertyName).toBe('prototype');
        expect(accessError.message).toMatch(/prototype access detected/i);
      }
    });

    it('should include expression context in AccessError', () => {
      const expression = 'obj.prop + 5';
      const restrictiveParser = new Parser({ allowMemberAccess: false });
      try {
        restrictiveParser.evaluate(expression);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AccessError);
        const accessError = error as AccessError;
        expect(accessError.expression).toBe(expression);
      }
    });
  });

  describe('Error message compatibility', () => {
    it('should maintain backward compatible error messages for undefined variables', () => {
      try {
        parser.evaluate('undefinedVar');
      } catch (error: unknown) {
        const varError = error as VariableError;
        expect(varError.message).toBe('undefined variable: undefinedVar');
      }
    });

    it('should maintain backward compatible error messages for member access', () => {
      const restrictiveParser = new Parser({ allowMemberAccess: false });
      try {
        restrictiveParser.evaluate('obj.prop');
      } catch (error: unknown) {
        const accessError = error as AccessError;
        expect(accessError.message).toBe('member access is not permitted');
      }
    });

    it('should maintain backward compatible error messages for function calls', () => {
      try {
        parser.evaluate('notFunc()', { notFunc: 123 });
      } catch (error: unknown) {
        const funcError = error as FunctionError;
        expect(funcError.message).toBe('123 is not a function');
      }
    });
  });

  describe('Error context and expression tracking', () => {
    it('should include expression in all custom errors when available', () => {
      const testCases = [
        {
          expression: 'undefinedVar + 5',
          errorType: VariableError,
          setup: () => parser.evaluate('undefinedVar + 5')
        },
        {
          expression: 'notFunc() + 3',
          errorType: FunctionError,
          setup: () => parser.evaluate('notFunc() + 3', { notFunc: 'not a function' })
        },
        {
          expression: 'obj.prop',
          errorType: AccessError,
          setup: () => new Parser({ allowMemberAccess: false }).evaluate('obj.prop')
        }
      ];

      testCases.forEach(({ expression, errorType, setup }) => {
        try {
          setup();
        } catch (error: unknown) {
          expect(error).toBeInstanceOf(errorType);
          const expressionError = error as ExpressionError;
          expect(expressionError.expression).toContain(expression);
        }
      });
    });

    it('should handle errors in complex nested expressions', () => {
      try {
        parser.evaluate('max(a, min(b, undefinedVar))', { a: 1, b: 2 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('undefinedVar');
        expect(varError.expression).toBe('max(a, min(b, undefinedVar))');
      }
    });
  });

  describe('Edge cases and error robustness', () => {
    it('should handle empty expressions gracefully', () => {
      expect(() => parser.parse('')).toThrow(ParseError);
    });

    it('should handle whitespace-only expressions', () => {
      expect(() => parser.parse('   \n  \t  ')).toThrow(ParseError);
    });

    it('should handle very long variable names', () => {
      const longVarName = 'a'.repeat(100);
      try {
        parser.evaluate(longVarName);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe(longVarName);
      }
    });

    it('should handle special characters in error context', () => {
      try {
        // Use a valid variable name that includes special characters
        parser.evaluate('special_var + undefinedÜmlauts', { special_var: 5 });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(VariableError);
        const varError = error as VariableError;
        expect(varError.variableName).toBe('undefinedÜmlauts');
      }
    });
  });

  describe('Error codes and type safety', () => {
    it('should have unique error codes for each error type', () => {
      const errorCodes = new Set();

      const testErrors = [
        () => parser.parse('2 +'),
        () => parser.evaluate('undefinedVar'),
        () => parser.evaluate('notFunc()', { notFunc: 42 }),
        () => new Parser({ allowMemberAccess: false }).evaluate('obj.prop'),
        () => parser.evaluate('__proto__')
      ];

      testErrors.forEach(testFn => {
        try {
          testFn();
        } catch (error: unknown) {
          const expressionError = error as ExpressionError;
          expect(expressionError.code).toBeDefined();
          expect(typeof expressionError.code).toBe('string');
          errorCodes.add(expressionError.code);
        }
      });

      // Should have at least 4 unique error codes
      expect(errorCodes.size).toBeGreaterThanOrEqual(4);
    });

    it('should have proper error code constants', () => {
      try {
        parser.evaluate('undefinedVar');
      } catch (error: unknown) {
        const varError = error as VariableError;
        expect(varError.code).toBe('VARIABLE_ERROR');
      }

      try {
        parser.parse('2 +');
      } catch (error: unknown) {
        const parseError = error as ParseError;
        expect(parseError.code).toBe('PARSE_ERROR');
      }

      try {
        parser.evaluate('notFunc()', { notFunc: 42 });
      } catch (error: unknown) {
        const funcError = error as FunctionError;
        expect(funcError.code).toBe('FUNCTION_ERROR');
      }
    });
  });

  describe('Function definition errors', () => {
    it('should throw ParseError for function definitions when disabled', () => {
      const noFuncParser = new Parser({ operators: { fndef: false } });
      expect(() => noFuncParser.parse('f(x) = x * x')).toThrow(ParseError);

      try {
        noFuncParser.parse('f(x) = x * x');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.message).toMatch(/function definition is not permitted/);
      }
    });

    it('should include position information for function definition errors', () => {
      const noFuncParser = new Parser({ operators: { fndef: false } });
      try {
        noFuncParser.parse('someVar = 5; f(x) = x');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ParseError);
        const parseError = error as ParseError;
        expect(parseError.position).toBeDefined();
        expect(parseError.position!.line).toBe(1);
        expect(parseError.position!.column).toBeGreaterThan(10);
      }
    });
  });
});
