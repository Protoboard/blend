"use strict";

/**
 * @function $widgets.Text.create
 * @returns {$widgets.Text}
 */

/**
 * @class $widgets.Text
 * @extends $widget.Widget
 * @todo Add formatting when ready
 * @todo Add binary states when ready (escaped)
 */
$widgets.Text = $oop.getClass('$widgets.Text')
.blend($widget.Widget)
.define(/** @lends $widgets.Text# */{
  /**
   * @member {string|$utils.Stringifiable} $widgets.Text#textString
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
   * @returns {$widgets.Text}
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
