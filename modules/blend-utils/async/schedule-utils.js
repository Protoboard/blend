"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Debounces specified function with the specified delay. Passed function
   * will be invoked when `delay` milliseconds have elapsed after the last
   * call to the returned function.
   * @param {function} originalFunction
   * @param {number} [delay=0]
   * @returns {function}
   */
  debounce: function (originalFunction, delay) {
    delay = delay || 0;

    var deferred = $utils.Deferred.create(),
        timer;

    return function debounced() {
      // (re-)starting timer
      if (timer) {
        timer.clearTimer();
      }
      timer = $utils.setTimeout(delay);
      timer.timerPromise.then(function () {
        deferred.resolve(originalFunction.apply(null, debounced.args));
      }, function () {
        deferred.reject();
      });

      debounced.args = arguments;
      debounced.timer = timer;

      return deferred.promise;
    };
  },

  /**
   * @param {function} originalFunction
   * @param {number} delay
   * @returns {function}
   */
  throttle: function (originalFunction, delay) {
    delay = delay || 0;

    var deferred = $utils.Deferred.create(),
        callCount,
        timer;

    return function throttled() {
      if (!timer) {
        callCount = 1;
        timer = $utils.setInterval(delay);
        timer.timerPromise.then(
            null,
            function () {
              deferred.reject();
            },
            function () {
              if (callCount > 0) {
                deferred.notify(originalFunction.apply(null, throttled.args));
                callCount = 0;
              }
            });
        throttled.timer = timer;
      } else {
        callCount++;
      }

      throttled.args = arguments;

      return deferred.promise;
    };
  }
});