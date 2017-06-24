"use strict";

/**
 * @function $assert#hasOnlyConverters
 * @param {object} expr
 * @param {string} message
 * @returns {$assert}
 */
$assert.hasOnlyConverters = function (expr, message) {
  $assert.assert(
    expr instanceof Object &&
    !Object.getOwnPropertyNames(expr)
      .filter(function (propertyName) {
        return typeof expr[propertyName] !== 'function' ||
          propertyName.slice(0, 2) !== 'to';
      })
      .length,
    message);

  return $assert;
};
