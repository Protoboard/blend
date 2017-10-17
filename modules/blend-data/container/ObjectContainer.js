"use strict";

/**
 * Maintains object data buffer. To be added to `DataContainer`s that use an
 * object for storage.
 * @mixin $data.ObjectContainer
 * @augments $data.DataContainer
 * @implements $data.Clearable
 * @todo Add clone() w/ shallow copy?
 */
$data.ObjectContainer = $oop.getClass('$data.ObjectContainer')
.expect($oop.getClass('$data.DataContainer'))
.implement($oop.getClass('$data.Clearable'))
.define(/** @lends $data.ObjectContainer# */{
  /**
   * @member {object|Array} $data.ObjectContainer#data
   */

  /** @ignore */
  spread: function () {
    this.data = this.data || {};
  },

  /** @ignore */
  init: function () {
    $assert.isObject(this.data, "Invalid object buffer");
  },

  /**
   * Clears container.
   * @returns {$data.ObjectContainer}
   */
  clear: function () {
    this.data = {};
    return this;
  },

  /**
   * @returns {boolean}
   */
  isEmpty: function () {
    return $data.isEmptyObject(this.data);
  }
});
