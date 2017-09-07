"use strict";

/**
 * Describes a class the instances of which may be reinterpreted to other
 * classes.
 * @interface $data.Reinterpretable
 * @todo Move to cake-utils?
 */
$data.Reinterpretable = $oop.getClass('$data.Reinterpretable')
.define(/** @lends $data.Reinterpretable# */{
  /**
   * @param {$oop.Class} Target
   * @returns {*}
   */
  as: function (Target) {}
});
