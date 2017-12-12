"use strict";

/**
 * @mixin $ui.DomMultiSelectElementHost
 * @extends $ui.MultiSelectElementHost
 * @mixes $ui.DomInputEventBound
 */
$ui.DomMultiSelectElementHost = $oop.createClass('$ui.DomMultiSelectElementHost')
.blend($ui.MultiSelectElementHost)
.blend($ui.DomInputEventBound)
.define(/** @lends $ui.DomMultiSelectElementHost# */{
  /**
   * @protected
   */
  _syncToElementSelected: function () {
    var element = this.getElement(),
        selectedOptions = element && element.selectedOptions,
        inputValues;

    if (selectedOptions) {
      inputValues = slice.call(selectedOptions)
      .map(function (optionElement) {
        return optionElement.value;
      })
      .reduce(function (inputValues, optionValue) {
        inputValues[optionValue] = optionValue;
        return inputValues;
      }, {});

      this.setInputValue(inputValues);
    }
  },

  /** @ignore */
  onRender: function () {
    this._syncToElementSelected();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementInput: function (event) {
    this._syncToElementSelected();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementChange: function (event) {
    this._syncToElementSelected();
  }
})
.build();

$ui.MultiSelectElementHost
.forwardBlend($ui.DomMultiSelectElementHost, $utils.isBrowser);
