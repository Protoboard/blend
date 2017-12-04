"use strict";

/**
 * @function $data.OrderedStringList.create
 * @param {Object} [properties]
 * @param {string[]} [properties.data] If data has content, it must be already
 * ordered and
 * contain strings only!
 * @returns {$data.OrderedStringList}
 */

/**
 * @class $data.OrderedStringList
 * @extends $data.OrderedList
 */
$data.OrderedStringList = $oop.createClass('$data.OrderedStringList')
.blend($data.OrderedList)
.define(/** @lends $data.OrderedStringList# */{
  /**
   * Increments last character of specified string.
   * @param {string} string
   * @returns {string}
   * @private
   */
  _incLastChar: function (string) {
    return string.slice(0, -1) +
        String.fromCharCode(string.slice(-1).charCodeAt(0) + 1);
  },

  /**
   * @param {string} prefix
   * @param {number} [offset=0]
   * @param {number} [limit=Infinity]
   * @returns {string[]}
   */
  getRangeByPrefix: function (prefix, offset, limit) {
    return this.getRange(prefix, this._incLastChar(prefix), offset, limit);
  },

  /**
   * @param {string} prefix
   * @param {number} [offset=0]
   * @param {number} [limit=Infinity]
   * @returns {$data.OrderedStringList}
   */
  getRangeByPrefixWrapped: function (prefix, offset, limit) {
    return $oop.getClass(this.__className).create({
      data: this.getRangeByPrefix(prefix, offset, limit)
    });
  }
})
.build();

$data.DataContainer
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  asOrderedStringList: function () {
    return this.as($data.OrderedStringList);
  }
});

$data.SetContainer
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  toOrderedStringList: function () {
    return this.to($data.OrderedStringList);
  }
});

$data.KeyValueContainer
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  toOrderedStringList: function () {
    return this.to($data.OrderedStringList);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  asOrderedStringList: function () {
    return $data.OrderedStringList.create({data: this});
  }
});
