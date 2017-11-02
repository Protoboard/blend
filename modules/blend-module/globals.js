"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $module = exports;

/**
 * @namespace $module
 */

$oop.copyProperties($module, /** @lends $module */{
  /**
   * Signals that a module became available.
   * @constant
   */
  EVENT_MODULE_AVAILABLE: 'module.available'
});
