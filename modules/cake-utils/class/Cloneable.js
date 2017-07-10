"use strict";

/**
 * Creates a new instance of identical class and state.
 * @mixin $utils.Cloneable
 */
$utils.Cloneable = $oop.getClass('$utils.Cloneable')
.define(/** @lends $utils.Cloneable# */{
  /** @ignore */
  init: function () {
    /**
     * Constructor arguments.
     * @type {Arguments}
     * @private
     */
    this._ctrArguments = arguments;
  },

  /**
   * Clones current instance.
   * @returns {$utils.Cloneable}
   */
  clone: function clone() {
    var Class = $oop.getClass(this.__classId);
    return Class.create.apply(Class, this._ctrArguments);
  }
});
