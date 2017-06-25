"use strict";

/**
 * @function $data.DataContainer.create
 * @param {object|Array} [data]
 * @returns {$data.DataContainer}
 */

/**
 * Maintains data and provides access to it. Supports life cycle, clearing
 * and cloning.
 * @class $data.DataContainer
 * @implements $utils.Destructible
 * @implements $data.Clearable
 * @extends $utils.Cloneable
 */
$data.DataContainer = $oop.getClass('$data.DataContainer')
.extend($utils.Cloneable)
.implement($utils.Destructible)
.implement($oop.getClass('$data.Clearable'))
.define(/** @lends $data.DataContainer# */{
  /**
   * @param {object|Array} [data]
   * @ignore
   */
  init: function (data) {
    $assert.isObjectOptional(data, "Invalid data buffer");

    /**
     * @member {object|Array} $data.DataContainer#data
     */
    this.data = data || {};
  },

  /**
   * @inheritDoc
   * @returns {$data.DataContainer}
   */
  destroy: function () {
    this.clear();
    return this;
  },

  /**
   * @inheritDoc
   * @returns {$data.DataContainer}
   */
  clone: function clone() {
    var cloned = clone.returned;
    cloned.data = this.data;
    return cloned;
  },

  /**
   * Clears container.
   * @returns {$data.DataContainer}
   */
  clear: function () {
    if (this.data instanceof Array) {
      this.data = [];
    } else {
      this.data = {};
    }
    return this;
  },

  /**
   * @param {function} callback
   * @param {Object} [context]
   * @param {number} [argIndex=0]
   * @param {...*} arg
   * @returns {*}
   */
  passDataTo: function (callback, context, argIndex, arg) {
    var args;
    if (arguments.length > 2) {
      args = slice.call(arguments, 2);
      args.splice(argIndex, 0, this.data);
      return callback.apply(context, args);
    } else {
      return callback.call(context, this.data);
    }
  },

  /**
   * @todo Move to Passable?
   * @param {function} callback
   * @param {Object} [context]
   * @param {number} [argIndex=0]
   * @param {...*} arg
   * @returns {*}
   */
  passSelfTo: function (callback, context, argIndex, arg) {
    var args;
    if (arguments.length > 2) {
      args = slice.call(arguments, 2);
      args.splice(argIndex, 0, this);
      return callback.apply(context, args);
    } else {
      return callback.call(context, this);
    }
  }
});
