"use strict";

/**
 * @interface $api.RequestDispatcher
 */
$api.RequestDispatcher = $oop.getClass('$api.RequestDispatcher')
.define(/** @lends $api.RequestDispatcher */{
  /**
   * Dispatches a request.
   * @param {$api.Request} request
   * @returns {$utils.Promise}
   */
  dispatchRequest: function (request) {}
});
