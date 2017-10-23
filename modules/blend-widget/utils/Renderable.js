"use strict";

/**
 * Describes a renderable object.
 * @interface $widget.Renderable
 */
$widget.Renderable = $oop.getClass('$widget.Renderable')
.define(/** @lends $widget.Renderable# */{
  /**
   * @param element
   * @returns {$widget.Renderable}
   */
  renderInto: function (element) {},

  /**
   * @returns {$widget.Renderable}
   */
  reRender: function () {},

  /**
   * @returns {$widget.Renderable}
   */
  reRenderContents: function () {}
});
