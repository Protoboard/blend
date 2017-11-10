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
$api.HttpEndpoint = $oop.getClass('$api.HttpEndpoint')
.cacheBy(function (parameters) {
  var endpointId = parameters && parameters.endpointId;
  return endpointId || $api.HttpEndpoint.toString.call(parameters);
})
.blend($oop.getClass('$api.Endpoint'))
.blend($oop.getClass('$utils.UriPath'))
.define(/** @lends $api.HttpEndpoint# */{
  /** @ignore */
  spread: function () {
    if (this.endpointId === undefined) {
      this.endpointId = this.toString();
    }
  }
});

$data.TreePath
.delegate(/** @lends $data.TreePath */{
  /**
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function () {
    return $api.HttpEndpoint.create({components: this.components});
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function () {
    return $api.HttpEndpoint.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$api.HttpEndpoint}
   */
  toHttpEndpoint: function () {
    return $api.HttpEndpoint.create({components: this});
  }
});
