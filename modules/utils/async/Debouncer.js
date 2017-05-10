/* global $assert, $oop, slice */
"use strict";

/**
 * @function $utils.Debouncer.create
 * @param {function} callback Function to debounce
 * @returns {$utils.Debouncer}
 */

/**
 * @class $utils.Debouncer
 * @implements $utils.Scheduler
 */
exports.Debouncer = $oop.getClass('$utils.Debouncer')
    .implement($oop.getClass('$utils.Scheduler'))
    .define(/** @lends $utils.Debouncer# */{
        /**
         * @param {Array} args
         * @private
         */
        _getIndexByArguments: function (args) {
            var scheduledCallbackArguments = this.scheduledCallbackArguments,
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
         * @param {function} callback Function to debounce
         * @ignore
         */
        init: function (callback) {
            $assert.isFunction(callback, "Invalid debouncer callback");

            this.elevateMethods(
                'onTimerEnd',
                'onTimerCancel');

            /**
             * @type {function}
             */
            this.scheduledCallback = callback;

            /**
             * @type {Array}
             */
            this.scheduledCallbackArguments = [];

            /**
             * @type {$utils.Timeout[]}
             */
            this.schedulerTimers = [];

            /**
             * @type {$utils.Deferred}
             */
            this.schedulerDeferred = exports.Deferred.create();
        },

        /**
         * @param {number} delay
         * @param {...*} arg
         * @returns {$utils.Promise}
         */
        schedule: function (delay, arg) {
            // looking up arguments in list
            var callbackArguments = slice.call(arguments, 1),
                timerIndex = this._getIndexByArguments(callbackArguments),
                timer;

            if (typeof timerIndex === 'undefined') {
                // adding arg list & timer
                this.scheduledCallbackArguments.push(callbackArguments);
                timer = exports.setTimeout.apply(exports, arguments);
                timer.timerPromise.then(
                    this.onTimerEnd,
                    this.onTimerCancel);
                this.schedulerTimers.push(timer);
            } else {
                // re-starting timer
                this.schedulerTimers[timerIndex].clearTimer();
                timer = exports.setTimeout.apply(exports, arguments);
                timer.timerPromise.then(
                    this.onTimerEnd,
                    this.onTimerCancel);
                this.schedulerTimers[timerIndex] = timer;
            }

            return this.schedulerDeferred.promise;
        },

        /** @ignore */
        onTimerEnd: function () {
            // timer expired

            // removing affected timer & arguments
            var affectedTimerIndex = this._getIndexByArguments(slice.call(arguments));
            this.schedulerTimers.splice(affectedTimerIndex, 1);
            this.scheduledCallbackArguments.splice(affectedTimerIndex, 1);

            // notifying promise
            var schedulerDeferred = this.schedulerDeferred;
            schedulerDeferred.notify.apply(schedulerDeferred, arguments);
        },

        /** @ignore */
        onTimerCancel: function () {
            // timer was canceled either by user or by subsequent scheduling

            // removing affected timer
            var affectedTimerIndex = this._getIndexByArguments(slice.call(arguments));
            this.schedulerTimers[affectedTimerIndex] = undefined;
        }
    });

$oop.copyProperties(Function.prototype, /** @lends Function# */{
    /**
     * Converts `Function` to `Debouncer` instance.
     * @returns {$utils.Debouncer}
     */
    toDebouncer: function () {
        return exports.Debouncer.create(this.valueOf());
    }
});
