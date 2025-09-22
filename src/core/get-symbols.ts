import { IVAR, IMEMBER, IEXPR, IVARNAME } from '../parsing/instruction.js';
import type { Instruction } from '../parsing/instruction.js';
import contains from './contains.js';

interface SymbolOptions {
  withMembers?: boolean;
}

export default function getSymbols(tokens: Instruction[], symbols: string[], options?: SymbolOptions): void {
  const opts = options || {};
  const withMembers = !!opts.withMembers;
  let prevVar: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const item = tokens[i];
    if (item.type === IVAR || item.type === IVARNAME) {
      if (!withMembers && !contains(symbols, item.value as string)) {
        symbols.push(item.value as string);
      } else if (prevVar !== null) {
        if (!contains(symbols, prevVar)) {
          symbols.push(prevVar);
        }
        prevVar = item.value as string;
      } else {
        prevVar = item.value as string;
      }
    } else if (item.type === IMEMBER && withMembers && prevVar !== null) {
      prevVar += '.' + item.value;
    } else if (item.type === IEXPR) {
      getSymbols(item.value as Instruction[], symbols, opts);
    } else if (prevVar !== null) {
      if (!contains(symbols, prevVar)) {
        symbols.push(prevVar);
      }
      prevVar = null;
    }
  }

  if (prevVar !== null && !contains(symbols, prevVar)) {
    symbols.push(prevVar);
  }
}
