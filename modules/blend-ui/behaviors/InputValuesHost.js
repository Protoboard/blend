"use strict";

/**
 * Endows widget with user input capabilities. Associates host widget with an
 * input value to be set by the user. Usually mixed to input widgets.
 * @mixin $ui.InputValuesHost
 * @extends $ui.Disableable
 * @extends $ui.Focusable
 * @augments $widget.Widget
 */
$ui.InputValuesHost = $oop.createClass('$ui.InputValuesHost')
.blend($ui.Disableable)
.blend($ui.Focusable)
.expect($widget.Widget)
.define(/** @lends $ui.InputValuesHost# */{
  /**
   * Stores selected values as a symmetric lookup.
   * @member {Object.<string,string>} $ui.InputValuesHost#inputValues
   */

  /** @ignore */
  defaults: function () {
    this.inputValues = this.inputValues || {};
  },

  /**
   * @param {Object} inputValues
   * @returns {$ui.InputValuesHost}
   */
  setInputValues: function setInputValue(inputValues) {
    var inputValuesBefore = this.inputValues;
    this.inputValues = inputValues;
    setInputValue.shared.inputValuesBefore = inputValuesBefore;
    return this;
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.InputValuesHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = this.inputValues[inputValue];
    this.inputValues[inputValue] = inputValue;
    setInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  },

  /**
   * @param {*} inputValue
   * @returns {$ui.InputValuesHost}
   */
  deleteInputValue: function deleteInputValue(inputValue) {
    var inputValueBefore = this.inputValues[inputValue];
    delete this.inputValues[inputValue];
    deleteInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  }
})
.build();
