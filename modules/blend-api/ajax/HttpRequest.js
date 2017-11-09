"use strict";

/**
 * @function $api.HttpRequest.create
 * @param {Object} properties
 * @param {$api.Endpoint} properties.endpoint
 * @returns {$api.HttpRequest}
 */

/**
 * @class $api.HttpRequest
 * @extends $api.Request
 */
$api.HttpRequest = $oop.getClass('$api.HttpRequest')
.blend($oop.getClass('$api.Request'))
.define(/** @lends $api.HttpRequest# */{
  /**
   * @param {string} prefix
   * @returns {Object}
   * @private
   */
  _extractParametersByType: function (prefix) {
    var prefixLength = prefix.length;
    return $data.Collection.fromData(this.parameters)
    .filterByKeyPrefix(prefix)
    .mapKeys(function (value, key) {
      return key.substr(prefixLength);
    })
    .toCollection()
        .data;
  },

  /**
   * @returns {string}
   */
  getMethod: function () {
    return $data.Collection.fromData(this.parameters)
    .filterByKeyPrefix('method:')
    .getFirstValue();
  },

  /**
   * @returns {Object}
   */
  getHeaderObject: function () {
    return this._extractParametersByType('header:');
  },

  /**
   * @returns {string}
   */
  getUrlPathQuery: function () {
    var endpointParams = this._extractParametersByType('endpoint:'),
        pathComponents = this.endpoint.components
        .map(function (endpointComponent) {
          return endpointComponent[0] === ':' ?
              endpointParams[endpointComponent.substr(1)] :
              endpointComponent;
        }),
        locationPath = $api.LocationPath.fromComponents(pathComponents),

        queryParams = this._extractParametersByType('query:'),
        urlQuery = $data.Collection.fromData(queryParams)
        .mapValues(function (queryParamValue) {
          return queryParamValue instanceof Array ?
              queryParamValue :
              [queryParamValue];
        })
        .as($api.UrlQuery);

    return locationPath.toUrlPath() + '?' + urlQuery.toString();
  }
});

$oop.getClass('$api.Request')
.forwardBlend($api.HttpRequest, function (properties) {
  return properties && $api.HttpEndpoint.mixedBy(properties.endpoint);
});
