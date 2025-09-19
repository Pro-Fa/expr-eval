'use strict';

export default function (fn) {
  function spy() {
    spy.called = true;
    return fn.apply(this, arguments);
  }
  spy.called = false;
  return spy;
}
