/* globals $assert, $data, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.StringKeyHost
 * @augments $data.KeyValueContainer
 */
$data.StringKeyHost = $oop.getClass('$data.StringKeyHost')
    .require($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.StringKeyHost# */{
        /**
         * @type {string}
         * @constant
         */
        keyType: $data.KEY_TYPE_STRING
    });
