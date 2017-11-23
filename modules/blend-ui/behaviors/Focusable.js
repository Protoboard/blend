"use strict";

/**
 * Adds focused state to host class. Usually mixed to input widgets.
 * @mixin $ui.Focusable
 * @augments $widget.Widget
 */
$ui.Focusable = $oop.getClass('$ui.Focusable')
.expect($widget.Widget)
.define(/** @lends $ui.Focusable# */{
  /**
   * @returns {$ui.Focusable}
   */
  focus: function focus() {
    this.setStateValue($ui.STATE_NAME_FOCUSED, true);
    return this;
  },

  /**
   * @returns {$ui.Focusable}
   */
  blur: function blur() {
    this.setStateValue($ui.STATE_NAME_FOCUSED, false);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isFocused: function () {
    return this.getStateValue($ui.STATE_NAME_FOCUSED);
  }
});

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_FOCUSED: 'focused'
});
