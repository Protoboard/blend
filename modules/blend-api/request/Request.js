"use strict";

/**
 * @function $api.Request.create
 * @param {Object} properties
 * @param {$api.Endpoint} properties.endpoint
 * @returns {$api.Request}
 */

/**
 * Bundles endpoint with parameters. These two together define a request to
 * be sent to a remote resource.
 * @class $api.Request
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @implements $api.Sendable
 * @todo Make Request abortable? (Implementation dependent)
 */
$api.Request = $oop.createClass('$api.Request')
.blend($event.EventSender)
.blend($event.EventListener)
.implement($api.Sendable)
.define(/** @lends $api.Request# */{
  /**
   * Identifies endpoint the request will be sent to.
   * @member {$api.Endpoint} $api.Request#endpoint
   */

  /**
   * @member {Object.<string,string>} $api.HttpRequest#endpointParams
   */

  /**
   * @memberOf $api.Request
   * @param {$api.Endpoint} endpoint
   * @param {Object} [properties]
   * @returns {$api.Request}
   */
  fromEndpoint: function (endpoint, properties) {
    return this.create({endpoint: endpoint}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.endpoint, $api.Endpoint, "Invalid endpoint");

    this
    .addTriggerPaths(this.endpoint.triggerPaths.list);
  },

  /**
   * Sends request using a fitting default dispatcher.
   * @returns {$utils.Promise}
   */
  send: function () {
    return this.toRequestDispatcher().dispatch();
  }
})
.build();

$api.Endpoint
.delegate(/** @lends $api.Endpoint# */{
  /**
   * @param {Object} [properties]
   * @returns {$api.Request}
   */
  toRequest: function (properties) {
    return $api.Request.fromEndpoint(this, properties);
  }
});
