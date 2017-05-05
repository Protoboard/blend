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
         * Creates a new Class instance.
         * @param {string} classId
         * @returns {$oop.Class}
         */
        create: function (classId) {
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
                     * @protected
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
                     * @protected
                     */
                    __interfaceLookup: {value: {}},

                    /**
                     * @type {string[]}
                     * @protected
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
                     * @protected
                     */
                    __includeLookup: {value: {}},

                    /**
                     * @type {string[]}
                     * @protected
                     */
                    __requires: {value: []},

                    /**
                     * @type {object}
                     * @protected
                     */
                    __requireLookup: {value: {}},

                    /**
                     * List of surrogate descriptors.
                     * @todo Do we need a lookup for this too?
                     * @type {object[]}
                     * @protected
                     */
                    __forwards: {value: []},

                    /**
                     * Instance hash function for cached classes.
                     * @todo Rename
                     * @type {function}
                     * @protected
                     */
                    __mapper: {
                        value   : undefined,
                        writable: true
                    },

                    /**
                     * Registry of instances indexed by hash.
                     * @type {object}
                     * @protected
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
