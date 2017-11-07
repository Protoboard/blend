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
      var args = slice.call(arguments);

      // (re-)starting timer
      if (timer) {
        timer.clearTimer();
      }
      timer = $utils.setTimeout(delay);
      timer.timerPromise.then(function () {
        deferred.resolve(originalFunction.apply(null, args));
      }, function () {
        deferred.reject();
      });

      debounced.timer = timer;

      return deferred.promise;
    };
  }
});