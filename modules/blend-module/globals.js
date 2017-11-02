"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $entity = require('blend-entity'),
    $module = exports;

/**
 * @namespace $module
 */

$oop.copyProperties($module, /** @lends $module */{
  /**
   * Signals that a module became available.
   * @constant
   */
  EVENT_MODULE_AVAILABLE: 'module.available',

  /**
   * Signals that a module is no longer available.
   * @constant
   */
  EVENT_MODULE_UNAVAILABLE: 'module.unavailable'
});
