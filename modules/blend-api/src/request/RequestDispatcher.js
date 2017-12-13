"use strict";

/**
 * @function $api.RequestDispatcher.create
 * @param {Object} properties
 * @param {$api.Request} properties.request
 * @returns {$api.RequestDispatcher}
 */

/**
 * Dispatches a request to a remote resource.
 * @class $api.RequestDispatcher
 * @implements $api.Dispatchable
 */
$api.RequestDispatcher = $oop.createClass('$api.RequestDispatcher')
.implement($api.Dispatchable)
.define(/** @lends $api.RequestDispatcher# */{
  /**
   * Request to be dispatched.
   * @member {$api.Request} $api.RequestDispatcher#request
   */

  /**
   * @memberOf $api.RequestDispatcher
   * @param {$api.Request} request
   * @param {Object} [properties]
   * @returns {$api.RequestDispatcher}
   */
  fromRequest: function (request, properties) {
    return this.create({request: request}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.request, $api.Request, "Invalid request");
  },

  /**
   * Dispatches associated request.
   * @returns {$utils.Promise}
   */
  dispatch: function () {
    var activeRequestIndex = $api.ActiveRequestIndex.create();
    return activeRequestIndex.getPromiseForRequest(this.request);
  }
})
.build();

$api.Request
.delegate(/** @lends $api.Request# */{
  /**
   * @param {Object} [properties]
   * @returns {$api.Request}
   */
  toRequestDispatcher: function (properties) {
    return $api.RequestDispatcher.create({request: this}, properties);
  }
});
