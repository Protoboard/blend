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
   * @member {Object} $api.Request#parameterValues
   */

  /**
   * @memberOf $api.Request
   * @param {$api.Endpoint} endpoint
   * @param {Object} [parameterValues]
   * @returns {$api.Request}
   */
  fromEndpoint: function (endpoint, parameterValues) {
    return this.create({
      endpoint: endpoint,
      parameterValues: parameterValues
    });
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(this.endpoint, $api.Endpoint, "Invalid endpoint");

    var endpoint = this.endpoint,
        parameterValues = this.parameterValues || {},
        listeningPath = $data.Path.fromComponentsToString([
          'endpoint',
          endpoint.endpointId,
          JSON.stringify(parameterValues)]);

    this.parameterValues = parameterValues;

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
  toRequest: function (parameterValues) {
    return $api.Request.create({
      endpoint: this,
      parameterValues: parameterValues
    });
  }
});
