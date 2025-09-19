// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE
// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND

import { TOP, TNUMBER, TSTRING, TPAREN, TBRACKET, TCOMMA, TNAME, TSEMICOLON, TEOF, TKEYWORD, TBRACE, Token, TokenType } from './token';
import { Instruction, INUMBER, IVAR, IVARNAME, IFUNCALL, IFUNDEF, IEXPR, IMEMBER, IENDSTATEMENT, IARRAY, IUNDEFINED, ternaryInstruction, binaryInstruction, unaryInstruction, IWHENMATCH, ICASEMATCH, ICASEELSE, ICASECOND, IWHENCOND, IPROPERTY, IOBJECT, IOBJECTEND, InstructionType } from './instruction';
import contains from './contains';
import { TokenStream } from './token-stream';

// Parser interface (will be more complete when we convert parser.js)
interface ParserLike {
  isOperatorEnabled(op: string): boolean;
}

// Options interface
interface ParserStateOptions {
  allowMemberAccess?: boolean;
}

// Token matching function type
type TokenMatcher = (token: Token) => boolean;

// Token value matcher - can be various types
type TokenValueMatcher = string | readonly string[] | string[] | TokenMatcher | undefined;

export class ParserState {
  public parser: ParserLike;
  public tokens: TokenStream;
  public current: Token | null = null;
  public nextToken: Token | null = null;
  public savedCurrent: Token | null = null;
  public savedNextToken: Token | null = null;
  public allowMemberAccess: boolean;

  constructor(parser: ParserLike, tokenStream: TokenStream, options: ParserStateOptions) {
    this.parser = parser;
    this.tokens = tokenStream;
    this.allowMemberAccess = options.allowMemberAccess !== false;
    this.next();
  }

  next(): Token {
    this.current = this.nextToken;
    return (this.nextToken = this.tokens.next());
  }

  tokenMatches(token: Token, value: TokenValueMatcher, exclude?: string[]): boolean {
    if (exclude && contains(exclude, token.value as string)) {
      return false;
    }

    if (typeof value === 'undefined') {
      return true;
    } else if (Array.isArray(value)) {
      return contains([...value], token.value as string);
    } else if (typeof value === 'function') {
      return value(token);
    } else {
      return token.value === value;
    }
  }

  save(): void {
    this.savedCurrent = this.current;
    this.savedNextToken = this.nextToken;
    this.tokens.save();
  }

  restore(): void {
    this.tokens.restore();
    this.current = this.savedCurrent;
    this.nextToken = this.savedNextToken;
  }

  accept(type: TokenType, value?: TokenValueMatcher, exclude?: string[]): boolean {
    if (this.nextToken!.type === type && this.tokenMatches(this.nextToken!, value, exclude)) {
      this.next();
      return true;
    }
    return false;
  }

  expect(type: TokenType, value?: TokenValueMatcher): void {
    if (!this.accept(type, value)) {
      const coords = this.tokens.getCoordinates();
      throw new Error('parse error [' + coords.line + ':' + coords.column + ']: Expected ' + (value || type));
    }
  }

  parseAtom(instr: Instruction[]): void {
    const unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token: Token): boolean {
      return token.value as string in unaryOps;
    }

    if (this.accept(TNAME) || this.accept(TOP, isPrefixOperator)) {
      if (this.current!.value === 'undefined') {
        // undefined is a reserved work that evaluates to JavaScript undefined.
        instr.push(new Instruction(IUNDEFINED));
      } else {
        instr.push(new Instruction(IVAR, this.current!.value));
      }
    } else if (this.accept(TNUMBER)) {
      instr.push(new Instruction(INUMBER, this.current!.value));
    } else if (this.accept(TSTRING)) {
      instr.push(new Instruction(INUMBER, this.current!.value));
    } else if (this.accept(TPAREN, '(')) {
      this.parseExpression(instr);
      this.expect(TPAREN, ')');
    } else if (this.accept(TBRACE, '{')) {
      this.parseObject(instr);
    } else if (this.accept(TBRACKET, '[')) {
      if (this.accept(TBRACKET, ']')) {
        instr.push(new Instruction(IARRAY, 0));
      } else {
        const argCount = this.parseArrayList(instr);
        instr.push(new Instruction(IARRAY, argCount));
      }
    } else if (this.accept(TKEYWORD)) {
      this.parseKeywordExpression(instr);
    } else {
      throw new Error('unexpected ' + this.nextToken);
    }
  }

  parseExpression(instr: Instruction[]): void {
    const exprInstr: Instruction[] = [];
    if (this.parseUntilEndStatement(instr, exprInstr)) {
      return;
    }
    this.parseVariableAssignmentExpression(exprInstr);
    if (this.parseUntilEndStatement(instr, exprInstr)) {
      return;
    }
    this.pushExpression(instr, exprInstr);
  }

  pushExpression(instr: Instruction[], exprInstr: Instruction[]): void {
    for (let i = 0, len = exprInstr.length; i < len; i++) {
      instr.push(exprInstr[i]);
    }
  }

  parseUntilEndStatement(instr: Instruction[], exprInstr: Instruction[]): boolean {
    if (!this.accept(TSEMICOLON)) return false;
    if (this.nextToken && this.nextToken.type !== TEOF && !(this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
      exprInstr.push(new Instruction(IENDSTATEMENT));
    }
    if (this.nextToken!.type !== TEOF) {
      this.parseExpression(exprInstr);
    }
    instr.push(new Instruction(IEXPR, exprInstr));
    return true;
  }

  parseArrayList(instr: Instruction[]): number {
    let argCount = 0;

    while (!this.accept(TBRACKET, ']')) {
      this.parseExpression(instr);
      ++argCount;
      while (this.accept(TCOMMA)) {
        this.parseExpression(instr);
        ++argCount;
      }
    }

    return argCount;
  }

  parseVariableAssignmentExpression(instr: Instruction[]): void {
    this.parseConditionalExpression(instr);
    while (this.accept(TOP, '=')) {
      const varName = instr.pop()!;
      const varValue: Instruction[] = [];
      const lastInstrIndex = instr.length - 1;
      if (varName.type === IFUNCALL) {
        if (!this.tokens.isOperatorEnabled('()=')) {
          throw new Error('function definition is not permitted');
        }
        for (let i = 0, len = (varName.value as number) + 1; i < len; i++) {
          const index = lastInstrIndex - i;
          if (instr[index].type === IVAR) {
            instr[index] = new Instruction(IVARNAME, instr[index].value);
          }
        }
        this.parseVariableAssignmentExpression(varValue);
        instr.push(new Instruction(IEXPR, varValue));
        instr.push(new Instruction(IFUNDEF, varName.value));
        continue;
      }
      if (varName.type !== IVAR && varName.type !== IMEMBER) {
        throw new Error('expected variable for assignment');
      }
      this.parseVariableAssignmentExpression(varValue);
      instr.push(new Instruction(IVARNAME, varName.value));
      instr.push(new Instruction(IEXPR, varValue));
      instr.push(binaryInstruction('='));
    }
  }

  parseConditionalExpression(instr: Instruction[]): void {
    this.parseOrExpression(instr);
    while (this.accept(TOP, '?')) {
      const trueBranch: Instruction[] = [];
      const falseBranch: Instruction[] = [];
      this.parseConditionalExpression(trueBranch);
      this.expect(TOP, ':');
      this.parseConditionalExpression(falseBranch);
      instr.push(new Instruction(IEXPR, trueBranch));
      instr.push(new Instruction(IEXPR, falseBranch));
      instr.push(ternaryInstruction('?'));
    }
  }

  parseOrExpression(instr: Instruction[]): void {
    this.parseAndExpression(instr);
    while (this.accept(TOP, ['or', '||'])) {
      const falseBranch: Instruction[] = [];
      this.parseAndExpression(falseBranch);
      instr.push(new Instruction(IEXPR, falseBranch));
      instr.push(binaryInstruction('or'));
    }
  }

  parseAndExpression(instr: Instruction[]): void {
    this.parseComparison(instr);
    while (this.accept(TOP, ['and', '&&'])) {
      const trueBranch: Instruction[] = [];
      this.parseComparison(trueBranch);
      instr.push(new Instruction(IEXPR, trueBranch));
      instr.push(binaryInstruction('and'));
    }
  }

  private static readonly COMPARISON_OPERATORS = ['==', '!=', '<', '<=', '>=', '>', 'in', 'not in'] as const;

  parseComparison(instr: Instruction[]): void {
    this.parseAddSub(instr);
    while (this.accept(TOP, ParserState.COMPARISON_OPERATORS)) {
      const op = this.current!;
      this.parseAddSub(instr);
      instr.push(binaryInstruction(op.value as string));
    }
  }

  private static readonly ADD_SUB_OPERATORS = ['+', '-', '|'] as const;

  parseAddSub(instr: Instruction[]): void {
    this.parseTerm(instr);
    while (this.accept(TOP, ParserState.ADD_SUB_OPERATORS, ['||'])) {
      const op = this.current!;
      this.parseTerm(instr);
      instr.push(binaryInstruction(op.value as string));
    }
  }

  private static readonly TERM_OPERATORS = ['*', '/', '%'] as const;

  parseTerm(instr: Instruction[]): void {
    // this.parseFactor(instr);
    this.parseCoalesceExpression(instr);
    while (this.accept(TOP, ParserState.TERM_OPERATORS)) {
      const op = this.current!;
      this.parseFactor(instr);
      instr.push(binaryInstruction(op.value as string));
    }
  }

  private static readonly COALESCE_OPERATORS = ['??', 'as'] as const;

  parseCoalesceExpression(instr: Instruction[]): void {
    this.parseFactor(instr);
    while (this.accept(TOP, ParserState.COALESCE_OPERATORS)) {
      const op = this.current!;
      this.parseFactor(instr);
      instr.push(binaryInstruction(op.value as string));
    }
  }

  parseFactor(instr: Instruction[]): void {
    const unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token: Token): boolean {
      return token.value as string in unaryOps;
    }

    this.save();
    if (this.accept(TOP, isPrefixOperator)) {
      if (this.current!.value !== '-' && this.current!.value !== '+') {
        if (this.nextToken!.type === TPAREN && this.nextToken!.value === '(') {
          this.restore();
          this.parseExponential(instr);
          return;
        } else if (this.nextToken!.type === TSEMICOLON || this.nextToken!.type === TCOMMA || this.nextToken!.type === TEOF || (this.nextToken!.type === TPAREN && this.nextToken!.value === ')')) {
          this.restore();
          this.parseAtom(instr);
          return;
        }
      }

      const op = this.current!;
      this.parseFactor(instr);
      instr.push(unaryInstruction(op.value as string));
    } else {
      this.parseExponential(instr);
    }
  }

  parseExponential(instr: Instruction[]): void {
    this.parsePostfixExpression(instr);
    while (this.accept(TOP, '^')) {
      this.parseFactor(instr);
      instr.push(binaryInstruction('^'));
    }
  }

  parsePostfixExpression(instr: Instruction[]): void {
    this.parseFunctionCall(instr);
    while (this.accept(TOP, '!')) {
      instr.push(unaryInstruction('!'));
    }
  }

  parseFunctionCall(instr: Instruction[]): void {
    const unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token: Token): boolean {
      return token.value as string in unaryOps;
    }

    if (this.accept(TOP, isPrefixOperator)) {
      const op = this.current!;
      this.parseAtom(instr);
      instr.push(unaryInstruction(op.value as string));
    } else {
      this.parseMemberExpression(instr);
      while (this.accept(TPAREN, '(')) {
        if (this.accept(TPAREN, ')')) {
          instr.push(new Instruction(IFUNCALL, 0));
        } else {
          const argCount = this.parseArgumentList(instr);
          instr.push(new Instruction(IFUNCALL, argCount));
        }
      }
    }
  }

  parseArgumentList(instr: Instruction[]): number {
    let argCount = 0;

    while (!this.accept(TPAREN, ')')) {
      this.parseExpression(instr);
      ++argCount;
      while (this.accept(TCOMMA)) {
        this.parseExpression(instr);
        ++argCount;
      }
    }

    return argCount;
  }

  parseMemberExpression(instr: Instruction[]): void {
    this.parseAtom(instr);
    while (this.accept(TOP, '.') || this.accept(TBRACKET, '[')) {
      const op = this.current!;

      if (op.value === '.') {
        if (!this.allowMemberAccess) {
          throw new Error('unexpected ".", member access is not permitted');
        }

        this.expect(TNAME);
        instr.push(new Instruction(IMEMBER, this.current!.value));
      } else if (op.value === '[') {
        if (!this.tokens.isOperatorEnabled('[')) {
          throw new Error('unexpected "[]", arrays are disabled');
        }

        this.parseExpression(instr);
        this.expect(TBRACKET, ']');
        instr.push(binaryInstruction('['));
      } else {
        throw new Error('unexpected symbol: ' + op.value);
      }
    }
  }

  parseKeywordExpression(instr: Instruction[]): void {
    if (this.current!.value === 'case') {
      this.parseCaseWhen(instr);
    } else {
      throw new Error(`unexpected keyword: ${this.current!.value}`);
    }
  }

  parseCaseWhen(instr: Instruction[]): void {
    /*
      cases look like:

      case $input
        when $match1 then $value1
        when $match2 then $value2
        else $value3
      end

      OR

      case
        when $expr1 then $value1
        when $expr2 then $value2
        else $value3
      end

      The first case is comparing the match values to the input, the second case is essentially an if/else/if chain.

      The parse tree uses postfix notation so the trees for the above should look like

      $input $match1 $value1 WHEN $match2 $value2 WHEN $value3 ELSE
      $expr1 $value1 WHEN $expr2 $value2 WHEN $value3 ELSE
    */
    // Before doing anything we need to look a head at the next token to see whether it is
    // a WHEN or something else; if it is a WHEN then we have a case with no input (ICASECOND)
    // vs. a case with input (ICASEMATCH).
    const caseWithInput = this.nextToken!.type !== TKEYWORD;
    const caseInstruction: InstructionType = caseWithInput ? ICASEMATCH : ICASECOND;
    const whenInstruction: InstructionType = caseWithInput ? IWHENMATCH : IWHENCOND;

    // Parse the expression for the value being checked by the case.
    if (caseWithInput) {
      this.parseConditionalExpression(instr);
    }

    // Parse all the when xxx then yyy conditions.
    let count = 0;
    while (this.accept(TKEYWORD, 'when')) {
      this.parseConditionalExpression(instr);
      if (this.accept(TKEYWORD, 'then')) {
        this.parseConditionalExpression(instr);
        instr.push(new Instruction(whenInstruction, count++));
      } else {
        throw new Error('case block missing when');
      }
    }

    // Parse the optional else which gets added to the parse tree as when true then yyy
    if (this.accept(TKEYWORD, 'else')) {
      this.parseConditionalExpression(instr);
      instr.push(new Instruction(ICASEELSE, count++));
    }

    // Parse the end of the case.
    if (this.accept(TKEYWORD, 'end')) {
      instr.push(new Instruction(caseInstruction, count));
    } else {
      throw new Error('invalid case block');
    }
  }

  parseObject(instr: Instruction[]): number {
    const error = 'invalid object definition';
    let count = 0;
    instr.push(new Instruction(IOBJECT, 0));
    for (let first = true; !this.accept(TBRACE, '}'); first = false) {
      // There should be a command before the 2nd-nth property.
      if (!first && !this.accept(TCOMMA, ',')) {
        throw new Error(error);
      }
      // We want to allow an extraneous trailing comma after the last property
      // so if there is a closing brace after the comma we allow it and the
      // object is complete.
      if (this.accept(TBRACE, '}')) {
        return count;
      }
      // Expect a name token for the property name.
      if (!this.accept(TNAME)) {
        throw new Error(error);
      }
      const name = this.current!.value;
      // Expect a colon.
      if (!this.accept(TOP, ':')) {
        throw new Error(error);
      }
      // Expect an expression for the property value.
      this.parseExpression(instr);
      instr.push(new Instruction(IPROPERTY, name));
      ++count;
    }
    instr.push(new Instruction(IOBJECTEND, count));
    return count;
  }
}

