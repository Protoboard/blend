"use strict";

/**
 * Adds focused state to host class. Usually mixed to input widgets.
 * @mixin $widgets.Focusable
 * @augments $widget.Widget
 * @todo Use #state container?
 */
$widgets.Focusable = $oop.getClass('$widgets.Focusable')
.expect($widget.Widget)
.define(/** @lends $widgets.Focusable# */{
  /**
   * @member {boolean} $widgets.Focusable#isFocused
   */

  /** @ignore */
  defaults: function () {
    this.isFocused = this.isFocused || false;
  },

  /**
   * @returns {$widgets.Focusable}
   */
  focus: function focus() {
    var isFocusedBefore = this.isFocused;
    this.isFocused = true;
    focus.shared.isFocusedBefore = isFocusedBefore;
    return this;
  },

  /**
   * @returns {$widgets.Focusable}
   */
  blur: function blur() {
    var isFocusedBefore = this.isFocused;
    this.isFocused = false;
    blur.shared.isFocusedBefore = isFocusedBefore;
    return this;
  }
});
