'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDynamicInterval = setDynamicInterval;
exports.clearDynamicInterval = clearDynamicInterval;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var intervalShouldTerminate = function intervalShouldTerminate(delay) {
  return isNaN(delay) || delay < 0;
};

/**
 * Converts the given input to a function if it wasn't a function already.
 * @param {any} input The thing to convert to a function.
 * @returns {function} The given function, or a function that returns the passed in input.
 */
var castFunction = function castFunction(input) {
  return typeof input === 'function' ? input : function () {
    return input;
  };
};

/**
 * The default interval scheduling policy for arrays.
 * @param {Array} array The array to shift from.
 */
var intervalArrayScheduler = function intervalArrayScheduler(array) {
  return function () {
    return array.shift();
  };
};

/**
 * Removes an item from an array if it exists in it.
 * @param {Array} array The array to remove the `thingy` from.
 * @param {any} thing The thing to remove.
 * @returns {boolean} True if `thingy` was removed, false otherwise.
 */
var removeFromArray = function removeFromArray(array, thing) {
  var index = array.indexOf(thing);
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
function setDynamicInterval(callback, getNextDelay) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var getNextTimeoutDelay = getNextDelay instanceof Array ? intervalArrayScheduler([].concat(_toConsumableArray(getNextDelay))) : castFunction(getNextDelay);

  var reference = {
    calls: 0,
    timers: [],
    cleared: false,
    clear: clear
  };

  (function scheduleNextInterval() {
    var delay = Number(getNextTimeoutDelay());

    // The interval will terminate if given a non-numeric
    // value, NaN, or a negative number.
    if (intervalShouldTerminate(delay)) return;

    var timeout = setTimeout(function () {
      reference.calls++;
      removeFromArray(reference.timers, timeout);
      scheduleNextInterval();
      callback.apply(undefined, args);
    }, delay);

    reference.timers.push(timeout);
  })();

  return reference;
}

/**
 * Clears a dynamic interval.
 * @param {object} reference The interval reference to clear.
 * @returns {undefined}
 */
function clearDynamicInterval(reference) {
  if (reference && typeof reference.clear === 'function') {
    reference.clear();
  }
}

exports.default = exports;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9keW5hbWljSW50ZXJ2YWwuanMiXSwibmFtZXMiOlsic2V0RHluYW1pY0ludGVydmFsIiwiY2xlYXJEeW5hbWljSW50ZXJ2YWwiLCJpbnRlcnZhbFNob3VsZFRlcm1pbmF0ZSIsImlzTmFOIiwiZGVsYXkiLCJjYXN0RnVuY3Rpb24iLCJpbnB1dCIsImludGVydmFsQXJyYXlTY2hlZHVsZXIiLCJhcnJheSIsInNoaWZ0IiwicmVtb3ZlRnJvbUFycmF5IiwidGhpbmciLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJjbGVhciIsInRpbWVycyIsImZvckVhY2giLCJjbGVhclRpbWVvdXQiLCJjbGVhcmVkIiwiY2FsbGJhY2siLCJnZXROZXh0RGVsYXkiLCJhcmdzIiwiZ2V0TmV4dFRpbWVvdXREZWxheSIsIkFycmF5IiwicmVmZXJlbmNlIiwiY2FsbHMiLCJzY2hlZHVsZU5leHRJbnRlcnZhbCIsIk51bWJlciIsInRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicHVzaCIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBNERnQkEsa0IsR0FBQUEsa0I7UUFxQ0FDLG9CLEdBQUFBLG9COzs7O0FBakdoQjs7Ozs7OztBQU9BOzs7OztBQUtBO0FBQ0EsSUFBTUMsMEJBQTBCLFNBQTFCQSx1QkFBMEI7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLEtBQWdCQSxRQUFRLENBQWpDO0FBQUEsQ0FBaEM7O0FBRUE7Ozs7O0FBS0EsSUFBTUMsZUFBZSxTQUFmQSxZQUFlO0FBQUEsU0FBVSxPQUFPQyxLQUFQLEtBQWlCLFVBQWpCLEdBQThCQSxLQUE5QixHQUFzQztBQUFBLFdBQU1BLEtBQU47QUFBQSxHQUFoRDtBQUFBLENBQXJCOztBQUVBOzs7O0FBSUEsSUFBTUMseUJBQXlCLFNBQXpCQSxzQkFBeUI7QUFBQSxTQUFTO0FBQUEsV0FBTUMsTUFBTUMsS0FBTixFQUFOO0FBQUEsR0FBVDtBQUFBLENBQS9COztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNGLEtBQUQsRUFBUUcsS0FBUixFQUFrQjtBQUN4QyxNQUFNQyxRQUFRSixNQUFNSyxPQUFOLENBQWNGLEtBQWQsQ0FBZDtBQUNBLFNBQU9DLFFBQVEsQ0FBQyxDQUFULElBQWNKLE1BQU1NLE1BQU4sQ0FBYUYsS0FBYixFQUFvQixDQUFwQixDQUFkLElBQXdDLElBQS9DO0FBQ0QsQ0FIRDs7QUFLQTs7OztBQUlBLFNBQVNHLEtBQVQsR0FBaUI7QUFDZixPQUFLQyxNQUFMLENBQVlDLE9BQVosQ0FBb0JDLFlBQXBCO0FBQ0EsT0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxPQUFLSCxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVU8sU0FBU2hCLGtCQUFULENBQTRCb0IsUUFBNUIsRUFBc0NDLFlBQXRDLEVBQTZEO0FBQUEsb0NBQU5DLElBQU07QUFBTkEsUUFBTTtBQUFBOztBQUNsRSxNQUFNQyxzQkFBc0JGLHdCQUF3QkcsS0FBeEIsR0FDeEJqQixvREFBMkJjLFlBQTNCLEdBRHdCLEdBRXhCaEIsYUFBYWdCLFlBQWIsQ0FGSjs7QUFJQSxNQUFNSSxZQUFZO0FBQ2hCQyxXQUFPLENBRFM7QUFFaEJWLFlBQVEsRUFGUTtBQUdoQkcsYUFBUyxLQUhPO0FBSWhCSjtBQUpnQixHQUFsQjs7QUFPQyxZQUFTWSxvQkFBVCxHQUFnQztBQUMvQixRQUFNdkIsUUFBUXdCLE9BQU9MLHFCQUFQLENBQWQ7O0FBRUE7QUFDQTtBQUNBLFFBQUlyQix3QkFBd0JFLEtBQXhCLENBQUosRUFBb0M7O0FBRXBDLFFBQU15QixVQUFVQyxXQUFXLFlBQU07QUFDL0JMLGdCQUFVQyxLQUFWO0FBQ0FoQixzQkFBZ0JlLFVBQVVULE1BQTFCLEVBQWtDYSxPQUFsQztBQUNBRjtBQUNBUCxnQ0FBWUUsSUFBWjtBQUNELEtBTGUsRUFLYmxCLEtBTGEsQ0FBaEI7O0FBT0FxQixjQUFVVCxNQUFWLENBQWlCZSxJQUFqQixDQUFzQkYsT0FBdEI7QUFDRCxHQWZBLEdBQUQ7O0FBaUJBLFNBQU9KLFNBQVA7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTeEIsb0JBQVQsQ0FBOEJ3QixTQUE5QixFQUF5QztBQUM5QyxNQUFJQSxhQUFhLE9BQU9BLFVBQVVWLEtBQWpCLEtBQTJCLFVBQTVDLEVBQXdEO0FBQ3REVSxjQUFVVixLQUFWO0FBQ0Q7QUFDRjs7a0JBRWNpQixPIiwiZmlsZSI6ImR5bmFtaWNJbnRlcnZhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXhwb3J0cyBhIGZ1bmN0aW9uIHRoYXQgc2V0cyBhIFwiZHluYW1pY2FsbHkgc2NoZWR1bGVkXCIgaW50ZXJ2YWwuXG4gKiBZb3UgZ2l2ZSBpdCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFuZCBhIGZ1bmN0aW9uIHRvIGRldGVybWluZSB0aGUgaW50ZXJ2YWwgZGVsYXkuXG4gKiBAc2luY2UgMy8yMi8xOFxuICogQGZpbGVcbiAqL1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgYW4gaW50ZXJ2YWwgc2hvdWxkIHRlcm1pbmF0ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWxheSBUaGUgaW50ZXJ2YWwncyBkZWxheSBzZXR0aW5nLlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIGludGVydmFsIHNob3VsZCB0ZXJtaW5hdGUuXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbmNvbnN0IGludGVydmFsU2hvdWxkVGVybWluYXRlID0gZGVsYXkgPT4gaXNOYU4oZGVsYXkpIHx8IGRlbGF5IDwgMDtcblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gaW5wdXQgdG8gYSBmdW5jdGlvbiBpZiBpdCB3YXNuJ3QgYSBmdW5jdGlvbiBhbHJlYWR5LlxuICogQHBhcmFtIHthbnl9IGlucHV0IFRoZSB0aGluZyB0byBjb252ZXJ0IHRvIGEgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IFRoZSBnaXZlbiBmdW5jdGlvbiwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBhc3NlZCBpbiBpbnB1dC5cbiAqL1xuY29uc3QgY2FzdEZ1bmN0aW9uID0gaW5wdXQgPT4gKHR5cGVvZiBpbnB1dCA9PT0gJ2Z1bmN0aW9uJyA/IGlucHV0IDogKCkgPT4gaW5wdXQpO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGludGVydmFsIHNjaGVkdWxpbmcgcG9saWN5IGZvciBhcnJheXMuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2hpZnQgZnJvbS5cbiAqL1xuY29uc3QgaW50ZXJ2YWxBcnJheVNjaGVkdWxlciA9IGFycmF5ID0+ICgpID0+IGFycmF5LnNoaWZ0KCk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gYW4gYXJyYXkgaWYgaXQgZXhpc3RzIGluIGl0LlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgYHRoaW5neWAgZnJvbS5cbiAqIEBwYXJhbSB7YW55fSB0aGluZyBUaGUgdGhpbmcgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYHRoaW5neWAgd2FzIHJlbW92ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuY29uc3QgcmVtb3ZlRnJvbUFycmF5ID0gKGFycmF5LCB0aGluZykgPT4ge1xuICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YodGhpbmcpO1xuICByZXR1cm4gaW5kZXggPiAtMSAmJiBhcnJheS5zcGxpY2UoaW5kZXgsIDEpICYmIHRydWU7XG59O1xuXG4vKipcbiAqIENsZWFycyBhIFwiZHluYW1pYyBpbnRlcnZhbCByZWZlcmVuY2VcIi5cbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBpbnRlcnZhbCBvYmplY3QgYXNzaW9jaWF0ZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIHRoaXMudGltZXJzLmZvckVhY2goY2xlYXJUaW1lb3V0KTtcbiAgdGhpcy5jbGVhcmVkID0gdHJ1ZTtcbiAgdGhpcy50aW1lcnMgPSBbXTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogVXNlcyBgc2V0VGltZW91dGAgdG8gY3JlYXRlIGEgXCJkeW5hbWljYWxseVwiIGRlbGF5ZWQgaW50ZXJ2YWwuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIG9uIGVhY2ggdGljayBvZiB0aGUgaW50ZXJ2YWwuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBnZXROZXh0RGVsYXkgQSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm5cbiAqIHRoZSBuZXh0IGRlbGF5IGluIHRoZSBpbnRlcnZhbCBzZXJpZXMuXG4gKiBAcGFyYW0gey4uLmFueX0gYXJncyBBIGxpc3Qgb2YgYXJndW1lbnRzIHRvIHBhc3MgdG8gYGNhbGxiYWNrYCBvbiBlYWNoIGludGVydmFsIGludm9jYXRpb24uXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBBIHJlZmVyZW5jZSB0byB0aGUgdGltZXJzIHRoaXMgZHluYW1pYyBpbnRlcnZhbCBpcyB1c2luZyBhbmQgYSBmdW5jdGlvblxuICogdG8gY2xlYXIgdGhlIGR5bmFtaWMgaW50ZXJ2YWwgKGtleWVkIHJlc3BlY3RpdmVseSkuXG4gKiBAZXhwb3J0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXREeW5hbWljSW50ZXJ2YWwoY2FsbGJhY2ssIGdldE5leHREZWxheSwgLi4uYXJncykge1xuICBjb25zdCBnZXROZXh0VGltZW91dERlbGF5ID0gZ2V0TmV4dERlbGF5IGluc3RhbmNlb2YgQXJyYXlcbiAgICA/IGludGVydmFsQXJyYXlTY2hlZHVsZXIoWy4uLmdldE5leHREZWxheV0pXG4gICAgOiBjYXN0RnVuY3Rpb24oZ2V0TmV4dERlbGF5KTtcblxuICBjb25zdCByZWZlcmVuY2UgPSB7XG4gICAgY2FsbHM6IDAsXG4gICAgdGltZXJzOiBbXSxcbiAgICBjbGVhcmVkOiBmYWxzZSxcbiAgICBjbGVhcixcbiAgfTtcblxuICAoZnVuY3Rpb24gc2NoZWR1bGVOZXh0SW50ZXJ2YWwoKSB7XG4gICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZ2V0TmV4dFRpbWVvdXREZWxheSgpKTtcblxuICAgIC8vIFRoZSBpbnRlcnZhbCB3aWxsIHRlcm1pbmF0ZSBpZiBnaXZlbiBhIG5vbi1udW1lcmljXG4gICAgLy8gdmFsdWUsIE5hTiwgb3IgYSBuZWdhdGl2ZSBudW1iZXIuXG4gICAgaWYgKGludGVydmFsU2hvdWxkVGVybWluYXRlKGRlbGF5KSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVmZXJlbmNlLmNhbGxzKys7XG4gICAgICByZW1vdmVGcm9tQXJyYXkocmVmZXJlbmNlLnRpbWVycywgdGltZW91dCk7XG4gICAgICBzY2hlZHVsZU5leHRJbnRlcnZhbCgpO1xuICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSwgZGVsYXkpO1xuXG4gICAgcmVmZXJlbmNlLnRpbWVycy5wdXNoKHRpbWVvdXQpO1xuICB9KCkpO1xuXG4gIHJldHVybiByZWZlcmVuY2U7XG59XG5cbi8qKlxuICogQ2xlYXJzIGEgZHluYW1pYyBpbnRlcnZhbC5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZWZlcmVuY2UgVGhlIGludGVydmFsIHJlZmVyZW5jZSB0byBjbGVhci5cbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckR5bmFtaWNJbnRlcnZhbChyZWZlcmVuY2UpIHtcbiAgaWYgKHJlZmVyZW5jZSAmJiB0eXBlb2YgcmVmZXJlbmNlLmNsZWFyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVmZXJlbmNlLmNsZWFyKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0cztcbiJdfQ==
