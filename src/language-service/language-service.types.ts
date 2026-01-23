import type { Values } from '../types';
import type { Position, Hover, CompletionItem, MarkupContent, Diagnostic } from 'vscode-languageserver-types';
import type { TextDocument } from 'vscode-languageserver-textdocument';

/**
 * Public API for the language service
 */
export interface LanguageServiceApi {
    /**
     * Returns a list of possible completions for the given position in the document.
     * @param params - Parameters for the completion request
     */
    getCompletions(params: GetCompletionsParams): CompletionItem[];

    /**
     * Returns a hover message for the given position in the document.
     * @param params - Parameters for the hover request
     */
    getHover(params: GetHoverParams): HoverV2;

    /**
     * Returns a list of syntax highlighting tokens for the given text document.
     * @param textDocument - The text document to analyze
     */
    getHighlighting(textDocument: TextDocument): HighlightToken[];

    /**
     * Returns a list of diagnostics for the given text document.
     * This includes errors like incorrect number of function arguments.
     * @param params - Parameters for the diagnostics request
     */
    getDiagnostics(params: GetDiagnosticsParams): Diagnostic[];
}

export interface HighlightToken {
    type: 'number' | 'string' | 'name' | 'keyword' | 'operator' | 'function' | 'punctuation' | 'constant';
    start: number;
    end: number;
    value?: string | number | boolean | undefined;
}

export interface LanguageServiceOptions {
    // A map of operator names to booleans indicating whether they are
    // allowed in the expression.
    operators?: Record<string, boolean>;
}

export interface GetCompletionsParams {
    textDocument: TextDocument;
    position: Position;
    variables?: Values;
}

export interface GetHoverParams {
    textDocument: TextDocument;
    position: Position;
    variables?: Values;
}

export interface HoverV2 extends Hover {
    contents: MarkupContent; // Type narrowing since we know we are not going to return deprecated content
}

export interface GetDiagnosticsParams {
    textDocument: TextDocument;
}

/**
 * Describes the arity (expected number of arguments) for a function.
 */
export interface ArityInfo {
    /** Minimum number of required arguments */
    min: number;
    /** Maximum number of arguments, or undefined if variadic (unlimited) */
    max: number | undefined;
}
