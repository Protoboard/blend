"use strict";

/**
 * @function $api.XhrRequest.create
 * @returns {$api.XhrRequest}
 */

/**
 * Describes a request that may be sent using the browser's `XMLHttpRequest`
 * object.
 * @class $api.XhrRequest
 * @extends $api.HttpRequest
 */
$api.XhrRequest = $oop.createClass('$api.XhrRequest')
.blend($api.HttpRequest)
.define(/** @lends $api.XhrRequest# */{
  /**
   * Properties to be set on the corresponding XMLHttpRequest object.
   * @member {Object} $api.XhrRequest#xhrProperties
   */

  /**
   * @returns {string}
   */
  toString: function toString() {
    var httpRequestStr = toString.returned,
        safeJson = $utils.jsonToSafeJson(this.xhrProperties);
    return httpRequestStr + JSON.stringify(safeJson);
  }
})
.build();

$api.Request
.forwardBlend($api.XhrRequest, function (properties) {
  return properties &&
      $utils.isBrowser() &&
      $api.HttpEndpoint.mixedBy(properties.endpoint);
});
