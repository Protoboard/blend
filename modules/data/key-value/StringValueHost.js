"use strict";

/**
 * @mixin $data.StringValueHost
 * @augments $data.KeyValueContainer
 */
$data.StringValueHost = $oop.getClass('$data.StringValueHost')
  .require($oop.getClass('$data.KeyValueContainer'))
  .define(/** @lends $data.StringValueHost# */{
    /**
     * @type {string}
     * @constant
     */
    valueType: $data.VALUE_TYPE_STRING,

    /**
     * @param {$data.StringKeyHost} rightContainer
     * @returns {$data.KeyValueContainer}
     */
    join: function (rightContainer) {
      var ResultClass = $data.getJoinResultClass(this, rightContainer),
        result = ResultClass.create();

      this.forEachItem(function (value, key) {
        var values = rightContainer.getValuesForKey(value);
        values.forEach(function (value) {
          result.setItem(key, value);
        });
      });

      return result;
    }
  });
