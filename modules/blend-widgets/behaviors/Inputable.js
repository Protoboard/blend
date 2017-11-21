"use strict";

/**
 * Associates host widget with an input value to be set by the user. Usually
 * mixed to input widgets.
 * @mixin $widgets.Inputable
 * @augments $widget.Widget
 */
$widgets.Inputable = $oop.getClass('$widgets.Inputable')
.expect($widget.Widget)
.define(/** @lends $widgets.Inputable# */{
  /**
   * @member {*} $widgets.Inputable#inputValue
   */

  /**
   * @param {*} inputValue
   * @returns {$widgets.Inputable}
   */
  setInputValue: function setInputValue(inputValue) {
    var inputValueBefore = this.inputValue;
    this.inputValue = inputValue;
    setInputValue.shared.inputValueBefore = inputValueBefore;
    return this;
  }
});
