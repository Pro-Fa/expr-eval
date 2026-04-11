/**
 * Core value types for expression evaluation
 * These define the fundamental data types that can be used in expressions
 */

// Core primitive types
export type Primitive = number | string | boolean | null | undefined;

// Function types for expression evaluation
export type SyncFunction = (...args: Value[]) => Value;
export type AsyncFunction = (...args: Value[]) => Promise<Value>;
export type ExpressionFunction = SyncFunction | AsyncFunction | ((...args: any[]) => Value | Promise<Value>);

// Object and array types (recursive)
export interface ValueObject {
    [propertyName: string]: Value;
}

export type ValueArray = Value[];

// Core value types that can be used in expressions
export type Value =
    | Primitive
    | ExpressionFunction
    | ValueObject
    | ValueArray;

// Values object for variable evaluation
export interface Values {
    [propertyName: string]: Value;
}

/**
 * Utility type for readonly Values
 */
export type ReadonlyValues = Readonly<Values>;

/**
 * Variable resolver result types
 */
export interface VariableAlias {
    readonly alias: string;
}

export interface VariableValue {
    readonly value: Value;
}

export type VariableResolveResult = VariableAlias | VariableValue | Value | undefined;

/**
 * Custom variable resolver callback signature.
 * Given a variable name (as it appears in the expression), returns a resolution result
 * or `undefined` to indicate that this resolver does not handle the variable.
 */
export type VariableResolver = (token: string) => VariableResolveResult;
