/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Collection.create
 * @param {object|Array} [data]
 * @returns {$data.Collection}
 */

/**
 * Manipulates key-value stores.
 * @class $data.Collection
 * @mixes $data.Iterable
 * @implements $data.Filterable
 * @extends $data.Lookup
 */
exports.Collection = $oop.getClass('$data.Collection')
    .include($oop.getClass('$data.Iterable'))
    .extend($oop.getClass('$data.Lookup'))
    .define(/** @lends $data.Collection# */{
        /**
         * Merges current collection with specified collection and returns
         * result as a new collection. The specified collection's items
         * take precedence on collision.
         * @param {$data.Collection} collection Collection to merge with
         * @returns {$data.Collection} The merged collection
         */
        mergeWith: function (collection) {
            return this.clone()
                .setItems(collection._data);
        },

        /**
         * Merges specified collection into current collection.
         * The specified collection's items take precedence on collision.
         * Mutates current collection!
         * @param {$data.Collection} collection Collection to merge into
         * current one
         * @returns {$data.Collection} Current instance
         */
        mergeIn: function (collection) {
            this.setItems(collection._data);
            return this;
        },

        /**
         * Extracts items matching the specified keys and returns result
         * as a new collection.
         * @param {string[]|number[]} keys Key strings to be matched
         * @returns {$data.Collection} Filtered collection
         */
        filterByKeys: function (keys) {
            var data = this._data,
                keyCount = keys.length,
                i, key,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (hOP.call(data, key)) {
                    result[key] = data[key];
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Iterates over collection and calls specified callback on
         * each item. Item order is not deterministic. Returns self.
         * Returning false from callback breaks iteration.
         * @param {function} callback Function to be called for each item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Current instance
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (callback.call(context, data[key], key, this) === false) {
                    break;
                }
            }

            return this;
        }
    });

$oop.getClass('$data.Container')
    .delegate(/** @lends $data.Container# */{
        /**
         * @returns {$data.Collection}
         */
        toCollection: function () {
            return exports.Collection.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Collection}
     */
    toCollection: function () {
        return exports.Collection.create(this);
    }
});
