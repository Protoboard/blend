/* globals $assert, $data, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.StringValueHost
 * @augments $data.KeyValueContainer
 */
$data.StringValueHost = $oop.getClass('$data.StringValueHost')
    .require($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.StringValueHost# */{
        /**
         * @type {string}
         * @constant
         */
        valueType: $data.VALUE_TYPE_STRING
    });
