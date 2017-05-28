/* globals $assert, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.StringValueHost
 * @augments $data.KeyValueContainer
 */
exports.StringValueHost = $oop.getClass('$data.StringValueHost')
    .require($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.StringValueHost# */{
        /**
         * @type {string}
         * @constant
         */
        valueType: exports.VALUE_TYPE_STRING
    });
