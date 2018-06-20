"use strict";

/**
 * @function $data.PairList.create
 * @param {Object} [properties]
 * @param {Array} [properties.data]
 * @returns {$data.PairList}
 */

/**
 * Key-value container with any-type keys and any-type values.
 * **Pairs are not unique.**
 * @class $data.PairList
 * @extends $data.DataContainer
 * @extends $data.ArrayContainer
 * @extends $data.KeyValueContainer
 */
$data.PairList = $oop.createClass('$data.PairList')
.blend($data.DataContainer)
.blend($data.ArrayContainer)
.blend($data.KeyValueContainer)
.define(/** @lends $data.PairList# */{
  /**
   * @param {string} key
   * @param {*} value
   * @returns {$data.PairList}
   */
  setItem: function (key, value) {
    this.data.push({
      key: key,
      value: value
    });

    if (this._itemCount !== undefined) {
      this._itemCount++;
    }

    return this;
  },

  /**
   * @param {string} key
   * @param {*} [value]
   * @returns {$data.PairList}
   * @todo Allow when low-performance switch is on?
   */
  deleteItem: function (key, value) {
    $assert.fail([
      this.__className + "does not support item deletion."
    ].join(" "));
    /* istanbul ignore next */
    return this;
  },

  /**
   * @param {string} key
   * @param {*} [value]
   * @returns {boolean}
   * @todo Allow when low-performance switch is on?
   */
  hasItem: function (key, value) {
    $assert.fail([
      this.__className + "does not support item testing."
    ].join(" "));
    /* istanbul ignore next */
    return false;
  },

  /**
   * @param {function} callback Function to be called for each item
   * @param {Object} [context] Context for callback
   * @returns {$data.PairList} Current instance
   */
  forEachItem: function (callback, context) {
    var data = this.data,
        itemCount = data.length,
        i, pair;

    for (i = 0; i < itemCount; i++) {
      pair = data[i];
      if (callback && callback.call(context || this, pair.value, pair.key) === false) {
        break;
      }
    }

    return this;
  }
})
.build();

$data.DataContainer
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.PairList}
   */
  asPairList: function () {
    return this.as($data.PairList);
  }
});

$data.SetContainer
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.PairList}
   */
  toPairList: function () {
    return this.to($data.PairList);
  }
});

$data.KeyValueContainer
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.PairList}
   */
  toPairList: function () {
    return this.to($data.PairList);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.PairList}
   */
  asPairList: function () {
    return $data.PairList.create({data: this});
  }
});
