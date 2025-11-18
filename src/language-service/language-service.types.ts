import type { Values } from '../types/index.js';
import type { Position, Hover, CompletionItem } from 'vscode-languageserver-types';
import type { TextDocument } from 'vscode-languageserver-textdocument';

// Public API types for the language service now align with vscode-languageserver conventions

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
    position: Position; // LSP position within textDocument
    variables?: Values;
}

export interface GetHoverParams {
    textDocument: TextDocument;
    position: Position; // LSP position within textDocument
    variables?: Values;
}

export interface LanguageServiceApi {
    getCompletions(params: GetCompletionsParams): CompletionItem[];

    getHover(params: GetHoverParams): Hover;

    getHighlighting(textDocument: TextDocument): HighlightToken[];
}
