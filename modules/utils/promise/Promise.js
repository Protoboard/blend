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
    /** @ignore */
    init: function () {
      /**
       * @member {string} $utils.Promise#promiseState
       */
      this.promiseState = $utils.PROMISE_STATE_PENDING;

      /**
       * @member {Array} $utils.Promise#deferredArguments
       */
      this.deferredArguments = undefined;

      /**
       * @member {Arguments[]} $utils.Promise#notificationArguments
       */
      this.notificationArguments = [];

      /**
       * @member {function[]} $utils.Promise#successHandlers
       */
      this.successHandlers = [];

      /**
       * @member {function[]} $utils.Promise#failureHandlers
       */
      this.failureHandlers = [];

      /**
       * @member {function[]} $utils.Promise#progressHandlers
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
     * @param {...$utils.Promise|*} promise A list of promises. Non-promises
     *   will be treated as resolved promises.
     * @returns {$utils.Promise}
     * @memberOf $utils.Promise
     * @todo Change to accept array for perf reasons
     */
    when: function (promise) {
      var deferred = $utils.Deferred.create(),
        promises = Array.prototype.slice.call(arguments),
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

$oop.copyProperties($assert, /** @lends $assert# */{
  /**
   * @param {$utils.Promise} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isPromise: function (expr, message) {
    return $assert.assert(
      $utils.Promise.isIncludedBy(expr), message);
  },

  /**
   * @param {$utils.Promise} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isPromiseOptional: function (expr, message) {
    return $assert.assert(
      expr === undefined ||
      $utils.Promise.isIncludedBy(expr), message);
  }
});
