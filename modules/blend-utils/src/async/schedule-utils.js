"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Debounces specified function with the specified delay. Passed function
   * will be invoked when `delay` milliseconds have elapsed after the last
   * call to the returned "debounced" function. The debounced function
   * returns a Promise which gets notified whenever `originalFunction` is
   * invoked, with its return value.
   * @param {function} originalFunction
   * @param {number} [delay=0]
   * @returns {function}
   */
  debounce: function (originalFunction, delay) {
    delay = delay || 0;

    var deferred = $utils.Deferred.create(),
        timer;

    function debounced() {
      // (re-)starting timer
      if (timer) {
        timer.clearTimer();
      }
      timer = $utils.setTimeout(delay);

      // updating last argument list and timer
      debounced.args = arguments;
      debounced.timer = timer;

      // setting up timer to call `originalFunction` and notify returned promise
      timer.timerPromise.then(
          function () {
            // invoking `originalFunction` and notifying returned promise
            deferred.notify(originalFunction.apply(null, debounced.args));
          }, function () {
            // timer rejected by user, rejecting returned promise
            deferred.reject();
          });

      return deferred.promise;
    }

    return debounced;
  },

  /**
   * Throttles specified function with the specified delay. Passed function
   * will be invoked once in every `delay` millisecond intervals where there
   * was at least one call to the returned "throttled" function. The throttled
   * function returns a Promise which gets notified whenever `originalFunction`
   * is invoked, with its return value. On multiple calls to the throttled
   * function within a single interval, arguments of the last one will be
   * passed to `originalFunction`.
   * @param {function} originalFunction
   * @param {number} delay
   * @returns {function}
   */
  throttle: function (originalFunction, delay) {
    delay = delay || 0;

    var deferred = $utils.Deferred.create(),
        callCount = 0,
        timer = $utils.setInterval(delay);

    function throttled() {
      // updating last arguments
      throttled.args = arguments;

      // increasing call count within interval
      callCount++;

      return deferred.promise;
    }

    // storing timer on throttled function
    throttled.timer = timer;

    // setting up timer to call `originalFunction` and notify returned promise
    timer.timerPromise.then(null,
        function () {
          // timer rejected by user, rejecting returned promise
          deferred.reject();
        },
        function () {
          if (callCount > 0) {
            // invoking `originalFunction` and notifying returned promise
            deferred.notify(originalFunction.apply(null, throttled.args));

            // interval over, resetting call count
            callCount = 0;
          }
        });

    return throttled;
  }
});