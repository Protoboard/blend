/* global $oop */
"use strict";

/**
 * Builds protoclasses.
 * Not part of public API.
 * @class
 * @ignore
 */
$oop.ProtoclassBuilder = {
    /**
     * @returns {$oop.ProtoclassBuilder}
     */
    start: function () {
        this._extends = undefined;
        this._members = undefined;
        return this;
    },

    /**
     * @param {object} protoClass
     * @returns {$oop.ProtoclassBuilder}
     */
    extend: function (protoClass) {
        /**
         * @type {Object}
         * @private
         */
        this._extends = protoClass;
        return this;
    },

    /**
     * @param {object} members
     * @returns {$oop.ProtoclassBuilder}
     */
    define: function (members) {
        /**
         * @type {Object}
         * @private
         */
        this._members = members;
        return this;
    },

    /**
     * Builds protoclass.
     * @returns {Object}
     */
    build: function () {
        var base = this._extends || Object.prototype,
            members = this._members,
            propertyDefinitions = Object.getOwnPropertyNames(members)
                .reduce(function (result, memberName) {
                    result[memberName] = {
                        value   : members[memberName],
                        writable: true
                    };
                    return result;
                }, {});

        return Object.create(base, propertyDefinitions);
    }
};
