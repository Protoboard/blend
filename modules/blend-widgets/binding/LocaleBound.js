"use strict";

/**
 * Binds host widget class to locale events through predefined event handler
 * methods (`onLocaleChange` and `onActiveTranslationsChange`).
 * @mixin $widgets.LocaleBound
 * @augments $widget.Widget
 */
$widgets.LocaleBound = $oop.getClass('$widgets.LocaleBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.LocaleBound# */{
  /**
   * @function $widgets.LocaleBound#onLocaleChange
   * @param {$i18n.LocaleChangeEvent} event
   */

  /**
   * @function $widgets.LocaleBound#onActiveTranslationsChange
   * @param {$event.Event} event
   */

  /** @ignore */
  onAttach: function () {
    var LocaleEnvironment = $i18n.LocaleEnvironment.create();

    if (this.onLocaleChange) {
      this.on(
          $i18n.EVENT_LOCALE_CHANGE,
          LocaleEnvironment,
          this.onLocaleChange);
    }

    if (this.onActiveTranslationsChange) {
      this.on(
          $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
          LocaleEnvironment,
          this.onActiveTranslationsChange);
    }
  }
});
