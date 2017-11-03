"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   * @todo Need better (but still fast) detection.
   */
  isBrowser: function () {
    return typeof window === 'object';
  }
});
