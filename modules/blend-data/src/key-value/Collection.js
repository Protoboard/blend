"use strict";

/**
 * @function $data.Collection.create
 * @param {Object} [properties]
 * @param {object|Array} [properties.data]
 * @returns {$data.Collection}
 */

/**
 * Key-value container with string keys and any-type values.
 * Pairs are unique.
 * @class $data.Collection
 * @extends $data.DataContainer
 * @extends $data.ObjectContainer
 * @extends $data.KeyValueContainer
 * @extends $data.StringKeyHost
 */
$data.Collection = $oop.createClass('$data.Collection')
.blend($data.DataContainer)
.blend($data.ObjectContainer)
.blend($data.KeyValueContainer)
.blend($data.StringKeyHost)
.define(/** @lends $data.Collection# */{
  /**
   * @type {string}
   * @constant
   */
  keyMultiplicity: $data.KEY_MUL_UNIQUE,

  /**
   * @param {string} key
   * @param {*} value
   * @returns {$data.Collection}
   */
  setItem: function (key, value) {
    var data = this.data,
        hasKey = hOP.call(data, key);

    data[key] = value;

    if (!hasKey && this._itemCount !== undefined) {
      this._itemCount++;
    }

    return this;
  },

  /**
   * @param {string} key
   * @param {*} [value]
   * @returns {$data.Collection}
   */
  deleteItem: function (key, value) {
    var data = this.data,
        hasValue = value === undefined ?
            hOP.call(data, key) :
            data[key] === value;

    if (hasValue) {
      delete data[key];

      if (this._itemCount !== undefined) {
        this._itemCount--;
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
    return this.getValue(key) === value;
  },

  /**
   * @param {function} callback Function to be called for each item
   * @param {Object} [context] Context for callback
   * @returns {$data.Collection} Current instance
   */
  forEachItem: function (callback, context) {
    var data = this.data,
        keys = Object.keys(data),
        keyCount = keys.length,
        i, key;

    for (i = 0; i < keyCount; i++) {
      key = keys[i];
      if (callback && callback.call(context || this, data[key], key) === false) {
        break;
      }
    }

    return this;
  },

  /**
   * @param {string} key
   * @returns {Array}
   */
  getValuesForKey: function (key) {
    var data = this.data;
    return hOP.call(data, key) ?
        [data[key]] :
        [];
  },

  /**
   * @param {string} key
   * @returns {*}
   */
  getValue: function (key) {
    return this.data[key];
  },

  /**
   * @param {string} key
   * @returns {$data.DataContainer}
   */
  getValueWrapped: function (key) {
    return $data.DataContainer.create({data: this.getValue(key)});
  }
})
.build();

$data.DataContainer
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.Collection}
   */
  asCollection: function () {
    return this.as($data.Collection);
  }
});

$data.SetContainer
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.Collection}
   */
  toCollection: function () {
    return this.to($data.Collection);
  }
});

$data.KeyValueContainer
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.Collection}
   */
  toCollection: function () {
    return this.to($data.Collection);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.Collection}
   */
  asCollection: function () {
    return $data.Collection.create({data: this});
  }
});
