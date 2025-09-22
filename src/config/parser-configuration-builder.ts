import type { ParserOptions, OperatorConfig } from '../types/parser.js';

/**
 * Builder for creating parser configurations with improved type safety and clarity
 */
export class ParserConfigurationBuilder {
  private config: {
    allowMemberAccess?: boolean;
    operators?: OperatorConfig;
  } = {};

  /**
   * Sets operator configuration for the parser
   */
  withOperators(operators: OperatorConfig): this {
    this.config.operators = { ...this.config.operators, ...operators };
    return this;
  }

  /**
   * Enables or disables member access (obj.property)
   */
  withMemberAccess(enabled: boolean): this {
    this.config.allowMemberAccess = enabled;
    return this;
  }

  /**
   * Enables member access (obj.property)
   */
  allowingMemberAccess(): this {
    return this.withMemberAccess(true);
  }

  /**
   * Disables member access (obj.property)
   */
  disallowingMemberAccess(): this {
    return this.withMemberAccess(false);
  }

  /**
   * Enables all arithmetic operators
   */
  withArithmeticOperators(): this {
    return this.withOperators({
      add: true,
      subtract: true,
      multiply: true,
      divide: true,
      remainder: true,
      power: true
    });
  }

  /**
   * Enables all comparison operators
   */
  withComparisonOperators(): this {
    return this.withOperators({
      comparison: true
    });
  }

  /**
   * Enables all logical operators
   */
  withLogicalOperators(): this {
    return this.withOperators({
      logical: true
    });
  }

  /**
   * Creates a math-focused parser configuration
   */
  static forMathExpressions(): ParserConfigurationBuilder {
    return new ParserConfigurationBuilder()
      .disallowingMemberAccess()
      .withArithmeticOperators()
      .withComparisonOperators();
  }

  /**
   * Creates a secure parser configuration (minimal operators, no member access)
   */
  static forSecureEvaluation(): ParserConfigurationBuilder {
    return new ParserConfigurationBuilder()
      .disallowingMemberAccess()
      .withArithmeticOperators();
  }

  /**
   * Creates a full-featured parser configuration
   */
  static forFullFeatures(): ParserConfigurationBuilder {
    return new ParserConfigurationBuilder()
      .allowingMemberAccess()
      .withArithmeticOperators()
      .withComparisonOperators()
      .withLogicalOperators();
  }

  /**
   * Validates the configuration before building
   */
  private validateConfiguration(): void {
    // Add validation logic here if needed
    if (this.config.operators) {
      for (const [name, enabled] of Object.entries(this.config.operators)) {
        if (typeof enabled !== 'boolean' && enabled !== undefined) {
          throw new Error(`Operator '${name}' must be a boolean value`);
        }
      }
    }
  }

  /**
   * Builds the final parser configuration
   */
  build(): ParserOptions {
    this.validateConfiguration();
    return { ...this.config } as ParserOptions;
  }

  /**
   * Resets the builder to start fresh
   */
  reset(): this {
    this.config = {};
    return this;
  }
}
