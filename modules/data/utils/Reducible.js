"use strict";

/**
 * @interface $data.Reducible
 */
$data.Reducible = $oop.getClass('$data.Reducible')
    .define(/** @lends $data.Reducible# */{
        /**
         * Accumulates a value based on the contribution of each item,
         * as defined by the specified callback.
         * @param {function} callback Contributes to accumulated value
         * based on current item
         * @param {*} [initialValue] Initial value for accumulated result
         * @param {object} [context] Context for callback
         * @returns {*} Accummulated value
         */
        reduce: function (callback, initialValue, context) {}
    });
