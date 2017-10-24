"use strict";

/**
 * @function $widgets.Text.create
 * @returns {$widgets.Text}
 */

/**
 * @class $widgets.Text
 * @extends $widget.Widget
 * @todo Add formatting when ready
 * @todo Add binary states when ready (escaped, empty)
 */
$widgets.Text = $oop.getClass('$widgets.Text')
.blend($widget.Widget)
.define(/** @lends $widgets.Text# */{
  /**
   * @member {string|$utils.Stringifiable} $widgets.Text#textString
   */

  /**
   * @param {string|$utils.Stringifiable} textString
   * @returns {$widgets.Text}
   */
  setTextString: function setTextString(textString) {
    var textStringBefore = this.textString;
    if (textString !== textStringBefore) {
      this.textString = textString;
    }
    setTextString.saved.textStringBefore = textStringBefore;
    return this;
  }
});
