/* global $assert, $oop */
"use strict";

/**
 * @function $utils.Interval.create
 * @param {number} timerId
 * @returns {$utils.Interval}
 */

/**
 * Represents an interval ID with promise capabilities.
 * Allows to cancel an interval timer via window.clearInterval.
 * @class $utils.Interval
 * @extends $utils.Timer
 */
exports.Interval = $oop.getClass('')
    .include($oop.getClass('$utils.Timer'))
    .define(/** @lends $utils.Interval# */{
        /**
         * Clears the interval ID, and rejects the promise.
         * Clearing an already cleared interval timer will have no effect.
         * @returns {$utils.Interval}
         */
        clearTimer: function () {
            var deferred = this.timerDeferred;

            if (deferred.promise.promiseState === exports.PROMISE_STATE_UNFULFILLED) {
                clearInterval(this.timerId);
                deferred.reject.apply(deferred, arguments);
            }

            return this;
        }
    });

$oop.copyProperties(Number.prototype, /** @lends Number# */{
    /**
     * Converts `Number` to `Interval` instance.
     * @returns {$utils.Interval}
     */
    toInterval: function () {
        return exports.Interval.create(this.valueOf());
    }
});
