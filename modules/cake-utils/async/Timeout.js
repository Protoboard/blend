"use strict";

/**
 * @function $utils.Timeout.create
 * @param {Object} properties
 * @param {number} properties.timerId
 * @returns {$utils.Timeout}
 */

/**
 * Represents a timeout ID with promise capabilities. Allows to cancel a
 * timeout via window.clearTimeout.
 * @class $utils.Timeout
 * @extends $utils.Timer
 */
$utils.Timeout = $oop.getClass('$utils.Timeout')
.mix($oop.getClass('$utils.Timer'))
.define(/** @lends $utils.Timeout# */{
  /**
   * @inheritDoc
   * @returns {$utils.Timeout}
   */
  clearTimer: function () {
    clearTimeout(this.timerId);
    return this;
  }
});

/** @external Number */
$oop.copyProperties(Number.prototype, /** @lends Number# */{
  /**
   * Converts `Number` to `Timeout` instance.
   * @returns {$utils.Timeout}
   */
  toTimeout: function () {
    return $utils.Timeout.create({timerId: this.valueOf()});
  }
});
