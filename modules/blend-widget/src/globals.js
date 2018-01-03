/* jshint strict:false */

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $template = require('blend-template'),
    $widget = exports,
    indexOf = Array.prototype.indexOf,
    slice = Array.prototype.slice;

/**
 * @namespace $widget
 */

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Signals that the state fo a `Stateful` has changed.
   * @constant
   */
  EVENT_STATE_CHANGE: 'widget.state.change',

  /**
   * Determines how widgets manifest in Node.js.
   * Possible values: undefined, 'html'
   * @constant
   */
  nodeWidgetRenderMethod: 'html'
});
