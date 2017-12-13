"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   */
  isBrowser: function () {
    return typeof window === 'object';
  },

  /**
   * Detects whether we are running in a browser environment.
   * @returns {boolean}
   */
  isNode: function () {
    return typeof global === 'object';
  }
});
