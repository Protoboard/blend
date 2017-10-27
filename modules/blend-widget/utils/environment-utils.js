"use strict";

$oop.copyProperties($widget, /** @lends $widget */{
  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   * @todo Need detection that includes Node.js.
   */
  isHtml: function () {
    return typeof window === 'object';
  },

  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   * @todo Need better (but still fast) detection.
   */
  isBrowser: function () {
    return typeof window === 'object';
  }
});
