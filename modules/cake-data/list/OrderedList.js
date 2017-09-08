"use strict";

/**
 * @function $data.OrderedList.create
 * @param {Object} [properties]
 * @param {Array} [properties.data] If data has content, it must be already
 * ordered!
 * @param {function} [comparer]
 * @returns {$data.OrderedList}
 */

/**
 * @class $data.OrderedList
 * @extends $data.DataContainer
 * @extends $data.ArrayContainer
 * @extends $data.SetContainer
 */
$data.OrderedList = $oop.getClass('$data.OrderedList')
.mix($oop.getClass('$data.DataContainer'))
.mix($oop.getClass('$data.ArrayContainer'))
.mix($oop.getClass('$data.SetContainer'))
.define(/** @lends $data.OrderedList# */{
  /** @ignore */
  spread: function () {
    /**
     * @member {$data.Comparer} $data.OrderedList#comparer
     * @protected
     */
    this.comparer = this.comparer || this._defaultComparer;
  },

  /** @ignore */
  init: function () {
    $assert.isFunction(this.comparer, "Invalid comparer function");
  },

  /**
   * @memberOf $data.OrderedList
   * @param {*} a
   * @param {*} b
   * @returns {number}
   * @private
   */
  _defaultComparer: function (a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  },

  /**
   * Gets splice index of specified value in the specified range of interest.
   * Performs binary search on the list's sorted array buffer and returns the
   * lowest index where a given value would be spliced into or out of the list.
   * For exact hits, this is the actual position, but no information is given
   * whether the value is present in the list or not.
   * @param {*} value
   * @param {number} [start=0]
   * @param {number} [end]
   * @returns {number}
   * @private
   * @todo Add public `#indexOf()` that returns -1 for absent values
   */
  _spliceIndexOf: function (value, start, end) {
    var data = this.data;

    start = start || 0;
    end = end === undefined ? data.length : end;

    var medianPos = Math.floor((start + end) / 2),
        medianValue = data[medianPos];

    if (data[start] >= value) {
      // out of range hit
      return start;
    } else if (end - start <= 1) {
      // between two adjacent values
      return end;
    } else if (medianValue >= value) {
      // narrowing range to lower half
      return this._spliceIndexOf(value, start, medianPos);
    } else if (medianValue < value) {
      // narrowing range to upper half
      return this._spliceIndexOf(value, medianPos, end);
    } else {
      // default index, should never be reached
      return -1;
    }
  },

  /**
   * @param {*} item
   * @returns {$data.OrderedList}
   */
  setItem: function (item) {
    var data = this.data;
    data.splice(this._spliceIndexOf(item), 0, item);
    this._itemCount = data.length;
    return this;
  },

  /**
   * @param {*} item
   * @returns {$data.OrderedList}
   */
  deleteItem: function (item) {
    var data = this.data,
        spliceIndex = this._spliceIndexOf(item);

    if (data[spliceIndex] === item) {
      // when item is present in list
      data.splice(spliceIndex, 1);
      this._itemCount = data.length;
    }

    return this;
  },

  /**
   * @param {*} item
   * @returns {boolean}
   */
  hasItem: function (item) {
    var data = this.data,
        spliceIndex = this._spliceIndexOf(item);
    return data[spliceIndex] === item;
  },

  /**
   * @param {function} callback
   * @param {Object} [context]
   * @returns {$data.OrderedList}
   */
  forEachItem: function (callback, context) {
    var data = this.data,
        itemCount = data.length,
        i;

    for (i = 0; i < itemCount; i++) {
      if (callback.call(context || this, data[i]) === false) {
        break;
      }
    }

    return this;
  },

  /**
   * Returns list items in a sorted array starting from `startValue` up to but
   * not including `endValue`.
   * @param {*} startValue Value marking start of the range.
   * @param {*} endValue Value marking end of the range.
   * @param {number} [offset=0] Number of items to skip at start.
   * @param {number} [limit=Infinity] Number of items to fetch at most.
   * @returns {Array} Shallow copy of the array's affected segment.
   */
  getRange: function (startValue, endValue, offset, limit) {
    offset = offset || 0;
    limit = limit === undefined ? Infinity : limit;

    var startIndex = this._spliceIndexOf(startValue) + offset,
        endIndex = Math.min(
            this._spliceIndexOf(endValue),
            startIndex + limit);

    return this.data.slice(startIndex, endIndex);
  },

  /**
   * Returns list items in a sorted array wrapped in an instance of the current
   * class; starting from `startValue` up to but not including `endValue`.
   * @param {*} startValue Value marking start of the range.
   * @param {*} endValue Value marking end of the range.
   * @param {number} [offset=0] Number of items to skip at start.
   * @param {number} [limit=Infinity] Number of items to fetch at most.
   * @returns {$data.OrderedList}
   */
  getRangeWrapped: function (startValue, endValue, offset, limit) {
    return $oop.getClass(this.__classId).create({
      data: this.getRange(startValue, endValue, offset, limit)
    });
  }
});

$oop.getClass('$data.DataContainer')
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.OrderedList}
   */
  asOrderedList: function () {
    return this.as($data.OrderedList);
  }
});

$oop.getClass('$data.SetContainer')
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.OrderedList}
   */
  toOrderedList: function () {
    return this.to($data.OrderedList);
  }
});

$oop.getClass('$data.KeyValueContainer')
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.OrderedList}
   */
  toOrderedList: function () {
    return this.to($data.OrderedList);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.OrderedList}
   */
  asOrderedList: function () {
    return $data.OrderedList.create({data: this});
  }
});
