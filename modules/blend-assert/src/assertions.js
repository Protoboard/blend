"use strict";

/**
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.fail = function (message) {
  return $assert.assert(false, message);
};

/**
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDefined = function (expr, message) {
  return $assert.assert(expr !== undefined, message);
};

/**
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isUndefined = function (expr, message) {
  return $assert.assert(expr === undefined, message);
};

/**
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isTruthy = function (expr, message) {
  return $assert.assert(!!expr, message);
};

/**
 * @param {*} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isFalsy = function (expr, message) {
  return $assert.assert(!expr, message);
};

/**
 * @param {string} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isString = function (expr, message) {
  return $assert.assert(typeof expr === 'string' ||
      expr instanceof String, message);
};

/**
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
 * @param {boolean} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isBoolean = function (expr, message) {
  return $assert.assert(typeof expr === 'boolean' ||
      expr instanceof Boolean, message);
};

/**
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
 * @param {number} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isNumber = function (expr, message) {
  return $assert.assert(typeof expr === 'number' ||
      expr instanceof Number, message);
};

/**
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
 * @param {function} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isFunction = function (expr, message) {
  return $assert.assert(typeof expr === 'function', message);
};

/**
 * @param {function} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isFunctionOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
      typeof expr === 'function', message);
};

/**
 * @param {object} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isObject = function (expr, message) {
  return $assert.assert(expr instanceof Object, message);
};

/**
 * @param {object} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isObjectOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
      expr instanceof Object, message);
};

/**
 * @param {Array} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isArray = function (expr, message) {
  return $assert.assert(expr instanceof Array, message);
};

/**
 * @param {Array} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isArrayOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
      expr instanceof Array, message);
};

/**
 * @param {RegExp} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isRegExp = function (expr, message) {
  return $assert.assert(expr instanceof RegExp, message);
};

/**
 * @param {RegExp} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isRegExpOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
      expr instanceof RegExp, message);
};

/**
 * @param {Date} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDate = function (expr, message) {
  return $assert.assert(expr instanceof Date, message);
};

/**
 * @param {Date} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isDateOptional = function (expr, message) {
  return $assert.assert(expr === undefined ||
      expr instanceof Date, message);
};
