/* jshint strict:false */

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $api = exports;

/**
 * @namespace $api
 */

$oop.copyProperties($api, /** @lends $api */{
  /** @constant */
  EVENT_REQUEST_OPEN: 'api.request.open',

  /** @constant */
  EVENT_REQUEST_SEND: 'api.request.send',

  /** @constant */
  EVENT_RESPONSE_PROGRESS: 'api.response.progress',

  /** @constant */
  EVENT_RESPONSE_RECEIVE: 'api.response.receive'
});
