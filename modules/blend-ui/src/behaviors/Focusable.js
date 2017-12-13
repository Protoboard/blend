"use strict";

/**
 * Adds focused state to host class. Usually mixed to input widgets.
 * @mixin $ui.Focusable
 * @augments $widget.Widget
 */
$ui.Focusable = $oop.createClass('$ui.Focusable')
.expect($widget.Widget)
.define(/** @lends $ui.Focusable# */{
  /**
   * @returns {$ui.Focusable}
   */
  focus: function focus() {
    focus.shared.focusedStateBefore = this.getStateValue($ui.STATE_NAME_FOCUSED);
    this.setStateValue($ui.STATE_NAME_FOCUSED, true);
    return this;
  },

  /**
   * @returns {$ui.Focusable}
   */
  blur: function blur() {
    blur.shared.focusedStateBefore = this.getStateValue($ui.STATE_NAME_FOCUSED);
    this.setStateValue($ui.STATE_NAME_FOCUSED, false);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isFocused: function () {
    return this.getStateValue($ui.STATE_NAME_FOCUSED);
  }
})
.build();

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_FOCUSED: 'focused'
});
