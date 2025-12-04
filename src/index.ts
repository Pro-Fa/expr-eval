/**
 * Expression evaluation library
 *
 * This is the main entry point for the reorganized expr-eval library.
 * It provides a clean, domain-driven API for expression parsing and evaluation.
 */

// Core types and type guards
export * from './types/index.js';

// Binary operators organized by category
export * from './operators/binary/index.js';

// Unary operators organized by category
export * from './operators/unary/index.js';

// Functions organized by domain
export * from './functions/math/index.js';
export * from './functions/array/index.js';
export * from './functions/utility/index.js';

// Core evaluation engine
export * from './core/index.js';

// Language service for intellisense
export * from './language-service/index.js';

// Parsing utilities
export * from './parsing/index.js';

// Validation utilities
export * from './validation/index.js';

// Error handling utilities
export * from './errors/index.js';

// Configuration utilities
export * from './config/index.js';
