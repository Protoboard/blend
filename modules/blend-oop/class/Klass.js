"use strict";

/**
 * @class $oop.Klass
 * @todo Rename when replacing $oop.Class
 */
$oop.Klass = $oop.createObject(Object.prototype, /** @lends $oop.Klass# */{
  /**
   * @member {string} @lends $oop.Klass#__classId
   */

  /**
   * @member {$oop.ClassBuilder} @lends $oop.Klass#__builder
   */

  create: function (properties) {
  },

  forwardBlend: function (Class, filter) {
    return this;
  },

  implements: function (Interface) {
    return false;
  },

  implementedBy: function (Class) {
    return false;
  },

  mixes: function (Class) {
    return false;
  },

  mixedBy: function (Class) {
    return false;
  },

  expects: function (Class) {
    return false;
  },

  expectedBy: function (Class) {
    return false;
  },

  elevateMethods: function () {
    return this;
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$oop.Klass} expr
   * @param {string} [message]
   * @return {$assert}
   */
  isKlass: function (expr, message) {
    return $assert.assert(
        $oop.Klass.isPrototypeOf(expr), message);
  },

  /**
   * @param {$oop.Klass} [expr]
   * @param {string} [message]
   * @return {$assert}
   */
  isKlassOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $oop.Klass.isPrototypeOf(expr), message);
  }
});

