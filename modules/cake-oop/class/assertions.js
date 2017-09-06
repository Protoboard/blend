"use strict";

/**
 * @function $assert.hasOnlyConverters
 * @param {object} expr
 * @param {string} message
 * @returns {$assert}
 */
$assert.hasOnlyConverters = function (expr, message) {
  $assert.assert(
      expr instanceof Object &&
      !Object.getOwnPropertyNames(expr)
      .filter(function (propertyName) {
        var prefix = propertyName.slice(0, 2);
        return typeof expr[propertyName] !== 'function' ||
            (prefix !== 'to' && prefix !== 'as');
      })
          .length,
      message);

  return $assert;
};
