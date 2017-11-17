/* jshint strict:false */

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $module = require('blend-module'),
    $template = require('blend-template'),
    $router = require('blend-router'),
    $entity = require('blend-entity'),
    $i18n = require('blend-i18n'),
    $widget = require('blend-widget'),
    $widgets = exports;

/**
 * @namespace $widgets
 */

$oop.copyProperties($widgets, /** @lends $widgets */{
  /**
   * Signals that the application's active page changed.
   * @constant
   */
  EVENT_PAGE_CHANGE: 'widgets.page.change',

  /**
   * Signals that a `Clickable` widget was clicked.
   * @constant
   */
  EVENT_CLICKABLE_CLICK: 'widgets.clickable.click'
});
