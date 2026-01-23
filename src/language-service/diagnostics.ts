/**
 * Diagnostics module for the language service.
 * Provides function argument count validation and syntax error detection.
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
    // End at the end of the line or a few characters ahead
    endOffset = Math.min(startOffset + 10, textDocument.getText().length);
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

/**
 * Result of checking brackets in an expression.
 */
interface BracketCheckResult {
  unclosedOpening: Array<{ char: string; offset: number }>;
  unmatchedClosing: Array<{ char: string; offset: number }>;
}

/**
 * Checks for unclosed or mismatched brackets, parentheses, and braces.
 */
function checkBrackets(text: string): BracketCheckResult {
  const stack: Array<{ char: string; offset: number }> = [];
  const unclosedOpening: Array<{ char: string; offset: number }> = [];
  const unmatchedClosing: Array<{ char: string; offset: number }> = [];
  const matchingBrackets: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const openBrackets = new Set(['(', '[', '{']);
  const closeBrackets = new Set([')', ']', '}']);

  let inString = false;
  let stringChar = '';
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // Handle string literals
    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
      i++;
      continue;
    }
    if (inString) {
      if (char === '\\' && i + 1 < text.length) {
        i += 2; // Skip escaped character
        continue;
      }
      if (char === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    // Handle comments
    if (char === '/' && i + 1 < text.length && text[i + 1] === '*') {
      const endComment = text.indexOf('*/', i + 2);
      if (endComment >= 0) {
        i = endComment + 2;
      } else {
        i = text.length;
      }
      continue;
    }

    if (openBrackets.has(char)) {
      stack.push({ char, offset: i });
    } else if (closeBrackets.has(char)) {
      const expected = matchingBrackets[char];
      if (stack.length > 0 && stack[stack.length - 1].char === expected) {
        stack.pop();
      } else {
        unmatchedClosing.push({ char, offset: i });
      }
    }
    i++;
  }

  // Any remaining items in the stack are unclosed
  unclosedOpening.push(...stack);

  return { unclosedOpening, unmatchedClosing };
}

/**
 * Creates diagnostics for bracket matching issues.
 */
export function getDiagnosticsForBrackets(
  textDocument: TextDocument
): Diagnostic[] {
  const text = textDocument.getText();
  const { unclosedOpening, unmatchedClosing } = checkBrackets(text);
  const diagnostics: Diagnostic[] = [];

  const bracketNames: Record<string, string> = {
    '(': 'parenthesis',
    ')': 'parenthesis',
    '[': 'bracket',
    ']': 'bracket',
    '{': 'brace',
    '}': 'brace'
  };

  for (const { char, offset } of unclosedOpening) {
    const range: Range = {
      start: textDocument.positionAt(offset),
      end: textDocument.positionAt(offset + 1)
    };
    diagnostics.push({
      range,
      severity: DiagnosticSeverity.Error,
      message: `Unclosed ${bracketNames[char]} '${char}'.`,
      source: 'expr-eval'
    });
  }

  for (const { char, offset } of unmatchedClosing) {
    const range: Range = {
      start: textDocument.positionAt(offset),
      end: textDocument.positionAt(offset + 1)
    };
    diagnostics.push({
      range,
      severity: DiagnosticSeverity.Error,
      message: `Unexpected closing ${bracketNames[char]} '${char}'.`,
      source: 'expr-eval'
    });
  }

  return diagnostics;
}

/**
 * Result of checking for unclosed strings.
 */
interface UnclosedStringResult {
  unclosedStrings: Array<{ quote: string; offset: number }>;
}

/**
 * Checks for unclosed string literals.
 */
function checkUnclosedStrings(text: string): UnclosedStringResult {
  const unclosedStrings: Array<{ quote: string; offset: number }> = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // Handle comments (skip them)
    if (char === '/' && i + 1 < text.length && text[i + 1] === '*') {
      const endComment = text.indexOf('*/', i + 2);
      if (endComment >= 0) {
        i = endComment + 2;
      } else {
        i = text.length;
      }
      continue;
    }

    // Check for string start
    if (char === '"' || char === "'") {
      const quote = char;
      const startOffset = i;
      i++; // Move past the opening quote

      let closed = false;
      while (i < text.length) {
        if (text[i] === '\\' && i + 1 < text.length) {
          i += 2; // Skip escaped character
          continue;
        }
        if (text[i] === quote) {
          closed = true;
          i++; // Move past the closing quote
          break;
        }
        i++;
      }

      if (!closed) {
        unclosedStrings.push({ quote, offset: startOffset });
      }
      continue;
    }

    i++;
  }

  return { unclosedStrings };
}

/**
 * Creates diagnostics for unclosed string literals.
 */
export function getDiagnosticsForUnclosedStrings(
  textDocument: TextDocument
): Diagnostic[] {
  const text = textDocument.getText();
  const { unclosedStrings } = checkUnclosedStrings(text);
  const diagnostics: Diagnostic[] = [];

  for (const { quote, offset } of unclosedStrings) {
    const range: Range = {
      start: textDocument.positionAt(offset),
      end: textDocument.positionAt(text.length)
    };
    diagnostics.push({
      range,
      severity: DiagnosticSeverity.Error,
      message: `Unclosed string literal. Missing closing ${quote === '"' ? 'double quote' : 'single quote'}.`,
      source: 'expr-eval'
    });
  }

  return diagnostics;
}

/**
 * Checks for unclosed comments.
 */
function checkUnclosedComments(text: string): Array<{ offset: number }> {
  const unclosedComments: Array<{ offset: number }> = [];
  let i = 0;
  let inString = false;
  let stringChar = '';

  while (i < text.length) {
    const char = text[i];

    // Handle string literals (skip them to avoid false positives)
    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
      i++;
      continue;
    }
    if (inString) {
      if (char === '\\' && i + 1 < text.length) {
        i += 2;
        continue;
      }
      if (char === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    // Check for comment start
    if (char === '/' && i + 1 < text.length && text[i + 1] === '*') {
      const commentStart = i;
      const endComment = text.indexOf('*/', i + 2);
      if (endComment < 0) {
        unclosedComments.push({ offset: commentStart });
        break;
      }
      i = endComment + 2;
      continue;
    }

    i++;
  }

  return unclosedComments;
}

/**
 * Creates diagnostics for unclosed comments.
 */
export function getDiagnosticsForUnclosedComments(
  textDocument: TextDocument
): Diagnostic[] {
  const text = textDocument.getText();
  const unclosedComments = checkUnclosedComments(text);
  const diagnostics: Diagnostic[] = [];

  for (const { offset } of unclosedComments) {
    const range: Range = {
      start: textDocument.positionAt(offset),
      end: textDocument.positionAt(text.length)
    };
    diagnostics.push({
      range,
      severity: DiagnosticSeverity.Error,
      message: `Unclosed comment. Missing closing '*/' for block comment.`,
      source: 'expr-eval'
    });
  }

  return diagnostics;
}
