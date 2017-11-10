"use strict";

/**
 * @function $api.ObjectRequest.create
 * @returns {$api.ObjectRequest}
 */

/**
 * Bundles object endpoint with request parameters. Allows extraction of
 * request object to be used by `Dispatcher`.
 * @class $api.ObjectRequest
 * @extends $api.Request
 */
$api.ObjectRequest = $oop.getClass('$api.ObjectRequest')
.blend($oop.getClass('$api.Request'))
.define(/** @lends $api.ObjectRequest# */{
  /**
   * Extracts request object blending endpoint properties with request
   * parameters. In case of collision, parameters win.
   * @returns {Object}
   */
  getRequestObject: function () {
    var endpointProperties = this.endpoint.endpointProperties,
        endpointPropertyNames = Object.keys(endpointProperties),
        parameters = this.parameters,
        parameterNames = Object.keys(parameters),
        result = {};

    endpointPropertyNames
    .forEach(function (endpointPropertyName) {
      result[endpointPropertyName] = endpointProperties[endpointPropertyName];
    });

    parameterNames
    .forEach(function (parameterName) {
      result[parameterName] = parameters[parameterName];
    });

    return result;
  }
});

$oop.getClass('$api.Request')
.forwardBlend($api.ObjectRequest, function (properties) {
  return properties && $api.ObjectEndpoint.mixedBy(properties.endpoint);
});
