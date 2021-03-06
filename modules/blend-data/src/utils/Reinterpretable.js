"use strict";

/**
 * Describes a class the instances of which may be reinterpreted to other
 * classes.
 * @interface $data.Reinterpretable
 */
$data.Reinterpretable = $oop.createClass('$data.Reinterpretable')
.define(/** @lends $data.Reinterpretable# */{
  /**
   * @param {$oop.Class} Target
   * @returns {*}
   */
  as: function (Target) {}
})
.build();
