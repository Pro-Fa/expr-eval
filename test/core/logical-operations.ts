import { expect, describe, it } from 'vitest';
import { LogicalOperationHandler, TernaryOperationHandler } from '../../src/core/logical-operations.js';

describe('LogicalOperationHandler', () => {
  describe('handleAnd', () => {
    it('should return right operand when left is truthy', () => {
      expect(LogicalOperationHandler.handleAnd(true, 'right')).toBe('right');
      expect(LogicalOperationHandler.handleAnd(1, 'right')).toBe('right');
      expect(LogicalOperationHandler.handleAnd('left', 'right')).toBe('right');
    });

    it('should return left operand when left is falsy', () => {
      expect(LogicalOperationHandler.handleAnd(false, 'right')).toBe(false);
      expect(LogicalOperationHandler.handleAnd(0, 'right')).toBe(0);
      expect(LogicalOperationHandler.handleAnd('', 'right')).toBe('');
      expect(LogicalOperationHandler.handleAnd(null, 'right')).toBe(null);
      expect(LogicalOperationHandler.handleAnd(undefined, 'right')).toBe(undefined);
    });
  });

  describe('handleOr', () => {
    it('should return left operand when left is truthy', () => {
      expect(LogicalOperationHandler.handleOr(true, 'right')).toBe(true);
      expect(LogicalOperationHandler.handleOr(1, 'right')).toBe(1);
      expect(LogicalOperationHandler.handleOr('left', 'right')).toBe('left');
    });

    it('should return right operand when left is falsy', () => {
      expect(LogicalOperationHandler.handleOr(false, 'right')).toBe('right');
      expect(LogicalOperationHandler.handleOr(0, 'right')).toBe('right');
      expect(LogicalOperationHandler.handleOr('', 'right')).toBe('right');
      expect(LogicalOperationHandler.handleOr(null, 'right')).toBe('right');
      expect(LogicalOperationHandler.handleOr(undefined, 'right')).toBe('right');
    });
  });

  describe('isLogicalOperator', () => {
    it('should identify logical operators correctly', () => {
      expect(LogicalOperationHandler.isLogicalOperator('&&')).toBe(true);
      expect(LogicalOperationHandler.isLogicalOperator('||')).toBe(true);
      expect(LogicalOperationHandler.isLogicalOperator('and')).toBe(true);
      expect(LogicalOperationHandler.isLogicalOperator('or')).toBe(true);
    });

    it('should return false for non-logical operators', () => {
      expect(LogicalOperationHandler.isLogicalOperator('+')).toBe(false);
      expect(LogicalOperationHandler.isLogicalOperator('-')).toBe(false);
      expect(LogicalOperationHandler.isLogicalOperator('*')).toBe(false);
      expect(LogicalOperationHandler.isLogicalOperator('?')).toBe(false);
    });
  });

  describe('handle', () => {
    it('should handle && operator', () => {
      expect(LogicalOperationHandler.handle('&&', true, 'right')).toBe('right');
      expect(LogicalOperationHandler.handle('&&', false, 'right')).toBe(false);
    });

    it('should handle and operator', () => {
      expect(LogicalOperationHandler.handle('and', true, 'right')).toBe('right');
      expect(LogicalOperationHandler.handle('and', false, 'right')).toBe(false);
    });

    it('should handle || operator', () => {
      expect(LogicalOperationHandler.handle('||', true, 'right')).toBe(true);
      expect(LogicalOperationHandler.handle('||', false, 'right')).toBe('right');
    });

    it('should handle or operator', () => {
      expect(LogicalOperationHandler.handle('or', true, 'right')).toBe(true);
      expect(LogicalOperationHandler.handle('or', false, 'right')).toBe('right');
    });

    it('should throw error for unknown operators', () => {
      expect(() => LogicalOperationHandler.handle('unknown', true, false)).toThrow('Unknown logical operator: unknown');
    });
  });
});

describe('TernaryOperationHandler', () => {
  describe('handleConditional', () => {
    it('should return true value when condition is truthy', () => {
      expect(TernaryOperationHandler.handleConditional(true, 'true-val', 'false-val')).toBe('true-val');
      expect(TernaryOperationHandler.handleConditional(1, 'true-val', 'false-val')).toBe('true-val');
      expect(TernaryOperationHandler.handleConditional('truthy', 'true-val', 'false-val')).toBe('true-val');
    });

    it('should return false value when condition is falsy', () => {
      expect(TernaryOperationHandler.handleConditional(false, 'true-val', 'false-val')).toBe('false-val');
      expect(TernaryOperationHandler.handleConditional(0, 'true-val', 'false-val')).toBe('false-val');
      expect(TernaryOperationHandler.handleConditional('', 'true-val', 'false-val')).toBe('false-val');
      expect(TernaryOperationHandler.handleConditional(null, 'true-val', 'false-val')).toBe('false-val');
      expect(TernaryOperationHandler.handleConditional(undefined, 'true-val', 'false-val')).toBe('false-val');
    });
  });

  describe('isTernaryOperator', () => {
    it('should identify ternary operators correctly', () => {
      expect(TernaryOperationHandler.isTernaryOperator('?')).toBe(true);
    });

    it('should return false for non-ternary operators', () => {
      expect(TernaryOperationHandler.isTernaryOperator('&&')).toBe(false);
      expect(TernaryOperationHandler.isTernaryOperator('||')).toBe(false);
      expect(TernaryOperationHandler.isTernaryOperator('+')).toBe(false);
      expect(TernaryOperationHandler.isTernaryOperator(':')).toBe(false);
    });
  });

  describe('handle', () => {
    it('should handle ? operator', () => {
      expect(TernaryOperationHandler.handle('?', true, 'true-val', 'false-val')).toBe('true-val');
      expect(TernaryOperationHandler.handle('?', false, 'true-val', 'false-val')).toBe('false-val');
    });

    it('should throw error for unknown operators', () => {
      expect(() => TernaryOperationHandler.handle('unknown', true, 'true', 'false')).toThrow('Unknown ternary operator: unknown');
    });
  });
});
