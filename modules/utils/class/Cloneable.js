/* global $assert, $oop, $utils */
"use strict";

/**
 * Cloning creates a new instance of identical class and state.
 * @mixin $utils.Cloneable
 */
exports.Cloneable = $oop.getClass('$utils.Cloneable')
    .define(/** @lends $utils.Cloneable# */{
        /**
         * Clones current instance.
         * @returns {$utils.Cloneable}
         */
        clone: function clone() {
            var Class = $oop.getClass(this.__classId);
            return Class.create();
        }
    });
