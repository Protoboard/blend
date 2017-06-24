"use strict";

/**
 * @function $data.StringPairList.create
 * @param {object|Array} [data]
 * @returns {$data.StringPairList}
 */

/**
 * Key-value container with any-type keys and string values.
 * **Pairs are not unique.**
 * @class $data.StringPairList
 * @extends $data.PairList
 */
$data.StringPairList = $oop.getClass('$data.StringPairList')
  .extend($oop.getClass('$data.PairList'))
  .define(/** @lends $data.StringPairList# */{
    /**
     * @type {string}
     * @constant
     */
    valueType: $data.VALUE_TYPE_STRING
  });

$oop.getClass('$data.DataContainer')
  .delegate(/** @lends $data.DataContainer# */{
    /**
     * @returns {$data.StringPairList}
     */
    toStringPairList: function () {
      return $data.StringPairList.create(this._data);
    }
  });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
  /**
   * @returns {$data.StringPairList}
   */
  toStringPairList: function () {
    return $data.StringPairList.create(this);
  }
});
