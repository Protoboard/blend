"use strict";

/**
 * Wraps any value or object in an `$oop.Class` instance.
 * @mixin $event.Wrapper
 * @augments $utils.Cloneable
 * @todo Move to cake-utils?
 */
$event.Wrapper = $oop.getClass('$event.Wrapper')
.expect($utils.Cloneable)
.define(/** @lends $event.Wrapper# */{
  /**
   * Variable wrapped by the current instance.
   * @member {*} wrapped
   */

  /**
   * Clones `Wrapper` instance.
   * @returns {$event.Wrapper}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.wrapped = this.wrapped;
    return cloned;
  },

  /**
   * Wraps specified variable.
   * @param {*} wrapped
   * @returns {$event.Wrapper}
   */
  wrap: function (wrapped) {
    this.wrapped = wrapped;
    return this;
  }
});
