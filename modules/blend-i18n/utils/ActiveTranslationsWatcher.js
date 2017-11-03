"use strict";

/**
 * @function $i18n.ActiveTranslationsWatcher.create
 * @returns {$i18n.ActiveTranslationsWatcher}
 */

/**
 * @class $i18n.ActiveTranslationsWatcher
 * @extends $event.EventListener
 */
$i18n.ActiveTranslationsWatcher = $oop.getClass('$i18n.ActiveTranslationsWatcher')
.blend($oop.Singleton)
.blend($event.EventListener)
.define(/** @lends $i18n.ActiveTranslationsWatcher# */{
  /** @ignore */
  init: function () {
    // todo Use DocumentAttributePath once available
    this.setListeningPath('entity.document.__document._locale');
  },

  /**
   * @param {$event.Event} event
   * @ignore
   */
  onTranslationsChange: function (event) {
    var affectedLocale = event.sender,
        localeEnvironment = $i18n.LocaleEnvironment.create(),
        activeLocale = localeEnvironment.getActiveLocale();

    if (affectedLocale === activeLocale) {
      // translations changed in active locale
      return localeEnvironment.trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
    }
  },

  /**
   * @ignore
   */
  onLocaleChange: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();
    return localeEnvironment.trigger($i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE);
  }
});

$event.EventSpace.create()
.on($i18n.EVENT_TRANSLATIONS_CHANGE,
    'locale',
    $i18n.ActiveTranslationsWatcher.__classId,
    function (event) {
      return $i18n.ActiveTranslationsWatcher.create()
      .onTranslationsChange(event);
    })
.on($i18n.EVENT_LOCALE_CHANGE,
    'locale',
    $i18n.ActiveTranslationsWatcher.__classId,
    function (event) {
      return $i18n.ActiveTranslationsWatcher.create()
      .onLocaleChange(event);
    });