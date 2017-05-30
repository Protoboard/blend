"use strict";

/**
 * Maintains a set of items. Agnostic about the nature of the items.
 * Host classes implement item-specific behavior and features.
 * @mixin $data.ItemContainer
 * @augments $data.DataContainer
 */
$data.ItemContainer = $oop.getClass('$data.ItemContainer')
    .require($oop.getClass('$data.DataContainer'))
    .define(/** @lends $data.ItemContainer# */{
        /**
         * @param {object|Array} data
         * @ignore
         */
        init: function (data) {
            /**
             * @type {number}
             */
            this._itemCount = data ? undefined : 0;
        },

        /**
         * Clones current container instance.
         * @returns {$data.ItemContainer}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._itemCount = this._itemCount;
            return cloned;
        },

        /**
         * Resets state of current container instance.
         * @returns {$data.ItemContainer}
         */
        clear: function () {
            this._itemCount = 0;
            return this;
        },

        /**
         * Sets item in container.
         * @function $data.ItemContainer#setItem
         * @param {...*} item
         * @returns {$data.ItemContainer}
         * @abstract
         */

        /**
         * Deletes item from container.
         * @function $data.ItemContainer#deleteItem
         * @param {...*} item
         * @returns {$data.ItemContainer}
         * @abstract
         */

        /**
         * Tells whether item is present in the container.
         * @function $data.ItemContainer#hasItem
         * @param {...*} item
         * @returns {boolean}
         * @abstract
         */

        /**
         * @function $data.ItemContainer#forEachItem
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.ItemContainer}
         * @abstract
         */

        /**
         * Retrieves the number of key-value pairs in the container.
         * @returns {Number}
         */
        getItemCount: function () {
            var itemCount = this._itemCount;
            if (itemCount === undefined) {
                itemCount = 0;
                this.forEachItem(function () {
                    itemCount++;
                });
                this._itemCount = itemCount;
            }
            return itemCount;
        }
    });
