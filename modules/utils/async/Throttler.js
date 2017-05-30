"use strict";

/**
 * @function $utils.Throttler.create
 * @param {number} [interval] Time interval between dispatched calls.
 * @returns {$utils.Throttler}
 */

/**
 * Throttles functions.
 * Throttling allows only one call to go through in a specified interval.
 * @class $utils.Throttler
 * @extends $utils.Scheduler
 */
$utils.Throttler = $oop.getClass('$utils.Throttler')
    .extend($oop.getClass('$utils.Scheduler'))
    .define(/** @lends $utils.Throttler# */{
        /** @ignore */
        init: function (interval) {
            $assert.isNumberOptional(interval, "Invalid throttle interval");

            this.elevateMethods(
                'onTimerTick',
                'onTimerCancel');

            /**
             * @member {number} $utils.Throttler#_throttleInterval
             * @private
             */
            this._throttleInterval = interval || 0;

            /**
             * @member {number[]} $utils.Throttler#_throttledCallCounts
             * @private
             */
            this._throttledCallCounts = [];
        },

        /**
         * @param {$utils.Timer} timer
         * @param {Array|Arguments} args
         * @protected
         */
        _addTimerForArguments: function (timer, args) {
            this._throttledCallCounts.push(0);
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
                timeoutArguments = [this._throttleInterval].concat(callbackArguments);

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
            this._throttledCallCounts[timerIndex]++;

            return this.schedulerDeferred.promise;
        },

        /** @ignore */
        onTimerTick: function () {
            // checking whether a call is registered
            var timerIndex = this._getTimerIndexByArguments(arguments),
                throttledCallCounts = this._throttledCallCounts,
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
