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
$utils.Deferred = $oop.getClass('$utils.Deferred')
    .define(/** @lends $utils.Deferred# */{
        /** @ignore */
        init: function () {
            /**
             * @member {$utils.Promise} $utils.Deferred#promise
             */
            this.promise = $utils.Promise.create();
        },

        /**
         * @returns {$utils.Deferred}
         */
        resolve: function () {
            var deferredArguments = arguments,
                promise = this.promise;

            if (promise.promiseState === $utils.PROMISE_STATE_PENDING) {
                // setting state
                promise.promiseState = $utils.PROMISE_STATE_FULFILLED;

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

            if (promise.promiseState === $utils.PROMISE_STATE_PENDING) {
                // setting state
                promise.promiseState = $utils.PROMISE_STATE_REJECTED;

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

            if (promise.promiseState === $utils.PROMISE_STATE_PENDING) {
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
