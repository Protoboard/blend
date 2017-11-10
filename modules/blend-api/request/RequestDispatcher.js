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
$api.RequestDispatcher = $oop.getClass('$api.RequestDispatcher')
.implement($oop.getClass('$api.Dispatchable'))
.define(/** @lends $api.RequestDispatcher# */{
  /**
   * @member {$api.Request} $api.RequestDispatcher#request
   */

  /**
   * @memberOf $api.RequestDispatcher
   * @param {$api.Request} request
   * @returns {$api.RequestDispatcher}
   */
  fromRequest: function (request) {
    return this.create({request: request});
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.request, $api.Request, "Invalid request");
  },

  /**
   * @returns {$utils.Promise}
   */
  dispatch: function () {}
});

$oop.getClass('$api.Request')
.delegate(/** @lends $api.Request# */{
  /**
   * @returns {$api.Request}
   */
  toRequestDispatcher: function () {
    return $api.RequestDispatcher.create({request: this});
  }
});
