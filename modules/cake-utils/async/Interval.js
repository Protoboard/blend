"use strict";

/**
 * @function $utils.Interval.create
 * @param {Object} properties
 * @param {number} properties.timerId
 * @returns {$utils.Interval}
 */

/**
 * Represents an interval ID with promise capabilities. Allows to cancel an
 * interval timer via `window.clearInterval`.
 * @class $utils.Interval
 * @extends $utils.Timer
 */
$utils.Interval = $oop.getClass('$utils.Interval')
.mix($oop.getClass('$utils.Timer'))
.define(/** @lends $utils.Interval# */{
  /**
   * @inheritDoc
   * @returns {$utils.Interval}
   */
  clearTimer: function () {
    clearInterval(this.timerId);
    return this;
  }
});

/** @external Number */
$oop.copyProperties(Number.prototype, /** @lends Number# */{
  /**
   * Converts `Number` to `Interval` instance.
   * @returns {$utils.Interval}
   */
  toInterval: function () {
    return $utils.Interval.create({timerId: this.valueOf()});
  }
});
