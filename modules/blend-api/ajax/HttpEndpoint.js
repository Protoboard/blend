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
 * @todo Add #fromUrlPath, #toUrlPath, as in $router.Route
 */
$api.HttpEndpoint = $oop.getClass('$api.HttpEndpoint')
.cacheBy(function (parameters) {
  var endpointId = parameters && parameters.endpointId,
      components = parameters && parameters.components;
  return endpointId || components && $data.Path.fromComponentsToString(components);
})
.blend($oop.getClass('$api.Endpoint'))
.blend($data.Path)
.define(/** @lends $api.HttpEndpoint# */{
  /** @ignore */
  spread: function () {
    var components = this.components,
        endpointId = this.endpointId;

    if (endpointId === undefined) {
      this.endpointId = this.toString();
    } else if (components === undefined) {
      this.components = $utils.safeSplit(endpointId, $data.PATH_COMPONENT_SEPARATOR)
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
    return $api.HttpEndpoint.fromEndpointId(this.valueOf());
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
