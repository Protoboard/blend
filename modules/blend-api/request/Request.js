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
 * @todo Add #send()
 */
$api.Request = $oop.getClass('$api.Request')
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $api.Request# */{
  /**
   * Identifies endpoint the request will be sent to.
   * @member {$api.Endpoint} $api.Request#endpoint
   */

  /**
   * Request parameters.
   * @member {Object} $api.Request#parameters
   * @todo Should be Collection?
   */

  /**
   * @memberOf $api.Request
   * @param {$api.Endpoint} endpoint
   * @param {Object} [parameters]
   * @returns {$api.Request}
   */
  fromEndpoint: function (endpoint, parameters) {
    return this.create({
      endpoint: endpoint,
      parameters: parameters
    });
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.endpoint, $api.Endpoint, "Invalid endpoint");

    var endpoint = this.endpoint,
        parameters = this.parameters || {},
        listeningPath = $data.TreePath.fromComponentsToString([
          'endpoint',
          endpoint.endpointId,
          JSON.stringify($utils.jsonToSafeJson(parameters))]);

    this.parameters = parameters;

    this
    .setListeningPath(listeningPath)
    .addTriggerPaths([listeningPath].concat(endpoint.triggerPaths));
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.endpoint.endpointId +
        JSON.stringify($utils.jsonToSafeJson(this.parameters));
  }
});

$oop.getClass('$api.Endpoint')
.delegate(/** @lends $api.Endpoint# */{
  /**
   * Converts endpoint to a request.
   * @returns {$api.Request}
   */
  toRequest: function (parameters) {
    return $api.Request.create({
      endpoint: this,
      parameters: parameters
    });
  }
});
