/*!
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
*/

import { Expression } from './src/core/expression.js';
import { Parser } from './src/parsing/parser.js';
import { createLanguageService } from './src/language-service/index.js';

// Re-export types for public API
export type {
  Value,
  Values,
  ParserOptions,
  UnaryOperator,
  BinaryOperator,
  SymbolOptions,
  VariableAlias,
  VariableValue,
  VariableResolveResult,
  OperatorFunction
} from './src/types/index.js';

// Re-export custom error classes
export {
  ExpressionError,
  ParseError,
  EvaluationError,
  ArgumentError,
  AccessError,
  VariableError,
  FunctionError
} from './src/types/errors.js';

export type {
  LanguageServiceApi,
  HoverV2,
  GetCompletionsParams,
  GetHoverParams,
  HighlightToken,
  LanguageServiceOptions
} from './src/language-service/index.js';

export { createLanguageService, Expression, Parser };
