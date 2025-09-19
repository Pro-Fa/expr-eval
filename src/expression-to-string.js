// cSpell:words INUMBER IVAR IVARNAME IFUNCALL IEXPR IEXPREVAL IMEMBER IENDSTATEMENT IARRAY
// cSpell:words IFUNDEF IUNDEFINED ICASEMATCH ICASECOND IWHENCOND IWHENMATCH ICASEELSE IPROPERTY
// cSpell:words IOBJECT IOBJECTEND
// cSpell:words nstack

import { INUMBER, IOP1, IOP2, IOP3, IVAR, IVARNAME, IFUNCALL, IFUNDEF, IEXPR, IMEMBER, IENDSTATEMENT, IARRAY, IUNDEFINED, ICASEMATCH, ICASECOND, IWHENCOND, IWHENMATCH, ICASEELSE, IOBJECT, IOBJECTEND, IPROPERTY } from './instruction';

export default function expressionToString(tokens, toJS) {
  var nstack = [];
  var n1, n2, n3;
  var f, args, argCount;
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {
      if (typeof item.value === 'number' && item.value < 0) {
        nstack.push('(' + item.value + ')');
      } else if (Array.isArray(item.value)) {
        nstack.push('[' + item.value.map(escapeValue).join(', ') + ']');
      } else {
        nstack.push(escapeValue(item.value));
      }
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (toJS) {
        if (f === '^') {
          nstack.push('Math.pow(' + n1 + ', ' + n2 + ')');
        } else if (f === 'and' || f === '&&') {
          nstack.push('(!!' + n1 + ' && !!' + n2 + ')');
        } else if (f === 'or' || f === '||') {
          nstack.push('(!!' + n1 + ' || !!' + n2 + ')');
        } else if (f === '|') {
          nstack.push('(function(a,b){ return Array.isArray(a) && Array.isArray(b) ? a.concat(b) : String(a) + String(b); }((' + n1 + '),(' + n2 + ')))');
        } else if (f === '==') {
          nstack.push('(' + n1 + ' === ' + n2 + ')');
        } else if (f === '!=') {
          nstack.push('(' + n1 + ' !== ' + n2 + ')');
        } else if (f === '[') {
          nstack.push(n1 + '[(' + n2 + ') | 0]');
        } else {
          nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
        }
      } else {
        if (f === '[') {
          nstack.push(n1 + '[' + n2 + ']');
        } else {
          nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
        }
      }
    } else if (type === IOP3) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (f === '?') {
        nstack.push('(' + n1 + ' ? ' + n2 + ' : ' + n3 + ')');
      } else {
        throw new Error('invalid Expression');
      }
    } else if (type === IVAR || type === IVARNAME) {
      nstack.push(item.value);
    } else if (type === IOP1) {
      n1 = nstack.pop();
      f = item.value;
      if (f === '-' || f === '+') {
        nstack.push('(' + f + n1 + ')');
      } else if (toJS) {
        if (f === 'not') {
          nstack.push('(' + '!' + n1 + ')');
        } else if (f === '!') {
          nstack.push('fac(' + n1 + ')');
        } else {
          nstack.push(f + '(' + n1 + ')');
        }
      } else if (f === '!') {
        nstack.push('(' + n1 + '!)');
      } else {
        nstack.push('(' + f + ' ' + n1 + ')');
      }
    } else if (type === IFUNCALL) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      f = nstack.pop();
      nstack.push(f + '(' + args.join(', ') + ')');
    } else if (type === IFUNDEF) {
      n2 = nstack.pop();
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      n1 = nstack.pop();
      if (toJS) {
        nstack.push('(' + n1 + ' = function(' + args.join(', ') + ') { return ' + n2 + ' })');
      } else {
        nstack.push('(' + n1 + '(' + args.join(', ') + ') = ' + n2 + ')');
      }
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1 + '.' + item.value);
    } else if (type === IARRAY) {
      argCount = item.value;
      args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      nstack.push('[' + args.join(', ') + ']');
    } else if (type === IEXPR) {
      nstack.push('(' + expressionToString(item.value, toJS) + ')');
    } else if (type === IENDSTATEMENT) {
      // eslint-disable no-empty
    } else if (type === IUNDEFINED) {
      // The value of the undefined reserved work is undefined.
      nstack.push('undefined');
    } else if (type === ICASEMATCH || type === ICASECOND) {
      // When we get here all the when conditions have already been evaluated; at this point
      // the stack will look like
      // toTest, condition0, value0, condition1, value1, ..., conditionN, valueN.
      // Each of the condition values will be true/false.
      // First we remove all the WHEN/ELSE conditions from the stack...
      n1 = item.value;
      const whens = nstack.splice(-n1, n1);
      if (type === ICASEMATCH) {
        // ...then remove the value being tested from the stack if this is a CASE $input...
        n2 = nstack.pop();
        // ...push a string for the entire case onto the stack.
        nstack.push(`case ${n2} ` + whens.join(' ') + ' end');
      } else {
        // ...push a string for the entire case onto the stack.
        nstack.push('case ' + whens.join(' ') + ' end');
      }
    } else if (type === IWHENCOND) {
      // We are evaluating a WHEN x THEN y portion of a CASE statement; the top of the
      // stack has the y value...
      n1 = nstack.pop();
      // ...The second value on the stack has the x value
      n2 = nstack.pop();
      // ..once we have the when value and the value being tested we evaluate the x value
      // to see if it evaluates to a truthy value.
      nstack.push(`when ${n2} then ${n1}`);
    } else if (type === IWHENMATCH) {
      // We are evaluating a WHEN x THEN y portion of a CASE $input statement; the top of the
      // stack has the y value...
      n1 = nstack.pop();
      // ...The second value on the stack has the x value
      n2 = nstack.pop();
      // ...The last item on the stack will be the value to test for the FIRST when;
      // as we have further when conditions they will pile up on the stack we will have to
      // skip them...
      n3 = nstack[nstack.length - 1 - (item.value * 2)];
      // ..once we have the when value and the value being tested we use the == operator
      // to compare them.
      nstack.push(`when ${n2} then ${n1}`);
    } else if (type === ICASEELSE) {
      // Wea re evaluating a ELSE y portion of a case statement; we want to push a pair of values
      // just a like a WHEN x THEN y; the first value being true to always match this condition the
      // second value being the value to use.
      n1 = nstack.pop();
      nstack.push(`else ${n1}`);
    } else if (type === IOBJECT) {
      // We are constructing an object, push an empty object onto the stack.
      nstack.push('{ ');
    } else if (type === IOBJECTEND) {
      // We have completed constructing an object, append the closing brace.
      nstack.push(`${nstack.pop()} }`);
    } else if (type === IPROPERTY) {
      // At this point the top 2 items on the stack will be the property value, and the partial
      // object construction string we are building.
      n1 = nstack.pop();
      const partial = nstack.pop();
      // We keep the entire object expression as a single entry on the stack
      // If this is the FIRST property then the value on the stack will be the '{ ' from the IOBJECT
      // above.  If not then it will be the previous property in the object which means we need a
      // comma to separate this property from the previous property.
      const separator = partial.endsWith('{ ') ? '' : ', ';
      nstack.push(`${partial}${separator}${item.value}: ${n1}`);
    } else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    if (toJS) {
      nstack = [nstack.join(',')];
    } else {
      nstack = [nstack.join(';')];
    }
  }
  return String(nstack[0]);
}

function escapeValue(v) {
  if (typeof v === 'string') {
    return JSON.stringify(v).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }
  return v;
}
