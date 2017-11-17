"use strict";

/**
 * @function $widgets.LocaleText.create
 * @returns {$widgets.LocaleText}
 */

/**
 * @class $widgets.LocaleText
 * @extends $widgets.Text
 * @mixes $widgets.LocaleBound
 */
$widgets.LocaleText = $oop.getClass('$widgets.LocaleText')
.blend($oop.getClass('$widgets.Text'))
.blend($oop.getClass('$widgets.LocaleBound'))
.define(/** @lends $widgets.LocaleText# */{
  /**
   * @member {$i18n.Translatable} $widgets.LocaleText#textTranslatable
   */

  /**
   * @memberOf $widgets.LocaleText
   * @param textTranslatable
   * @returns {$widgets.LocaleText}
   */
  fromTextTranslatable: function (textTranslatable) {
    return this.create({
      textTranslatable: textTranslatable
    });
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(
        this.textTranslatable, $i18n.Translatable, "Invalid textTranslatable");
  },

  /** @ignore */
  syncToActiveLocale: function () {
    this.setTextString(this.textTranslatable.toString());
  }
});
