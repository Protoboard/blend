"use strict";

/**
 * Wraps any value or object in an `$oop.Class` instance.
 * @mixin $event.Wrapper
 * @augments $utils.Cloneable
 * @todo Move to blend-utils?
 */
$event.Wrapper = $oop.createClass('$event.Wrapper')
.expect($utils.Cloneable)
.define(/** @lends $event.Wrapper# */{
  /**
   * Variable wrapped by the current instance.
   * @member {*} $event.Wrapper#wrapped
   */

  /**
   * Wraps specified variable.
   * @param {*} wrapped
   * @returns {$event.Wrapper}
   */
  wrap: function (wrapped) {
    this.wrapped = wrapped;
    return this;
  }
})
.build();
