"use strict";

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Detects whether HTML rendering is available and is set as default.
   * @returns {boolean}
   */
  isHtml: function () {
    return $utils.isBrowser() ||
        $utils.isNode() && $widget.nodeWidgetRenderMethod === 'html';
  }
});
