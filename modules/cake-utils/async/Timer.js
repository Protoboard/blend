"use strict";

/**
 * @function $utils.Timer.create
 * @param {Object} properties]
 * @param {number} properties.timerId
 * @returns {$utils.Timer}
 */

/**
 * @class $utils.Timer
 */
$utils.Timer = $oop.getClass('$utils.Timer')
.define(/** @lends $utils.Timer# */{
  /**
   * ID associated with timer.
   * @member {number} $utils.Timer#timerId
   */

  /** @ignore */
  init: function () {
    $assert.isNumber(this.timerId, "Invalid timer ID");

    this.elevateMethods(
        'onTimerPromiseResolve',
        'onTimerPromiseReject');

    var timerDeferred = $utils.Deferred.create(),
        timerPromise = timerDeferred.promise;

    /**
     * @member {$utils.Deferred} $utils.Timer#timerDeferred
     */
    this.timerDeferred = timerDeferred;

    /**
     * @member {$utils.Promise} $utils.Timer#timerPromise
     */
    this.timerPromise = timerPromise;

    timerPromise.then(
        this.onTimerPromiseResolve,
        this.onTimerPromiseReject);
  },

  /**
   * Stops the timer. Clearing an already cleared interval timer will have no
   * effect.
   * @returns {$utils.Timer}
   */
  clearTimer: function () {
    var timerDeferred = this.timerDeferred;
    timerDeferred.reject.apply(timerDeferred, arguments);
    return this;
  },

  /** @ignore */
  onTimerPromiseResolve: function () {
    this.clearTimer();
  },

  /** @ignore */
  onTimerPromiseReject: function () {
    this.clearTimer();
  }
});
