"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Escapes commas in a string. To be used in `Array#map()`.
   * @param {string} string
   * @returns {string}
   */
  escapeCommas: function (string) {
    return string && string.replace(/,/g, '\\,');
  },

  /**
   * Wraps input string in single quotes. To be used in `Array#map()`.
   * @param {string} string
   * @returns {string}
   */
  addQuotes: function (string) {
    return "'" + string + "'";
  }
});
