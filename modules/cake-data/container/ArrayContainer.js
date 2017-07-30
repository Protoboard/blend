"use strict";

/**
 * Maintains Array data buffer. To be added to `DataContainer`s that use an
 * array for storage.
 * @mixin $data.ArrayContainer
 * @augments $data.DataContainer
 * @implements $data.Clearable
 */
$data.ArrayContainer = $oop.getClass('$data.ArrayContainer')
.expect($oop.getClass('$data.DataContainer'))
.implement($oop.getClass('$data.Clearable'))
.define(/** @lends $data.ArrayContainer# */{
  /** @ignore */
  init: function () {
    $assert.isArrayOptional(this.data, "Invalid array buffer");

    /**
     * @member {Array} $data.ArrayContainer#data
     */
    this.data = this.data || [];
  },

  /**
   * Clears container.
   * @returns {$data.ArrayContainer}
   */
  clear: function () {
    this.data = [];
    return this;
  },

  /**
   * @returns {boolean}
   */
  isEmpty: function () {
    return !this.data.length;
  }
});
