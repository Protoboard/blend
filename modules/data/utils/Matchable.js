"use strict";

/**
 * Describes a pattern that can be matched against static variables.
 * @interface $data.Matchable
 */
$data.Matchable = $oop.getClass('$data.Matchable')
.define(/** @lends $data.Matchable# */{
  /**
   * Determines whether specified instance matches current one.
   * @param {...*} instance
   * @returns {boolean}
   */
  matches: function (instance) {}
});
