"use strict";

/**
 * @function $api.ObjectEndpoint.create
 * @param {string} [properties.endpointProperties]
 * @param {string} [properties.endpointId]
 * @returns {$api.ObjectEndpoint}
 */

/**
 * Identifies an endpoint by its properties. To be used with custom non-HTTP
 * endpoints.
 * @class $api.ObjectEndpoint
 * @extends $api.Endpoint
 */
$api.ObjectEndpoint = $oop.getClass('$api.ObjectEndpoint')
.cacheBy(function (parameters) {
  var endpointId = parameters && parameters.endpointId,
      endpointProperties = parameters && parameters.endpointProperties;
  return endpointId || endpointProperties && JSON.stringify(endpointProperties);
})
.blend($oop.getClass('$api.Endpoint'))
.define(/** @lends $api.ObjectEndpoint# */{
  /**
   * @member {Object} $api.ObjectEndpoint#endpointProperties
   */

  /**
   * @memberOf $api.ObjectEndpoint
   * @param endpointProperties
   * @returns {$api.ObjectEndpoint}
   */
  fromEndpointProperties: function (endpointProperties) {
    return this.create({endpointProperties: endpointProperties});
  },

  /** @ignore */
  init: function () {
    $assert.isObject(this.endpointProperties, "Invalid endpoint properties");
  },

  /** @ignore */
  spread: function () {
    var endpointProperties = this.endpointProperties,
        endpointId = this.endpointId;

    if (endpointId === undefined) {
      this.endpointId = JSON.stringify(endpointProperties);
    } else if (endpointProperties === undefined) {
      this.endpointProperties = JSON.parse(endpointId);
    }
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$api.ObjectEndpoint}
   */
  toObjectEndpoint: function () {
    return $api.ObjectEndpoint.fromEndpointId(this.valueOf());
  }
});
