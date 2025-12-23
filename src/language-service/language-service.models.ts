import {Parser} from "../parsing/parser";
import {BUILTIN_FUNCTION_DOCS, FunctionDoc} from "./language-service.documentation";

export class FunctionDetails {
    private readonly builtInFunctionDoc : FunctionDoc | undefined;

    constructor(private readonly parser: Parser, public readonly name: string) {
        this.builtInFunctionDoc = BUILTIN_FUNCTION_DOCS[this.name] || undefined;
    }

    private arity(){
        if(this.builtInFunctionDoc){
            return this.builtInFunctionDoc.params?.length;
        }

        const f: unknown = (this.parser.functions && this.parser.functions[this.name]) || (this.parser.unaryOps && this.parser.unaryOps[this.name]);
        return typeof f === 'function' ? f.length : undefined;
    }

    public docs(){
        if(this.builtInFunctionDoc){
            const description = this.builtInFunctionDoc.description || '';

            const params = this.builtInFunctionDoc.params || [];

            return`**${this.details()}**\n\n${description}\n\n*Parameters:*\n` + params.map((paramDoc) => `* \`${paramDoc.name}\`: ${paramDoc.description}`).join('\n');
        }

        // Provide a generic doc for unary operators if not documented
        if (this.parser.unaryOps && this.parser.unaryOps[this.name]) {
            return `${this.name} x: unary operator`;
        }

        return undefined;
    }

    public details(){
        if(this.builtInFunctionDoc){
            const name = this.builtInFunctionDoc.name || this.name;
            const params = this.builtInFunctionDoc.params || [];
            return `${name}(${params.map((paramDoc) => `${paramDoc.name}`).join(', ')})`;
        }

        const arity = this.arity();
        return arity != null ? `${this.name}(${Array.from({length: arity}).map((_, i) => 'arg' + (i + 1)).join(', ')})` : `${this.name}(…)`;
    }

    public completionText(){
        if(this.builtInFunctionDoc){
            const params = this.builtInFunctionDoc.params || [];
            return `${this.name}(${params.map((paramDoc, i) => `\${${i+1}:${paramDoc.name}}`).join(', ')})`;
        }

        const arity = this.arity();
        return arity != null ? `${this.name}(${Array.from({length: arity}).map((_, i) => `\${${i+1}}`).join(', ')})` : `${this.name}(…)`;
    }
}
