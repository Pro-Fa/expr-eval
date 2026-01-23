// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE

import {
  Token,
  TEOF,
  TOP,
  TCONST,
  TNUMBER,
  TSTRING,
  TPAREN,
  TBRACKET,
  TCOMMA,
  TNAME,
  TSEMICOLON,
  TKEYWORD,
  TBRACE,
  TokenType,
  TokenValue
} from './token.js';
import { ParseError } from '../types/errors.js';
import type { OperatorFunction } from '../types/parser.js';

/**
 * Parser interface defining the required properties for tokenization
 * This interface represents the subset of Parser functionality needed by TokenStream
 */
interface ParserLike {
  keywords: string[];
  unaryOps: Record<string, OperatorFunction>;
  binaryOps: Record<string, OperatorFunction>;
  ternaryOps: Record<string, OperatorFunction>;
  numericConstants: Record<string, any>;
  buildInLiterals: Record<string, any>;
  options: {
    allowMemberAccess?: boolean;
    operators?: Record<string, any>;
    [key: string]: any;
  };
  isOperatorEnabled(op: string): boolean;
}

/**
 * Position coordinates for error reporting
 */
interface Coordinates {
  line: number;
  column: number;
}

/** Single-character operators that map directly to themselves */
const SINGLE_CHAR_OPERATORS = new Set(['+', '-', '*', '/', '%', '^', ':', '.']);

/** Unicode multiplication symbols that map to '*' */
const MULTIPLICATION_SYMBOLS = new Set(['∙', '•']);

/** Escape sequence mappings for string unescape */
const ESCAPE_SEQUENCES: Record<string, string> = {
  '\'': '\'',
  '"': '"',
  '\\': '\\',
  '/': '/',
  'b': '\b',
  'f': '\f',
  'n': '\n',
  'r': '\r',
  't': '\t'
};

export class TokenStream {
  public pos: number = 0;
  public keywords: string[];
  public current: Token | null = null;
  public unaryOps: Record<string, OperatorFunction>;
  public binaryOps: Record<string, OperatorFunction>;
  public ternaryOps: Record<string, OperatorFunction>;
  public numericConstants: Record<string, any>;
  public buildInLiterals: Record<string, any>;
  public expression: string;
  public savedPosition: number = 0;
  public savedCurrent: Token | null = null;
  public options: ParserLike['options'];
  public parser: ParserLike;

  constructor(parser: ParserLike, expression: string) {
    this.keywords = parser.keywords;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.ternaryOps = parser.ternaryOps;
    this.numericConstants = parser.numericConstants;
    this.buildInLiterals = parser.buildInLiterals;
    this.expression = expression;
    this.options = parser.options;
    this.parser = parser;
  }

  newToken(type: TokenType, value: TokenValue, pos?: number): Token {
    return new Token(type, value, pos != null ? pos : this.pos);
  }

  save(): void {
    this.savedPosition = this.pos;
    this.savedCurrent = this.current;
  }

  restore(): void {
    this.pos = this.savedPosition;
    this.current = this.savedCurrent;
  }

  next(): Token {
    if (this.pos >= this.expression.length) {
      return this.newToken(TEOF, 'EOF');
    }

    if (this.isWhitespace() || this.isComment()) {
      return this.next();
    } else if (this.isRadixInteger() ||
        this.isNumber() ||
        this.isOperator() ||
        this.isString() ||
        this.isParen() ||
        this.isBrace() ||
        this.isBracket() ||
        this.isComma() ||
        this.isSemicolon() ||
        this.isNamedOp() ||
        this.isConst() ||
        this.isName()) {
      return this.current!;
    } else {
      this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
    }
  }

  isString(): boolean {
    let r = false;
    const startPos = this.pos;
    const quote = this.expression.charAt(startPos);

    if (quote === '\'' || quote === '"') {
      let index = this.expression.indexOf(quote, startPos + 1);
      while (index >= 0 && this.pos < this.expression.length) {
        this.pos = index + 1;
        if (this.expression.charAt(index - 1) !== '\\') {
          const rawString = this.expression.substring(startPos + 1, index);
          this.current = this.newToken(TSTRING, this.unescape(rawString), startPos);
          r = true;
          break;
        }
        index = this.expression.indexOf(quote, index + 1);
      }
    }
    return r;
  }

  isParen(): boolean {
    const c = this.expression.charAt(this.pos);
    if (c === '(' || c === ')') {
      this.current = this.newToken(TPAREN, c);
      this.pos++;
      return true;
    }
    return false;
  }

  isBrace(): boolean {
    const c = this.expression.charAt(this.pos);
    if (c === '{' || c === '}') {
      this.current = this.newToken(TBRACE, c);
      this.pos++;
      return true;
    }
    return false;
  }

  isBracket(): boolean {
    const c = this.expression.charAt(this.pos);
    if ((c === '[' || c === ']') && this.isOperatorEnabled('[')) {
      this.current = this.newToken(TBRACKET, c);
      this.pos++;
      return true;
    }
    return false;
  }

  isComma(): boolean {
    const c = this.expression.charAt(this.pos);
    if (c === ',') {
      this.current = this.newToken(TCOMMA, ',');
      this.pos++;
      return true;
    }
    return false;
  }

  isSemicolon(): boolean {
    const c = this.expression.charAt(this.pos);
    if (c === ';') {
      this.current = this.newToken(TSEMICOLON, ';');
      this.pos++;
      return true;
    }
    return false;
  }

  isConst(): boolean {
    const startPos = this.pos;
    let i = startPos;
    for (; i < this.expression.length; i++) {
      const c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos || (c !== '_' && c !== '.' && (c < '0' || c > '9'))) {
          break;
        }
      }
    }
    if (i > startPos) {
      const str = this.expression.substring(startPos, i);
      if (str in this.numericConstants) {
        this.current = this.newToken(TNUMBER, this.numericConstants[str]);
        this.pos += str.length;
        return true;
      }
      if (str in this.buildInLiterals) {
        this.current = this.newToken(TCONST, this.buildInLiterals[str]);
        this.pos += str.length;
        return true;
      }
    }
    return false;
  }

  isNamedOp(): boolean {
    const startPos = this.pos;
    let i = startPos;
    for (; i < this.expression.length; i++) {
      const c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
          break;
        }
      }
    }
    if (i > startPos) {
      let str = this.expression.substring(startPos, i);
      if (str === 'not') {
        // The operator could be 'not' or 'not in', we need to look ahead in the input stream.
        if (this.expression.substring(startPos, i + 3) === 'not in') {
          str = 'not in';
        }
      }
      if (this.isOperatorEnabled(str) && (str in this.binaryOps || str in this.unaryOps || str in this.ternaryOps)) {
        this.current = this.newToken(TOP, str);
        this.pos += str.length;
        return true;
      }
    }
    return false;
  }

  isName(): boolean {
    const startPos = this.pos;
    let i = startPos;
    let hasLetter = false;
    let leading$ = false;
    for (; i < this.expression.length; i++) {
      const c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos && (c === '$' || c === '_')) {
          if (c === '_') {
            hasLetter = true;
          } else {
            leading$ = true;
          }
          continue;
        } else if (i === startPos + 1 && leading$ && c === '$') {
          // allow $$name tokens.
          continue;
        } else if (i === this.pos || !hasLetter || (c !== '_' && (c < '0' || c > '9'))) {
          break;
        }
      } else {
        hasLetter = true;
      }
    }
    if (hasLetter) {
      const str = this.expression.substring(startPos, i);
      if (this.keywords.includes(str)) {
        this.current = this.newToken(TKEYWORD, str);
      } else {
        this.current = this.newToken(TNAME, str);
      }
      this.pos += str.length;
      return true;
    }
    return false;
  }

  isWhitespace(): boolean {
    let r = false;
    let c = this.expression.charAt(this.pos);
    while (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      r = true;
      this.pos++;
      if (this.pos >= this.expression.length) {
        break;
      }
      c = this.expression.charAt(this.pos);
    }
    return r;
  }

  private static readonly codePointPattern = /^[0-9a-f]{4}$/i;

  /**
   * Process a single escape sequence character and return the unescaped result
   */
  private processEscapeChar(c: string, v: string, currentIndex: number): { char: string; skip: number } {
    // Check standard escape sequences first
    if (c in ESCAPE_SEQUENCES) {
      return { char: ESCAPE_SEQUENCES[c], skip: 0 };
    }

    // Handle unicode escape sequence
    if (c === 'u') {
      const codePoint = v.substring(currentIndex + 1, currentIndex + 5);
      if (!TokenStream.codePointPattern.test(codePoint)) {
        this.parseError('Illegal escape sequence: \\u' + codePoint);
      }
      return { char: String.fromCharCode(parseInt(codePoint, 16)), skip: 4 };
    }

    // Unknown escape sequence
    throw this.parseError('Illegal escape sequence: "\\' + c + '"');
  }

  /**
   * Unescape a string by processing escape sequences
   */
  unescape(v: string): string {
    const index = v.indexOf('\\');
    if (index < 0) {
      return v;
    }

    let buffer = v.substring(0, index);
    let currentIndex = index;

    while (currentIndex >= 0) {
      const c = v.charAt(++currentIndex);
      const { char, skip } = this.processEscapeChar(c, v, currentIndex);
      buffer += char;
      currentIndex += skip;

      ++currentIndex;
      const backslash = v.indexOf('\\', currentIndex);
      buffer += v.substring(currentIndex, backslash < 0 ? v.length : backslash);
      currentIndex = backslash;
    }

    return buffer;
  }

  isComment(): boolean {
    const c = this.expression.charAt(this.pos);
    if (c === '/' && this.expression.charAt(this.pos + 1) === '*') {
      this.pos = this.expression.indexOf('*/', this.pos) + 2;
      if (this.pos === 1) {
        this.pos = this.expression.length;
      }
      return true;
    }
    return false;
  }

  isRadixInteger(): boolean {
    let pos = this.pos;

    if (pos >= this.expression.length - 2 || this.expression.charAt(pos) !== '0') {
      return false;
    }
    ++pos;

    let radix: number;
    let validDigit: RegExp;
    if (this.expression.charAt(pos) === 'x') {
      radix = 16;
      validDigit = /^[0-9a-f]$/i;
      ++pos;
    } else if (this.expression.charAt(pos) === 'b') {
      radix = 2;
      validDigit = /^[01]$/i;
      ++pos;
    } else {
      return false;
    }

    let valid = false;
    const startPos = pos;

    while (pos < this.expression.length) {
      const c = this.expression.charAt(pos);
      if (validDigit.test(c)) {
        pos++;
        valid = true;
      } else {
        break;
      }
    }

    if (valid) {
      this.current = this.newToken(TNUMBER, parseInt(this.expression.substring(startPos, pos), radix));
      this.pos = pos;
    }
    return valid;
  }

  isNumber(): boolean {
    let valid = false;
    let pos = this.pos;
    const startPos = pos;
    let resetPos = pos;
    let foundDot = false;
    let foundDigits = false;
    let c: string;

    while (pos < this.expression.length) {
      c = this.expression.charAt(pos);
      if ((c >= '0' && c <= '9') || (!foundDot && c === '.')) {
        if (c === '.') {
          foundDot = true;
        } else {
          foundDigits = true;
        }
        pos++;
        valid = foundDigits;
      } else {
        break;
      }
    }

    if (valid) {
      resetPos = pos;
    }

    if (c! === 'e' || c! === 'E') {
      pos++;
      let acceptSign = true;
      let validExponent = false;
      while (pos < this.expression.length) {
        c = this.expression.charAt(pos);
        if (acceptSign && (c === '+' || c === '-')) {
          acceptSign = false;
        } else if (c >= '0' && c <= '9') {
          validExponent = true;
          acceptSign = false;
        } else {
          break;
        }
        pos++;
      }

      if (!validExponent) {
        pos = resetPos;
      }
    }

    if (valid) {
      this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
      this.pos = pos;
    } else {
      this.pos = resetPos;
    }
    return valid;
  }

  /**
   * Try to match a single-character operator (+, -, *, /, %, ^, :, .)
   */
  private tryMatchSingleCharOperator(c: string): boolean {
    if (SINGLE_CHAR_OPERATORS.has(c)) {
      this.current = this.newToken(TOP, c);
      return true;
    }
    return false;
  }

  /**
   * Try to match unicode multiplication symbols (∙, •)
   */
  private tryMatchMultiplicationSymbol(c: string): boolean {
    if (MULTIPLICATION_SYMBOLS.has(c)) {
      this.current = this.newToken(TOP, '*');
      return true;
    }
    return false;
  }

  /**
   * Try to match the question mark operator (? or ??)
   * Returns null if no match, false if disabled, true if matched
   */
  private tryMatchQuestionOperator(c: string): boolean | null {
    if (c !== '?') {
      return null;
    }

    if (this.expression.charAt(this.pos + 1) === '?') {
      if (!this.isOperatorEnabled('??')) {
        return false;
      }
      this.current = this.newToken(TOP, '??');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, c);
    }
    return true;
  }

  /**
   * Try to match a two-character operator where the second char may be '='
   * Examples: >=, <=, ==, !=
   */
  private tryMatchComparisonOperator(c: string, doubleOp: string): boolean {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, doubleOp);
      this.pos++;
    } else {
      this.current = this.newToken(TOP, c);
    }
    return true;
  }

  /**
   * Try to match the arrow operator (=>)
   * Returns true if arrow operator was matched, false otherwise
   */
  private tryMatchArrowOperator(): boolean {
    // Check bounds before accessing the next character
    if (this.pos + 1 >= this.expression.length) {
      return false;
    }
    if (this.expression.charAt(this.pos + 1) === '>') {
      if (!this.isOperatorEnabled('=>')) {
        return false;
      }
      this.current = this.newToken(TOP, '=>');
      this.pos++;
      return true;
    }
    return false;
  }

  /**
   * Try to match pipe operators (| or ||)
   */
  private tryMatchPipeOperator(): boolean {
    if (this.expression.charAt(this.pos + 1) === '|') {
      this.current = this.newToken(TOP, '||');
      this.pos++;
    } else {
      this.current = this.newToken(TOP, '|');
    }
    return true;
  }

  /**
   * Try to match the && operator (single & is not valid)
   */
  private tryMatchAmpersandOperator(): boolean | null {
    if (this.expression.charAt(this.pos + 1) === '&') {
      this.current = this.newToken(TOP, '&&');
      this.pos++;
      return true;
    }
    return false;
  }

  /**
   * Try to match the 'as' keyword operator
   */
  private tryMatchAsOperator(): boolean | null {
    if (this.expression.substring(this.pos, this.pos + 3) !== 'as ') {
      return null;
    }
    if (!this.isOperatorEnabled('as')) {
      return false;
    }
    this.current = this.newToken(TOP, 'as');
    this.pos++;
    return true;
  }

  /**
   * Attempt to identify the current character as an operator
   */
  isOperator(): boolean {
    const startPos = this.pos;
    const c = this.expression.charAt(this.pos);

    // Try single-character operators
    if (this.tryMatchSingleCharOperator(c)) {
      // matched
    }
    // Try unicode multiplication symbols
    else if (this.tryMatchMultiplicationSymbol(c)) {
      // matched
    }
    // Try question mark operators (? and ??)
    else if (c === '?') {
      const result = this.tryMatchQuestionOperator(c);
      if (result === false) return false;
    }
    // Try comparison operators with optional '='
    else if (c === '>') {
      this.tryMatchComparisonOperator(c, '>=');
    }
    else if (c === '<') {
      this.tryMatchComparisonOperator(c, '<=');
    }
    else if (c === '=') {
      // Try arrow operator first (=>), then comparison/assignment (== or =)
      if (!this.tryMatchArrowOperator()) {
        this.tryMatchComparisonOperator(c, '==');
      }
    }
    else if (c === '!') {
      this.tryMatchComparisonOperator(c, '!=');
    }
    // Try pipe operators
    else if (c === '|') {
      this.tryMatchPipeOperator();
    }
    // Try ampersand operator
    else if (c === '&') {
      const result = this.tryMatchAmpersandOperator();
      if (result === false) return false;
    }
    // Try 'as' keyword operator
    else if (c === 'a') {
      const result = this.tryMatchAsOperator();
      if (!result) return false;
    }
    // No operator matched
    else {
      return false;
    }

    this.pos++;

    // All successful branches above set this.current, so it's safe to access
    if (this.current && this.isOperatorEnabled(this.current.value as string)) {
      return true;
    }

    this.pos = startPos;
    return false;
  }

  isOperatorEnabled(op: string): boolean {
    return this.parser.isOperatorEnabled(op);
  }

  getCoordinates(): Coordinates {
    let line = 0;
    let column: number;
    let newline = -1;
    do {
      line++;
      column = this.pos - newline;
      newline = this.expression.indexOf('\n', newline + 1);
    } while (newline >= 0 && newline < this.pos);

    return {
      line: line,
      column: column
    };
  }

  parseError(msg: string): never {
    const coords = this.getCoordinates();
    throw new ParseError(
      msg,
      {
        position: { line: coords.line, column: coords.column },
        expression: this.expression
      }
    );
  }
}
