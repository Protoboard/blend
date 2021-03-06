"use strict";

/**
 * @function $api.ActiveRequestIndex.create
 * @returns {$api.ActiveRequestIndex}
 */

/**
 * Maintains associations between requests and promises returned by
 * corresponding `Dispatcher`.
 * @class $api.ActiveRequestIndex
 */
$api.ActiveRequestIndex = $oop.createClass('$api.ActiveRequestIndex')
.blend($oop.Singleton)
.define(/** @lends $api.ActiveRequestIndex# */{
  /**
   * Associates promise with request.
   * @param {$api.Request} request
   * @param {$utils.Thenable} promise
   * @returns {$api.ActiveRequestIndex}
   */
  addPromiseForRequest: function (request, promise) {
    var indexPath = $data.TreePath.fromComponents([
      '_request', request.toString()]);
    $api.index.setNode(indexPath, promise);
    return this;
  },

  /**
   * Disassociates promise from request.
   * @param {$api.Request} request
   * @returns {$api.ActiveRequestIndex}
   */
  removePromiseForRequest: function (request) {
    var indexPath = $data.TreePath.fromComponents([
      '_request', request.toString()]);
    $api.index.deleteNode(indexPath);
    return this;
  },

  /**
   * Retrieves promise associated with specified `request`.
   * @param {$api.Request} request
   * @returns {$utils.Thenable}
   */
  getPromiseForRequest: function (request) {
    var indexPath = $data.TreePath.fromComponents([
      '_request', request.toString()]);
    return $api.index.getNode(indexPath);
  },

  /**
   * @param {$api.ApiEvent} event
   * @ignore
   */
  onRequestSend: function (event) {
    this.addPromiseForRequest(event.request, event.promise);
  },

  /**
   * @param {$api.ApiEvent} event
   * @ignore
   */
  onResponseReceive: function (event) {
    this.removePromiseForRequest(event.request);
  }
})
.build();

$event.EventSpace.create()
.on($api.EVENT_REQUEST_SEND,
    'endpoint',
    $api.ActiveRequestIndex.__className,
    function (event) {
      return $api.ActiveRequestIndex.create()
      .onRequestSend(event);
    })
.on($api.EVENT_RESPONSE_RECEIVE,
    'endpoint',
    $api.ActiveRequestIndex.__className,
    function (event) {
      return $api.ActiveRequestIndex.create()
      .onResponseReceive(event);
    });