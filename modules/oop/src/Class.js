/* global $oop */
"use strict";

/**
 * Composable class
 * @class $oop.Class
 */
$oop.Class = {
    /**
     * All classes indexed by class ID.
     * @memberOf $oop.Class
     */
    classes: {},

    /**
     * Copies batch of members to class members container.
     * @todo Throw on conflict.
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @private
     */
    _addToContributors: function (class_) {
        var contributions = this.__contributors,
            contributionLookup = this.__contributorLookup,
            classId = class_.__classId;

        if (!contributionLookup.hasOwnProperty(classId)) {
            contributionLookup[classId] = contributions.length;
            contributions.push(class_);
        }
    },

    /**
     * Adds methods to method lookup, indexed by method name, then order.
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} interface_
     * @private
     */
    _addToInterfaces: function (interface_) {
        var interfaces = this.__interfaces,
            interfaceLookup = this.__interfaceLookup,
            interfaceId = interface_.__classId;

        if (!interfaceLookup.hasOwnProperty(interfaceId)) {
            interfaces.push(interface_);
            interfaceLookup[interfaceId] = true;
        }
    },

    /**
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
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
                return !contributions.some(function (class_) {
                    var method = class_.__members[methodName];
                    return typeof method === 'function';
                });
            })
            // leaving out methods not found in any interfaces
            .filter(function (methodName) {
                return interfaces.some(function (interface_) {
                    var method = interface_.__members[methodName];
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @private
     */
    _addToIncludes: function (class_) {
        var includes = this.__includes,
            includeLookup = this.__includeLookup,
            classId = class_.__classId;

        if (!includeLookup.hasOwnProperty(classId)) {
            includes.push(class_);
            includeLookup[classId] = true;
        }
    },

    /**
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @private
     */
    _addToRequires: function (class_) {
        var classId = this.__classId,
            requireId = class_.__classId,
            includeLookup = this.__includeLookup,
            requires = this.__requires,
            requireLookup = this.__requireLookup;

        if (classId !== requireId &&
            !includeLookup.hasOwnProperty(requireId) &&
            !requireLookup.hasOwnProperty(requireId)
        ) {
            // require is not included (which would cancel each other out)
            // adding to requires
            requires.push(class_);
            requireLookup[requireId] = true;
        }
    },

    /**
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @private
     */
    _removeFromRequires: function (class_) {
        var classId = class_.__classId,
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @private
     */
    _transferRequires: function (class_) {
        var that = this;

        class_.__requires
            .concat(class_.__includes)
            .forEach(function (class_) {
                that.require(class_);
            });
    },

    /**
     * @returns {$oop.Class}
     * @private
     */
    _instantiate: function () {
        // retrieving forward class (if any)
        var that = this,
            forwards = this.__forwards,
            forwardsCount = forwards.length,
            i, forward;
        for (i = 0; i < forwardsCount; i++) {
            forward = forwards[i];
            if (forward.filter.apply(this, arguments)) {
                // ctr arguments fit forward filter
                // forwarding
                that = forward['class'];
                break;
            }
        }

        // fetching cached instance
        var mapper = that.__mapper,
            instances,
            instanceId, instance;
        if (mapper) {
            instances = that.__instanceLookup;
            instanceId = mapper.apply(this, arguments);
            instance = instances[instanceId];
            if (instance) {
                // instance found in cache
                return instance;
            }
        }

//         // checking whether
//         // ... methods match interfaces
//         if (unimplementedMethods.length) {
//             throw new Error([
//                 "Class '" + __classId + "' doesn't implement method(s): " +
//                 unimplementedMethods
//                     .map(function (methodName) {
//                         return "'" + methodName + "'";
//                     }) + ".",
//                 "Can't instantiate."
//             ].join(" "));
//         }

        // running checks
        var requires = that.__requires;
        if (requires.length) {
            // there are unfulfilled requires - can't instantiate
            throw new Error([
                "Class '" + that.__classId + "' doesn't satisfy require(s): " +
                requires
                    .map(function (class_) {
                        return "'" + class_.__classId + "'";
                    })
                    .join(",") + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // instantiating class
        instance = Object.create(that);

        // invoking .init
        // initializing instance properties
        if (typeof that.init === 'function') {
            // running instance initializer
            that.init.apply(instance, arguments);
        }

        // caching instance (if necessary)
        if (mapper) {
            instances[instanceId] = instance;
        }

        return instance;
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
            class_ = classes[classId];

        if (!class_) {
            // class is not initialized yet
            class_ = Object.create(this, /** @lends $oop.Class# */{
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
                __instanceLookup: {value: {}},

                /**
                 * Creates class instance.
                 * @function
                 */
                create: {
                    value   : this._instantiate,
                    writable: true
                }
            });

            // adding class to registry
            classes[classId] = class_;
        }

        return class_;
    },

    /**
     * Defines a batch of properties and methods contributed by the current class.
     * Can be called multiple times.
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @returns {$oop.Class}
     */
    include: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class#include expects type Class.");
        }

        // adding to includes
        this._addToIncludes(class_);

        // adding included class to contributions
        this._addToContributors(class_);

        // removing fulfilled require
        this._removeFromRequires(class_);

        var members = class_.__members;

        // adding methods to lookup at specified index
        this._addMethodsToMatrix(members, this.__contributorLookup[class_.__classId]);

        // adding / overwriting properties
        this._addPropertiesToClass(members);

        // adding wrapper method when necessary
        this._addWrapperMethodsToClass(members);

        // updating unimplemented methods lookup
        this._removeUnimplementedMethods(members);

        // transferring includes & requires from include
        this._transferRequires(class_);

        return this;
    },

    /**
     * Specifies an interface to be implemented by the host class.
     * @memberOf $oop.Class#
     * @param {$oop.Class} interface_
     * @returns {$oop.Class}
     */
    implement: function (interface_) {
        if (!$oop.Class.isPrototypeOf(interface_)) {
            throw new Error("Class#implement expects type Class.");
        }

        // adding to interfaces
        this._addToInterfaces(interface_);

        // updating unimplemented methods lookup
        this._addUnimplementedMethods(interface_.__members);

        return this;
    },

    /**
     * Specifies a required base, or trait of the host class.
     * Used by traits only.
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @returns {$oop.Class}
     */
    require: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class#require expects type Class.");
        }

        // adding require to registry
        this._addToRequires(class_);

        // transferring includes & requires from require
        this._transferRequires(class_);

        return this;
    },

    /**
     * Forwards the class to the specified class, if
     * constructor arguments satisfy the supplied filter.
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @param {function} filter
     * @param {number} [priority=0]
     * @returns {$oop.Class}
     */
    forward: function (class_, filter, priority) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class#forward expects type Class.");
        }

        var forwards = this.__forwards;

        // adding forward descriptor
        forwards.push({
            'class'   : class_,
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
     * @memberOf $oop.Class#
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
     * @memberOf $oop.Class#
     * @param {$oop.Class} interface_
     * @returns {boolean}
     */
    implements: function (interface_) {
        if (!$oop.Class.isPrototypeOf(interface_)) {
            throw new Error("Class type expected");
        }

        return !!this.__interfaceLookup[interface_.__classId];
    },

    /**
     * Tells whether current class is or includes the specified class.
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    includes: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        var classId = class_.__classId;

        return this.__classId === classId || !!this.__includeLookup[classId];
    },

    /**
     * Tells whether current class requires the specified class.
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    requires: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        return !!this.__requireLookup[class_.__classId];
    }
};
