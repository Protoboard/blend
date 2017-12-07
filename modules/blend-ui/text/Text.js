"use strict";

/**
 * @function $ui.Text.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textContent]
 * @returns {$ui.Text}
 */

/**
 * @class $ui.Text
 * @extends $widget.Widget
 * @todo Add formatting when ready
 */
$ui.Text = $oop.createClass('$ui.Text')
.blend($widget.Widget)
.define(/** @lends $ui.Text# */{
  /**
   * @member {string|$utils.Stringifiable} $ui.Text#textContent
   */

  /** @ignore */
  init: function () {
    this._updateEmptyState();
  },

  /**
   * @private
   */
  _updateEmptyState: function () {
    this.setStateValue('empty', !this.textContent);
  },

  /**
   * @param {string|$utils.Stringifiable} textContent
   * @returns {$ui.Text}
   */
  setTextString: function setTextString(textContent) {
    var textStringBefore = this.textContent;
    if (textContent !== textStringBefore) {
      this.textContent = textContent;
      this._updateEmptyState();
    }
    setTextString.shared.textStringBefore = textStringBefore;
    return this;
  }
})
.build();
