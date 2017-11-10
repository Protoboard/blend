"use strict";

/**
 * @function $api.Dispatcher.create
 * @param {Object} properties
 * @param {$api.Request} properties.request
 * @returns {$api.Dispatcher}
 */

/**
 * @class $api.Dispatcher
 */
$api.Dispatcher = $oop.getClass('$api.Dispatcher')
.define(/** @lends $api.Dispatcher# */{
  /**
   * @member {$api.Request} $api.Dispatcher#request
   */

  /**
   * @memberOf $api.Dispatcher
   * @param {$api.Request} request
   * @returns {$api.Dispatcher}
   */
  fromRequest: function (request) {
    return this.create({request: request});
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.request, $api.Request, "Invalid request");
  }

  /**
   * @function $api.Dispatcher#dispatch
   * @returns {$utils.Promise}
   */
});

$oop.getClass('$api.Request')
.delegate(/** @lends $api.Request# */{
  /**
   * @returns {$api.Request}
   */
  toDispatcher: function () {
    return $api.Dispatcher.create({request: this});
  }
});
