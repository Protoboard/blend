"use strict";

/**
 * Abstract base class for function call schedulers.
 * @class $utils.Scheduler
 */
$utils.Scheduler = $oop.getClass('$utils.Scheduler')
.define(/** @lends $utils.Scheduler# */{
  /**
   * Registry of unique argument lists passed to the Scheduler.
   * @member {Array} $utils.Scheduler#scheduledArguments
   */

  /**
   * Registry of `Timer` instances associated with corresponding argument
   * lists in `scheduledArguments`.
   * @member {$utils.Timer[]} $utils.Scheduler#scheduleTimers
   */

  /**
   * Allows external control over completing or stopping scheduled calls.
   * @member {$utils.Deferred} $utils.Scheduler#schedulerDeferred
   */

  /** @ignore */
  spread: function () {
    this.scheduledArguments = [];
    this.scheduleTimers = [];
    this.schedulerDeferred = $utils.Deferred.create();
  },

  /**
   * @param {Array|Arguments} args
   * @protected
   */
  _getTimerIndexByArguments: function (args) {
    var scheduledCallbackArguments = this.scheduledArguments,
        scheduledCallbackArgumentsCount = scheduledCallbackArguments.length,
        argCount = args.length,
        i, matchesArguments,
        j;

    for (i = 0; i < scheduledCallbackArgumentsCount; i++) {
      matchesArguments = true;
      for (j = 0; j < argCount; j++) {
        if (scheduledCallbackArguments[i][j] !== args[j]) {
          matchesArguments = false;
          break;
        }
      }

      if (matchesArguments) {
        return i;
      }
    }
  },

  /**
   * @returns {Number}
   * @protected
   */
  _getTimerCount: function () {
    return this.scheduleTimers.length;
  },

  /**
   * @param {$utils.Timer} timer
   * @param {Array|Arguments} args
   * @protected
   */
  _addTimerForArguments: function (timer, args) {
    this.scheduledArguments.push(args);
    this.scheduleTimers.push(timer);
  },

  /**
   * @param {$utils.Timer} timer
   * @param {number} timerIndex
   * @protected
   */
  _setTimerAtIndex: function (timer, timerIndex) {
    this.scheduleTimers[timerIndex] = timer;
  },

  /**
   * @param {number} timerIndex
   * @returns {$utils.Scheduler}
   * @protected
   */
  _clearTimerAtIndex: function (timerIndex) {
    // todo Investigate a good middle ground bw. cpu vs. memory footprint.
    this.scheduleTimers[timerIndex] = undefined;
  }

  /**
   * Schedules a call passing the specified arguments.
   * @method $utils.Scheduler#schedule
   * @param {...*} arg
   * @returns {$utils.Promise}
   * @abstract
   */
});
