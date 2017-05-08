/* global $assert, $oop */
"use strict";

/**
 * Do not create Promise instances directly. Promises are only to be used in connection with Deferred instances.
 * @function $utils.Promise.create
 * @returns {$utils.Promise}
 * @ignore
 */

/**
 * Non-interactive synchronous implementation of Promises/A.
 * @link http://wiki.commonjs.org/wiki/Promises/A
 * @class $utils.Promise
 * @implements $utils.Thenable
 */
exports.Promise = $oop.getClass('$utils.Promise')
    .implement($oop.getClass('$utils.Thenable'))
    .define(/** @lends $utils.Promise# */{
        /** @ignore */
        init: function () {
            /**
             * @type {string}
             */
            this.status = exports.PROMISE_STATE_UNFULFILLED;

            /**
             * @type {Array}
             */
            this.deferredArguments = undefined;

            /**
             * @type {Arguments[]}
             */
            this.notificationArguments = [];

            /**
             * @type {function[]}
             */
            this.successHandlers = [];

            /**
             * @type {function[]}
             */
            this.failureHandlers = [];

            /**
             * @type {function[]}
             */
            this.progressHandlers = [];
        },

        /**
         * @param {function} [successHandler]
         * @param {function} [failureHandler]
         * @param {function} [progressHandler]
         * @returns {$utils.Promise}
         */
        then: function (successHandler, failureHandler, progressHandler) {
            if (successHandler) {
                switch (this.status) {
                case exports.PROMISE_STATE_FULFILLED:
                    successHandler.apply(this, this.deferredArguments);
                    break;
                case exports.PROMISE_STATE_UNFULFILLED:
                    this.successHandlers.push(successHandler);
                    break;
                }
            }

            if (failureHandler) {
                switch (this.status) {
                case exports.PROMISE_STATE_FAILED:
                    failureHandler.apply(this, this.deferredArguments);
                    break;
                case exports.PROMISE_STATE_UNFULFILLED:
                    this.failureHandlers.push(failureHandler);
                    break;
                }
            }

            if (progressHandler) {
                if (this.status === exports.PROMISE_STATE_UNFULFILLED) {
                    // adding progress handler to list of handlers
                    this.progressHandlers.push(progressHandler);

                    // passing previous notifications to new handler
                    this.notificationArguments.forEach(function (args) {
                        progressHandler.apply(this, args);
                    });
                }
            }

            return this;
        },

        /**
         * Returns a promise that is fulfilled when all passed promises are fulfilled,
         * or fails when one of them fails. Invokes progress on each promise' progress,
         * and when individual promises are fulfilled.
         * The order of invoking the returned promise and the original promises' handlers
         * is not deterministic.
         * @param {...$utils.Promise|*} promise A list of promises. Non-promises will be
         * treated as resolved promises.
         * @returns {$utils.Promise}
         * @memberOf $utils.Promise
         */
        when: function (promise) {
            var deferred = exports.Deferred.create(),
                promises = Array.prototype.slice.call(arguments),
                promiseCount = promises.length;

            function tryResolving() {
                if (--promiseCount === 0) {
                    deferred.resolve.apply(deferred, arguments);
                } else {
                    // TODO: Diff bw. this and regular notify?
                    deferred.notify.apply(deferred, arguments);
                }
            }

            promises.forEach(function (promise) {
                if (exports.Promise.isIncludedBy(promise)) {
                    promise.then(
                        tryResolving,
                        deferred.reject.bind(deferred),
                        deferred.notify.bind(deferred));
                } else {
                    tryResolving(promise);
                }
            });

            return deferred.promise;
        }
    });

$oop.copyProperties(exports, /** @lends $utils */{
    /** @constant */
    PROMISE_STATE_UNFULFILLED: 'unfulfilled',

    /** @constant */
    PROMISE_STATE_FULFILLED: 'fulfilled',

    /** @constant */
    PROMISE_STATE_FAILED: 'failed'
});

$oop.copyProperties($assert, /** @lends $assert */{
    /**
     * @param {$utils.Promise} expr
     * @param {string} [message]
     * @returns {$assert}
     */
    isPromise: function (expr, message) {
        return $assert.assert(
            exports.Promise.isIncludedBy(expr), message);
    },

    /**
     * @param {$utils.Promise} [expr]
     * @param {string} [message]
     * @returns {$assert}
     */
    isPromiseOptional: function (expr, message) {
        return $assert.assert(
            typeof expr === 'undefined' ||
            exports.Promise.isIncludedBy(expr), message);
    }
});
