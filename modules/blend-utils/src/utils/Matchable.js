"use strict";

/**
 * Describes a pattern that can be matched against static variables.
 * @interface $utils.Matchable
 */
$utils.Matchable = $oop.createClass('$utils.Matchable')
.define(/** @lends $utils.Matchable# */{
  /**
   * Determines whether specified instance matches current one.
   * @param {...*} instance
   * @returns {boolean}
   */
  matches: function (instance) {}
})
.build();
