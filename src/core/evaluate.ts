/**
 * Expression evaluation module
 *
 * This module contains the core evaluation logic for executing parsed expressions.
 * It uses a stack-based interpreter to evaluate instruction sequences produced by the parser.
 */

import { INUMBER, IOP1, IOP2, IOP3, IVAR, IVARNAME, IFUNCALL, IFUNDEF, IEXPR, IEXPREVAL, IMEMBER, IENDSTATEMENT, IARRAY, IUNDEFINED, ICASEMATCH, IWHENMATCH, ICASEELSE, ICASECOND, IWHENCOND, IOBJECT, IPROPERTY, IOBJECTEND } from '../parsing/instruction.js';
import type { Instruction } from '../parsing/instruction.js';
import type { Expression } from './expression.js';
import type { Value, Values, VariableResolveResult, VariableAlias, VariableValue } from '../types/values.js';
import { VariableError } from '../types/errors.js';
import { ExpressionValidator } from '../validation/expression-validator.js';

// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND
// cSpell:words nstack

/**
 * Wrapper for lazy expression evaluation
 * Used for short-circuit evaluation of logical operators and conditionals
 */
interface ExpressionEvaluator {
  type: typeof IEXPREVAL;
  value: (scope: Values) => Value | Promise<Value>;
}

/** Type alias for evaluation context values */
type EvaluationValues = Values;

/** Type alias for the evaluation stack (stores intermediate results) */
type EvaluationStack = any[];

/**
 * The main entry point for expression evaluation; evaluates an expression returning the result.
 * @param tokens Tokens parsed from the expression by the parser; this is expected to be an array
 * of objects returned by the {@link Token} function.
 * @param expr The instance of the {@link Expression} class that invoked the evaluator.
 * @param values Input values provided to the expression.
 * @returns The return value is the expression result value or a promise that when resolved will contain
 * the expression result value.  A promise is only returned if a caller defined function returns a promise.
 */
export default function evaluate(tokens: Instruction | Instruction[], expr: Expression, values: EvaluationValues): Value | Promise<Value> {
  if (isExpressionEvaluator(tokens)) {
    return resolveExpression(tokens, values);
  }

  const nstack: EvaluationStack = [];
  return runEvaluateLoop(tokens as Instruction[], expr, values, nstack);
}

/**
 * Tests to determine if an object is a promise or promise-like object.
 * @param obj The object to test.
 * @returns A truthy value if the object is a promise or promise-like object.
 */
function isPromise(obj: any): obj is Promise<any> {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

/**
 * Runs the expression evaluator's evaluation loop to evaluate an expression.  This evaluation
 * loop runs synchronously unless a custom function added by the caller returns a promise, at
 * which point the event loop will also become asynchronous; pausing execution until the
 * custom function promise resolves or rejects.
 * @param tokens Tokens parsed from the expression by the parser; this is expected to be an array
 * of objects returned by the {@link Token} function.
 * @param expr The instance of the {@link Expression} class that invoked the evaluator.
 * @param values Input values provided to the expression.
 * @param nstack The stack to use for expression evaluation.
 * @param startAt The index of the token at which to start expression evaluation; defaults to 0 to
 * start at the first token.
 * @returns The return value is the expression result value or a promise that when resolved will contain
 * the expression result value.  A promise is only returned if a caller defined function returns a promise.
 */
function runEvaluateLoop(tokens: Instruction[], expr: Expression, values: EvaluationValues, nstack: EvaluationStack, startAt: number = 0): Value | Promise<Value> {
  const numTokens = tokens.length;
  for (let i = startAt; i < numTokens; i++) {
    const item = tokens[i];
    evaluateExpressionToken(expr, values, item, nstack);
    const last = nstack[nstack.length - 1];
    if (isPromise(last)) {
      // The only way a promise can get added to the stack is if a custom function was invoked that
      // returned a promise.  If that happens we need to pause the expression evaluation loop until
      // the promise resolves/rejects and then pick up where we left off.
      return last.then(resolvedValue => {
        // We need to replace the promise on the stack with the actual resolved value of the promise...
        nstack.pop();
        nstack.push(resolvedValue);
        // ...with the stack updated with the resolved value from the promise we can call ourselves to
        // continue evaluating the expression.
        return runEvaluateLoop(tokens, expr, values, nstack, i + 1);
      });
    }
  }

  // When we get here the expression has been completely evaluated and the final value of the expression
  // should be on the top of the stack.
  return resolveFinalValue(nstack, values);
}

/**
 * Resolves the final value of a fully evaluated expression.
 * @param nstack The stack to use for expression evaluation.
 * @param values Input values provided to the expression.
 * @returns The expression value.
 */
function resolveFinalValue(nstack: EvaluationStack, values: EvaluationValues): Value | Promise<Value> {
  ExpressionValidator.validateStackParity(nstack.length);
  // Explicitly return zero to avoid test issues caused by -0
  return nstack[0] === 0 ? 0 : resolveExpression(nstack[0], values);
}

/**
 * Evaluates a single expression token, updating the stack based on the token.
 * @param expr The instance of the {@link Expression} class that invoked the evaluator.
 * @param values Input values provided to the expression.
 * @param token The token to evaluate; this is expected to be an object returned by
 * the {@link Token} function.
 * @param nstack The stack to use for expression evaluation.
 */
function evaluateExpressionToken(expr: Expression, values: EvaluationValues, token: Instruction, nstack: EvaluationStack): void {
  let leftOperand: any, rightOperand: any, conditionValue: any;
  let operatorFunction: Function, functionArgs: any[], argumentCount: number;

  const { type } = token;
  if (type === INUMBER || type === IVARNAME) {
    nstack.push(token.value);
  } else if (type === IOP2) {
    rightOperand = nstack.pop();
    leftOperand = nstack.pop();

    // Handle special short-circuit logical operators
    if (token.value === 'and') {
      nstack.push(leftOperand ? !!evaluate(rightOperand, expr, values) : false);
    } else if (token.value === 'or') {
      nstack.push(leftOperand ? true : !!evaluate(rightOperand, expr, values));
    } else if (token.value === '=') {
      operatorFunction = expr.binaryOps[token.value];
      nstack.push(operatorFunction(leftOperand, evaluate(rightOperand, expr, values), values));
    } else {
      operatorFunction = expr.binaryOps[token.value];
      nstack.push(operatorFunction(resolveExpression(leftOperand, values), resolveExpression(rightOperand, values)));
    }
  } else if (type === IOP3) {
    const falseValue = nstack.pop();
    const trueValue = nstack.pop();
    conditionValue = nstack.pop();

    if (token.value === '?') {
      nstack.push(evaluate(conditionValue ? trueValue : falseValue, expr, values));
    } else {
      operatorFunction = expr.ternaryOps[token.value];
      nstack.push(operatorFunction(
        resolveExpression(conditionValue, values),
        resolveExpression(trueValue, values),
        resolveExpression(falseValue, values)
      ));
    }
  } else if (type === IVAR) {
    const variableName = token.value as string;
    ExpressionValidator.validateVariableName(variableName, expr.toString());

    if (variableName in expr.functions) {
      nstack.push(expr.functions[variableName]);
    } else if (variableName in expr.unaryOps && expr.parser.isOperatorEnabled(variableName)) {
      nstack.push(expr.unaryOps[variableName]);
    } else {
      let valueResolved = false;
      if (variableName in values) {
        const variableValue = values[variableName];
        nstack.push(variableValue);
        valueResolved = true;
      } else {
        // We don't recognize the IVAR token.  Before throwing an error for an undefined variable we
        // give the parser a shot at resolving the IVAR for us.  By default this callback will return
        // undefined and fail to resolve, but the creator of the parser can replace the resolve callback
        // with their own implementation to resolve variables.  That can return values that look like:
        // { alias: "xxx" } - use xxx as the IVAR token instead of what was typed.
        // { value: <something> } use <something> as the value for the variable.
        const resolvedVariable: VariableResolveResult | undefined = expr.parser.resolve(variableName);
        if (typeof resolvedVariable === 'object' && resolvedVariable && 'alias' in resolvedVariable && typeof resolvedVariable.alias === 'string') {
          // The parser's resolver function returned { alias: "xxx" }, we want to use
          // resolved.alias in place of token.value.
          if (resolvedVariable.alias in values) {
            nstack.push(values[resolvedVariable.alias]);
            valueResolved = true;
          }
        } else if (typeof resolvedVariable === 'object' && resolvedVariable && 'value' in resolvedVariable) {
          // The parser's resolver function returned { value: <something> }, use <something>
          // as the value of the token.
          nstack.push(resolvedVariable.value);
          valueResolved = true;
        }
      }
      if (!valueResolved) {
        throw new VariableError(
          variableName,
          {
            expression: expr.toString()
          }
        );
      }
    }
  } else if (type === IOP1) {
    const operand = nstack.pop();
    operatorFunction = expr.unaryOps[token.value];
    nstack.push(operatorFunction(resolveExpression(operand, values)));
  } else if (type === IFUNCALL) {
    argumentCount = token.value as number;
    functionArgs = [];
    while (argumentCount-- > 0) {
      functionArgs.unshift(resolveExpression(nstack.pop(), values));
    }
    const functionToCall = nstack.pop();
    ExpressionValidator.validateFunctionCall(functionToCall, String(functionToCall), expr.toString());
    nstack.push(functionToCall.apply(undefined, functionArgs));
  } else if (type === IFUNDEF) {
    // Create closure to keep references to arguments and expression
    nstack.push((function () {
      const expressionToEvaluate = nstack.pop();
      const functionParams: string[] = [];
      let parameterCount = token.value as number;
      while (parameterCount-- > 0) {
        functionParams.unshift(nstack.pop());
      }
      const functionName = nstack.pop();
      const userDefinedFunction = function (...functionArguments: any[]) {
        const localScope = Object.assign({}, values);
        for (let i = 0, len = functionParams.length; i < len; i++) {
          localScope[functionParams[i]] = functionArguments[i];
        }
        return evaluate(expressionToEvaluate, expr, localScope);
      };
      // Set function name for debugging
      Object.defineProperty(userDefinedFunction, 'name', {
        value: functionName,
        writable: false
      });
      values[functionName] = userDefinedFunction;
      return userDefinedFunction;
    })());
  } else if (type === IEXPR) {
    nstack.push(createExpressionEvaluator(token, expr));
  } else if (type === IEXPREVAL) {
    nstack.push(token);
  } else if (type === IMEMBER) {
    const memberParent = nstack.pop();
    nstack.push(memberParent === undefined || token === undefined || token.value === undefined ? undefined : memberParent[token.value]);
  } else if (type === IENDSTATEMENT) {
    nstack.pop();
  } else if (type === IARRAY) {
    argumentCount = token.value as number;
    functionArgs = [];
    while (argumentCount-- > 0) {
      functionArgs.unshift(nstack.pop());
    }
    nstack.push(functionArgs);
  } else if (type === IUNDEFINED) {
    // The value of the undefined reserved work is undefined.
    nstack.push(undefined);
  } else if (type === ICASEMATCH || type === ICASECOND) {
    // When we get here all the when conditions have already been evaluated; at this point
    // the stack will look like
    // toTest, condition0, value0, condition1, value1, ..., conditionN, valueN.
    // Each of the condition values will be true/false.
    // First we remove all the WHEN/ELSE conditions from the stack...
    const whenConditionCount = (token.value as number) * 2;
    const whenConditions = nstack.splice(-whenConditionCount, whenConditionCount);
    if (type === ICASEMATCH) {
      // ...then remove the value being tested from the stack if this is a CASE $input...
      nstack.pop();
    }
    // ...Walk the flag/value tuples looking for the first flag which is truthy,
    // when we find it we want the corresponding value.  If none of the flags
    // are truthy then the value of the case will be undefined...
    let caseResult = undefined;
    for (let i = 0; i < whenConditions.length; i += 2) {
      if (whenConditions[i]) {
        caseResult = whenConditions[i + 1];
        break;
      }
    }
    // ...push the result of the case onto the stack.
    nstack.push(caseResult);
  } else if (type === IWHENCOND) {
    // We are evaluating a WHEN x THEN y portion of a CASE statement; the top of the
    // stack has the y value...
    const thenValue = nstack.pop();
    // ...The second value on the stack has the x value
    const whenCondition = nstack.pop();
    // ..once we have the when value and the value being tested we evaluate the x value
    // to see if it evaluates to a truthy value.
    operatorFunction = expr.binaryOps['=='];
    nstack.push(resolveExpression(whenCondition, values));
    nstack.push(resolveExpression(thenValue, values));
  } else if (type === IWHENMATCH) {
    // We are evaluating a WHEN x THEN y portion of a CASE $input statement; the top of the
    // stack has the y value...
    const thenValue = nstack.pop();
    // ...The second value on the stack has the x value
    const whenValue = nstack.pop();
    // ...The last item on the stack will be the value to test for the FIRST when;
    // as we have further when conditions they will pile up on the stack we will have to
    // skip them...
    const testValue = nstack[nstack.length - 1 - ((token.value as number) * 2)];
    // ..once we have the when value and the value being tested we use the == operator
    // to compare them.
    operatorFunction = expr.binaryOps['=='];
    nstack.push(operatorFunction(resolveExpression(whenValue, values), resolveExpression(testValue, values)));
    nstack.push(resolveExpression(thenValue, values));
  } else if (type === ICASEELSE) {
    // We are evaluating a ELSE y portion of a case statement; we want to push a pair of values
    // just a like a WHEN x THEN y; the first value being true to always match this condition the
    // second value being the value to use.
    const elseValue = nstack.pop();
    nstack.push(true);
    nstack.push(resolveExpression(elseValue, values));
  } else if (type === IOBJECT) {
    // We are constructing an object, push an empty object onto the stack.
    nstack.push({});
  } else if (type === IOBJECTEND) {
    // We ignore this instruction, we don't need to emit anything to the stack
    // when an object construction is complete.
  } else if (type === IPROPERTY) {
    // At this point the top 2 items on the stack will be the property value, and the object
    // in which we should be setting the value.  We need to pop the value off the stack
    // and then set the property in the object to the value, leaving the object on the stack.
    const propertyValue = nstack.pop();
    const targetObject = nstack[nstack.length - 1];
    targetObject[token.value] = propertyValue;
  } else {
    throw new Error('invalid Expression');
  }
}

function createExpressionEvaluator(token: Instruction, expr: Expression): ExpressionEvaluator {
  if (isExpressionEvaluator(token)) {
    return token;
  }
  return {
    type: IEXPREVAL,
    value: function (scope: EvaluationValues): Value | Promise<Value> {
      return evaluate(token.value as Instruction[], expr, scope);
    }
  };
}

function isExpressionEvaluator(n: any): n is ExpressionEvaluator {
  return n && n.type === IEXPREVAL;
}

function resolveExpression(n: any, values: EvaluationValues): Value | Promise<Value> {
  return isExpressionEvaluator(n) ? n.value(values) : n;
}
