/* global $assert, $oop, slice */
"use strict";

/**
 * @function $utils.Throttler.create
 * @param {number} [delay] Delay between dispatched calls.
 * @returns {$utils.Throttler}
 */

/**
 * Throttles functions.
 * Throttling allows only one call to go through in a specified interval.
 * @class $utils.Throttler
 * @extends $utils.Scheduler
 */
exports.Throttler = $oop.getClass('$utils.Throttler')
    .include($oop.getClass('$utils.Scheduler'))
    .define(/** @lends $utils.Throttler# */{
        /** @ignore */
        init: function () {
            this.elevateMethods(
                'onTimerTick',
                'onTimerCancel');

            /**
             * @type {number[]}
             */
            this.throttledCallCounts = [];
        },

        /**
         * @param {...*} arg
         * @returns {$utils.Promise}
         */
        schedule: function (arg) {
            // looking up arguments in list
            var scheduleTimers,
                throttledCallCounts = this.throttledCallCounts,
                callbackArguments = slice.call(arguments),
                timeoutArguments,
                timerIndex = this._getTimerIndexByArguments(callbackArguments),
                timer;

            if (typeof timerIndex === 'undefined') {
                scheduleTimers = this.scheduleTimers;
                timerIndex = scheduleTimers.length;
                timeoutArguments = [this.scheduleDelay].concat(callbackArguments);

                // starting timer
                timer = exports.setInterval.apply(exports, timeoutArguments);
                timer.timerPromise.then(
                    null,
                    this.onTimerCancel,
                    this.onTimerTick);

                // adding arg list, timer, & count
                this.scheduledArguments.push(callbackArguments);
                scheduleTimers.push(timer);
                throttledCallCounts.push(0);
            }

            // registering call
            throttledCallCounts[timerIndex]++;

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
