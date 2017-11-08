"use strict";

/**
 * @function $api.FunctionEndpoint.create
 * @param {Object} properties
 * @param {function} properties.callback
 * @param {function} [properties.endpointId] Must not be bound.
 * @returns {$api.FunctionEndpoint}
 */

/**
 * Identifies a function endpoint.
 * @class $api.FunctionEndpoint
 * @extends $api.Endpoint
 * @extends $utils.Identifiable
 */
$api.FunctionEndpoint = $oop.getClass('$api.FunctionEndpoint')
.blend($oop.getClass('$api.Endpoint'))
.blend($utils.Identifiable)
.define(/** @lends $api.FunctionEndpoint# */{
  /**
   * Function returning remote data.
   * @member {function} $api.FunctionEndpoint#callback
   */

  /**
   * @memberOf $api.FunctionEndpoint
   * @param {function} callback
   * @returns {$api.FunctionEndpoint}
   */
  fromFunction: function (callback) {
    return this.create({callback: callback});
  },

  /** @ignore */
  spread: function () {
    this.endpointId = this.endpointId || String(this.instanceId);
  },

  /** @ignore */
  init: function () {
    $assert.isFunction(this.callback, "Invalid endpoint callback");
  }
});

$oop.copyProperties(Function.prototype, /** @lends Function# */{
  /**
   * @returns {$api.HttpEndpoint}
   */
  toFunctionEndpoint: function () {
    return $api.FunctionEndpoint.fromFunction(this.valueOf());
  }
});
