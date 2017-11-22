"use strict";

/**
 * Associates host widget with an own value and selected state to be set by the
 * user. Usually mixed to input widgets.
 * @mixin $ui.Selectable
 * @extends $ui.Inputable
 * @augments $widget.Widget
 */
$ui.Selectable = $oop.getClass('$ui.Selectable')
.blend($oop.getClass('$ui.Inputable'))
.expect($widget.Widget)
.define(/** @lends $ui.Selectable# */{
  /**
   * @member {*} $ui.Selectable#ownValue
   */

  /**
   * @member {boolean} $ui.Selectable#isSelected
   */

  /**
   * @protected
   */
  _syncToOwnValue: function () {
    if (this.isSelected) {
      this.setInputValue(this.ownValue);
    } else {
      this.setInputValue(undefined);
    }
  },

  /**
   * @param {*} ownValue
   * @returns {$ui.Selectable}
   */
  setOwnValue: function setOwnValue(ownValue) {
    var ownValueBefore = this.ownValue;
    if (ownValue !== ownValueBefore) {
      this.ownValue = ownValue;
      this._syncToOwnValue();
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
      this._syncToOwnValue();
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
      this._syncToOwnValue();
    }
    deselect.shared.isSelectedBefore = isSelectedBefore;
    return this;
  }
});
