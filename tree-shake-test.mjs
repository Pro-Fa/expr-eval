// Tree-shaking test file
import { Parser } from '@pro-fa/expr-eval';

// Only import and use Parser, not Expression
const parser = new Parser();
const result = parser.parse('2 + 3').evaluate();
console.log('Parser result:', result);

export { result };