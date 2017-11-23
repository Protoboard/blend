"use strict";

/**
 * @mixin $ui.DomOtherInputTypeHost
 * @extends $ui.DomInputEventBound
 * @extends $ui.OtherInputTypeHost
 */
$ui.DomOtherInputTypeHost = $oop.getClass('$ui.DomOtherInputTypeHost')
.blend($oop.getClass('$ui.DomInputEventBound'))
.blend($oop.getClass('$ui.OtherInputTypeHost'))
.define(/** @lends $ui.DomOtherInputTypeHost# */{
  /**
   * @protected
   */
  _syncElementValue: function () {
    var element = this.getElement();
    if (element) {
      element.value = this.inputValue;
    }
  },

  /**
   * @protected
   */
  _syncToElementValue: function () {
    var element = this.getElement();
    if (element) {
      this.setInputValue(element.value);
    }
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.DomOtherInputTypeHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncElementValue();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncElementValue();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInput: function (event) {
    this._syncToElementValue();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementChange: function (event) {
    this._syncToElementValue();
  }
});

$oop.getClass('$ui.OtherInputTypeHost')
.forwardBlend($ui.DomOtherInputTypeHost, $utils.isBrowser);
