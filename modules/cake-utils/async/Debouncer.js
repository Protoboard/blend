"use strict";

/**
 * @function $utils.Debouncer.create
 * @param {Object} [properties]
 * @param {number} [properties.debounceDelay] Minimum time between
 * dispatched calls in milliseconds.
 * @returns {$utils.Debouncer}
 */

/**
 * @class $utils.Debouncer
 * @extends $utils.Scheduler
 */
$utils.Debouncer = $oop.getClass('$utils.Debouncer')
.mix($oop.getClass('$utils.Scheduler'))
.define(/** @lends $utils.Debouncer# */{
  /**
   * Minimum time between dispatched calls in milliseconds.
   * @member {number} $utils.Debouncer#debounceDelay
   */

  /** @ignore */
  spread: function () {
    this.debounceDelay = this.debounceDelay || 0;
  },

  /** @ignore */
  init: function () {
    $assert.isNumber(this.debounceDelay, "Invalid debounce delay");

    this.elevateMethods(
        'onTimerEnd',
        'onTimerCancel');
  },

  /**
   * @param {...*} arg
   * @returns {$utils.Promise}
   */
  schedule: function (arg) {
    // looking up arguments in list
    var callbackArguments = slice.call(arguments),
        timeoutArguments = [this.debounceDelay].concat(callbackArguments),
        timerIndex = this._getTimerIndexByArguments(callbackArguments),
        timer;

    // (re-)starting timer
    timer = $utils.setTimeout.apply($utils, timeoutArguments);
    timer.timerPromise.then(
        this.onTimerEnd,
        this.onTimerCancel);

    if (timerIndex === undefined) {
      // adding arg list & timer
      this._addTimerForArguments(timer, callbackArguments);
    } else {
      // replacing timer in registry
      this._clearTimerAtIndex(timerIndex);
      this._setTimerAtIndex(timerIndex, timer);
    }

    return this.schedulerDeferred.promise;
  },

  /** @ignore */
  onTimerEnd: function () {
    // timer expired

    // resetting affected timer
    var timerIndex = this._getTimerIndexByArguments(arguments);
    this._clearTimerAtIndex(timerIndex);

    // notifying promise
    var schedulerDeferred = this.schedulerDeferred;
    schedulerDeferred.notify.apply(schedulerDeferred, arguments);
  },

  /** @ignore */
  onTimerCancel: function () {
    // timer was canceled by user

    // resetting affected timer
    var timerIndex = this._getTimerIndexByArguments(arguments);
    this._clearTimerAtIndex(timerIndex);
  }
});
