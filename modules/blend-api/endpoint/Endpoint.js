"use strict";

/**
 * @function $api.Endpoint.create
 * @param {Object} properties
 * @param {string} properties.endpointId
 * @returns {$api.Endpoint}
 */

/**
 * Identifies a remote resource.
 * @class $api.Endpoint
 * @extends $utils.Identifiable
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$api.Endpoint = $oop.getClass('$api.Endpoint')
.blend($utils.Identifiable)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $api.Endpoint# */{
  /**
   * @member {string} $api.Endpoint#endpointId
   */

  /**
   * @memberOf $api.Endpoint
   * @param {string} endpointId
   * @returns {$api.Endpoint}
   */
  fromEndpointId: function (endpointId) {
    return this.create({endpointId: endpointId});
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.endpointId, "Invalid endpoint ID");

    var listeningPath = $data.TreePath.fromComponentsToString([
      'endpoint', this.endpointId]);
    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('endpoint');
  }
});
