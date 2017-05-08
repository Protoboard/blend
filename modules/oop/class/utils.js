/* global $assert */
"use strict";

/**
 * Copies properties to the specified target object.
 * For built-in prototypes, only conversion methods are allowed.
 * @function $oop.copyProperties
 * @param {object} target
 * @param {object} members
 */
exports.copyProperties = function (target, members) {
    var memberNames;

    switch (target) {
    case Array.prototype:
    case Date.prototype:
    case Number.prototype:
    case Object.prototype:
    case RegExp.prototype:
    case String.prototype:
        memberNames = Object.getOwnPropertyNames(members);

        if (memberNames.filter(function (memberName) {
                return memberName.slice(0, 2) !== 'to';
            }).length
        ) {
            $assert.assert(false, "Attempting to add non-conversion methods to built-in object prototype.");
        }

        Object.defineProperties(target, memberNames
            .reduce(function (definitions, memberName) {
                definitions[memberName] = {
                    configurable: true,
                    enumerable: false,
                    value: members[memberName],
                    writable: true
                };
                return definitions;
            }, {}));
        break;

    default:
        Object.getOwnPropertyNames(members)
            .forEach(function (memberName) {
                target[memberName] = members[memberName];
            });
        break;
    }
};

/**
 * @function $oop.createObject
 * @param {object} base
 * @param {object} members
 * @returns {Object}
 * @ignore
 */
exports.createObject = function (base, members) {
    var result = Object.create(base || Object.prototype);
    exports.copyProperties(result, members);
    return result;
};

/**
 * @function $oop.getClass
 * @param {string} classId
 * @returns {$oop.Class}
 */
exports.getClass = function (classId) {
    return exports.Class.getClass(classId);
};
