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
  EVENT_LOCALE_CHANGE: 'i18n.change.locale',

  /**
   * Signals that translations associated with a locale have changed.
   * @constant
   */
  EVENT_TRANSLATIONS_CHANGE: 'i18n.change.translations',

  /**
   * Signals that translations associated with the active locale have
   * changed. Listen to this event on `$i18n.LocaleEnvironment` to
   * update components depending on translated strings.
   * @constant
   */
  EVENT_ACTIVE_TRANSLATIONS_CHANGE: 'i18n.change.activeTranslations'
});
