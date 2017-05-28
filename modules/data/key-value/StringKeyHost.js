/* globals $assert, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.StringKeyHost
 * @augments $data.KeyValueContainer
 */
exports.StringKeyHost = $oop.getClass('$data.StringKeyHost')
    .require($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.StringKeyHost# */{
        /**
         * @type {string}
         * @constant
         */
        keyType: exports.KEY_TYPE_STRING
    });
