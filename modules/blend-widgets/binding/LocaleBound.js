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
   * To be optionally implemented by host class.
   * @function $widgets.LocaleBound#onLocaleChange
   */

  /**
   * To be optionally implemented by host class.
   * @function $widgets.LocaleBound#onActiveTranslationsChange
   */

  /** @ignore */
  onAttach: function () {
    var localeEnvironment = $i18n.LocaleEnvironment.create();

    if (this.onLocaleChange) {
      this.on(
          $i18n.EVENT_LOCALE_CHANGE,
          localeEnvironment,
          this.onLocaleChange);
    }

    if (this.onActiveTranslationsChange) {
      this.on(
          $i18n.EVENT_ACTIVE_TRANSLATIONS_CHANGE,
          localeEnvironment,
          this.onActiveTranslationsChange);
    }
  }
});
