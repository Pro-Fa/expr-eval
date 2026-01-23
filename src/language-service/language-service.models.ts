import { Parser } from '../parsing/parser';
import { BUILTIN_FUNCTION_DOCS, FunctionDoc } from './language-service.documentation';
import type { ArityInfo } from './language-service.types';

export class FunctionDetails {
  private readonly builtInFunctionDoc : FunctionDoc | undefined;

  constructor(private readonly parser: Parser, public readonly name: string) {
    this.builtInFunctionDoc = BUILTIN_FUNCTION_DOCS[this.name] || undefined;
  }

  private arity() {
    if (this.builtInFunctionDoc) {
      return this.builtInFunctionDoc.params?.length;
    }

    const f: unknown = (this.parser.functions && this.parser.functions[this.name]) || (this.parser.unaryOps && this.parser.unaryOps[this.name]);
    return typeof f === 'function' ? f.length : undefined;
  }

  /**
   * Returns the arity information for this function:
   * - min: minimum number of required arguments
   * - max: maximum number of arguments, or undefined if variadic
   */
  public arityInfo(): ArityInfo | undefined {
    if (this.builtInFunctionDoc) {
      const params = this.builtInFunctionDoc.params || [];
      if (params.length === 0) {
        return { min: 0, max: 0 };
      }

      // Check if any parameter is variadic
      const hasVariadic = params.some(p => p.isVariadic);
      // Count required (non-optional, non-variadic) parameters
      const requiredParams = params.filter(p => !p.optional && !p.isVariadic);
      const optionalParams = params.filter(p => p.optional && !p.isVariadic);

      const min = requiredParams.length;
      // If variadic, max is undefined (unlimited); otherwise, it's all non-variadic params
      const max = hasVariadic ? undefined : (requiredParams.length + optionalParams.length);

      return { min, max };
    }

    // For functions without documentation, use the JavaScript function's .length property
    const f: unknown = (this.parser.functions && this.parser.functions[this.name]) || (this.parser.unaryOps && this.parser.unaryOps[this.name]);
    if (typeof f === 'function') {
      // JavaScript's .length gives number of expected arguments (doesn't account for variadic)
      return { min: f.length, max: f.length };
    }

    return undefined;
  }

  public docs() {
    if (this.builtInFunctionDoc) {
      const description = this.builtInFunctionDoc.description || '';

      const params = this.builtInFunctionDoc.params || [];

      return `**${this.details()}**\n\n${description}\n\n*Parameters:*\n` + params.map((paramDoc) => `* \`${paramDoc.name}\`: ${paramDoc.description}`).join('\n');
    }

    // Provide a generic doc for unary operators if not documented
    if (this.parser.unaryOps && this.parser.unaryOps[this.name]) {
      return `${this.name} x: unary operator`;
    }

    return undefined;
  }

  public details() {
    if (this.builtInFunctionDoc) {
      const name = this.builtInFunctionDoc.name || this.name;
      const params = this.builtInFunctionDoc.params || [];
      return `${name}(${params.map((paramDoc) => `${paramDoc.name}`).join(', ')})`;
    }

    const arity = this.arity();
    return arity != null ? `${this.name}(${Array.from({ length: arity }).map((_, i) => 'arg' + (i + 1)).join(', ')})` : `${this.name}(…)`;
  }

  public completionText() {
    if (this.builtInFunctionDoc) {
      const params = this.builtInFunctionDoc.params || [];
      return `${this.name}(${params.map((paramDoc, i) => `\${${i + 1}:${paramDoc.name}}`).join(', ')})`;
    }

    const arity = this.arity();
    return arity != null ? `${this.name}(${Array.from({ length: arity }).map((_, i) => `\${${i + 1}}`).join(', ')})` : `${this.name}(…)`;
  }
}
