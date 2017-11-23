"use strict";

/**
 * Associates host widget with an own value and selected state to be set by the
 * user. Usually mixed to input widgets.
 * @mixin $ui.Selectable
 * @extends $ui.Disableable
 * @extends $ui.Focusable
 * @augments $widget.Widget
 */
$ui.Selectable = $oop.getClass('$ui.Selectable')
.blend($oop.getClass('$ui.Disableable'))
.blend($oop.getClass('$ui.Focusable'))
.expect($widget.Widget)
.define(/** @lends $ui.Selectable# */{
  /**
   * @member {*} $ui.Selectable#ownValue
   */

  /**
   * @param {*} ownValue
   * @returns {$ui.Selectable}
   */
  setOwnValue: function setOwnValue(ownValue) {
    var ownValueBefore = this.ownValue;
    if (ownValue !== ownValueBefore) {
      this.ownValue = ownValue;
    }
    setOwnValue.shared.ownValueBefore = ownValueBefore;
    return this;
  },

  /**
   * @returns {$ui.Selectable}
   */
  select: function select() {
    this.setStateValue($ui.STATE_NAME_SELECTED, true);
    return this;
  },

  /**
   * @returns {$ui.Selectable}
   */
  deselect: function deselect() {
    this.setStateValue($ui.STATE_NAME_SELECTED, false);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isSelected: function () {
    return this.getStateValue($ui.STATE_NAME_SELECTED);
  }
});

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_SELECTED: 'selected'
});
