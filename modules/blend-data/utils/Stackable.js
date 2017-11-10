"use strict";

/**
 * Describes classes that behave like stacks, ie. are only modifiable at their
 * ends.
 * @interface $data.Stackable
 * @todo Move to utils?
 */
$data.Stackable = $oop.getClass('$data.Stackable')
.define(/** @lends $data.Stackable# */{
  /**
   * @param {*} element
   * @returns {$data.Stackable}
   */
  push: function (element) {},

  /**
   * @returns {*} Removed element
   */
  pop: function () {},

  /**
   * @param {*} element
   * @returns {$data.Stackable}
   */
  unshift: function (element) {},

  /**
   * @returns {*} Removed element
   */
  shift: function () {},

  /**
   * @param {$data.Stackable} stackable
   * @returns {$data.Stackable} Concatenated stackable
   */
  concat: function (stackable) {}
});
