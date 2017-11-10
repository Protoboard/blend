"use strict";

/**
 * @function $api.HttpRequest.create
 * @param {Object} properties
 * @param {$api.Endpoint} properties.endpoint
 * @returns {$api.HttpRequest}
 */

/**
 * Bundles HTTP endpoint with request parameters. Allows extraction of HTTP
 * method, header, and URL (path & query) to be used by `Dispatcher`.
 * @class $api.HttpRequest
 * @extends $api.Request
 * @todo Use methods for setting HTTP specific parameters?
 */
$api.HttpRequest = $oop.getClass('$api.HttpRequest')
.blend($oop.getClass('$api.Request'))
.define(/** @lends $api.HttpRequest# */{
  /**
   * @param {string} prefix
   * @returns {Object}
   */
  extractParametersByPrefix: function (prefix) {
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
   * Extracts HTTP method from `parameters`. Method parameter is expected to
   * be prefixed with "method:". When there are multiple such parameters in
   * the request, one will be selected randomly.
   * @returns {string}
   */
  getMethod: function () {
    return $data.Collection.fromData(this.parameters)
    .filterByKeyPrefix('method:')
    .getFirstValue();
  },

  /**
   * Extracts header object from `parameters`. Header attributes are expected
   * to be prefixed with "header:".
   * @returns {Object}
   */
  getHeaderObject: function () {
    return this.extractParametersByPrefix('header:');
  },

  /**
   * Extracts URL path and query string from `parameters`. Endpoint parameters
   * (manifesting in URL path) are expected to be prefixed with "endpoint:".
   * Query parameters are expected to be prefixed with "query:". Query
   * parameters can take array values.
   * @returns {string}
   */
  getUrlPathQuery: function () {
    var endpointParams = this.extractParametersByPrefix('endpoint:'),
        pathComponents = this.endpoint.components
        .map(function (endpointComponent) {
          return endpointComponent[0] === ':' ?
              endpointParams[endpointComponent.substr(1)] :
              endpointComponent;
        }),
        urlPath = $utils.UriPath.fromComponents(pathComponents).toString(),

        queryParams = this.extractParametersByPrefix('query:'),
        urlQuery = $data.Collection.fromData(queryParams)
        .mapValues(function (queryParamValue) {
          return queryParamValue instanceof Array ?
              queryParamValue :
              [queryParamValue];
        })
        .as($api.UrlQuery)
        .toString();

    return urlPath + (urlQuery && ('?' + urlQuery));
  },

  /**
   * Extracts request body.
   * @returns {*}
   * @todo Add test
   */
  getBody: function () {
    return $data.Collection.fromData(this.parameters)
    .filterByKeyPrefix('body:')
    .getFirstValue();
  }
});

$oop.getClass('$api.Request')
.forwardBlend($api.HttpRequest, function (properties) {
  return properties && $api.HttpEndpoint.mixedBy(properties.endpoint);
});
