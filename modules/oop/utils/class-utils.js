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

/**
 * @function $oop.createObject
 * @param {object} base
 * @param {object} members
 * @param {object} [propertyDescriptor]
 * @returns {Object}
 * @ignore
 */
$oop.createObject = function (base, members, propertyDescriptor) {
  var result = Object.create(base || Object.prototype);
  $oop.copyProperties(result, members, propertyDescriptor);
  return result;
};

/**
 * @function $oop.getClass
 * @param {string} classId
 * @returns {$oop.Class}
 */
$oop.getClass = function (classId) {
  return $oop.Class.getClass(classId);
};
