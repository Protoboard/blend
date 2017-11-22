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
   * @member {boolean} $ui.Selectable#selected
   */

  /**
   * @protected
   */
  _syncToOwnValue: function () {
    if (this.selected) {
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
    var selectedBefore = this.selected;
    if (!selectedBefore) {
      this.selected = true;
      this._syncToOwnValue();
    }
    select.shared.selectedBefore = selectedBefore;
    return this;
  },

  /**
   * @returns {$ui.Selectable}
   */
  deselect: function deselect() {
    var selectedBefore = this.selected;
    if (selectedBefore) {
      this.selected = false;
      this._syncToOwnValue();
    }
    deselect.shared.selectedBefore = selectedBefore;
    return this;
  }
});
