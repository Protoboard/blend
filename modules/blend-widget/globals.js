"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $template = require('blend-template'),
    $widget = exports;

/**
 * @namespace $widget
 */

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   * @todo Need better (but still fast) detection.
   */
  isBrowser: function () {
    return typeof window === 'object';
  }
});
