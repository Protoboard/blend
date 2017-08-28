"use strict";

/**
 * @function $utils.Throttler.create
 * @param {Object} [properties]
 * @param {number} [properties.throttleDelay] Exact time between dispatched
 * calls in milliseconds.
 * @returns {$utils.Throttler}
 */

/**
 * Throttles functions. Throttling allows only one call to go through in a
 * specified interval.
 * @class $utils.Throttler
 * @extends $utils.Scheduler
 */
$utils.Throttler = $oop.getClass('$utils.Throttler')
.mix($oop.getClass('$utils.Scheduler'))
.define(/** @lends $utils.Throttler# */{
  /**
   * Exact time between dispatched calls in milliseconds.
   * @member {number} $utils.Throttler#throttleDelay
   */

  /**
   * Registry of call counts associated with corresponding argument lists in
   * `scheduledArguments`.
   * @member {number[]} $utils.Throttler#throttledCallCounts
   */

  /** @ignore */
  spread: function () {
    this.throttleDelay = this.throttleDelay || 0;
    this.throttledCallCounts = [];
  },

  /** @ignore */
  init: function () {
    $assert.isNumber(this.throttleDelay, "Invalid throttle delay");

    this.elevateMethods(
        'onTimerTick',
        'onTimerCancel');
  },

  /**
   * @param {$utils.Timer} timer
   * @param {Array|Arguments} args
   * @protected
   */
  _addTimerForArguments: function (timer, args) {
    this.throttledCallCounts.push(0);
  },

  /**
   * @param {...*} arg
   * @returns {$utils.Promise}
   */
  schedule: function (arg) {
    // looking up arguments in list
    var callbackArguments = slice.call(arguments),
        timeoutArguments,
        timerIndex = this._getTimerIndexByArguments(callbackArguments),
        timer;

    if (timerIndex === undefined) {
      timerIndex = this._getTimerCount();
      timeoutArguments = [this.throttleDelay].concat(callbackArguments);

      // starting timer
      timer = $utils.setInterval.apply($utils, timeoutArguments);
      timer.timerPromise.then(
          null,
          this.onTimerCancel,
          this.onTimerTick);

      // adding arg list, timer, & count
      this._addTimerForArguments(timer, callbackArguments);
    }

    // registering call
    this.throttledCallCounts[timerIndex]++;

    return this.schedulerDeferred.promise;
  },

  /** @ignore */
  onTimerTick: function () {
    // checking whether a call is registered
    var timerIndex = this._getTimerIndexByArguments(arguments),
        throttledCallCounts = this.throttledCallCounts,
        callCount = throttledCallCounts[timerIndex];

    if (callCount > 0) {
      // scheduler was called since last tick

      // resetting call count
      throttledCallCounts[timerIndex] = 0;

      // notifying promise
      var schedulerDeferred = this.schedulerDeferred;
      schedulerDeferred.notify.apply(schedulerDeferred, arguments);
    }
  },

  /** @ignore */
  onTimerCancel: function () {
    // resetting timer in registry
    var timerIndex = this._getTimerIndexByArguments(arguments);
    this._clearTimerAtIndex(timerIndex);
  }
});
