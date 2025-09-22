// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE

// Token type constants
export const TEOF = 'TEOF' as const;
export const TOP = 'TOP' as const;
export const TNUMBER = 'TNUMBER' as const;
export const TSTRING = 'TSTRING' as const;
export const TPAREN = 'TPAREN' as const;
export const TBRACKET = 'TBRACKET' as const;
export const TCOMMA = 'TCOMMA' as const;
export const TNAME = 'TNAME' as const;
export const TSEMICOLON = 'TSEMICOLON' as const;
export const TKEYWORD = 'TKEYWORD' as const;
export const TBRACE = 'TBRACE' as const;

// Union type for all token types
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

// Token value can be various types depending on the token type
export type TokenValue = string | number | boolean | undefined;

// Token class with TypeScript typing
export class Token {
  public readonly type: TokenType;
  public readonly value: TokenValue;
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
