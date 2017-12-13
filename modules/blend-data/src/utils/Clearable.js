"use strict";

/**
 * @todo Rename to Emptyable?
 * @interface $data.Clearable
 */
$data.Clearable = $oop.createClass('$data.Clearable')
.define(/** @lends $data.Clearable# */{
  /**
   * Resets instance to initial state.
   * @returns {$data.Clearable}
   */
  clear: function () {},

  /**
   * Tells whether container is empty.
   * @returns {boolean}
   */
  isEmpty: function () {}
})
.build();
