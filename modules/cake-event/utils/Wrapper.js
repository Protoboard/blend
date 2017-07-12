"use strict";

/**
 * @mixin $event.Wrapper
 * @mixes $utils.Cloneable
 * @todo Move to cake-utils?
 */
$event.Wrapper = $oop.getClass('$event.Wrapper')
.mix($utils.Cloneable)
.define(/** @lends $event.Wrapper# */{
  /**
   * @ignore
   */
  init: function () {
    /**
     * Variable wrapped by the current instance.
     * @type {*}
     */
    this.wrapped = undefined;
  },

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
