"use strict";

/**
 * Binds host widget class to locale events through predefined event handler
 * methods.
 * @mixin $widgets.LocaleBound
 * @augments $widget.Widget
 */
$widgets.LocaleBound = $oop.getClass('$widgets.LocaleBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.LocaleBound# */{
  /** @ignore */
  onAttach: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();

    this.syncToActiveLocale();
    this.on(
        $i18n.EVENT_LOCALE_CHANGE,
        localeEnvironment,
        this.onLocaleChange);

    this.syncToActiveTranslations();
    this.on(
        $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
        localeEnvironment,
        this.onActiveTranslationsChange);
  },

  /**
   * Updates parts of the widget's state that depend on the active locale.
   * @ignore
   */
  syncToActiveLocale: function () {},

  /**
   * Updates parts of the widget's state that depend on the active translations.
   * @ignore
   */
  syncToActiveTranslations: function () {},

  /** @ignore */
  onLocaleChange: function () {
    this.syncToActiveLocale();
  },

  /** @ignore */
  onActiveTranslationsChange: function () {
    this.syncToActiveTranslations();
  }
});
