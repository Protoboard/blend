/* global $assert, $oop */
"use strict";

/**
 * @interface $data.Clearable
 */
exports.Clearable = $oop.getClass('$data.Clearable')
    .define(/** @lends $data.Clearable# */{
        /**
         * Resets instance to initial state.
         * @returns {$data.Clearable}
         */
        clear: function () {}
    });
