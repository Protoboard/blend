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
$data.OrderedStringList = $oop.getClass('$data.OrderedStringList')
.mix($oop.getClass('$data.OrderedList'))
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
    return $oop.getClass(this.__classId).create({
      data: this.getRangeByPrefix(prefix, offset, limit)
    });
  }
});

$oop.getClass('$data.DataContainer')
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  toOrderedStringList: function () {
    return $data.OrderedStringList.create({data: this.data});
  }
});

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
  /**
   * @returns {$data.OrderedStringList}
   */
  toOrderedStringList: function () {
    return $data.OrderedStringList.create({data: this});
  }
});
