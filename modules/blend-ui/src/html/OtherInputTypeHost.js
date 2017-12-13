"use strict";

/**
 * Assigned to input element widgets that are not of type 'checkbox' or
 * 'radio'. Host widgets sync their `inputValue`s to their element's 'value'
 * attribute.
 * @mixin $ui.OtherInputTypeHost
 * @extends $ui.InputElementHost
 * @augments $ui.InputValueHost
 */
$ui.OtherInputTypeHost = $oop.createClass('$ui.OtherInputTypeHost')
.blend($ui.InputElementHost)
.expect($ui.InputValueHost)
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
})
.build();
