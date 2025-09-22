// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE

import { Token, TEOF, TOP, TNUMBER, TSTRING, TPAREN, TBRACKET, TCOMMA, TNAME, TSEMICOLON, TKEYWORD, TBRACE, TokenType, TokenValue } from './token.js';
import { ParseError } from '../types/errors.js';

// Type for operator functions - they accept arrays of values and return a value
type OperatorFunction = (...args: any[]) => any;

// Basic parser interface - will define more completely when converting parser.js
interface ParserLike {
  keywords: string[];
  unaryOps: Record<string, OperatorFunction>;
  binaryOps: Record<string, OperatorFunction>;
  ternaryOps: Record<string, OperatorFunction>;
  consts: Record<string, any>;
  options: {
    allowMemberAccess?: boolean;
    operators?: Record<string, any>;
    [key: string]: any;
  };
  isOperatorEnabled(op: string): boolean;
}

// Coordinates interface for error reporting
interface Coordinates {
  line: number;
  column: number;
}

export class TokenStream {
  public pos: number = 0;
  public keywords: string[];
  public current: Token | null = null;
  public unaryOps: Record<string, OperatorFunction>;
  public binaryOps: Record<string, OperatorFunction>;
  public ternaryOps: Record<string, OperatorFunction>;
  public consts: Record<string, any>;
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
    this.consts = parser.consts;
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
      if (str in this.consts) {
        this.current = this.newToken(TNUMBER, this.consts[str]);
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

  unescape(v: string): string {
    const index = v.indexOf('\\');
    if (index < 0) {
      return v;
    }

    let buffer = v.substring(0, index);
    let currentIndex = index;
    while (currentIndex >= 0) {
      const c = v.charAt(++currentIndex);
      switch (c) {
        case '\'':
          buffer += '\'';
          break;
        case '"':
          buffer += '"';
          break;
        case '\\':
          buffer += '\\';
          break;
        case '/':
          buffer += '/';
          break;
        case 'b':
          buffer += '\b';
          break;
        case 'f':
          buffer += '\f';
          break;
        case 'n':
          buffer += '\n';
          break;
        case 'r':
          buffer += '\r';
          break;
        case 't':
          buffer += '\t';
          break;
        case 'u':
        // interpret the following 4 characters as the hex of the unicode code point
          const codePoint = v.substring(currentIndex + 1, currentIndex + 5);
          if (!TokenStream.codePointPattern.test(codePoint)) {
            this.parseError('Illegal escape sequence: \\u' + codePoint);
          }
          buffer += String.fromCharCode(parseInt(codePoint, 16));
          currentIndex += 4;
          break;
        default:
          throw this.parseError('Illegal escape sequence: "\\' + c + '"');
      }
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

  isOperator(): boolean {
    const startPos = this.pos;
    const c = this.expression.charAt(this.pos);

    if (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '^' || c === ':' || c === '.') {
      this.current = this.newToken(TOP, c);
    } else if (c === '?') {
      // ? could be a ternary operator a ? b : c or a coalesce operator a ?? b, we need to look ahead
      // to figure out which one it is.
      if (this.expression.charAt(this.pos + 1) === '?') {
        if (this.isOperatorEnabled('??')) {
          this.current = this.newToken(TOP, '??');
          this.pos++;
        } else {
          // We have a ?? operator but it has been disabled.
          return false;
        }
      } else {
        this.current = this.newToken(TOP, c);
      }
    } else if (c === '∙' || c === '•') {
      this.current = this.newToken(TOP, '*');
    } else if (c === '>') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '>=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, '>');
      }
    } else if (c === '<') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '<=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, '<');
      }
    } else if (c === '|') {
      if (this.expression.charAt(this.pos + 1) === '|') {
        this.current = this.newToken(TOP, '||');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, '|');
      }
    } else if (c === '&') {
      if (this.expression.charAt(this.pos + 1) === '&') {
        this.current = this.newToken(TOP, '&&');
        this.pos++;
      } else {
        return false;
      }
    } else if (c === '=') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '==');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, c);
      }
    } else if (c === '!') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '!=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, c);
      }
    } else if (c === 'a' && this.expression.substring(this.pos, this.pos + 3) === 'as ') {
      if (this.isOperatorEnabled('as')) {
        this.current = this.newToken(TOP, 'as');
        this.pos++;
      } else {
        return false;
      }
    } else {
      return false;
    }
    this.pos++;

    if (this.isOperatorEnabled(this.current.value as string)) {
      return true;
    } else {
      this.pos = startPos;
      return false;
    }
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
