"use strict";

/**
 * @mixin $ui.Validatable
 * @extends $ui.BinaryStateful
 */
$ui.Validatable = $oop.createClass('$ui.Validatable')
.blend($ui.BinaryStateful)
.define(/** @lends $ui.Validatable# */{
  /** @ignore */
  init: function () {
    this.addBinaryState($ui.STATE_NAME_INVALID);
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Validatable}
   */
  invalidateBy: function invalidateBy(sourceId) {
    invalidateBy.shared.invalidStateBefore = this.getStateValue($ui.STATE_NAME_INVALID);
    this.addBinaryStateSourceId($ui.STATE_NAME_INVALID, sourceId);
    return this;
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Validatable}
   */
  validateBy: function validateBy(sourceId) {
    validateBy.shared.invalidStateBefore = this.getStateValue($ui.STATE_NAME_INVALID);
    this.removeBinaryStateSourceId($ui.STATE_NAME_INVALID, sourceId);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isValid: function () {
    return !this.isStateOn($ui.STATE_NAME_INVALID);
  }
})
.build();

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_INVALID: 'invalid'
});
