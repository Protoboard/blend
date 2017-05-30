"use strict";

/**
 * @function $utils.Timer.create
 * @param {number} timerId
 * @returns {$utils.Timer}
 */

/**
 * @class $utils.Timer
 */
$utils.Timer = $oop.getClass('$utils.Timer')
    .define(/** @lends $utils.Timer# */{
        /**
         * @param {number} timerId
         * @ignore
         */
        init: function (timerId) {
            $assert.isNumber(timerId, "Invalid timer ID");

            this.elevateMethods(
                'onTimerPromiseResolve',
                'onTimerPromiseReject');

            /**
             * ID associated with timer.
             * @member {number} $utils.Timer#_timerId
             * @protected
             */
            this._timerId = timerId;

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
         * Stops the timer.
         * Clearing an already cleared interval timer will have no effect.
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
