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
$utils.Deferred = $oop.createClass('$utils.Deferred')
.define(/** @lends $utils.Deferred# */{
  /** @ignore */
  init: function () {
    /**
     * Promise associated  with `Deferred`. Provides access to "resolve",
     * "reject", and "progress" events.
     * @member {$utils.Promise} $utils.Deferred#promise
     */
    this.promise = $utils.Promise.create();
  },

  /**
   * Resolves promise, invoking success handlers associated with `promise`.
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
   * Rejects promise, invoking failure handlers associated with `promise`.
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
   * Notifies promise of progress, invoking progress handlers associated with
   * `promise`.
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
})
.build();
