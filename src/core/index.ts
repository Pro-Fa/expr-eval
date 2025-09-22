/**
 * Core evaluation engine
 *
 * This module contains the core expression evaluation logic including
 * the main evaluation loop and stack-based computation.
 */

// Re-export the main evaluation function
export { default as evaluate } from './evaluate.js';

// Re-export the Expression class
export { Expression } from './expression.js';

// Re-export utility functions
export { default as simplify } from './simplify.js';
export { default as substitute } from './substitute.js';
export { default as expressionToString } from './expression-to-string.js';
export { default as getSymbols } from './get-symbols.js';
export { default as contains } from './contains.js';
