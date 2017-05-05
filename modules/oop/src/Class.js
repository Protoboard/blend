/* global $oop */
"use strict";

/**
 * Composable class.
 * @class $oop.Class
 */
$oop.Class = $oop.ProtoclassBuilder.reset()
    .define(/** @lends $oop.Class# */{
        /**
         * All classes indexed by class ID.
         * @memberOf $oop.Class
         */
        classes: {},

        /**
         * Copies batch of members to class members container.
         * @todo Throw on conflict.
         * @param {object} batch
         * @private
         */
        _addToMembers: function (batch) {
            var members = this.__members;

            Object.getOwnPropertyNames(batch)
                .forEach(function (memberName) {
                    members[memberName] = batch[memberName];
                    return members;
                });
        },

        /**
         * Adds class to contributions
         * @param {$oop.Class} Class
         * @private
         */
        _addToContributors: function (Class) {
            var contributions = this.__contributors,
                contributionLookup = this.__contributorLookup,
                classId = Class.__classId;

            if (!contributionLookup.hasOwnProperty(classId)) {
                contributionLookup[classId] = contributions.length;
                contributions.push(Class);
            }
        },

        /**
         * Adds methods to method lookup, indexed by method name, then order.
         * @param {object} members
         * @param {number} index
         * @private
         */
        _addMethodsToMatrix: function (members, index) {
            var methodMatrix = this.__methodMatrix;

            Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] === 'function';
                })
                .forEach(function (methodName) {
                    var methods = methodMatrix[methodName];
                    if (!methods) {
                        methods = methodMatrix[methodName] = [];
                    }
                    methods[index] = members[methodName];
                });
        },

        /**
         * Adds properties to class.
         * @param {object} members
         * @private
         */
        _addPropertiesToClass: function (members) {
            var that = this;

            Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] !== 'function';
                })
                .forEach(function (propertyName) {
                    that[propertyName] = members[propertyName];
                });
        },

        /**
         * Adds wrapper methods for functions included in `members`.
         * @param {object} members
         * @private
         */
        _addWrapperMethodsToClass: function (members) {
            var that = this;

            Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] === 'function';
                })
                .filter(function (methodName) {
                    return !that.hasOwnProperty(methodName);
                })
                .forEach(function (methodName) {
                    var methodMatrix = that.__methodMatrix;

                    that[methodName] = function () {
                        var methods = methodMatrix[methodName],
                            methodCount = methods.length,
                            results = [],
                            i, method, result,
                            resultCount,
                            same = true;

                        // running functions in order of includes
                        for (i = 0; i < methodCount; i++) {
                            method = methods[i];
                            if (method) {
                                results.push(method.apply(this, arguments));
                            }
                        }

                        // evaluating return values
                        resultCount = results.length;
                        for (i = 1, result = results[0]; i < resultCount; i++) {
                            if (result !== results[i]) {
                                same = false;
                                break;
                            }
                        }

                        // returning either uniform result or all results
                        return same ?
                            result :
                            results;
                    };
                });
        },

        /**
         * @param {$oop.Class} Interface
         * @private
         */
        _addToInterfaces: function (Interface) {
            var interfaces = this.__interfaces,
                interfaceLookup = this.__interfaceLookup,
                interfaceId = Interface.__classId;

            if (!interfaceLookup.hasOwnProperty(interfaceId)) {
                interfaces.push(Interface);
                interfaceLookup[interfaceId] = true;
            }
        },

        /**
         * @param {object} members
         * @private
         */
        _removeUnimplementedMethods: function (members) {
            var unimplementedMethodNames = this.__unimplementedMethodNames,
                unimplementedMethodsLookup = this.__unimplementedMethodNameLookup;

            // removing methods from registry
            Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] === 'function';
                })
                // leaving only those already registered
                .filter(function (methodName) {
                    return unimplementedMethodsLookup.hasOwnProperty(methodName);
                })
                // unregistering method names
                .forEach(function (implementedMethodName) {
                    unimplementedMethodNames.splice(unimplementedMethodNames.indexOf(implementedMethodName), 1);
                    delete unimplementedMethodsLookup[implementedMethodName];
                });
        },

        /**
         * Adds functions in members to registry of unimplemented methods,
         * unless they're already implemented by the class, or any of the includes.
         * @param {object} members
         * @private
         */
        _addUnimplementedMethods: function (members) {
            var contributions = this.__contributors,
                interfaces = this.__interfaces,
                unimplementedMethodNames = this.__unimplementedMethodNames,
                unimplementedMethodNameLookup = this.__unimplementedMethodNameLookup;

            Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] === 'function';
                })
                // leaving out any methods already found in contributions
                .filter(function (methodName) {
                    return !contributions.some(function (Class) {
                        var method = Class.__members[methodName];
                        return typeof method === 'function';
                    });
                })
                // leaving out methods not found in any interfaces
                .filter(function (methodName) {
                    return interfaces.some(function (Interface) {
                        var method = Interface.__members[methodName];
                        return typeof method === 'function';
                    });
                })
                // leaving only those not yet registered
                .filter(function (unimplementedMethodName) {
                    return !unimplementedMethodNameLookup.hasOwnProperty(unimplementedMethodName);
                })
                // registering method names as unimplemented
                .forEach(function (unimplementedMethodName) {
                    unimplementedMethodNames.push(unimplementedMethodName);
                    unimplementedMethodNameLookup[unimplementedMethodName] = true;
                });
        },

        /**
         * @param {$oop.Class} Class
         * @private
         */
        _addToIncludes: function (Class) {
            var includes = this.__includes,
                includeLookup = this.__includeLookup,
                classId = Class.__classId;

            if (!includeLookup.hasOwnProperty(classId)) {
                includes.push(Class);
                includeLookup[classId] = true;
            }
        },

        /**
         * @param {$oop.Class} Class
         * @private
         */
        _addToRequires: function (Class) {
            var classId = this.__classId,
                requireId = Class.__classId,
                includeLookup = this.__includeLookup,
                requires = this.__requires,
                requireLookup = this.__requireLookup;

            if (classId !== requireId &&
                !includeLookup.hasOwnProperty(requireId) &&
                !requireLookup.hasOwnProperty(requireId)
            ) {
                // require is not included (which would cancel each other out)
                // adding to requires
                requires.push(Class);
                requireLookup[requireId] = true;
            }
        },

        /**
         * @param {$oop.Class} Class
         * @private
         */
        _removeFromRequires: function (Class) {
            var classId = Class.__classId,
                requires = this.__requires,
                requireLookup = this.__requireLookup;

            if (requireLookup.hasOwnProperty(classId)) {
                requires.splice(requires.indexOf(classId), 1);
                delete requireLookup[classId];
            }
        },

        /**
         * Extracts includes and requires from class and transfers them
         * to the current class as first-degree requires.
         * @param {$oop.Class} Class
         * @private
         */
        _transferRequires: function (Class) {
            var that = this;

            Class.__requires
                .concat(Class.__includes)
                .forEach(function (Class) {
                    that.require(Class);
                });
        },

        /**
         * Creates a new Class instance.
         * @memberOf $oop.Class
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
                Class = Object.create($oop.InstantiableClass, /** @lends $oop.Class# */{
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
        },

        /**
         * Defines a batch of properties and methods contributed by the current class.
         * Can be called multiple times.
         * @param {object} batch
         * @returns {$oop.Class}
         */
        define: function (batch) {
            if (!batch) {
                throw new Error("No members specified.");
            }

            // adding batch to members, overwriting conflicting properties
            this._addToMembers(batch);

            // adding members to contributions
            this._addToContributors(this);

            // adding methods to lookup at specified index
            this._addMethodsToMatrix(batch, this.__contributorLookup[this.__classId]);

            // adding / overwriting properties
            this._addPropertiesToClass(batch);

            // adding wrapper method when necessary
            this._addWrapperMethodsToClass(batch);

            // updating unimplemented methods lookup
            this._removeUnimplementedMethods(batch);

            // delegating batch to includers
            // TODO Implement

            return this;
        },

        /**
         * Specifies a class to be included by the host class.
         * @param {$oop.Class} Class
         * @returns {$oop.Class}
         */
        include: function (Class) {
            if (!$oop.Class.isPrototypeOf(Class)) {
                throw new Error("Class#include expects type Class.");
            }

            // adding to includes
            this._addToIncludes(Class);

            // adding included class to contributions
            this._addToContributors(Class);

            // removing fulfilled require
            this._removeFromRequires(Class);

            var members = Class.__members;

            // adding methods to lookup at specified index
            this._addMethodsToMatrix(members, this.__contributorLookup[Class.__classId]);

            // adding / overwriting properties
            this._addPropertiesToClass(members);

            // adding wrapper method when necessary
            this._addWrapperMethodsToClass(members);

            // updating unimplemented methods lookup
            this._removeUnimplementedMethods(members);

            // transferring includes & requires from include
            this._transferRequires(Class);

            return this;
        },

        /**
         * Specifies an interface to be implemented by the host class.
         * @param {$oop.Class} Interface
         * @returns {$oop.Class}
         */
        implement: function (Interface) {
            if (!$oop.Class.isPrototypeOf(Interface)) {
                throw new Error("Class#implement expects type Class.");
            }

            // adding to interfaces
            this._addToInterfaces(Interface);

            // updating unimplemented methods lookup
            this._addUnimplementedMethods(Interface.__members);

            return this;
        },

        /**
         * Specifies a required base, or trait of the host class.
         * Used by traits only.
         * @param {$oop.Class} Class
         * @returns {$oop.Class}
         */
        require: function (Class) {
            if (!$oop.Class.isPrototypeOf(Class)) {
                throw new Error("Class#require expects type Class.");
            }

            // adding require to registry
            this._addToRequires(Class);

            // transferring includes & requires from require
            this._transferRequires(Class);

            return this;
        },

        /**
         * Forwards the class to the specified class, if
         * constructor arguments satisfy the supplied filter.
         * @param {$oop.Class} Class
         * @param {function} filter
         * @param {number} [priority=0]
         * @returns {$oop.Class}
         */
        forward: function (Class, filter, priority) {
            if (!$oop.Class.isPrototypeOf(Class)) {
                throw new Error("Class#forward expects type Class.");
            }

            var forwards = this.__forwards;

            // adding forward descriptor
            forwards.push({
                'class'   : Class,
                'filter'  : filter,
                'priority': priority || 0
            });

            // sorting forwards by priority (descending)
            // here we're relying on Array#sort() mutating the array
            // as the same array is referenced from the final class
            forwards.sort(function (a, b) {
                var ap = a.priority,
                    bp = b.priority;
                return ap > bp ? -1 : bp > ap ? 1 : 0;
            });

            return this;
        },

        /**
         * Specifies a mapper function to be used to build a registry
         * @todo Rename
         * @param {function} mapper
         * @returns {$oop.Class}
         */
        cache: function (mapper) {
            if (typeof mapper !== 'function') {
                throw new Error("Class#cache expects function argument.");
            }

            this.__mapper = mapper;

            return this;
        },

        /**
         * Tells whether current class implements the specified interface.
         * @param {$oop.Class} Interface
         * @returns {boolean}
         */
        implements: function (Interface) {
            if (!$oop.Class.isPrototypeOf(Interface)) {
                throw new Error("Class type expected");
            }

            return !!this.__interfaceLookup[Interface.__classId];
        },

        /**
         * Tells whether current class is or includes the specified class.
         * @param {$oop.Class} Class
         * @returns {boolean}
         */
        includes: function (Class) {
            if (!$oop.Class.isPrototypeOf(Class)) {
                throw new Error("Class type expected");
            }

            var classId = Class.__classId;

            return this.__classId === classId || !!this.__includeLookup[classId];
        },

        /**
         * Tells whether current class requires the specified class.
         * @param {$oop.Class} Class
         * @returns {boolean}
         */
        requires: function (Class) {
            if (!$oop.Class.isPrototypeOf(Class)) {
                throw new Error("Class type expected");
            }

            return !!this.__requireLookup[Class.__classId];
        }
    })
    .build();
