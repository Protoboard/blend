"use strict";

/**
 * @function $api.XhrDispatcher.create
 * @param {Object} properties
 * @param {$api.Request} properties.request
 * @returns {$api.XhrDispatcher}
 */

/**
 * Dispatches an XMLHttpRequest request.
 * @class $api.XhrDispatcher
 * @extends $api.RequestDispatcher
 * @todo Check IE / Edge, and create specific dispatcher if necessary.
 */
$api.XhrDispatcher = $oop.getClass('$api.XhrDispatcher')
.blend($oop.getClass('$api.RequestDispatcher'))
.define(/** @lends $api.XhrDispatcher# */{
  /**
   * @member {$api.XhrRequest} $api.XhrDispatcher#request
   */

  /**
   * @param {XMLHttpRequest} xhr
   * @returns {number}
   * @private
   */
  _readyStateGetterProxy: function (xhr) {
    /* istanbul ignore next */
    return xhr.readyState;
  },

  /**
   * Dispatches Ajax request.
   * @returns {$utils.Promise}
   */
  dispatch: function dispatch() {
    var promise = dispatch.returned;

    if (promise) {
      // returning promise associated with matching in-flight request
      return promise;
    }

    var that = this,
        xhr = new XMLHttpRequest(),
        deferred = $utils.Deferred.create(),
        request = this.request,
        httpMethod = request.httpMethod || 'GET',
        requestHeaders = request.requestHeaders || {},
        requestUrl = request.requestUrl,
        xhrParams = request.xhrProperties;

    // opening connection
    // todo Deal with user / password later
    xhr.open(httpMethod, requestUrl, true);

    // applying XHR properties
    $data.Collection.fromData(xhrParams)
    .forEachItem(function (value, property) {
      xhr[property] = value;
    });

    // setting up headers
    $data.Collection.fromData(requestHeaders)
    .forEachItem(function (value, header) {
      xhr.setRequestHeader(header, value);
    });

    // setting up events
    xhr.onreadystatechange = function () {
      var readyState = that._readyStateGetterProxy(xhr),
          event;

      switch (readyState) {
      case 1: // OPENED
        event = request.spawnEvent({
          eventName: $api.EVENT_REQUEST_OPEN,
          request: request,
          promise: deferred.promise,
          xhr: xhr
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 2: // HEADERS_RECEIVED
        event = request.spawnEvent({
          eventName: $api.EVENT_REQUEST_SEND,
          request: request,
          response: $api.HttpResponse.create({
            httpStatus: xhr.status,
            responseHeaders: xhr.getAllResponseHeaders(),
            responseBody: xhr.response
          }),
          promise: deferred.promise,
          xhr: xhr
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 3: // LOADING
        event = request.spawnEvent({
          eventName: $api.EVENT_RESPONSE_PROGRESS,
          request: request,
          response: $api.HttpResponse.create({
            httpStatus: xhr.status,
            responseHeaders: xhr.getAllResponseHeaders(),
            responseBody: xhr.response
          }),
          promise: deferred.promise,
          xhr: xhr
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 4: // DONE
        event = request.spawnEvent({
          eventName: $api.EVENT_RESPONSE_RECEIVE,
          request: request,
          response: $api.HttpResponse.create({
            httpStatus: xhr.status,
            responseHeaders: xhr.getAllResponseHeaders(),
            responseBody: xhr.response
          }),
          promise: deferred.promise,
          xhr: xhr
        });
        event.trigger();
        deferred.resolve(event);
        break;
      }
    };

    xhr.send(request.requestBody);

    return deferred.promise;
  }
});

$oop.getClass('$api.RequestDispatcher')
.forwardBlend($api.XhrDispatcher, function (properties) {
  var request = properties && properties.request;
  return request &&
      $utils.isBrowser() &&
      $api.HttpRequest.mixedBy(request);
});