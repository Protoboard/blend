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
   * @member {boolean} $ui.Selectable#isSelected
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
    var isSelectedBefore = this.isSelected;
    if (!isSelectedBefore) {
      this.isSelected = true;
    }
    select.shared.isSelectedBefore = isSelectedBefore;
    return this;
  },

  /**
   * @returns {$ui.Selectable}
   */
  deselect: function deselect() {
    var isSelectedBefore = this.isSelected;
    if (isSelectedBefore) {
      this.isSelected = false;
    }
    deselect.shared.isSelectedBefore = isSelectedBefore;
    return this;
  }
});
