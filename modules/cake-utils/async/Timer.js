"use strict";

/**
 * @function $utils.Timer.create
 * @param {Object} properties]
 * @param {number} properties.timerId
 * @returns {$utils.Timer}
 */

/**
 * Manages state for timed function calls.
 * @class $utils.Timer
 */
$utils.Timer = $oop.getClass('$utils.Timer')
.define(/** @lends $utils.Timer# */{
  /**
   * ID associated with timer.
   * @member {number} $utils.Timer#timerId
   */

  /**
   * Allows external control of the timer.
   * @member {$utils.Deferred} $utils.Timer#timerDeferred
   * @see $utils.Timer#clearTimer
   */

  /**
   * Resolves when the timer completes as planned. Rejects when the timer
   * gets interrupted.
   * @member {$utils.Promise} $utils.Timer#timerPromise
   */

  /** @ignore */
  spread: function () {
    var timerDeferred = $utils.Deferred.create();

    this.timerDeferred = timerDeferred;
    this.timerPromise = timerDeferred.promise;
  },

  /** @ignore */
  init: function () {
    $assert.isNumber(this.timerId, "Invalid timer ID");

    this.elevateMethods(
        'onTimerPromiseResolve',
        'onTimerPromiseReject');

    this.timerPromise.then(
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
