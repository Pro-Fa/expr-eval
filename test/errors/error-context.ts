import { expect, describe, it } from 'vitest';
import { ErrorContextBuilder } from '../../src/errors/error-context.js';
import { Token, TOP } from '../../src/parsing/token.js';

describe('ErrorContextBuilder', () => {
  describe('static factory methods', () => {
    it('should create parsing context', () => {
      const token = new Token(TOP, '(', 5);
      const expression = '1 + (2 * 3';

      const context = ErrorContextBuilder.forParsing(token, expression);

      expect(context.expression).toBe(expression);
      expect(context.token).toBe(token);
      expect(context.position).toEqual({
        line: 1,
        column: 5,
        offset: 5
      });
    });

    it('should create evaluation context', () => {
      const operation = 'add';
      const values = [1, 2];
      const expression = '1 + 2';

      const context = ErrorContextBuilder.forEvaluation(operation, values, expression);

      expect(context.operation).toBe(operation);
      expect(context.values).toBe(values);
      expect(context.expression).toBe(expression);
    });

    it('should create variable access context', () => {
      const variableName = 'x';
      const expression = 'x + 1';

      const context = ErrorContextBuilder.forVariableAccess(variableName, expression);

      expect(context.variableName).toBe(variableName);
      expect(context.expression).toBe(expression);
    });

    it('should create function call context', () => {
      const functionName = 'sin';
      const expression = 'sin(x)';

      const context = ErrorContextBuilder.forFunctionCall(functionName, expression);

      expect(context.functionName).toBe(functionName);
      expect(context.expression).toBe(expression);
    });
  });

  describe('builder pattern', () => {
    it('should build context using builder pattern', () => {
      const token = new Token(TOP, '(', 5);
      const builder = new ErrorContextBuilder();

      const context = builder
        .withExpression('1 + 2')
        .withToken(token)
        .withOperation('add')
        .withValues([1, 2])
        .withPosition(1, 10, 10)
        .build();

      expect(context.expression).toBe('1 + 2');
      expect(context.token).toBe(token);
      expect(context.operation).toBe('add');
      expect(context.values).toEqual([1, 2]);
      expect(context.position).toEqual({
        line: 1,
        column: 10,
        offset: 10
      });
    });

    it('should return new instance from build()', () => {
      const builder = new ErrorContextBuilder();
      const context1 = builder.withExpression('test').build();
      const context2 = builder.withExpression('test2').build();

      expect(context1).not.toBe(context2);
      expect(context1.expression).toBe('test');
      expect(context2.expression).toBe('test2');
    });

    it('should handle token index correctly', () => {
      const token = new Token(TOP, '(', 0);
      const expression = '1 + (2 * 3';

      const context = ErrorContextBuilder.forParsing(token, expression);

      expect(context.position).toEqual({
        line: 1,
        column: 0,
        offset: 0
      });
    });
  });
});
