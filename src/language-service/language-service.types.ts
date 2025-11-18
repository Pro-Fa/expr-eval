import type { Values } from '../types';
import type { Position, Hover, CompletionItem } from 'vscode-languageserver-types';
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
    getHover(params: GetHoverParams): Hover;

    /**
     * Returns a list of syntax highlighting tokens for the given text document.
     * @param textDocument - The text document to analyze
     */
    getHighlighting(textDocument: TextDocument): HighlightToken[];
}


export interface HighlightToken {
    type: 'number' | 'string' | 'name' | 'keyword' | 'operator' | 'function' | 'punctuation';
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
