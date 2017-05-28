/* globals $assert */
"use strict";

/**
 * Asserts if expression is false.
 * @function $assert#assert
 * @param {*} expr Expression to be evaluated.
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.assert = function (expr, message) {
    if (!expr) {
        throw new Error(message);
    }
    return this;
};
