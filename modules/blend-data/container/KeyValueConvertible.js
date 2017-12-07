"use strict";

/**
 * Describes a class that can be transformed into a KeyValueContainer. To be
 * implemented by `DataContainer` classes.
 * @interface $data.KeyValueConvertible
 */
$data.KeyValueConvertible = $oop.createClass('$data.KeyValueConvertible')
.define(/** @lends $data.KeyValueConvertible */{
  /**
   * @param {$data.KeyValueContainer} keyValueContainer
   * @returns {$data.DataContainer}
   */
  fromKeyValueContainer: function (keyValueContainer) {}
})
.build();
