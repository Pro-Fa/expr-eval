import { expect, describe, it } from 'vitest';
import { ParserConfigurationBuilder } from '../../src/config/parser-configuration-builder.js';

describe('ParserConfigurationBuilder', () => {
  describe('constructor and basic usage', () => {
    it('should create an empty builder', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder.build();

      expect(config).toEqual({});
    });

    it('should allow method chaining', () => {
      const builder = new ParserConfigurationBuilder();

      const result = builder
        .withMemberAccess(true)
        .withArithmeticOperators();

      expect(result).toBe(builder);
    });
  });

  describe('operator configuration', () => {
    it('should configure operators using withOperators', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withOperators({ add: true, subtract: false })
        .build();

      expect(config.operators).toEqual({
        add: true,
        subtract: false
      });
    });

    it('should merge multiple operator configurations', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withOperators({ add: true, subtract: false })
        .withOperators({ multiply: true, divide: false })
        .build();

      expect(config.operators).toEqual({
        add: true,
        subtract: false,
        multiply: true,
        divide: false
      });
    });

    it('should override previous operator settings when merging', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withOperators({ add: true, subtract: false })
        .withOperators({ add: false, multiply: true })
        .build();

      expect(config.operators).toEqual({
        add: false,
        subtract: false,
        multiply: true
      });
    });
  });

  describe('member access configuration', () => {
    it('should configure member access with withMemberAccess', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withMemberAccess(true)
        .build();

      expect(config.allowMemberAccess).toBe(true);
    });

    it('should allow member access with allowingMemberAccess', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .allowingMemberAccess()
        .build();

      expect(config.allowMemberAccess).toBe(true);
    });

    it('should disallow member access with disallowingMemberAccess', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .disallowingMemberAccess()
        .build();

      expect(config.allowMemberAccess).toBe(false);
    });
  });

  describe('operator convenience methods', () => {
    it('should configure arithmetic operators', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withArithmeticOperators()
        .build();

      expect(config.operators).toEqual({
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        remainder: true,
        power: true
      });
    });

    it('should configure comparison operators', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withComparisonOperators()
        .build();

      expect(config.operators).toEqual({
        comparison: true
      });
    });

    it('should configure logical operators', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withLogicalOperators()
        .build();

      expect(config.operators).toEqual({
        logical: true
      });
    });
  });

  describe('static factory methods', () => {
    it('should create math expression configuration', () => {
      const config = ParserConfigurationBuilder
        .forMathExpressions()
        .build();

      expect(config.allowMemberAccess).toBe(false);
      expect(config.operators).toEqual({
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        remainder: true,
        power: true,
        comparison: true
      });
    });

    it('should create secure evaluation configuration', () => {
      const config = ParserConfigurationBuilder
        .forSecureEvaluation()
        .build();

      expect(config.allowMemberAccess).toBe(false);
      expect(config.operators).toEqual({
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        remainder: true,
        power: true
      });
    });

    it('should create full features configuration', () => {
      const config = ParserConfigurationBuilder
        .forFullFeatures()
        .build();

      expect(config.allowMemberAccess).toBe(true);
      expect(config.operators).toEqual({
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        remainder: true,
        power: true,
        comparison: true,
        logical: true
      });
    });
  });

  describe('validation', () => {
    it('should validate operator values are boolean', () => {
      const builder = new ParserConfigurationBuilder();

      expect(() => {
        builder
          .withOperators({ add: 'invalid' as any })
          .build();
      }).toThrow("Operator 'add' must be a boolean value");
    });

    it('should allow undefined operator values', () => {
      const builder = new ParserConfigurationBuilder();

      expect(() => {
        builder
          .withOperators({ add: undefined })
          .build();
      }).not.toThrow();
    });

    it('should allow boolean operator values', () => {
      const builder = new ParserConfigurationBuilder();

      expect(() => {
        builder
          .withOperators({ add: true, subtract: false })
          .build();
      }).not.toThrow();
    });
  });

  describe('reset functionality', () => {
    it('should reset configuration to empty state', () => {
      const builder = new ParserConfigurationBuilder();

      builder
        .withMemberAccess(true)
        .withArithmeticOperators()
        .reset();

      const config = builder.build();
      expect(config).toEqual({});
    });

    it('should return the builder instance for chaining', () => {
      const builder = new ParserConfigurationBuilder();

      const result = builder.reset();
      expect(result).toBe(builder);
    });

    it('should allow configuration after reset', () => {
      const builder = new ParserConfigurationBuilder();

      const config = builder
        .withMemberAccess(true)
        .reset()
        .withMemberAccess(false)
        .build();

      expect(config.allowMemberAccess).toBe(false);
    });
  });

  describe('complex configuration scenarios', () => {
    it('should handle mixed configuration', () => {
      const builder = new ParserConfigurationBuilder();
      const config = builder
        .withMemberAccess(true)
        .withOperators({ add: true })
        .withArithmeticOperators()
        .withComparisonOperators()
        .build();

      expect(config).toEqual({
        allowMemberAccess: true,
        operators: {
          add: true,
          subtract: true,
          multiply: true,
          divide: true,
          remainder: true,
          power: true,
          comparison: true
        }
      });
    });

    it('should handle overriding static factory configurations', () => {
      const config = ParserConfigurationBuilder
        .forSecureEvaluation()
        .allowingMemberAccess()
        .withLogicalOperators()
        .build();

      expect(config.allowMemberAccess).toBe(true);
      expect(config.operators).toEqual({
        add: true,
        subtract: true,
        multiply: true,
        divide: true,
        remainder: true,
        power: true,
        logical: true
      });
    });
  });
});
