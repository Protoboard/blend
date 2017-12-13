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
 * @todo Check in Node.js
 */
$utils.Timer = $oop.createClass('$utils.Timer')
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

  /**
   * @memberOf $utils.Timer
   * @param {number} timerId
   * @param {Object} [properties]
   * @returns {$utils.Timer}
   */
  fromTimerId: function (timerId, properties) {
    return this.create({timerId: timerId}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isDefined(this.timerId, "Invalid timer ID");

    var timerDeferred = $utils.Deferred.create(),
        timerPromise = timerDeferred.promise;

    this.timerDeferred = timerDeferred;
    this.timerPromise = timerPromise;

    this.elevateMethods(
        'onTimerPromiseResolve',
        'onTimerPromiseReject');

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
})
.build();
