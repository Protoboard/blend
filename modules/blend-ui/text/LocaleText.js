"use strict";

/**
 * @function $ui.LocaleText.create
 * @returns {$ui.LocaleText}
 */

/**
 * @class $ui.LocaleText
 * @extends $ui.Text
 * @mixes $ui.LocaleBound
 */
$ui.LocaleText = $oop.getClass('$ui.LocaleText')
.blend($oop.getClass('$ui.Text'))
.blend($oop.getClass('$ui.LocaleBound'))
.define(/** @lends $ui.LocaleText# */{
  /**
   * @member {$i18n.Translatable} $ui.LocaleText#textTranslatable
   */

  /**
   * @memberOf $ui.LocaleText
   * @param {$i18n.Translatable} textTranslatable
   * @param {Object} [properties]
   * @returns {$ui.LocaleText}
   */
  fromTextTranslatable: function (textTranslatable, properties) {
    return this.create({
      textTranslatable: textTranslatable
    }, properties);
  },

  /**
   * @protected
   */
  _syncToActiveLocale: function () {
    this.setTextString(this.textTranslatable.toString());
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(
        this.textTranslatable, $i18n.Translatable, "Invalid textTranslatable");
  }
});
