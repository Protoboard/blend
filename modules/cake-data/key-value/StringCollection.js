"use strict";

/**
 * @function $data.StringCollection.create
 * @param {Object} [properties]
 * @param {Object|Array} [properties.data]
 * @returns {$data.StringCollection}
 */

/**
 * Key-value container with string keys and string values.
 * Pairs are unique.
 * @class $data.StringCollection
 * @extends $data.Collection
 * @extends $data.StringValueHost
 */
$data.StringCollection = $oop.getClass('$data.StringCollection')
.mix($oop.getClass('$data.Collection'))
.mix($oop.getClass('$data.StringValueHost'));

$oop.getClass('$data.DataContainer')
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.StringCollection}
   */
  asStringCollection: function () {
    return this.as($data.StringCollection);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$data.StringCollection}
   */
  asStringCollection: function () {
    return $data.StringCollection.create({data: this});
  }
});
