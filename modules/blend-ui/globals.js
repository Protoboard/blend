/* jshint strict:false */

var $assert = require('blend-assert'),
    $data = require('blend-data'),
    $entity = require('blend-entity'),
    $event = require('blend-event'),
    $i18n = require('blend-i18n'),
    $module = require('blend-module'),
    $oop = require('blend-oop'),
    $router = require('blend-router'),
    $template = require('blend-template'),
    $ui = exports,
    $utils = require('blend-utils'),
    $widget = require('blend-widget');

/**
 * @namespace $ui
 */

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * Signals that the application's active page changed.
   * @constant
   */
  EVENT_PAGE_CHANGE: 'ui.page.change',

  /**
   * Signals that a `Clickable` widget was clicked.
   * @constant
   */
  EVENT_CLICKABLE_CLICK: 'ui.clickable.click',

  /**
   * Signals that the ownValue of a Selectable has changed.
   * @constant
   */
  EVENT_SELECTABLE_OWN_VALUE_CHANGE: 'ui.selectable.ownValue.change'
});
