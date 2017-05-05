/* global $oop */
"use strict";

/**
 * @class $oop.ClassBuilder
 */
$oop.ClassBuilder = $oop.ProtoclassBuilder.reset()
    .define(/** @lends $oop.ClassBuilder */{
        /**
         * All classes indexed by class ID.
         * @type {object}
         */
        classes: {},
        
        /**
         * Builds a new class or continues to build an existing class.
         * @param {string} classId
         * @returns {$oop.Class}
         */
        build: function (classId) {
            if (!classId) {
                throw new Error("No class ID was specified.");
            }

            var classes = this.classes,
                Class = classes[classId];

            if (!Class) {
                // class is not initialized yet
                Class = Object.create($oop.Class, /** @lends $oop.Class# */{
                    /**
                     * Identifies class.
                     * @type {string}
                     * @private
                     */
                    __classId: {value: classId},

                    /**
                     * @type {object}
                     * @private
                     */
                    __members: {value: {}},

                    /**
                     * @type {object}
                     * @private
                     */
                    __methodMatrix: {value: {}},

                    /**
                     * @type {object[]}
                     * @private
                     */
                    __contributors: {value: []},

                    /**
                     * @type {object}
                     * @private
                     */
                    __contributorLookup: {value: {}},

                    /**
                     * @type {$oop.Class[]}
                     * @private
                     */
                    __interfaces: {value: []},

                    /**
                     * @type {object}
                     * @private
                     */
                    __interfaceLookup: {value: {}},

                    /**
                     * @type {string[]}
                     * @private
                     */
                    __unimplementedMethodNames: {value: []},

                    /**
                     * @type {object}
                     * @private
                     */
                    __unimplementedMethodNameLookup: {value: {}},

                    /**
                     * @type {$oop.Class[]}
                     * @private
                     */
                    __includes: {value: []},

                    /**
                     * @type {object}
                     * @private
                     */
                    __includeLookup: {value: {}},

                    /**
                     * @type {string[]}
                     * @private
                     */
                    __requires: {value: []},

                    /**
                     * @type {object}
                     * @private
                     */
                    __requireLookup: {value: {}},

                    /**
                     * List of surrogate descriptors.
                     * @todo Do we need a lookup for this too?
                     * @type {object[]}
                     * @private
                     */
                    __forwards: {value: []},

                    /**
                     * Instance hash function for cached classes.
                     * @todo Rename
                     * @type {function}
                     * @private
                     */
                    __mapper: {
                        value   : undefined,
                        writable: true
                    },

                    /**
                     * Registry of instances indexed by hash.
                     * @type {object}
                     * @private
                     */
                    __instanceLookup: {value: {}}
                });

                // adding class to registry
                classes[classId] = Class;
            }

            return Class;
        }
    })
    .build();
