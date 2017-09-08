"use strict";

/**
 * @function $data.DataContainer.create
 * @param {Object} [properties]
 * @param {*} [properties.data]
 * @returns {$data.DataContainer}
 */

/**
 * Maintains data and provides access to it. Supports life cycle, clearing and
 * cloning.
 * @class $data.DataContainer
 * @extends $utils.Cloneable
 * @implements $utils.Destructible
 * @implements $data.Clearable
 * @implements $data.Reinterpretable
 */
$data.DataContainer = $oop.getClass('$data.DataContainer')
.mix($utils.Cloneable)
.implement($utils.Destructible)
.implement($oop.getClass('$data.Clearable'))
.implement($oop.getClass('$data.Reinterpretable'))
.define(/** @lends $data.DataContainer# */{
  /**
   * @member {*} $data.DataContainer#data
   */

  /**
   * Creates a `DataContainer` based with the data provided.
   * @memberOf $data.DataContainer
   * @param {*} data
   * @returns {$data.DataContainer}
   */
  fromData: function (data) {
    return this.create({data: data});
  },

  /**
   * Reinterprets data as the specified `DataContainer` class.
   * @param {$data.DataContainer} DataContainer
   * @returns {$data.DataContainer}
   */
  as: function (DataContainer) {
    return DataContainer.create({data: this.data});
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
   * Clears container.
   * @returns {$data.DataContainer}
   */
  clear: function () {
    this.data = undefined;
    return this;
  },

  /**
   * @returns {boolean}
   */
  isEmpty: function () {
    return this.data === undefined;
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
