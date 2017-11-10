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
 * @extends $utils.LocationPath
 */
$api.HttpEndpoint = $oop.getClass('$api.HttpEndpoint')
.cacheBy(function (parameters) {
  var endpointId = parameters && parameters.endpointId;
  return endpointId || $api.HttpEndpoint.toUrlPath.call(parameters);
})
.blend($oop.getClass('$api.Endpoint'))
.blend($oop.getClass('$utils.LocationPath'))
.define(/** @lends $api.HttpEndpoint# */{
  /** @ignore */
  spread: function () {
    if (this.endpointId === undefined) {
      this.endpointId = this.toUrlPath();
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
    return $api.HttpEndpoint.fromUrlPath(this.valueOf());
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
