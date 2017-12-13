"use strict";

/**
 * @function $api.HttpRequest.create
 * @param {Object} properties
 * @param {$api.Endpoint} properties.endpoint
 * @param {string} properties.httpMethod
 * @param {Object.<string,string>} properties.requestHeaders
 * @param {Object.<string,string|Array.<string>>} properties.queryParams
 * @param {*} properties.requestBody
 * @returns {$api.HttpRequest}
 */

/**
 * Describes a request that may be sent over HTTP.
 * @class $api.HttpRequest
 * @extends $api.Request
 * @todo Host in URL?
 */
$api.HttpRequest = $oop.createClass('$api.HttpRequest')
.blend($api.Request)
.define(/** @lends $api.HttpRequest# */{
  /**
   * Target URL of request.
   * @member {string} $api.HttpRequest#requestUrl
   */

  /**
   * HTTP method to be used when sending request.
   * @member {string} $api.HttpRequest#httpMethod
   */

  /**
   * Request headers.
   * @member {Object.<string,string>} $api.HttpRequest#requestHeaders
   */

  /**
   * URL query parameters.
   * @member {Object.<string,string|Array.<string>>}
   * $api.HttpRequest#queryParams
   */

  /**
   * Body (data) carried by request.
   * @member {*} $api.HttpRequest#requestBody
   */

  /** @ignore */
  spread: function () {
    this.requestUrl = this.requestUrl || this._getUrlPathQuery();
  },

  /** @ignore */
  init: function () {
    var endpoint = this.endpoint,
        listeningPath = $data.TreePath.fromComponentsToString([
          'endpoint', endpoint.endpointId, this.toString()]);

    this
    .setListeningPath(listeningPath)
    .addTriggerPathBefore(listeningPath, endpoint.listeningPath);
  },

  /**
   * Extracts URL path and query string from parameters. Query parameters can
   * take array values.
   * @returns {string}
   */
  _getUrlPathQuery: function () {
    var endpointParams = this.endpointParams,
        pathComponents = this.endpoint.components
        .map(function (endpointComponent) {
          return endpointComponent[0] === ':' ?
              endpointParams[endpointComponent.substr(1)] :
              endpointComponent;
        }),
        urlPath = $utils.UriPath.fromComponents(pathComponents).toString(),

        queryParams = this.queryParams,
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
   * @returns {string}
   */
  toString: function () {
    return JSON.stringify($utils.jsonToSafeJson({
      requestUrl: this.requestUrl,
      httpMethod: this.httpMethod,
      requestHeaders: this.requestHeaders,
      requestBody: this.requestBody
    }));
  }
})
.build();

$api.Request
.forwardBlend($api.HttpRequest, function (properties) {
  return properties && $api.HttpEndpoint.mixedBy(properties.endpoint);
});
