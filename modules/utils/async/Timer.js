/* global $assert, $oop */
"use strict";

/**
 * @function $utils.Timer.create
 * @param {number} timerId
 * @returns {$utils.Timer}
 */

/**
 * @class $utils.Timer
 */
exports.Timer = $oop.getClass('$utils.Timer')
    .define(/** @lends $utils.Timer# */{
        /**
         * @param {number} timerId
         * @ignore
         */
        init: function (timerId) {
            $assert.isNumber(timerId, "Invalid timer ID");

            /**
             * ID associated with timer.
             * @type {number}
             */
            this.timerId = timerId;

            var timerDeferred = exports.Deferred.create();

            /**
             * @type {$utils.Deferred}
             */
            this.timerDeferred = timerDeferred;

            /**
             * @type {$utils.Promise}
             */
            this.timerPromise = timerDeferred.promise;
        }

        /**
         * @function $utils.Timer#clearTimer
         * @returns {$utils.Timer}
         * @abstract
         */
    });
