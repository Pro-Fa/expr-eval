import { Instruction, INUMBER, IOP1, IOP2, IOP3, IVAR, IVARNAME, IEXPR, IMEMBER, IARRAY } from './instruction';

// Type for operator functions
type OperatorFunction = (...args: any[]) => any;

export default function simplify(
  tokens: Instruction[],
  unaryOps: Record<string, OperatorFunction>,
  binaryOps: Record<string, OperatorFunction>,
  ternaryOps: Record<string, OperatorFunction>,
  values: Record<string, any>
): Instruction[] {
  const nstack: Instruction[] = [];
  const newexpression: Instruction[] = [];
  let n1: Instruction, n2: Instruction, n3: Instruction;
  let f: OperatorFunction;

  for (let i = 0; i < tokens.length; i++) {
    const item = tokens[i];
    const { type } = item;

    if (type === INUMBER || type === IVARNAME) {
      if (Array.isArray(item.value)) {
        nstack.push(...simplify(
          item.value.map((x) => new Instruction(INUMBER, x)).concat(new Instruction(IARRAY, item.value.length)),
          unaryOps,
          binaryOps,
          ternaryOps,
          values
        ));
      } else {
        nstack.push(item);
      }
    } else if (type === IVAR && Object.prototype.hasOwnProperty.call(values, item.value)) {
      const newItem = new Instruction(INUMBER, values[item.value]);
      nstack.push(newItem);
    } else if (type === IOP2 && nstack.length > 1) {
      n2 = nstack.pop()!;
      n1 = nstack.pop()!;
      f = binaryOps[item.value];
      const newItem = new Instruction(INUMBER, f(n1.value, n2.value));
      nstack.push(newItem);
    } else if (type === IOP3 && nstack.length > 2) {
      n3 = nstack.pop()!;
      n2 = nstack.pop()!;
      n1 = nstack.pop()!;
      if (item.value === '?') {
        nstack.push(n1.value ? n2.value : n3.value);
      } else {
        f = ternaryOps[item.value];
        const newItem = new Instruction(INUMBER, f(n1.value, n2.value, n3.value));
        nstack.push(newItem);
      }
    } else if (type === IOP1 && nstack.length > 0) {
      n1 = nstack.pop()!;
      f = unaryOps[item.value];
      const newItem = new Instruction(INUMBER, f(n1.value));
      nstack.push(newItem);
    } else if (type === IEXPR) {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift()!);
      }
      newexpression.push(new Instruction(IEXPR, simplify(item.value as Instruction[], unaryOps, binaryOps, ternaryOps, values)));
    } else if (type === IMEMBER && nstack.length > 0) {
      n1 = nstack.pop()!;
      nstack.push(new Instruction(INUMBER, n1.value[item.value]));
    } else {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift()!);
      }
      newexpression.push(item);
    }
  }

  while (nstack.length > 0) {
    newexpression.push(nstack.shift()!);
  }

  return newexpression;
}
