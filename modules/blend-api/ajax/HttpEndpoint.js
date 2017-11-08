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
 * @extends $data.Path
 */
$api.HttpEndpoint = $oop.getClass('$api.HttpEndpoint')
.cacheBy(function (parameters) {
  var components = parameters && parameters.components;
  return components && $data.Path.fromComponentsToString(components);
})
.blend($oop.getClass('$api.Endpoint'))
.blend($data.Path)
.define(/** @lends $api.HttpEndpoint# */{
  /** @ignore */
  spread: function () {
    var components = this.components,
        endpointId = this.endpointId;

    if (components) {
      this.endpointId = this.endpointId || this.toString();
    } else if (endpointId) {
      this.components = this.components ||
          $utils.safeSplit(endpointId, $data.PATH_COMPONENT_SEPARATOR)
          .map($data.unescapePathComponent);
    }
  }
});

$data.Path
.delegate(/** @lends $data.Path */{
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
