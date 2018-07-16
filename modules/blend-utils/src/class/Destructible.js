"use strict";

/**
 * Adds a destroy method for final cleanup of instances.
 * todo Should be included in Class
 * @interface $utils.Destructible
 */
$utils.Destructible = $oop.createClass('$utils.Destructible')
.define(/** @lends $utils.Destructible# */{
  /** Runs final cleanup of instance */
  destroy: function () {}
})
.build();
