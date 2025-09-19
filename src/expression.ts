import simplify from './simplify';
import substitute from './substitute';
import evaluate from './evaluate';
import expressionToString from './expression-to-string';
import getSymbols from './get-symbols';
import { Instruction } from './instruction';
import type {
  OperatorFunction,
  Values,
  SymbolOptions,
  VariableResolveResult
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

  constructor(tokens: Instruction[], parser: ParserLike) {
    this.tokens = tokens;
    this.parser = parser;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.ternaryOps = parser.ternaryOps;
    this.functions = parser.functions;
  }

  simplify(values?: Values): Expression {
    values = values || {};
    return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, values), this.parser);
  }

  substitute(variable: string, expr: string | Expression): Expression {
    if (!(expr instanceof Expression)) {
      expr = this.parser.parse(String(expr));
    }

    return new Expression(substitute(this.tokens, variable, expr), this.parser);
  }

  evaluate(values?: Values): any {
    values = values || {};
    return evaluate(this.tokens, this, values);
  }

  toString(): string {
    return expressionToString(this.tokens, false);
  }

  symbols(options?: SymbolOptions): string[] {
    options = options || {};
    const vars: string[] = [];
    getSymbols(this.tokens, vars, options);
    return vars;
  }

  variables(options?: SymbolOptions): string[] {
    options = options || {};
    const vars: string[] = [];
    getSymbols(this.tokens, vars, options);
    const functions = this.functions;
    return vars.filter(function (name) {
      return !(name in functions);
    });
  }

  toJSFunction(param: string, variables?: Values): (...args: any[]) => any {
    const expr = this;
    const f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }');
    return function (...args: any[]): any {
      return f.apply(expr, args);
    };
  }
}
