"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Wraps input string in single quotes. To be used in `Array#map()`.
   * @param {string} string
   * @returns {string}
   */
  addQuotes: function (string) {
    return "'" + string + "'";
  }
});
