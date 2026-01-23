/**
 * Diagnostics module for the language service.
 * Provides function argument count validation and syntax error detection.
 * 
 * This module leverages the existing parser infrastructure for error detection,
 * avoiding duplication of tokenization and parsing logic.
 */

import {
  TPAREN,
  TBRACKET,
  TCOMMA,
  TNAME,
  TBRACE,
  Token
} from '../parsing';
import type { Diagnostic, Range } from 'vscode-languageserver-types';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { GetDiagnosticsParams, ArityInfo } from './language-service.types';
import { FunctionDetails } from './language-service.models';
import { ParseError } from '../types/errors';

/**
 * Length of the error highlight range when position is known but token length is not.
 * Used to visually indicate the location of an error in the source text.
 */
const ERROR_HIGHLIGHT_LENGTH = 10;

/**
 * Represents a token with its position in the source text.
 */
export interface TokenSpan {
  token: Token;
  start: number;
  end: number;
}

/**
 * State used while counting function arguments.
 */
interface ArgumentCounterState {
  argCount: number;
  parenDepth: number;
  bracketDepth: number;
  braceDepth: number;
  hasSeenArgumentToken: boolean;
}

/**
 * Creates the initial state for argument counting.
 */
function createArgumentCounterState(): ArgumentCounterState {
  return {
    argCount: 0,
    parenDepth: 1,
    bracketDepth: 0,
    braceDepth: 0,
    hasSeenArgumentToken: false
  };
}

/**
 * Checks if the counter is at the top level of the function call.
 */
function isAtTopLevel(state: ArgumentCounterState): boolean {
  return state.parenDepth === 1 && state.bracketDepth === 0 && state.braceDepth === 0;
}

/**
 * Marks that an argument token has been seen at the current level.
 */
function markArgumentSeen(state: ArgumentCounterState): void {
  if (!state.hasSeenArgumentToken) {
    state.hasSeenArgumentToken = true;
    if (state.argCount === 0) {
      state.argCount = 1;
    }
  }
}

/**
 * Processes a parenthesis token and updates the state accordingly.
 * Returns the closing paren span index if found, or -1 otherwise.
 */
function processParenToken(
  token: Token,
  state: ArgumentCounterState,
  spanIndex: number
): number {
  if (token.value === '(') {
    state.parenDepth++;
    // Opening paren can start an argument (e.g., nested function call)
    if (state.parenDepth === 2 && state.bracketDepth === 0 && state.braceDepth === 0) {
      markArgumentSeen(state);
    }
  } else if (token.value === ')') {
    state.parenDepth--;
    if (state.parenDepth === 0) {
      return spanIndex;
    }
  }
  return -1;
}

/**
 * Processes a bracket token and updates the state accordingly.
 */
function processBracketToken(token: Token, state: ArgumentCounterState): void {
  if (token.value === '[') {
    state.bracketDepth++;
    // Opening bracket starts an argument (array literal)
    if (state.parenDepth === 1 && state.bracketDepth === 1 && state.braceDepth === 0) {
      markArgumentSeen(state);
    }
  } else if (token.value === ']') {
    state.bracketDepth--;
  }
}

/**
 * Processes a brace token and updates the state accordingly.
 */
function processBraceToken(token: Token, state: ArgumentCounterState): void {
  if (token.value === '{') {
    state.braceDepth++;
    // Opening brace starts an argument (object literal)
    if (state.parenDepth === 1 && state.bracketDepth === 0 && state.braceDepth === 1) {
      markArgumentSeen(state);
    }
  } else if (token.value === '}') {
    state.braceDepth--;
  }
}

/**
 * Processes a comma token and updates the state accordingly.
 */
function processCommaToken(state: ArgumentCounterState): void {
  if (isAtTopLevel(state)) {
    state.argCount++;
    state.hasSeenArgumentToken = false;
  }
}

/**
 * Processes any other token and updates the state accordingly.
 */
function processOtherToken(state: ArgumentCounterState): void {
  if (isAtTopLevel(state) && !state.hasSeenArgumentToken) {
    markArgumentSeen(state);
  }
}

/**
 * Result of counting arguments in a function call.
 */
interface ArgumentCountResult {
  argCount: number;
  closeParenSpanIndex: number;
}

/**
 * Counts the number of arguments in a function call starting from the opening parenthesis.
 */
function countFunctionArguments(
  spans: TokenSpan[],
  openParenIndex: number
): ArgumentCountResult {
  const state = createArgumentCounterState();
  let closeParenSpanIndex = openParenIndex;

  for (let j = openParenIndex + 1; j < spans.length && state.parenDepth > 0; j++) {
    const currentToken = spans[j].token;

    if (currentToken.type === TPAREN) {
      const result = processParenToken(currentToken, state, j);
      if (result !== -1) {
        closeParenSpanIndex = result;
      }
    } else if (currentToken.type === TBRACKET) {
      processBracketToken(currentToken, state);
    } else if (currentToken.type === TBRACE) {
      processBraceToken(currentToken, state);
    } else if (currentToken.type === TCOMMA) {
      processCommaToken(state);
    } else {
      processOtherToken(state);
    }
  }

  return {
    argCount: state.argCount,
    closeParenSpanIndex
  };
}

/**
 * Helper for pluralization of argument/arguments.
 */
function pluralize(count: number): string {
  return count !== 1 ? 's' : '';
}

/**
 * Creates a diagnostic for a function with too few arguments.
 */
function createTooFewArgumentsDiagnostic(
  textDocument: TextDocument,
  funcName: string,
  min: number,
  argCount: number,
  startOffset: number,
  endOffset: number
): Diagnostic {
  const range: Range = {
    start: textDocument.positionAt(startOffset),
    end: textDocument.positionAt(endOffset)
  };
  return {
    range,
    severity: DiagnosticSeverity.Error,
    message: `Function '${funcName}' expects at least ${min} argument${pluralize(min)}, but got ${argCount}.`,
    source: 'expr-eval'
  };
}

/**
 * Creates a diagnostic for a function with too many arguments.
 */
function createTooManyArgumentsDiagnostic(
  textDocument: TextDocument,
  funcName: string,
  max: number,
  argCount: number,
  startOffset: number,
  endOffset: number
): Diagnostic {
  const range: Range = {
    start: textDocument.positionAt(startOffset),
    end: textDocument.positionAt(endOffset)
  };
  return {
    range,
    severity: DiagnosticSeverity.Error,
    message: `Function '${funcName}' expects at most ${max} argument${pluralize(max)}, but got ${argCount}.`,
    source: 'expr-eval'
  };
}

/**
 * Validates the argument count for a function call and returns a diagnostic if invalid.
 */
function validateFunctionCall(
  textDocument: TextDocument,
  funcName: string,
  arityInfo: ArityInfo,
  argCount: number,
  startOffset: number,
  endOffset: number
): Diagnostic | null {
  const { min, max } = arityInfo;

  if (argCount < min) {
    return createTooFewArgumentsDiagnostic(
      textDocument, funcName, min, argCount, startOffset, endOffset
    );
  }

  if (max !== undefined && argCount > max) {
    return createTooManyArgumentsDiagnostic(
      textDocument, funcName, max, argCount, startOffset, endOffset
    );
  }

  return null;
}

/**
 * Analyzes the document for function calls and checks if they have the correct number of arguments.
 * Returns diagnostics for function calls with incorrect argument counts.
 */
export function getDiagnosticsForDocument(
  params: GetDiagnosticsParams,
  spans: TokenSpan[],
  functionNames: Set<string>,
  funcDetailsMap: Map<string, FunctionDetails>
): Diagnostic[] {
  const { textDocument } = params;
  const diagnostics: Diagnostic[] = [];

  // Find function calls: TNAME followed by TPAREN '('
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    const token = span.token;

    // Check if this is a function name followed by '('
    if (token.type !== TNAME || !functionNames.has(String(token.value))) {
      continue;
    }

    const funcName = String(token.value);

    // Look for the next token being '('
    if (i + 1 >= spans.length ||
        spans[i + 1].token.type !== TPAREN ||
        spans[i + 1].token.value !== '(') {
      continue;
    }

    const openParenIndex = i + 1;

    // Count arguments
    const { argCount, closeParenSpanIndex } = countFunctionArguments(spans, openParenIndex);
    const closeParenSpan = spans[closeParenSpanIndex];

    // Get the function's expected arity
    const funcDetails = funcDetailsMap.get(funcName);
    if (!funcDetails) {
      continue;
    }

    const arityInfo = funcDetails.arityInfo();
    if (!arityInfo) {
      continue;
    }

    // Validate and create diagnostic if needed
    const diagnostic = validateFunctionCall(
      textDocument,
      funcName,
      arityInfo,
      argCount,
      span.start,
      closeParenSpan.end
    );

    if (diagnostic) {
      diagnostics.push(diagnostic);
    }
  }

  return diagnostics;
}

/**
 * Creates a diagnostic from a ParseError.
 * This function converts errors thrown by the parser/tokenizer into diagnostics
 * that can be displayed to the user.
 */
export function createDiagnosticFromParseError(
  textDocument: TextDocument,
  error: ParseError
): Diagnostic {
  const position = error.context.position;
  let startOffset = 0;
  let endOffset = textDocument.getText().length;

  if (position) {
    // Convert line/column to offset
    startOffset = textDocument.offsetAt({
      line: position.line - 1,  // ParseError uses 1-based line numbers
      character: position.column - 1 // ParseError uses 1-based column numbers
    });
    // Highlight a fixed-length region from the error position
    endOffset = Math.min(startOffset + ERROR_HIGHLIGHT_LENGTH, textDocument.getText().length);
  }

  const range: Range = {
    start: textDocument.positionAt(startOffset),
    end: textDocument.positionAt(endOffset)
  };

  return {
    range,
    severity: DiagnosticSeverity.Error,
    message: error.message,
    source: 'expr-eval'
  };
}
