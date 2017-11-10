"use strict";

/**
 * @mixin $data.Comparable
 */
$data.Comparable = $oop.getClass('$data.Comparable')
.define(/** @lends $data.Comparable# */{
  /**
   * Tells whether current instance evaluates "less" than the specified
   * instance.
   * @param {$data.Comparable|$oop.Class} instance
   * @returns {boolean}
   */
  lessThan: function (instance) {
    return instance && // must have value
        this !== instance && // must not be same instance
        this.__classId === instance.__classId; // but shares class
  },

  /**
   * Tells whether current instance evaluates "greater" than the specified
   * instance.
   * @param {$data.Comparable|$oop.Class} instance
   * @returns {boolean}
   */
  greaterThan: function (instance) {
    return instance && // must have value
        this !== instance && // must not be same instance
        this.__classId === instance.__classId; // but shares class
  }
});
