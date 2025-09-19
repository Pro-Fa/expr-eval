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
    withMembers?: boolean;
}

// Variable resolver result types
export interface VariableAlias {
    alias: string;
}

export interface VariableValue {
    value: any;
}

export type VariableResolveResult = VariableAlias | VariableValue | any | undefined;

// Operator function type
export type OperatorFunction = (...args: any[]) => any;
