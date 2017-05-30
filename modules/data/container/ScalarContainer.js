"use strict";

/**
 * Maintains a set of singular values. Agnostic about value storage and
 * types. Hosts are expected to implement storage-specific behavior and
 * features.
 * @mixin $data.ScalarContainer
 * @implements $data.Filterable
 * @extends $data.ItemContainer
 */
$data.ScalarContainer = $oop.getClass('$data.ScalarContainer')
    .extend($oop.getClass('$data.ItemContainer'))
    .implement($oop.getClass('$data.Filterable'))
    .define(/** @lends $data.ScalarContainer# */{
        /**
         * Extracts items matching the condition in the specified
         * callback function and returns the result as a new collection.
         * @param {function} callback Filter function returning a boolean
         * @param {object} [context] Context for callback
         * @returns {$data.ScalarContainer} Filtered collection
         */
        filter: function (callback, context) {
            var data = this._data instanceof Array ? [] : {},
                ResultClass = $oop.getClass(this.__classId),
                result = ResultClass.create(data);

            this.forEachItem(function (item) {
                if (callback.call(this, item)) {
                    result.setItem(item);
                }
            }, context);

            return result;
        }
    });
