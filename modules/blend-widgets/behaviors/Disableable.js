"use strict";

/**
 * @mixin $widgets.Disableable
 * @mixes $widgets.BinaryStateful
 */
$widgets.Disableable = $oop.getClass('$widgets.Disableable')
.blend($oop.getClass('$widgets.BinaryStateful'))
.define(/** @lends $widgets.Disableable# */{
  /** @ignore */
  init: function () {
    this.addBinaryState($widgets.STATE_NAME_DISABLED, true);
  },

  /**
   * @param {string} sourceId
   * @returns {$widgets.Disableable}
   */
  disableBy: function (sourceId) {
    this.addBinaryStateSourceId($widgets.STATE_NAME_DISABLED, sourceId);
    return this;
  },

  /**
   * @param {string} sourceId
   * @returns {$widgets.Disableable}
   */
  enableBy: function (sourceId) {
    this.removeBinaryStateSourceId($widgets.STATE_NAME_DISABLED, sourceId);
    return this;
  },

  /**
   * @returns {boolean}
   */
  isDisabled: function () {
    return this.isStateOn($widgets.STATE_NAME_DISABLED);
  }
});

$oop.copyProperties($widgets, /** @lends $widgets */{
  /**
   * @constant
   */
  STATE_NAME_DISABLED: 'disabled'
});
