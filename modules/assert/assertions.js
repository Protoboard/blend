"use strict";

/**
 * @function $assert#hasValue
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.hasValue = function (expr, message) {
    return exports.assert(expr !== undefined, message);
};

/**
 * @function $assert#isUndefined
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isUndefined = function (expr, message) {
    return exports.assert(expr === undefined, message);
};

/**
 * @function $assert#isString
 * @param {string} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isString = function (expr, message) {
    return exports.assert(typeof expr === 'string' ||
        expr instanceof String, message);
};

/**
 * @function $assert#isStringOptional
 * @param {string} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isStringOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        typeof expr === 'string' ||
        expr instanceof String, message);
};

/**
 * @function $assert#isBoolean
 * @param {boolean} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isBoolean = function (expr, message) {
    return exports.assert(typeof expr === 'boolean' ||
        expr instanceof Boolean, message);
};

/**
 * @function $assert#isBooleanOptional
 * @param {boolean} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isBooleanOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        typeof expr === 'boolean' ||
        expr instanceof Boolean, message);
};

/**
 * @function $assert#isNumber
 * @param {number} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isNumber = function (expr, message) {
    return exports.assert(typeof expr === 'number' ||
        expr instanceof Number, message);
};

/**
 * @function $assert#isNumberOptional
 * @param {number} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isNumberOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        typeof expr === 'number' ||
        expr instanceof Number, message);
};

/**
 * @function $assert#isFunction
 * @param {function} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isFunction = function (expr, message) {
    return exports.assert(typeof expr === 'function', message);
};

/**
 * @function $assert#isFunctionOptional
 * @param {function} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isFunctionOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        typeof expr === 'function', message);
};

/**
 * @function $assert#isObject
 * @param {object} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isObject = function (expr, message) {
    return exports.assert(expr instanceof Object, message);
};

/**
 * @function $assert#isObjectOptional
 * @param {object} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isObjectOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        expr instanceof Object, message);
};

/**
 * @function $assert#isArray
 * @param {Array} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isArray = function (expr, message) {
    return exports.assert(expr instanceof Array, message);
};

/**
 * @function $assert#isArrayOptional
 * @param {Array} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isArrayOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        expr instanceof Array, message);
};

/**
 * @function $assert#isRegExp
 * @param {RegExp} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isRegExp = function (expr, message) {
    return exports.assert(expr instanceof RegExp, message);
};

/**
 * @function $assert#isRegExpOptional
 * @param {RegExp} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isRegExpOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        expr instanceof RegExp, message);
};

/**
 * @function $assert#isDate
 * @param {Date} expr
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isDate = function (expr, message) {
    return exports.assert(expr instanceof Date, message);
};

/**
 * @function $assert#isDateOptional
 * @param {Date} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
exports.isDateOptional = function (expr, message) {
    return exports.assert(expr === undefined ||
        expr instanceof Date, message);
};
