"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $router = exports;

/**
 * @namespace $router
 */

$oop.copyProperties($router, /** @lends $router */{
  /**
   * Signals that the application route has changed.
   * @constant
   */
  EVENT_ROUTE_CHANGE: 'router.change.route',

  /**
   * Determines how routing manifests in the browser.
   * Possible values: undefined, 'hash', 'pushState'
   * @type {string}
   */
  browserRoutingMethod: 'hash'
});
