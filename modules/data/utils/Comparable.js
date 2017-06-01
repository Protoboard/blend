"use strict";

/**
 * @mixin $data.Comparable
 */
$data.Comparable = $oop.getClass('$data.Comparable')
    .define(/** @lends $data.Comparable# */{
        /**
         * Tells whether current instance equals to the specified instance.
         * @param {$data.Comparable|$oop.Class} instance
         * @returns {boolean}
         */
        equals: function (instance) {
            return instance && // must have value
                (this === instance || // either same instance
                this.__classId === instance.__classId); // or shares class
        }
    });
