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
  /**
   * Determines how endpoints manifest in the browser by default.
   * Possible values: undefined, 'ajax', 'custom'
   * @constant
   * @todo Add 'function' option.
   */
  browserEndpointMethod: 'ajax',

  /**
   * Determines how endpoints manifest in Node by default.
   * Possible values: undefined, 'ajax', 'custom'
   * @constant
   * @todo Add 'function' option.
   */
  nodeEndpointMethod: 'ajax'
});