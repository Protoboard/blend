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
 */
$api.Request = $oop.getClass('$api.Request')
.blend($event.EventSender)
.blend($event.EventListener)
.implement($oop.getClass('$api.Sendable'))
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
    properties = properties || {};
    $oop.copyProperties(properties, {
      endpoint: endpoint
    });
    return this.create(properties);
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
});

$oop.getClass('$api.Endpoint')
.delegate(/** @lends $api.Endpoint# */{
  /**
   * @param {Object} [properties]
   * @returns {$api.Request}
   */
  toRequest: function (properties) {
    return $api.Request.fromEndpoint(this, properties);
  }
});
