"use strict";

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   */
  isHtml: function () {
    return $utils.isBrowser() ||
        $utils.isNode() && $widget.nodeWidgetRenderMethod === 'html';
  }
});
