"use strict";

/**
 * Describes a class the instances of which may be transformed into
 * instances of other classes.
 * @interface $data.Transformable
 */
$data.Transformable = $oop.getClass('$data.Transformable')
.define(/** @lends $data.Transformable# */{
  /**
   * @param {$oop.Class} Target
   * @returns {*}
   */
  to: function (Target) {}
});