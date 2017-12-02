"use strict";

/**
 * @class $oop.Klass
 * @todo Rename when replacing $oop.Class
 */
$oop.Klass = $oop.createObject(Object.prototype, /** @lends $oop.Klass# */{
  /**
   * @member {string} $oop.Klass#__classId
   */

  /**
   * @member {$oop.ClassBuilder} $oop.Klass#__builder
   */

  create: function (properties) {
  },

  /**
   * @param {Object} members
   * @return {$oop.Klass}
   */
  delegate: function (members) {
    var builder = this.__builder;

    builder.delegate(members);

    $oop.copyProperties(this, members);

    builder.mixins.upstream.list
    .map(function (classBuilder) {
      return classBuilder.Class;
    })
    .filter(function (Class) {
      return Class !== undefined;
    })
    .forEach(function (Class) {
      $oop.copyProperties(Class, members);
    });

    return this;
  },

  /**
   * @param {$oop.Klass} Class
   * @param {function} callback
   * @return {$oop.Klass}
   */
  forwardBlend: function (Class, callback) {
    this.__builder.forwardBlend(Class, callback);
    return this;
  },

  implements: function (Interface) {
    return false;
  },

  implementedBy: function (Class) {
    return false;
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  mixes: function (Class) {
    return Class && this.__builder.mixins.downstream.lookup[Class.__classId];
  },

  /**
   * @param {$oop.Klass} Class
   * @return {boolean}
   */
  mixedBy: function (Class) {
    return Class && Class.__builder.mixins.downstream.lookup[this.__classId];
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

