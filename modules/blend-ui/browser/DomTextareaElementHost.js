"use strict";

/**
 * @mixin $ui.DomTextareaElementHost
 * @extends $widget.DomWidget
 * @extends $ui.TextareaElementHost
 * @extends $ui.DomInputEventHost
 */
$ui.DomTextareaElementHost = $oop.getClass('$ui.DomTextareaElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.TextareaElementHost'))
.blend($oop.getClass('$ui.DomInputEventHost'))
.define(/** @lends $ui.DomTextareaElementHost# */{
  /**
   * @protected
   */
  _syncElementValue: function () {
    var element = this.getElement();
    element.value = $utils.stringify(this.inputValue);
  },

  /**
   * @protected
   */
  _syncToElementValue: function () {
    var element = this.getElement();
    this.inputValue = element.value;
  },

  /**
   * @param inputValue
   * @returns {$ui.DomTextareaElementHost}
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
  onInput: function (event) {
    this._syncToElementValue();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onChange: function (event) {
    this._syncToElementValue();
  }
});

$oop.getClass('$ui.TextareaElementHost')
.forwardBlend($ui.DomTextareaElementHost, function () {
  return $utils.isBrowser();
});
