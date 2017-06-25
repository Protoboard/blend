"use strict";

/**
 * @mixin $data.StringKeyHost
 * @augments $data.KeyValueContainer
 */
$data.StringKeyHost = $oop.getClass('$data.StringKeyHost')
.require($oop.getClass('$data.KeyValueContainer'))
.define(/** @lends $data.StringKeyHost# */{
  /**
   * @type {string}
   * @constant
   */
  keyType: $data.KEY_TYPE_STRING,

  /**
   * @method $data.StringKeyHost#getValuesForKey
   * @param {string} key
   * @returns {Array}
   */

  /**
   * @param {$data.StringValueHost} leftContainer
   * @returns {$data.KeyValueContainer}
   */
  joinTo: function (leftContainer) {
    return leftContainer.join(this);
  }
});
