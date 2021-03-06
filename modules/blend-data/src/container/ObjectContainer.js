"use strict";

/**
 * Maintains object data buffer. To be added to `DataContainer`s that use an
 * object for storage.
 * @mixin $data.ObjectContainer
 * @augments $data.DataContainer
 * @implements $data.Clearable
 * @todo Add clone() w/ shallow copy?
 */
$data.ObjectContainer = $oop.createClass('$data.ObjectContainer')
.expect($data.DataContainer)
.implement($data.Clearable)
.define(/** @lends $data.ObjectContainer# */{
  /**
   * @member {object|Array} $data.ObjectContainer#data
   */

  /** @ignore */
  init: function () {
    $assert.isObjectOptional(this.data, "Invalid object buffer");

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
})
.build();
