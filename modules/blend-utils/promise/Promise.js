"use strict";

/**
 * Not to be used by other than $utils.Deferred
 * @memberOf $utils~
 * @function $utils.Promise.create
 * @returns {$utils.Promise}
 * @ignore
 */

/**
 * Non-interactive synchronous implementation of Promises/A.
 * @see http://wiki.commonjs.org/wiki/Promises/A
 * @see $utils.Deferred
 * @class $utils.Promise
 * @implements $utils.Thenable
 */
$utils.Promise = $oop.getClass('$utils.Promise')
.implement($oop.getClass('$utils.Thenable'))
.define(/** @lends $utils.Promise# */{
  /**
   * Current state of the promise. Possible values: "pending",
   * "fulfilled", or "rejected".
   * @member {string} $utils.Promise#promiseState
   */

  /**
   * Argument list passed to the `resolve` or `reject` of the corresponding
   * `Deferred`.
   * @member {Array} $utils.Promise#deferredArguments
   */

  /**
   * Argument list passed to the `notify` of the corresponding `Deferred`.
   * @member {Arguments[]} $utils.Promise#notificationArguments
   */

  /**
   * List of callbacks to be invoked on resolution.
   * @member {function[]} $utils.Promise#successHandlers
   */

  /**
   * List of callbacks to be invoked on rejection.
   * @member {function[]} $utils.Promise#failureHandlers
   */

  /**
   * List of callbacks to be invoked on notification.
   * @member {function[]} $utils.Promise#progressHandlers
   */

  /** @ignore */
  init: function () {
    this.promiseState = $utils.PROMISE_STATE_PENDING;
    this.notificationArguments = [];
    this.successHandlers = [];
    this.failureHandlers = [];
    this.progressHandlers = [];
  },

  /**
   * Assigns event handlers to the `Promise`, to be called on resolution,
   * rejection, or notification of the corresponding `Deferred`.
   * @param {function} [successHandler]
   * @param {function} [failureHandler]
   * @param {function} [progressHandler]
   * @returns {$utils.Promise}
   */
  then: function (successHandler, failureHandler, progressHandler) {
    if (successHandler) {
      switch (this.promiseState) {
      case $utils.PROMISE_STATE_FULFILLED:
        successHandler.apply(this, this.deferredArguments);
        break;
      case $utils.PROMISE_STATE_PENDING:
        this.successHandlers.push(successHandler);
        break;
      }
    }

    if (failureHandler) {
      switch (this.promiseState) {
      case $utils.PROMISE_STATE_REJECTED:
        failureHandler.apply(this, this.deferredArguments);
        break;
      case $utils.PROMISE_STATE_PENDING:
        this.failureHandlers.push(failureHandler);
        break;
      }
    }

    if (progressHandler) {
      if (this.promiseState === $utils.PROMISE_STATE_PENDING) {
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
   * Returns a promise that is fulfilled when all passed promises are
   * fulfilled, or fails when one of them fails. Invokes progress on each
   * promise' progress, and when individual promises are fulfilled. The order
   * of invoking the returned promise and the original promises' handlers is
   * not deterministic.
   * @param {$utils.Promise[]} promises A list of promises. Non-promises will
   *     be treated as resolved promises.
   * @returns {$utils.Promise}
   * @memberOf $utils.Promise
   */
  when: function (promises) {
    var deferred = $utils.Deferred.create(),
        promiseCount = promises.length,
        deferredArguments = [];

    function tryResolving() {
      deferredArguments.push(arguments);

      if (--promiseCount === 0) {
        // resolving last promise with aggregate
        deferred.resolve(deferredArguments);
      } else {
        // notifying aggregate promise of fulfilment
        deferred.notify.apply(deferred, arguments);
      }
    }

    if (promiseCount) {
      promises.forEach(function (promise) {
        if (promise && typeof promise.then === 'function') {
          // latching on to next promise in array
          promise.then(
              tryResolving,
              deferred.reject.bind(deferred));
        } else {
          // passing non-promise to resolution
          tryResolving(promise);
        }
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }
});

$oop.copyProperties($utils, /** @lends $utils */{
  /** @constant */
  PROMISE_STATE_PENDING: 'pending',

  /** @constant */
  PROMISE_STATE_FULFILLED: 'fulfilled',

  /** @constant */
  PROMISE_STATE_REJECTED: 'rejected'
});
