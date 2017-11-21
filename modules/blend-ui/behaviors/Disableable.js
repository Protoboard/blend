"use strict";

/**
 * @mixin $ui.Disableable
 * @mixes $ui.BinaryStateful
 */
$ui.Disableable = $oop.getClass('$ui.Disableable')
.blend($oop.getClass('$ui.BinaryStateful'))
.define(/** @lends $ui.Disableable# */{
  /** @ignore */
  init: function () {
    this.addBinaryState($ui.STATE_NAME_DISABLED, true);
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Disableable}
   */
  disableBy: function (sourceId) {
    this.addBinaryStateSourceId($ui.STATE_NAME_DISABLED, sourceId);
    return this;
  },

  /**
   * @param {string} sourceId
   * @returns {$ui.Disableable}
   */
  enableBy: function (sourceId) {
    this.removeBinaryStateSourceId($ui.STATE_NAME_DISABLED, sourceId);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isDisabled: function () {
    return this.isStateOn($ui.STATE_NAME_DISABLED);
  }
});

$oop.copyProperties($ui, /** @lends $ui */{
  /**
   * @constant
   */
  STATE_NAME_DISABLED: 'disabled'
});
