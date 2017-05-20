/* globals $assert, $oop, $utils */
"use strict";

/**
 * @interface $data.StringFilterable
 */
exports.StringFilterable = $oop.getClass('$data.StringFilterable')
    .define(/** @lends $data.StringFilterable# */{
        /**
         * @param {string} prefix
         * @returns {$data.StringFilterable}
         */
        filterByPrefix: function (prefix) {},

        /**
         * @param {RegExp} regExp
         * @returns {$data.StringFilterable}
         */
        filterByRegExp: function (regExp) {}
    });
