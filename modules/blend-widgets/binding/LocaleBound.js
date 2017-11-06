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
   * @function $widgets.LocaleBound#updateByActiveLocale
   */

  /**
   * Updates parts of the widget's state that depend on the active translations.
   * To be optionally implemented by host class.
   * @function $widgets.LocaleBound#updateByActiveTranslations
   */

  /** @ignore */
  onAttach: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();

    if (this.updateByActiveLocale) {
      this.updateByActiveLocale();
      this.on(
          $i18n.EVENT_LOCALE_CHANGE,
          localeEnvironment,
          this.onLocaleChange);
    }

    if (this.updateByActiveTranslations) {
      this.updateByActiveTranslations();
      this.on(
          $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
          localeEnvironment,
          this.onActiveTranslationsChange);
    }
  },

  /** @ignore */
  onLocaleChange: function () {
    this.updateByActiveLocale();
  },

  /** @ignore */
  onActiveTranslationsChange: function () {
    this.updateByActiveTranslations();
  }
});
