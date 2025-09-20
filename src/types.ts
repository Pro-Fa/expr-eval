// Core value types that can be used in expressions
export type Value = number
    | string
    | boolean
    | null
    | undefined
    | ((...args: Value[]) => Value)
    | { [propertyName: string]: Value }
    | Value[];

// Values object for variable evaluation
export interface Values {
    [propertyName: string]: Value;
}

// Parser configuration options
export interface ParserOptions {
    allowMemberAccess?: boolean;
    operators?: {
        add?: boolean;
        comparison?: boolean;
        concatenate?: boolean;
        conditional?: boolean;
        divide?: boolean;
        factorial?: boolean;
        logical?: boolean;
        multiply?: boolean;
        power?: boolean;
        remainder?: boolean;
        subtract?: boolean;
        sin?: boolean;
        cos?: boolean;
        tan?: boolean;
        asin?: boolean;
        acos?: boolean;
        atan?: boolean;
        sinh?: boolean;
        cosh?: boolean;
        tanh?: boolean;
        asinh?: boolean;
        acosh?: boolean;
        atanh?: boolean;
        sqrt?: boolean;
        log?: boolean;
        ln?: boolean;
        lg?: boolean;
        log10?: boolean;
        abs?: boolean;
        ceil?: boolean;
        floor?: boolean;
        round?: boolean;
        trunc?: boolean;
        exp?: boolean;
        length?: boolean;
        in?: boolean;
        random?: boolean;
        min?: boolean;
        max?: boolean;
        assignment?: boolean;
        fndef?: boolean;
        cbrt?: boolean;
        expm1?: boolean;
        log1p?: boolean;
        sign?: boolean;
        log2?: boolean;
        coalesce?: boolean;
        conversion?: boolean;
    };
}

// Unary operators supported by the parser
export type UnaryOperator =
    | '-'
    | '+'
    | '!'
    | 'abs'
    | 'acos'
    | 'acosh'
    | 'asin'
    | 'asinh'
    | 'atan'
    | 'atanh'
    | 'cbrt'
    | 'ceil'
    | 'cos'
    | 'cosh'
    | 'exp'
    | 'expm1'
    | 'floor'
    | 'length'
    | 'lg'
    | 'ln'
    | 'log'
    | 'log1p'
    | 'log2'
    | 'log10'
    | 'not'
    | 'round'
    | 'sign'
    | 'sin'
    | 'sinh'
    | 'sqrt'
    | 'tan'
    | 'tanh'
    | 'trunc';

// Binary operators supported by the parser
export type BinaryOperator =
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '^'
    | '||'
    | '=='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | '='
    | '[xxx]'
    | 'and'
    | 'in'
    | 'or'
    | '??'
    | 'as';

// Symbol/variable extraction options
export interface SymbolOptions {
    readonly withMembers?: boolean;
}

// Variable resolver result types
export interface VariableAlias {
    readonly alias: string;
}

export interface VariableValue {
    readonly value: any;
}

export type VariableResolveResult = VariableAlias | VariableValue | any | undefined;

// Operator function type
export type OperatorFunction = (...args: any[]) => any;

// ============================================================================
// Custom Error Types
// ============================================================================

/**
 * Base class for all expression evaluation errors
 */
export abstract class ExpressionError extends Error {
    abstract readonly code: string;

    constructor(
        message: string,
        public readonly expression?: string,
        public readonly cause?: Error
    ) {
        super(message);
        this.name = this.constructor.name;

        // Maintain proper stack trace for where our error was thrown (only available on V8)
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Thrown when there are syntax errors during expression parsing
 */
export class ParseError extends ExpressionError {
    readonly code = 'PARSE_ERROR';

    constructor(
        message: string,
        public readonly position?: { line: number; column: number },
        public readonly token?: string,
        expression?: string
    ) {
        super(message, expression);
    }

    override toString(): string {
        if (this.position) {
            return `${this.name} [${this.position.line}:${this.position.column}]: ${this.message}`;
        }
        return `${this.name}: ${this.message}`;
    }
}

/**
 * Thrown when there are runtime errors during expression evaluation
 */
export class EvaluationError extends ExpressionError {
    readonly code = 'EVALUATION_ERROR';

    constructor(
        message: string,
        public readonly variableName?: string,
        expression?: string,
        cause?: Error
    ) {
        super(message, expression, cause);
    }
}

/**
 * Thrown when function arguments have invalid types or counts
 */
export class ArgumentError extends ExpressionError {
    readonly code = 'ARGUMENT_ERROR';

    constructor(
        message: string,
        public readonly functionName: string,
        public readonly expectedType?: string,
        public readonly receivedType?: string,
        public readonly argumentIndex?: number,
        expression?: string
    ) {
        super(message, expression);
    }
}

/**
 * Thrown when trying to access object properties in a restricted context
 */
export class AccessError extends ExpressionError {
    readonly code = 'ACCESS_ERROR';

    constructor(
        message: string,
        public readonly propertyName?: string,
        expression?: string
    ) {
        super(message, expression);
    }
}

/**
 * Thrown when an unknown variable is referenced
 */
export class VariableError extends ExpressionError {
    readonly code = 'VARIABLE_ERROR';

    constructor(
        variableName: string,
        expression?: string
    ) {
        super(`undefined variable: ${variableName}`, expression);
        this.variableName = variableName;
    }

    public readonly variableName: string;
}

/**
 * Thrown when a function is not found or not callable
 */
export class FunctionError extends ExpressionError {
    readonly code = 'FUNCTION_ERROR';

    constructor(
        message: string,
        public readonly functionName: string,
        expression?: string
    ) {
        super(message, expression);
    }
}
