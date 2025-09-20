import simplify from './simplify';
import substitute from './substitute';
import evaluate from './evaluate';
import expressionToString from './expression-to-string';
import getSymbols from './get-symbols';
import { Instruction } from './instruction';
import type {
  OperatorFunction,
  Values,
  Value,
  SymbolOptions,
  VariableResolveResult,
  ReadonlyValues
} from './types';

// Parser interface (will be more complete when we convert parser.js)
interface ParserLike {
  unaryOps: Record<string, OperatorFunction>;
  binaryOps: Record<string, OperatorFunction>;
  ternaryOps: Record<string, OperatorFunction>;
  functions: Record<string, OperatorFunction>;
  resolve: (token: string) => VariableResolveResult;
  isOperatorEnabled: (op: string) => boolean;
  parse(expression: string): Expression;
}

export class Expression {
  public tokens: Instruction[];
  public parser: ParserLike;
  public unaryOps: Record<string, OperatorFunction>;
  public binaryOps: Record<string, OperatorFunction>;
  public ternaryOps: Record<string, OperatorFunction>;
  public functions: Record<string, OperatorFunction>;

  /**
   * Creates a new Expression instance. Usually created via Parser.parse().
   *
   * @param tokens - The compiled instruction tokens
   * @param parser - The parser instance that created this expression
   * @internal
   */
  constructor(tokens: Instruction[], parser: ParserLike) {
    this.tokens = tokens;
    this.parser = parser;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.ternaryOps = parser.ternaryOps;
    this.functions = parser.functions;
  }

  /**
   * Returns a simplified version of this expression.
   * Attempts to pre-compute parts of the expression that don't depend on variables.
   *
   * @param values - Optional object containing known variable values for simplification
   * @returns A new simplified Expression instance
   * @example
   * ```typescript
   * const expr = parser.parse('2 + 3 + x');
   * const simplified = expr.simplify(); // Results in '5 + x'
   * ```
   */
  simplify(values?: ReadonlyValues): Expression {
    const safeValues = values || {};
    return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, safeValues), this.parser);
  }

  /**
   * Substitutes a variable with another expression.
   *
   * @param variable - The variable name to substitute
   * @param expr - The expression or expression string to substitute with
   * @returns A new Expression instance with the substitution applied
   * @example
   * ```typescript
   * const expr = parser.parse('x + y');
   * const substituted = expr.substitute('x', '2 * z'); // Results in '2 * z + y'
   * ```
   */
  substitute(variable: string, expr: string | Expression): Expression {
    if (!(expr instanceof Expression)) {
      expr = this.parser.parse(String(expr));
    }

    return new Expression(substitute(this.tokens, variable, expr), this.parser);
  }

  /**
   * Evaluates the expression with the given variable values.
   *
   * @param values - Object containing variable values
   * @returns The computed result of the expression
   * @throws {VariableError} When the expression references undefined variables
   * @throws {EvaluationError} When runtime evaluation fails
   * @example
   * ```typescript
   * const expr = parser.parse('2 + 3 * x');
   * const result = expr.evaluate({ x: 4 }); // Returns 14
   * ```
   */
  evaluate(values?: ReadonlyValues): Value | Promise<Value> {
    const safeValues = values || {};
    return evaluate(this.tokens, this, safeValues);
  }

  /**
   * Returns a string representation of the expression.
   *
   * @returns The expression as a human-readable string
   * @example
   * ```typescript
   * const expr = parser.parse('2 + 3 * x');
   * console.log(expr.toString()); // "2 + 3 * x"
   * ```
   */
  toString(): string {
    return expressionToString(this.tokens, false);
  }

  /**
   * Returns an array of all symbols (variables and functions) used in the expression.
   *
   * @param options - Options for symbol extraction
   * @param options.withMembers - Whether to include member access chains
   * @returns Array of symbol names
   * @example
   * ```typescript
   * const expr = parser.parse('x + sin(y) + obj.prop');
   * const symbols = expr.symbols(); // ['x', 'sin', 'y', 'obj', 'prop']
   * const symbolsWithMembers = expr.symbols({ withMembers: true }); // ['x', 'sin', 'y', 'obj.prop']
   * ```
   */
  symbols(options?: SymbolOptions): string[] {
    options = options || {};
    const vars: string[] = [];
    getSymbols(this.tokens, vars, options);
    return vars;
  }

  /**
   * Returns an array of variables used in the expression (excludes function names).
   *
   * @param options - Options for variable extraction
   * @param options.withMembers - Whether to include member access chains
   * @returns Array of variable names
   * @example
   * ```typescript
   * const expr = parser.parse('x + sin(y) + obj.prop');
   * const variables = expr.variables(); // ['x', 'y', 'obj', 'prop'] (sin is excluded as it's a function)
   * ```
   */
  variables(options?: SymbolOptions): string[] {
    options = options || {};
    const vars: string[] = [];
    getSymbols(this.tokens, vars, options);
    const { functions } = this;
    return vars.filter(function (name) {
      return !(name in functions);
    });
  }

  /**
   * Compiles the expression into a JavaScript function.
   * The resulting function can be called with arguments corresponding to variables in the expression.
   *
   * @param param - The parameter name for the generated function
   * @param variables - Optional pre-computed variable values for optimization
   * @returns A JavaScript function that evaluates the expression
   * @example
   * ```typescript
   * const expr = parser.parse('2 + 3 * x');
   * const fn = expr.toJSFunction('x');
   * const result = fn(4); // Returns 14
   *
   * // Multiple parameters
   * const expr2 = parser.parse('x + y * z');
   * const fn2 = expr2.toJSFunction('vars');
   * const result2 = fn2({ x: 1, y: 2, z: 3 }); // Returns 7
   * ```
   */
  toJSFunction(param: string, variables?: ReadonlyValues): (...args: Value[]) => Value {
    const expr = this;
    const f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }');
    return function (...args: Value[]): Value {
      return f.apply(expr, args);
    };
  }
}
