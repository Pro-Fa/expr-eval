/**
 * Test utility for creating function spies that track whether they've been called
 */

/**
 * A spy function that wraps another function and tracks if it has been called
 */
export interface SpyFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> {
  (...args: TArgs): TReturn;
  called: boolean;
}

/**
 * Creates a spy wrapper around a function that tracks whether it has been called
 * @param fn The function to wrap with spy functionality
 * @returns A spy function that tracks calls to the original function
 */
export default function spy<TArgs extends unknown[] = unknown[], TReturn = unknown>(
  fn: (...args: TArgs) => TReturn
): SpyFunction<TArgs, TReturn> {
  function spyWrapper(...args: TArgs): TReturn {
    spyWrapper.called = true;
    return fn(...args);
  }

  spyWrapper.called = false;

  return spyWrapper as SpyFunction<TArgs, TReturn>;
}
