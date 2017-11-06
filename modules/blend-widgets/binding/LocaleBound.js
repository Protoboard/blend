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
  /**
   * Updates parts of the widget's state that depend on the active locale.
   * To be optionally implemented by host class.
   * @function $widgets.LocaleBound#syncToActiveLocale
   */

  /**
   * Updates parts of the widget's state that depend on the active translations.
   * To be optionally implemented by host class.
   * @function $widgets.LocaleBound#syncToActiveTranslations
   */

  /** @ignore */
  onAttach: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();

    if (this.syncToActiveLocale) {
      this.syncToActiveLocale();
      this.on(
          $i18n.EVENT_LOCALE_CHANGE,
          localeEnvironment,
          this.onLocaleChange);
    }

    if (this.syncToActiveTranslations) {
      this.syncToActiveTranslations();
      this.on(
          $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
          localeEnvironment,
          this.onActiveTranslationsChange);
    }
  },

  /** @ignore */
  onLocaleChange: function () {
    this.syncToActiveLocale();
  },

  /** @ignore */
  onActiveTranslationsChange: function () {
    this.syncToActiveTranslations();
  }
});
