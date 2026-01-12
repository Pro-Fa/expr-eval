import { Instruction, ISCALAR, IOP1, IOP2, IOP3, IVAR, IVARNAME, IEXPR, IMEMBER, IARRAY } from '../parsing/instruction.js';
import type { OperatorFunction } from '../types/parser.js';

function flushStack(stack: Instruction[], out: Instruction[]) {
  out.push(...stack.splice(0));
}

export default function simplify(
  tokens: Instruction[],
  unaryOps: Record<string, OperatorFunction>,
  binaryOps: Record<string, OperatorFunction>,
  ternaryOps: Record<string, OperatorFunction>,
  values: Record<string, any>
): Instruction[] {
  const nstack: Instruction[] = [];
  const newExpression: Instruction[] = [];

  for (const item of tokens) {
    const { type } = item;

    if (type === ISCALAR || type === IVARNAME) {
      if (Array.isArray(item.value)) {
        nstack.push(
          ...simplify(
            [...item.value.map(x => new Instruction(ISCALAR, x)), new Instruction(IARRAY, item.value.length)],
            unaryOps,
            binaryOps,
            ternaryOps,
            values
          )
        );
      } else {
        nstack.push(item);
      }
    } else if (type === IVAR && item.value in values) {
      nstack.push(new Instruction(ISCALAR, values[item.value]));
    } else if (type === IOP2 && nstack.length > 1) {
      const n2 = nstack.pop()!;
      const n1 = nstack.pop()!;
      const f = binaryOps[item.value];
      nstack.push(new Instruction(ISCALAR, f(n1.value, n2.value)));
    } else if (type === IOP3 && nstack.length > 2) {
      const n3 = nstack.pop()!;
      const n2 = nstack.pop()!;
      const n1 = nstack.pop()!;
      if (item.value === '?') {
        nstack.push(new Instruction(ISCALAR, n1.value ? n2.value : n3.value));
      } else {
        const f = ternaryOps[item.value];
        nstack.push(new Instruction(ISCALAR, f(n1.value, n2.value, n3.value)));
      }
    } else if (type === IOP1 && nstack.length > 0) {
      const n1 = nstack.pop()!;
      const f = unaryOps[item.value];
      nstack.push(new Instruction(ISCALAR, f(n1.value)));
    } else if (type === IEXPR) {
      flushStack(nstack, newExpression);
      const simplified = simplify(item.value as Instruction[], unaryOps, binaryOps, ternaryOps, values);
      newExpression.push(new Instruction(IEXPR, simplified));
    } else if (type === IMEMBER && nstack.length > 0) {
      const n1 = nstack.pop()!;
      nstack.push(new Instruction(ISCALAR, n1.value[item.value]));
    } else {
      flushStack(nstack, newExpression);
      newExpression.push(item);
    }
  }

  flushStack(nstack, newExpression);

  return newExpression;
}
