"use strict";

/**
 * @function $api.HttpEndpoint.create
 * @param {Object} properties
 * @param {string} [properties.components]
 * @param {string} [properties.endpointId]
 * @returns {$api.HttpEndpoint}
 */

/**
 * Identifies an HTTP endpoint.
 * @class $api.HttpEndpoint
 * @extends $api.Endpoint
 * @extends $utils.UriPath
 */
$api.HttpEndpoint = $oop.createClass('$api.HttpEndpoint')
.cacheBy(function (parameters) {
  var endpointId = parameters && parameters.endpointId;
  return endpointId || $api.HttpEndpoint.toString.call(parameters);
})
.blend($api.Endpoint)
.blend($utils.UriPath)
.define(/** @lends $api.HttpEndpoint# */{
  /** @ignore */
  spread: function () {
    if (this.endpointId === undefined) {
      this.endpointId = this.toString();
    }
  }
})
.build();

$data.TreePath
.delegate(/** @lends $data.TreePath */{
  /**
   * @param {Object} [properties]
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function (properties) {
    return $api.HttpEndpoint.create({components: this.components}, properties);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function (properties) {
    return $api.HttpEndpoint.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function (properties) {
    return $api.HttpEndpoint.create({components: this}, properties);
  }
});
