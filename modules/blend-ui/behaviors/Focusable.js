"use strict";

/**
 * Adds focused state to host class. Usually mixed to input widgets.
 * @mixin $ui.Focusable
 * @augments $widget.Widget
 * @todo Use #state container?
 */
$ui.Focusable = $oop.getClass('$ui.Focusable')
.expect($widget.Widget)
.define(/** @lends $ui.Focusable# */{
  /**
   * @member {boolean} $ui.Focusable#isFocused
   */

  /** @ignore */
  defaults: function () {
    this.isFocused = this.isFocused || false;
  },

  /**
   * @returns {$ui.Focusable}
   */
  focus: function focus() {
    var isFocusedBefore = this.isFocused;
    this.isFocused = true;
    focus.shared.isFocusedBefore = isFocusedBefore;
    return this;
  },

  /**
   * @returns {$ui.Focusable}
   */
  blur: function blur() {
    var isFocusedBefore = this.isFocused;
    this.isFocused = false;
    blur.shared.isFocusedBefore = isFocusedBefore;
    return this;
  }
});
