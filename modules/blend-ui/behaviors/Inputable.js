"use strict";

/**
 * Associates host widget with an input value to be set by the user. Usually
 * mixed to input widgets.
 * @mixin $ui.Inputable
 * @augments $widget.Widget
 */
$ui.Inputable = $oop.getClass('$ui.Inputable')
.expect($widget.Widget)
.define(/** @lends $ui.Inputable# */{
  /**
   * @member {*} $ui.Inputable#inputValue
   */

  /**
   * @param {*} inputValue
   * @returns {$ui.Inputable}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = this.inputValue;
    this.inputValue = inputValue;
    setInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  }
});
