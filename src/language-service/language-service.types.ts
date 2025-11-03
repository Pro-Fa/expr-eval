import type { Values } from '../types/index.js';

// Public API types for the language service
export type CompletionKind = 'function' | 'constant' | 'keyword' | 'variable' | 'operator';

export interface CompletionItem {
  label: string;
  kind: CompletionKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
}

export interface HoverResult {
  contents: string | null;
  range?: { start: number; end: number };
}

export interface HighlightToken {
  type: 'number' | 'string' | 'name' | 'keyword' | 'operator' | 'punctuation';
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
  text: string;
  position?: number; // offset in text; if omitted, end of text
  variables?: Values;
}

export interface GetHoverParams {
  text: string;
  position: number; // offset in text
  variables?: Values;
}

export interface LanguageServiceApi {
  getCompletions(params: GetCompletionsParams): CompletionItem[];
  getHover(params: GetHoverParams): HoverResult;
  getHighlighting(text: string): HighlightToken[];
}
