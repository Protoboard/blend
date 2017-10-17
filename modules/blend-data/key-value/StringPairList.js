"use strict";

/**
 * @function $data.StringPairList.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$data.StringPairList}
 */

/**
 * Key-value container with any-type keys and string values.
 * **Pairs are not unique.**
 * @class $data.StringPairList
 * @extends $data.PairList
 */
$data.StringPairList = $oop.getClass('$data.StringPairList')
.blend($oop.getClass('$data.PairList'))
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
  asStringPairList: function () {
    return this.as($data.StringPairList);
  }
});

$oop.getClass('$data.SetContainer')
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.StringPairList}
   */
  toStringPairList: function () {
    return this.to($data.StringPairList);
  }
});

$oop.getClass('$data.KeyValueContainer')
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.StringPairList}
   */
  toStringPairList: function () {
    return this.to($data.StringPairList);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.StringPairList}
   */
  asStringPairList: function () {
    return $data.StringPairList.create({data: this});
  }
});
