// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE

/**
 * Token types for the expression lexer/tokenizer.
 *
 * The tokenizer converts expression strings into a sequence of tokens
 * that are then processed by the parser to create instructions.
 *
 * Token type naming convention:
 * - T = Token prefix
 * - EOF = End of file/expression
 * - OP = Operator
 * - NUMBER = Numeric literal
 * - etc.
 */

/** End of file/expression token */
export const TEOF = 'TEOF' as const;
/** Operator token (+, -, *, /, etc.) */
export const TOP = 'TOP' as const;
/** Numeric literal token */
export const TNUMBER = 'TNUMBER' as const;
/** String literal token */
export const TSTRING = 'TSTRING' as const;
/** Parenthesis token ( or ) */
export const TPAREN = 'TPAREN' as const;
/** Bracket token [ or ] */
export const TBRACKET = 'TBRACKET' as const;
/** Comma separator token */
export const TCOMMA = 'TCOMMA' as const;
/** Name/identifier token (variable, function name) */
export const TNAME = 'TNAME' as const;
/** Semicolon statement separator token */
export const TSEMICOLON = 'TSEMICOLON' as const;
/** Keyword token (case, when, then, else, end) */
export const TKEYWORD = 'TKEYWORD' as const;
/** Brace token { or } */
export const TBRACE = 'TBRACE' as const;

/**
 * Union type for all token types
 */
export type TokenType =
  | typeof TEOF
  | typeof TOP
  | typeof TNUMBER
  | typeof TSTRING
  | typeof TPAREN
  | typeof TBRACKET
  | typeof TCOMMA
  | typeof TNAME
  | typeof TSEMICOLON
  | typeof TKEYWORD
  | typeof TBRACE;

/**
 * Token value can be various types depending on the token type
 */
export type TokenValue = string | number | boolean | undefined;

/**
 * Token class representing a single lexical unit in an expression
 */
export class Token {
  public readonly type: TokenType;
  public readonly value: TokenValue;
  /** Position index in the source expression string */
  public readonly index: number;

  constructor(type: TokenType, value: TokenValue, index: number) {
    this.type = type;
    this.value = value;
    this.index = index;
  }

  toString(): string {
    return this.type + ': ' + this.value;
  }
}
