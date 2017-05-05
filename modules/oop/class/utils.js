/* global $oop */
"use strict";

/**
 * @function $oop.createObject
 * @param {object} base
 * @param {object} members
 * @returns {Object}
 * @ignore
 */
$oop.createObject = function (base, members) {
    var result = Object.create(base || Object.prototype);
    Object.getOwnPropertyNames(members)
        .forEach(function (memberName) {
            result[memberName] = members[memberName];
        });
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
