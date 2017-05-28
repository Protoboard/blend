/* globals $assert, $data, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.StringCollection.create
 * @param {object|Array} [data]
 * @returns {$data.StringCollection}
 */

/**
 * Key-value container with string keys and string values.
 * Pairs are unique.
 * @class $data.StringCollection
 * @extends $data.Collection
 */
$data.StringCollection = $oop.getClass('$data.StringCollection')
    .extend($oop.getClass('$data.Collection'))
    .include($oop.getClass('$data.StringValueHost'));

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.StringCollection}
         */
        toStringCollection: function () {
            return $data.StringCollection.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.StringCollection}
     */
    toStringCollection: function () {
        return $data.StringCollection.create(this);
    }
});
