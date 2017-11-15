"use strict";

/**
 * @mixin $widgets.Clickable
 * @augments $widget.Widget
 */
$widgets.Clickable = $oop.getClass('$widgets.Clickable')
.expect($widget.Widget)
.define(/** @lends $widgets.Clickable# */{
  /**
   * @returns {$widgets.Clickable}
   */
  click: function () {
    this.trigger($widgets.EVENT_CLICKABLE_CLICK);
    return this;
  }
});
