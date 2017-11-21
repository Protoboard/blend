"use strict";

/**
 * @function $ui.Text.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textString]
 * @returns {$ui.Text}
 */

/**
 * @class $ui.Text
 * @extends $widget.Widget
 * @todo Add formatting when ready
 */
$ui.Text = $oop.getClass('$ui.Text')
.blend($widget.Widget)
.define(/** @lends $ui.Text# */{
  /**
   * @member {string|$utils.Stringifiable} $ui.Text#textString
   */

  /** @ignore */
  init: function () {
    this._updateEmptyState();
  },

  /**
   * @private
   */
  _updateEmptyState: function () {
    this.setStateValue('empty', !this.textString);
  },

  /**
   * @param {string|$utils.Stringifiable} textString
   * @returns {$ui.Text}
   */
  setTextString: function setTextString(textString) {
    var textStringBefore = this.textString;
    if (textString !== textStringBefore) {
      this.textString = textString;
      this._updateEmptyState();
    }
    setTextString.shared.textStringBefore = textStringBefore;
    return this;
  }
});
