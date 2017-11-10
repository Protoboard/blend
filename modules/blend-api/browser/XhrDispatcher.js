"use strict";

/**
 * @function $api.XhrDispatcher.create
 * @returns {$api.XhrDispatcher}
 */

/**
 * @class $api.XhrDispatcher
 * @implements $api.RequestDispatcher
 * @todo Check IE / Edge, and create specific dispatcher if necessary.
 */
$api.XhrDispatcher = $oop.getClass('$api.XhrDispatcher')
.implement($oop.getClass('$api.RequestDispatcher'))
.define(/** @lends $api.XhrDispatcher */{
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
   * @param {$api.HttpRequest} request
   * @returns {$utils.Promise}
   */
  dispatchRequest: function (request) {
    $assert.isInstanceOf(request, $api.HttpRequest, "Invalid HTTP request");

    var that = this,
        xhr = new XMLHttpRequest(),
        deferred = $utils.Deferred.create(),
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
