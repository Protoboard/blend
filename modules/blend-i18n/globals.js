"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $template = require('blend-template'),
    $entity = require('blend-entity'),
    $i18n = exports;

/**
 * @namespace $i18n
 */

$oop.copyProperties($i18n, /** @lends $i18n */{
  /**
   * Signals that the global locale has changed.
   * @constant
   */
  EVENT_LOCALE_CHANGE: 'i18n.change.locale'
});
