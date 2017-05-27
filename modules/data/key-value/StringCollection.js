/* globals $assert, $oop, $utils, hOP, slice */
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
exports.StringCollection = $oop.getClass('$data.StringCollection')
    .extend($oop.getClass('$data.Collection'))
    .define(/** @lends $data.StringCollection# */{
        /**
         * @memberOf $data.StringCollection
         * @type {string}
         * @constant
         */
        keyType: exports.KEY_TYPE_STRING,

        /**
         * @memberOf $data.StringCollection
         * @type {string}
         * @constant
         */
        valueType: exports.VALUE_TYPE_STRING
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.StringCollection}
         */
        toStringCollection: function () {
            return exports.StringCollection.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.StringCollection}
     */
    toStringCollection: function () {
        return exports.StringCollection.create(this);
    }
});
