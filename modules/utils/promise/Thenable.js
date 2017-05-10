/* global $assert, $oop */
"use strict";

/**
 * For "thenables" outside of Giant, it's used in documentation only.
 * (Ie. for promises of external libraries, eg. Q, jQuery, ES6, etc.)
 * @interface $utils.Thenable
 */
exports.Thenable = $oop.getClass('$utils.Thenable')
    .define(/** @lends $utils.Thenable# */{
        /**
         * @param {function} successHandler
         * @param {function} failureHandler
         * @param {function} progressHandler
         * @returns {$utils.Thenable}
         */
        then: function (successHandler, failureHandler, progressHandler) {
        }
    });

$oop.copyProperties($assert, /** @lends $assert# */{
    /**
     * @param {object} expr
     * @param {string} [message]
     * @returns {$assert}
     */
    isThenable: function (expr, message) {
        return $assert.assert(
            expr instanceof Object && typeof expr.then === 'function',
            message);
    },

    /**
     * @param {object} [expr]
     * @param {string} [message]
     * @returns {$assert}
     */
    isThenableOptional: function (expr, message) {
        return $assert.assert(
            typeof expr === 'undefined' ||
            expr instanceof Object && typeof expr.then === 'function',
            message);
    }
});
