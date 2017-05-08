/* global $assert, $oop */
"use strict";

/**
 * @function $utils.Timeout.create
 * @param {number} timerId
 * @returns {$utils.Timeout}
 */

/**
 * Represents a timeout ID with promise capabilities.
 * Allows to cancel a timeout via window.clearTimeout.
 * @class $utils.Timeout
 * @extends $utils.Timer
 */
exports.Timeout = $oop.getClass('$utils.Timeout')
    .include($oop.getClass('$utils.Timer'))
    .define(/** @lends $utils.Timeout# */{
        /**
         * Clears the timeout ID, and rejects the promise.
         * Clearing an already cleared timeout will have no effect.
         * @returns {$utils.Timeout}
         */
        clearTimer: function () {
            var deferred = this.timerDeferred;

            if (deferred.promise.status === exports.PROMISE_STATE_UNFULFILLED) {
                clearTimeout(this.timerId);
                deferred.reject.apply(deferred, arguments);
            }

            return this;
        }
    });

$oop.copyProperties(Number.prototype, /** @lends Number# */{
    /**
     * Converts `Number` to `Timeout` instance.
     * @returns {$utils.Timeout}
     */
    toTimeout: function () {
        return exports.Timeout.create(this.valueOf());
    }
});
