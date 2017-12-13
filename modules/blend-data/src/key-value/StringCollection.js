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
$data.StringCollection = $oop.createClass('$data.StringCollection')
.blend($data.Collection)
.blend($data.StringValueHost)
.build();

$data.DataContainer
.delegate(/** @lends $data.DataContainer# */{
  /**
   * @returns {$data.StringCollection}
   */
  asStringCollection: function () {
    return this.as($data.StringCollection);
  }
});

$data.SetContainer
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.StringCollection}
   */
  toStringCollection: function () {
    return this.to($data.StringCollection);
  }
});

$data.KeyValueContainer
.delegate(/** @lends $data.KeyValueContainer# */{
  /**
   * @returns {$data.StringCollection}
   */
  toStringCollection: function () {
    return this.to($data.StringCollection);
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
