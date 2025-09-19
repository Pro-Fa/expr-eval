// cSpell:words TEOF TNUMBER TSTRING TPAREN TBRACKET TCOMMA TNAME TSEMICOLON TUNDEFINED TKEYWORD TBRACE
// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND

import { TOP, TNUMBER, TSTRING, TPAREN, TBRACKET, TCOMMA, TNAME, TSEMICOLON, TEOF, TKEYWORD, TBRACE } from './token';
import { Instruction, INUMBER, IVAR, IVARNAME, IFUNCALL, IFUNDEF, IEXPR, IMEMBER, IENDSTATEMENT, IARRAY, IUNDEFINED, ternaryInstruction, binaryInstruction, unaryInstruction, IWHENMATCH, ICASEMATCH, ICASEELSE, ICASECOND, IWHENCOND, IPROPERTY, IOBJECT, IOBJECTEND } from './instruction';
import contains from './contains';

export function ParserState(parser, tokenStream, options) {
  this.parser = parser;
  this.tokens = tokenStream;
  this.current = null;
  this.nextToken = null;
  this.next();
  this.savedCurrent = null;
  this.savedNextToken = null;
  this.allowMemberAccess = options.allowMemberAccess !== false;
}

ParserState.prototype.next = function () {
  this.current = this.nextToken;
  return (this.nextToken = this.tokens.next());
};

ParserState.prototype.tokenMatches = function (token, value, exclude) {
  if (exclude && contains(exclude, token.value)) {
    return false;
  }

  if (typeof value === 'undefined') {
    return true;
  } else if (Array.isArray(value)) {
    return contains(value, token.value);
  } else if (typeof value === 'function') {
    return value(token);
  } else {
    return token.value === value;
  }
};

ParserState.prototype.save = function () {
  this.savedCurrent = this.current;
  this.savedNextToken = this.nextToken;
  this.tokens.save();
};

ParserState.prototype.restore = function () {
  this.tokens.restore();
  this.current = this.savedCurrent;
  this.nextToken = this.savedNextToken;
};

ParserState.prototype.accept = function (type, value, exclude) {
  if (this.nextToken.type === type && this.tokenMatches(this.nextToken, value, exclude)) {
    this.next();
    return true;
  }
  return false;
};

ParserState.prototype.expect = function (type, value) {
  if (!this.accept(type, value)) {
    var coords = this.tokens.getCoordinates();
    throw new Error('parse error [' + coords.line + ':' + coords.column + ']: Expected ' + (value || type));
  }
};

ParserState.prototype.parseAtom = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  if (this.accept(TNAME) || this.accept(TOP, isPrefixOperator)) {
    if (this.current.value === 'undefined') {
      // undefined is a reserved work that evaluates to JavaScript undefined.
      instr.push(new Instruction(IUNDEFINED));
    } else {
      instr.push(new Instruction(IVAR, this.current.value));
    }
  } else if (this.accept(TNUMBER)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TSTRING)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TPAREN, '(')) {
    this.parseExpression(instr);
    this.expect(TPAREN, ')');
  } else if (this.accept(TBRACE, '{')) {
    this.parseObject(instr);
  } else if (this.accept(TBRACKET, '[')) {
    if (this.accept(TBRACKET, ']')) {
      instr.push(new Instruction(IARRAY, 0));
    } else {
      var argCount = this.parseArrayList(instr);
      instr.push(new Instruction(IARRAY, argCount));
    }
  } else if (this.accept(TKEYWORD)) {
    this.parseKeywordExpression(instr);
  } else {
    throw new Error('unexpected ' + this.nextToken);
  }
};

ParserState.prototype.parseExpression = function (instr) {
  var exprInstr = [];
  if (this.parseUntilEndStatement(instr, exprInstr)) {
    return;
  }
  this.parseVariableAssignmentExpression(exprInstr);
  if (this.parseUntilEndStatement(instr, exprInstr)) {
    return;
  }
  this.pushExpression(instr, exprInstr);
};

ParserState.prototype.pushExpression = function (instr, exprInstr) {
  for (var i = 0, len = exprInstr.length; i < len; i++) {
    instr.push(exprInstr[i]);
  }
};

ParserState.prototype.parseUntilEndStatement = function (instr, exprInstr) {
  if (!this.accept(TSEMICOLON)) return false;
  if (this.nextToken && this.nextToken.type !== TEOF && !(this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
    exprInstr.push(new Instruction(IENDSTATEMENT));
  }
  if (this.nextToken.type !== TEOF) {
    this.parseExpression(exprInstr);
  }
  instr.push(new Instruction(IEXPR, exprInstr));
  return true;
};

ParserState.prototype.parseArrayList = function (instr) {
  var argCount = 0;

  while (!this.accept(TBRACKET, ']')) {
    this.parseExpression(instr);
    ++argCount;
    while (this.accept(TCOMMA)) {
      this.parseExpression(instr);
      ++argCount;
    }
  }

  return argCount;
};

ParserState.prototype.parseVariableAssignmentExpression = function (instr) {
  this.parseConditionalExpression(instr);
  while (this.accept(TOP, '=')) {
    var varName = instr.pop();
    var varValue = [];
    var lastInstrIndex = instr.length - 1;
    if (varName.type === IFUNCALL) {
      if (!this.tokens.isOperatorEnabled('()=')) {
        throw new Error('function definition is not permitted');
      }
      for (var i = 0, len = varName.value + 1; i < len; i++) {
        var index = lastInstrIndex - i;
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
};

ParserState.prototype.parseConditionalExpression = function (instr) {
  this.parseOrExpression(instr);
  while (this.accept(TOP, '?')) {
    var trueBranch = [];
    var falseBranch = [];
    this.parseConditionalExpression(trueBranch);
    this.expect(TOP, ':');
    this.parseConditionalExpression(falseBranch);
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(ternaryInstruction('?'));
  }
};

ParserState.prototype.parseOrExpression = function (instr) {
  this.parseAndExpression(instr);
  while (this.accept(TOP, ['or', '||'])) {
    var falseBranch = [];
    this.parseAndExpression(falseBranch);
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(binaryInstruction('or'));
  }
};

ParserState.prototype.parseAndExpression = function (instr) {
  this.parseComparison(instr);
  while (this.accept(TOP, ['and', '&&'])) {
    var trueBranch = [];
    this.parseComparison(trueBranch);
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(binaryInstruction('and'));
  }
};

var COMPARISON_OPERATORS = ['==', '!=', '<', '<=', '>=', '>', 'in', 'not in'];

ParserState.prototype.parseComparison = function (instr) {
  this.parseAddSub(instr);
  while (this.accept(TOP, COMPARISON_OPERATORS)) {
    var op = this.current;
    this.parseAddSub(instr);
    instr.push(binaryInstruction(op.value));
  }
};

var ADD_SUB_OPERATORS = ['+', '-', '|'];

ParserState.prototype.parseAddSub = function (instr) {
  this.parseTerm(instr);
  while (this.accept(TOP, ADD_SUB_OPERATORS, ['||'])) {
    var op = this.current;
    this.parseTerm(instr);
    instr.push(binaryInstruction(op.value));
  }
};

var TERM_OPERATORS = ['*', '/', '%'];

ParserState.prototype.parseTerm = function (instr) {
  // this.parseFactor(instr);
  this.parseCoalesceExpression(instr);
  while (this.accept(TOP, TERM_OPERATORS)) {
    var op = this.current;
    this.parseFactor(instr);
    instr.push(binaryInstruction(op.value));
  }
};

var COALESCE_OPERATORS = ['??', 'as'];

ParserState.prototype.parseCoalesceExpression = function (instr) {
  this.parseFactor(instr);
  while (this.accept(TOP, COALESCE_OPERATORS)) {
    var op = this.current;
    this.parseFactor(instr);
    instr.push(binaryInstruction(op.value));
  }
};

ParserState.prototype.parseFactor = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  this.save();
  if (this.accept(TOP, isPrefixOperator)) {
    if (this.current.value !== '-' && this.current.value !== '+') {
      if (this.nextToken.type === TPAREN && this.nextToken.value === '(') {
        this.restore();
        this.parseExponential(instr);
        return;
      } else if (this.nextToken.type === TSEMICOLON || this.nextToken.type === TCOMMA || this.nextToken.type === TEOF || (this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
        this.restore();
        this.parseAtom(instr);
        return;
      }
    }

    var op = this.current;
    this.parseFactor(instr);
    instr.push(unaryInstruction(op.value));
  } else {
    this.parseExponential(instr);
  }
};

ParserState.prototype.parseExponential = function (instr) {
  this.parsePostfixExpression(instr);
  while (this.accept(TOP, '^')) {
    this.parseFactor(instr);
    instr.push(binaryInstruction('^'));
  }
};

ParserState.prototype.parsePostfixExpression = function (instr) {
  this.parseFunctionCall(instr);
  while (this.accept(TOP, '!')) {
    instr.push(unaryInstruction('!'));
  }
};

ParserState.prototype.parseFunctionCall = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  if (this.accept(TOP, isPrefixOperator)) {
    var op = this.current;
    this.parseAtom(instr);
    instr.push(unaryInstruction(op.value));
  } else {
    this.parseMemberExpression(instr);
    while (this.accept(TPAREN, '(')) {
      if (this.accept(TPAREN, ')')) {
        instr.push(new Instruction(IFUNCALL, 0));
      } else {
        var argCount = this.parseArgumentList(instr);
        instr.push(new Instruction(IFUNCALL, argCount));
      }
    }
  }
};

ParserState.prototype.parseArgumentList = function (instr) {
  var argCount = 0;

  while (!this.accept(TPAREN, ')')) {
    this.parseExpression(instr);
    ++argCount;
    while (this.accept(TCOMMA)) {
      this.parseExpression(instr);
      ++argCount;
    }
  }

  return argCount;
};

ParserState.prototype.parseMemberExpression = function (instr) {
  this.parseAtom(instr);
  while (this.accept(TOP, '.') || this.accept(TBRACKET, '[')) {
    var op = this.current;

    if (op.value === '.') {
      if (!this.allowMemberAccess) {
        throw new Error('unexpected ".", member access is not permitted');
      }

      this.expect(TNAME);
      instr.push(new Instruction(IMEMBER, this.current.value));
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
};

ParserState.prototype.parseKeywordExpression = function (instr) {
  if (this.current.value === 'case') {
    this.parseCaseWhen(instr);
  } else {
    throw new Error(`unexpected keyword: ${this.current.value}`);
  }
};

ParserState.prototype.parseCaseWhen = function (instr) {
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
  const caseWithInput = this.nextToken.type !== TKEYWORD;
  const caseInstruction = caseWithInput ? ICASEMATCH : ICASECOND;
  const whenInstruction = caseWithInput ? IWHENMATCH : IWHENCOND;

  // Parse the expression for the value being checked by the case.
  if (caseWithInput) {
    this.parseConditionalExpression(instr);
  }

  // Parse all the when xxx then yyy conditions.
  var count = 0;
  while (this.accept(TKEYWORD, 'when')) {
    this.parseConditionalExpression(instr);
    if (this.accept(TKEYWORD, 'then')) {
      this.parseConditionalExpression(instr);
      instr.push(new Instruction(whenInstruction, count++));
    } else {
      throw new Error(`case block missing when`);
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
    throw new Error(`invalid case block`);
  }
};

ParserState.prototype.parseObject = function (instr) {
  const error = 'invalid object definition';
  var count = 0;
  instr.push(new Instruction(IOBJECT, 0));
  for (var first = true; !this.accept(TBRACE, '}'); first = false) {
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
    const name = this.current.value;
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
};
