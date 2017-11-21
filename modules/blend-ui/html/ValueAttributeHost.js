"use strict";

/**
 * Manifests input value in "value" HTML attribute.
 * @mixin $ui.ValueAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $ui.Inputable
 */
$ui.ValueAttributeHost = $oop.getClass('$ui.ValueAttributeHost')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.ValueAttributeHost# */{
  /** @ignore */
  init: function () {
    this._syncValueAttribute();
  },

  /**
   * @protected
   */
  _syncValueAttribute: function () {
    this.setAttribute('value', this.inputValue);
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.ValueAttributeHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncValueAttribute();
    }
    return this;
  }
});

