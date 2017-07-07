"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * Generates GUID.
   * @returns {string}
   * @todo Replace w/ actual GUID generation.
   */
  generateGuid: function () {
    return Math.round(Math.random() * 10e9).toString();
  }
});
