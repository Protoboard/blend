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
                Class = Object.create($oop.Class, {
                    __classId: {value: classId},
                    __members: {value: {}},
                    __methodMatrix: {value: {}},
                    __contributors: {value: []},
                    __contributorIndexLookup: {value: {}},
                    __interfaces: {value: []},
                    __interfaceLookup: {value: {}},
                    __missingMethodNames: {value: []},
                    __missingMethodLookup: {value: {}},
                    __includes: {value: []},
                    __includeLookup: {value: {}},
                    __requires: {value: []},
                    __requireLookup: {value: {}},
                    __forwards: {value: []},
                    __mapper: {
                        value   : undefined,
                        writable: true
                    },
                    __instanceLookup: {value: {}}
                });

                // adding class to registry
                classes[classId] = Class;
            }

            return Class;
        }
    })
    .build();
