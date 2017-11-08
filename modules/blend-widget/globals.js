/* jshint strict:false */

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $widget = exports;

/**
 * @namespace $widget
 */

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Determines how widgets manifest in Node.js.
   * Possible values: undefined, 'html'
   * @constant
   */
  nodeWidgetRenderMethod: 'html'
});
