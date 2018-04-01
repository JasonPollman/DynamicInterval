/**
 * Exports a function that sets a "dynamically scheduled" interval.
 * You give it a callback function and a function to determine the interval delay.
 * @since 3/22/18
 * @file
 */

/**
 * Determines if an interval should terminate.
 * @param {number} delay The interval's delay setting.
 * @returns {boolean} True if the interval should terminate.
 */
/* eslint-disable-next-line no-restricted-globals */
const intervalShouldTerminate = delay => isNaN(delay) || delay < 0;

/**
 * Converts the given input to a function if it wasn't a function already.
 * @param {any} input The thing to convert to a function.
 * @returns {function} The given function, or a function that returns the passed in input.
 */
const castFunction = input => (typeof input === 'function' ? input : () => input);

/**
 * The default interval scheduling policy for arrays.
 * @param {Array} array The array to shift from.
 */
const intervalArrayScheduler = array => () => array.shift();

/**
 * Removes an item from an array if it exists in it.
 * @param {Array} array The array to remove the `thingy` from.
 * @param {any} thing The thing to remove.
 * @returns {boolean} True if `thingy` was removed, false otherwise.
 */
const removeFromArray = (array, thing) => {
  const index = array.indexOf(thing);
  return index > -1 && array.splice(index, 1) && true;
};

/**
 * Clears a "dynamic interval reference".
 * @returns {object} The interval object assiociated with this method.
 */
function clear() {
  this.timers.forEach(clearTimeout);
  this.cleared = true;
  this.timers = [];
  return this;
}

/**
 * Uses `setTimeout` to create a "dynamically" delayed interval.
 * @param {function} callback The callback to invoke on each tick of the interval.
 * @param {function} getNextDelay A function that should return
 * the next delay in the interval series.
 * @param {...any} args A list of arguments to pass to `callback` on each interval invocation.
 * @returns {object} A reference to the timers this dynamic interval is using and a function
 * to clear the dynamic interval (keyed respectively).
 * @export
 */
export function setDynamicInterval(callback, getNextDelay, ...args) {
  const getNextTimeoutDelay = getNextDelay instanceof Array
    ? intervalArrayScheduler([...getNextDelay])
    : castFunction(getNextDelay);

  const reference = {
    calls: 0,
    timers: [],
    cleared: false,
    clear,
  };

  (function scheduleNextInterval() {
    const delay = Number(getNextTimeoutDelay());

    // The interval will terminate if given a non-numeric
    // value, NaN, or a negative number.
    if (intervalShouldTerminate(delay)) return;

    const timeout = setTimeout(() => {
      reference.calls++;
      removeFromArray(reference.timers, timeout);
      scheduleNextInterval();
      callback(...args);
    }, delay);

    reference.timers.push(timeout);
  }());

  return reference;
}

/**
 * Clears a dynamic interval.
 * @param {object} reference The interval reference to clear.
 * @returns {undefined}
 */
export function clearDynamicInterval(reference) {
  if (reference && typeof reference.clear === 'function') {
    reference.clear();
  }
}

export default exports;
