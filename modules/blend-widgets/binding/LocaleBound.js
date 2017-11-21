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
   * @protected
   */
  _syncToActiveLocale: function () {},

  /**
   * Updates parts of the widget's state that depend on the active translations.
   * @protected
   */
  _syncToActiveTranslations: function () {},

  /** @ignore */
  onAttach: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();

    this._syncToActiveLocale();
    this.on(
        $i18n.EVENT_LOCALE_CHANGE,
        localeEnvironment,
        this.onLocaleChange);

    this._syncToActiveTranslations();
    this.on(
        $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
        localeEnvironment,
        this.onActiveTranslationsChange);
  },

  /** @ignore */
  onLocaleChange: function () {
    this._syncToActiveLocale();
  },

  /** @ignore */
  onActiveTranslationsChange: function () {
    this._syncToActiveTranslations();
  }
});
