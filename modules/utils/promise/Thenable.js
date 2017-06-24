"use strict";

/**
 * Basis for promises. Allows baseline documentation-level compatibility with
 * promises from external libraries. (Eg. Q, jQuery, ES6, etc.)
 * @interface $utils.Thenable
 */
$utils.Thenable = $oop.getClass('$utils.Thenable')
  .define(/** @lends $utils.Thenable# */{
    /**
     * @param {function} successHandler
     * @param {function} failureHandler
     * @param {function} progressHandler
     * @returns {$utils.Thenable}
     */
    then: function (successHandler, failureHandler, progressHandler) {
    }
  });

$oop.copyProperties($assert, /** @lends $assert# */{
  /**
   * @param {object} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isThenable: function (expr, message) {
    return $assert.assert(
      expr instanceof Object && typeof expr.then === 'function',
      message);
  },

  /**
   * @param {object} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isThenableOptional: function (expr, message) {
    return $assert.assert(
      expr === undefined ||
      expr instanceof Object && typeof expr.then === 'function',
      message);
  }
});
