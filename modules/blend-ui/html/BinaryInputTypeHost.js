"use strict";

/**
 * Assigned to input element widgets that are of type 'checkbox' or
 * 'radio'. Host widgets sync their `ownValue` property and `selected` state
 * to their element's 'value' and 'checked' attributes.
 * @mixin $ui.BinaryInputTypeHost
 * @extends $ui.InputElementHost
 * @augments $ui.Selectable
 */
$ui.BinaryInputTypeHost = $oop.getClass('$ui.BinaryInputTypeHost')
.blend($oop.getClass('$ui.InputElementHost'))
.expect($oop.getClass('$ui.Selectable'))
.define(/** @lends $ui.BinaryInputTypeHost# */{
  /** @ignore */
  init: function () {
    var inputType = this.inputType;
    $assert.isTruthy(inputType === 'checkbox' || inputType === 'radio',
        "Invalid inputType");

    this._syncValueAttribute();
    this._syncCheckedAttribute();
  },

  /**
   * @protected
   */
  _syncValueAttribute: function () {
    this.setAttribute('value', this.ownValue);
  },

  /**
   * @protected
   */
  _syncCheckedAttribute: function () {
    if (this.isSelected()) {
      this.setAttribute('checked', 'checked');
    } else {
      this.deleteAttribute('checked');
    }
  },

  /**
   * @param {*} ownValue
   * @returns {$ui.BinaryInputTypeHost}
   */
  setOwnValue: function setOwnValue(ownValue) {
    var ownValueBefore = setOwnValue.shared.ownValueBefore;
    if (ownValue !== ownValueBefore) {
      this._syncValueAttribute();
    }
    return this;
  },

  /**
   * @returns {$ui.BinaryInputTypeHost}
   */
  select: function select() {
    var selectedStateBefore = select.shared.selectedStateBefore;
    if (!selectedStateBefore) {
      this._syncCheckedAttribute();
    }
    return this;
  },

  /**
   * @returns {$ui.BinaryInputTypeHost}
   */
  deselect: function deselect() {
    var selectedStateBefore = deselect.shared.selectedStateBefore;
    if (selectedStateBefore) {
      this._syncCheckedAttribute();
    }
    return this;
  }
});
