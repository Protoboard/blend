"use strict";

/**
 * Interface that represents any object, or class that implements a .toString()
 * method. Instances of Stringifiable classes may be passed around like strings
 * where they're expected alongside strings.
 * @interface $utils.Stringifiable
 */
$utils.Stringifiable = $oop.createClass('$utils.Stringifiable')
.define(/** @lends $utils.Stringifiable# */{
  /** @returns {string} */
  toString: function () {}
})
.build();
