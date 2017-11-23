"use strict";

/**
 * @mixin $ui.Validatable
 * @extends $ui.BinaryStateful
 * @augments $ui.Inputable
 */
$ui.Validatable = $oop.getClass('$ui.Validatable')
.blend($oop.getClass('$ui.BinaryStateful'))
.expect($oop.getClass('$ui.Inputable'))
.define(/** @lends $ui.Validatable# */{
  /** @ignore */
  init: function () {
    this.addBinaryState($ui.STATE_NAME_INVALID);
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Validatable}
   */
  invalidateBy: function (sourceId) {
    this.addBinaryStateSourceId($ui.STATE_NAME_INVALID, sourceId);
    return this;
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Validatable}
   */
  validateBy: function (sourceId) {
    this.removeBinaryStateSourceId($ui.STATE_NAME_INVALID, sourceId);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isValid: function () {
    return !this.isStateOn($ui.STATE_NAME_INVALID);
  }
});

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_INVALID: 'invalid'
});
