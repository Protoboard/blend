"use strict";

/**
 * Endows widget with user input capabilities. Associates host widget with an
 * input value to be set by the user. Usually mixed to input widgets.
 * @mixin $ui.Inputable
 * @extends $ui.Disableable
 * @extends $ui.Focusable
 * @augments $widget.Widget
 */
$ui.Inputable = $oop.createClass('$ui.Inputable')
.blend($ui.Disableable)
.blend($ui.Focusable)
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
})
.build();
