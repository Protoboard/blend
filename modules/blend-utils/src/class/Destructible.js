"use strict";

/**
 * Adds a destroy method for final cleanup of instances.
 * @interface $utils.Destructible
 */
$utils.Destructible = $oop.createClass('$utils.Destructible')
.define(/** @lends $utils.Destructible# */{
  /** @returns {$utils.Destructible} */
  destroy: function () {}
})
.build();
