"use strict";

/**
 * Describes a class that can be transformed into a SetContainer. To be
 * implemented by `DataContainer` classes.
 * @interface $data.SetConvertible
 */
$data.SetConvertible = $oop.createClass('$data.SetConvertible')
.define(/** @lends $data.SetConvertible */{
  /**
   * @param {$data.SetContainer} setContainer
   * @returns {$data.DataContainer}
   */
  fromSetContainer: function (setContainer) {}
})
.build();
