"use strict";

/**
 * @function $data.Dictionary.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$data.Dictionary}
 */

/**
 * Key-value container with string keys and any-type values.
 * **Pairs are not unique.**
 * @class $data.Dictionary
 * @extends $data.DataContainer
 * @extends $data.ObjectContainer
 * @extends $data.KeyValueContainer
 * @extends $data.StringKeyHost
 */
$data.Dictionary = $oop.getClass('$data.Dictionary')
.blend($oop.getClass('$data.DataContainer'))
.blend($oop.getClass('$data.ObjectContainer'))
.blend($oop.getClass('$data.KeyValueContainer'))
.blend($oop.getClass('$data.StringKeyHost'))
.define(/** @lends $data.Dictionary# */{
  /**
   * @param {string} key
   * @param {*} value
   * @returns {$data.Dictionary}
   */
  setItem: function (key, value) {
    var data = this.data,
        values = data[key];

    if (values instanceof Array) {
      // current item is array
      // only when value doesn't exist
      // adding to array
      values.push(value);
    } else {
      // current item does not exist
      // setting as single value
      data[key] = [value];
    }

    // updating item count
    if (this._itemCount !== undefined) {
      this._itemCount++;
    }

    return this;
  },

  /**
   * @param {string} key
   * @param {*} value
   * @returns {$data.Dictionary}
   */
  deleteItem: function (key, value) {
    var data = this.data,
        values = data[key],
        valueIndex;

    if (values) {
      if (values.length === 1 && values[0] === value) {
        // value is singular
        delete data[key];

        // updating value counter
        if (this._itemCount !== undefined) {
          this._itemCount--;
        }
      } else {
        valueIndex = values.indexOf(value);

        if (valueIndex > -1) {
          // value is present on specified key
          // splicing out value from array
          values.splice(valueIndex, 1);

          // updating value counter
          if (this._itemCount !== undefined) {
            this._itemCount--;
          }
        }
      }
    }

    return this;
  },

  /**
   * @param {string} key
   * @param {*} value
   * @returns {boolean}
   */
  hasItem: function (key, value) {
    var values = this.data[key];
    return !!values && values.indexOf(value) > -1;
  },

  /**
   * @param {function} callback
   * @param {Object} [context]
   * @returns {$data.Dictionary}
   */
  forEachItem: function (callback, context) {
    var data = this.data,
        keys = Object.keys(data),
        keyCount = keys.length,
        i, key, values, valueCount,
        j;

    loop:
        for (i = 0; i < keyCount; i++) {
          key = keys[i];
          values = data[key];
          valueCount = values.length;
          for (j = 0; j < valueCount; j++) {
            if (callback.call(context || this, values[j], key) === false) {
              break loop;
            }
          }
        }

    return this;
  },

  /**
   * @param {string} key
   * @returns {Array}
   */
  getValuesForKey: function (key) {
    return this.data[key] || [];
  }
});

$oop.getClass('$data.DataContainer')
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.Dictionary}
   */
  asDictionary: function () {
    return this.as($data.Dictionary);
  }
});

$oop.getClass('$data.SetContainer')
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.Dictionary}
   */
  toDictionary: function () {
    return this.to($data.Dictionary);
  }
});

$oop.getClass('$data.KeyValueContainer')
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.Dictionary}
   */
  toDictionary: function () {
    return this.to($data.Dictionary);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.Dictionary}
   */
  asDictionary: function () {
    return $data.Dictionary.create({data: this});
  }
});
