"use strict";

/**
 * @mixin $utils.Equatable
 */
$utils.Equatable = $oop.createClass('$utils.Equatable')
.define(/** @lends $utils.Equatable# */{
  /**
   * Tells whether current instance equals to the specified instance.
   * @param {$utils.Equatable|$oop.Class} instance
   * @returns {boolean}
   */
  equals: function (instance) {
    return instance && ( // must have value
        this === instance || // either same instance
        this.__classId === instance.__classId); // or shares class
  }
})
.build();
