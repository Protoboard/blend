"use strict";

/**
 * Assigned to input element widgets that are not of type 'checkbox' or
 * 'radio'. Host widgets sync their `inputValue`s to their element's 'value'
 * attribute.
 * @mixin $ui.OtherInputTypeHost
 * @extends $ui.InputElementHost
 * @augments $ui.Inputable
 */
$ui.OtherInputTypeHost = $oop.getClass('$ui.OtherInputTypeHost')
.blend($oop.getClass('$ui.InputElementHost'))
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.OtherInputTypeHost# */{
  /** @ignore */
  init: function () {
    this._syncValueAttribute();
  },

  /**
   * @protected
   */
  _syncValueAttribute: function () {
    this.setAttribute('value', $utils.stringify(this.inputValue));
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.OtherInputTypeHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncValueAttribute();
    }
    return this;
  }
});
