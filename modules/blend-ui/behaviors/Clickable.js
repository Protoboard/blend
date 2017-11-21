"use strict";

/**
 * @mixin $ui.Clickable
 * @augments $widget.Widget
 */
$ui.Clickable = $oop.getClass('$ui.Clickable')
.expect($widget.Widget)
.define(/** @lends $ui.Clickable# */{
  /**
   * @returns {$ui.Clickable}
   */
  click: function () {
    this.trigger($ui.EVENT_CLICKABLE_CLICK);
    return this;
  }
});
