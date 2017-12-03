"use strict";

/**
 * Copies properties to the specified target object.
 * For built-in prototypes, only conversion methods are allowed.
 * @function $oop.copyProperties
 * @param {object} target
 * @param {object} members
 * @param {object} [propertyDescriptor]
 */
$oop.copyProperties = function (target, members, propertyDescriptor) {
  switch (target) {
  case Array.prototype:
  case Date.prototype:
  case Number.prototype:
  case Object.prototype:
  case RegExp.prototype:
  case String.prototype:
    $assert.hasOnlyConverters(members,
        "Attempting to add non-conversion methods to built-in prototype.");

    Object.defineProperties(
        target,
        Object.getOwnPropertyNames(members)
        .reduce(function (definitions, memberName) {
          definitions[memberName] = {
            value: members[memberName],
            writable: true,
            enumerable: false,
            configurable: true
          };
          return definitions;
        }, {}));
    break;

  default:
    if (propertyDescriptor) {
      Object.defineProperties(
          target,
          Object.getOwnPropertyNames(members)
          .reduce(function (definitions, memberName) {
            definitions[memberName] = {
              value: members[memberName],
              writable: propertyDescriptor.writable,
              enumerable: propertyDescriptor.enumerable,
              configurable: propertyDescriptor.configurable
            };
            return definitions;
          }, {}));
    } else {
      Object.getOwnPropertyNames(members)
      .forEach(function (memberName) {
        target[memberName] = members[memberName];
      });
    }
    break;
  }
};

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @param {object} base
   * @param {object} members
   * @param {object} [propertyDescriptor]
   * @returns {Object}
   * @ignore
   */
  createObject: function (base, members, propertyDescriptor) {
    var result = Object.create(base || Object.prototype);
    $oop.copyProperties(result, members, propertyDescriptor);
    return result;
  },

  /**
   * Retrieves class ID for specified class. To be used in `Array#map()`.
   * @param {$oop.Class} Class
   * @returns {string}
   */
  getClassId: function (Class) {
    return Class && Class.__classId;
  },

  /**
   * Retrieves class ID for specified class. To be used in `Array#map()`.
   * @param {$oop.ClassBuilder} classBuilder
   * @returns {number}
   */
  getClassBuilderId: function (classBuilder) {
    return classBuilder && classBuilder.classId;
  },

  /**
   * Retrieves class ID for specified class. To be used in `Array#map()`.
   * @param {$oop.ClassBuilder} classBuilder
   * @returns {string}
   */
  getClassBuilderName: function (classBuilder) {
    return classBuilder && classBuilder.className;
  }
});

