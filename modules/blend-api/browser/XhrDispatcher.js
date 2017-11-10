"use strict";

/**
 * @function $api.XhrDispatcher.create
 * @param {Object} properties
 * @param {$api.Request} properties.request
 * @returns {$api.XhrDispatcher}
 */

/**
 * @class $api.XhrDispatcher
 * @extends $api.Dispatcher
 * @todo Check IE / Edge, and create specific dispatcher if necessary.
 */
$api.XhrDispatcher = $oop.getClass('$api.XhrDispatcher')
.blend($oop.getClass('$api.Dispatcher'))
.define(/** @lends $api.XhrDispatcher# */{
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
  dispatch: function () {
    var that = this,
        xhr = new XMLHttpRequest(),
        deferred = $utils.Deferred.create(),
        request = this.request,
        method = request.getMethod() || 'GET',
        headerObject = request.getHeaderObject() || {},
        url = request.getUrlPathQuery();

    // opening connection
    // todo Deal with user / password later
    xhr.open(method, url, true);

    // setting up headers
    $data.Collection.fromData(headerObject)
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
          xhr: xhr
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 2: // HEADERS_RECEIVED
        event = request.spawnEvent({
          eventName: $api.EVENT_REQUEST_SEND,
          request: request,
          xhr: xhr
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 3: // LOADING
        event = request.spawnEvent({
          eventName: $api.EVENT_RESPONSE_PROGRESS,
          request: request,
          xhr: xhr
          // todo Add response
        });
        event.trigger();
        deferred.notify(event);
        break;

      case 4: // DONE
        event = request.spawnEvent({
          eventName: $api.EVENT_RESPONSE_RECEIVE,
          request: request,
          xhr: xhr
          // todo Add response
        });
        event.trigger();
        deferred.resolve(event);
        break;
      }
    };

    xhr.send(request.getBody());

    return deferred.promise;
  }
});

$oop.getClass('$api.Dispatcher')
.forwardBlend($api.XhrDispatcher, function (properties) {
  var request = properties && properties.request;
  return request &&
      $utils.isBrowser() &&
      $api.HttpRequest.mixedBy(request);
});