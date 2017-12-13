"use strict";

/**
 * Endows widget with user input capabilities. Associates host widget with an
 * input value to be set by the user. Usually mixed to input widgets.
 * @mixin $ui.InputValueHost
 * @extends $ui.Disableable
 * @extends $ui.Focusable
 * @augments $widget.Widget
 */
$ui.InputValueHost = $oop.createClass('$ui.InputValueHost')
.blend($ui.Disableable)
.blend($ui.Focusable)
.expect($widget.Widget)
.define(/** @lends $ui.InputValueHost# */{
  /**
   * @member {*} $ui.InputValueHost#inputValue
   */

  /**
   * @param {*} inputValue
   * @returns {$ui.InputValueHost}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = this.inputValue;
    this.inputValue = inputValue;
    setInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  }
})
.build();
