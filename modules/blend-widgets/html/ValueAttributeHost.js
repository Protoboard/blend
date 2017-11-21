"use strict";

/**
 * Manifests input value in "value" HTML attribute.
 * @mixin $widgets.ValueAttributeHost
 * @extend $widget.HtmlWidget
 * @augments $widgets.Inputable
 */
$widgets.ValueAttributeHost = $oop.getClass('$widgets.ValueAttributeHost')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$widgets.Inputable'))
.define(/** @lends $widgets.ValueAttributeHost# */{
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
   * @returns {$widgets.ValueAttributeHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = setInputValue.shared.inputValueBefore;
    if (inputValue !== inputValueBefore) {
      this._syncValueAttribute();
    }
    return this;
  }
});

