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
$utils.Interval = $oop.createClass('$utils.Interval')
.blend($utils.Timer)
.define(/** @lends $utils.Interval# */{
  /**
   * @inheritDoc
   * @returns {$utils.Interval}
   */
  clearTimer: function () {
    clearInterval(this.timerId);
    return this;
  }
})
.build();

/** @external Number */
$oop.copyProperties(Number.prototype, /** @lends Number# */{
  /**
   * Converts `Number` to `Interval` instance.
   * @param {Object} [properties]
   * @returns {$utils.Interval}
   */
  toInterval: function (properties) {
    return $utils.Interval.create({timerId: this.valueOf()}, properties);
  }
});
