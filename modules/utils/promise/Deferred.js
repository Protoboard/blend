/* global $assert, $oop */
"use strict";

/**
 * @function $utils.Deferred.create
 * @returns {$utils.Deferred}
 */

/**
 * Q-style deferred controlling the corresponding Promises/A implementation.
 * @see $utils.Promise
 * @class $utils.Deferred
 */
exports.Deferred = $oop.getClass('$utils.Deferred')
    .define(/** @lends $utils.Deferred# */{
        /** @ignore */
        init: function () {
            /**
             * @type {$utils.Promise}
             */
            this.promise = exports.Promise.create();
        },

        /**
         * @returns {$utils.Deferred}
         */
        resolve: function () {
            var deferredArguments = arguments,
                promise = this.promise;

            if (promise.promiseState === exports.PROMISE_STATE_UNFULFILLED) {
                // setting state
                promise.promiseState = exports.PROMISE_STATE_FULFILLED;

                // storing arguments
                promise.deferredArguments = deferredArguments;

                // calling success handlers
                promise.successHandlers.forEach(function (handler) {
                    handler.apply(promise, deferredArguments);
                });
            }

            return this;
        },

        /**
         * @returns {$utils.Deferred}
         */
        reject: function () {
            var deferredArguments = arguments,
                promise = this.promise;

            if (promise.promiseState === exports.PROMISE_STATE_UNFULFILLED) {
                // setting state
                promise.promiseState = exports.PROMISE_STATE_FAILED;

                // storing arguments
                promise.deferredArguments = deferredArguments;

                // calling failure handlers
                promise.failureHandlers.forEach(function (handler) {
                    handler.apply(promise, deferredArguments);
                });
            }

            return this;
        },

        /**
         * @returns {$utils.Deferred}
         */
        notify: function () {
            var args = arguments,
                promise = this.promise;

            if (promise.promiseState === exports.PROMISE_STATE_UNFULFILLED) {
                // storing arguments
                promise.notificationArguments.push(args);

                // calling progress handlers
                promise.progressHandlers.forEach(function (handler) {
                    handler.apply(promise, args);
                });
            }

            return this;
        }
    });
