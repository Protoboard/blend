"use strict";

/**
 * @function $api.Request.create
 * @param {Object} properties
 * @param {$api.Endpoint} properties.endpoint
 * @param {$api.Endpoint} properties.requestId
 * @returns {$api.Request}
 */

/**
 *
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
   * @member {$api.Endpoint} $api.Request#endpoint
   */

  /**
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
        listeningPath = $data.Path.fromComponentsToString([
          'endpoint',
          endpoint.endpointId,
          JSON.stringify(parameters)]);

    this.parameters = parameters;

    this
    .setListeningPath(listeningPath)
    .addTriggerPaths([listeningPath].concat(endpoint.triggerPaths));
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
