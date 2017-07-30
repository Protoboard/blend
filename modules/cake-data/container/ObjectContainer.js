"use strict";

/**
 * Maintains object data buffer. To be added to `DataContainer`s that use an
 * object for storage.
 * @mixin $data.ObjectContainer
 * @augments $data.DataContainer
 * @implements $data.Clearable
 */
$data.ObjectContainer = $oop.getClass('$data.ObjectContainer')
.expect($oop.getClass('$data.DataContainer'))
.implement($oop.getClass('$data.Clearable'))
.define(/** @lends $data.ObjectContainer# */{
  /** @ignore */
  init: function () {
    $assert.isObjectOptional(this.data, "Invalid object buffer");

    /**
     * @member {object|Array} $data.ObjectContainer#data
     */
    this.data = this.data || {};
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
