"use strict";

/**
 * @function $assert#isDefined
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDefined = function (expr, message) {
  return $assert.assert(expr !== undefined, message);
};

/**
 * @function $assert#isUndefined
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isUndefined = function (expr, message) {
  return $assert.assert(expr === undefined, message);
};

/**
 * @function $assert#isString
 * @param {string} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isString = function (expr, message) {
  return $assert.assert(typeof expr === 'string' ||
    expr instanceof String, message);
};

/**
 * @function $assert#isStringOptional
 * @param {string} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isStringOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    typeof expr === 'string' ||
    expr instanceof String, message);
};

/**
 * @function $assert#isBoolean
 * @param {boolean} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isBoolean = function (expr, message) {
  return $assert.assert(typeof expr === 'boolean' ||
    expr instanceof Boolean, message);
};

/**
 * @function $assert#isBooleanOptional
 * @param {boolean} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isBooleanOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    typeof expr === 'boolean' ||
    expr instanceof Boolean, message);
};

/**
 * @function $assert#isNumber
 * @param {number} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isNumber = function (expr, message) {
  return $assert.assert(typeof expr === 'number' ||
    expr instanceof Number, message);
};

/**
 * @function $assert#isNumberOptional
 * @param {number} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isNumberOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    typeof expr === 'number' ||
    expr instanceof Number, message);
};

/**
 * @function $assert#isFunction
 * @param {function} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isFunction = function (expr, message) {
  return $assert.assert(typeof expr === 'function', message);
};

/**
 * @function $assert#isFunctionOptional
 * @param {function} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isFunctionOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    typeof expr === 'function', message);
};

/**
 * @function $assert#isObject
 * @param {object} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isObject = function (expr, message) {
  return $assert.assert(expr instanceof Object, message);
};

/**
 * @function $assert#isObjectOptional
 * @param {object} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isObjectOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    expr instanceof Object, message);
};

/**
 * @function $assert#isArray
 * @param {Array} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isArray = function (expr, message) {
  return $assert.assert(expr instanceof Array, message);
};

/**
 * @function $assert#isArrayOptional
 * @param {Array} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isArrayOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    expr instanceof Array, message);
};

/**
 * @function $assert#isRegExp
 * @param {RegExp} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isRegExp = function (expr, message) {
  return $assert.assert(expr instanceof RegExp, message);
};

/**
 * @function $assert#isRegExpOptional
 * @param {RegExp} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isRegExpOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    expr instanceof RegExp, message);
};

/**
 * @function $assert#isDate
 * @param {Date} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDate = function (expr, message) {
  return $assert.assert(expr instanceof Date, message);
};

/**
 * @function $assert#isDateOptional
 * @param {Date} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDateOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
    expr instanceof Date, message);
};
