/* global $assert, $data, $oop */
"use strict";

/**
 * @interface $data.Clearable
 */
$data.Clearable = $oop.getClass('$data.Clearable')
    .define(/** @lends $data.Clearable# */{
        /**
         * Resets instance to initial state.
         * @returns {$data.Clearable}
         */
        clear: function () {}
    });
