/* global $assert */
"use strict";

/**
 * Composable class.
 * @class $oop.Class
 */
exports.Class = exports.createObject(Object.prototype, /** @lends $oop.Class# */{
    /**
     * All classes indexed by class ID.
     * @memberOf $oop.Class
     * @type {object}
     */
    classLookup: {},

    /**
     * Fetches the class by the specified ID.
     * Creates the class if it doesn't exist yet.
     * @memberOf $oop.Class
     * @param {string} classId
     * @returns {$oop.Class}
     */
    getClass: function (classId) {
        $assert.isString(classId, "No class ID was specified.");

        var classes = this.classLookup,
            Class = classes[classId];

        if (!Class) {
            // class is not initialized yet
            Class = exports.createObject(exports.Class, {
                __classId: classId,
                __members: {},
                __methodMatrix: {},
                __contributors: [],
                __contributorIndexLookup: {},
                __interfaces: [],
                __interfaceLookup: {},
                __missingMethodNames: [],
                __missingMethodLookup: {},
                __includes: [],
                __includeLookup: {},
                __includers: [],
                __includerLookup: {},
                __requires: [],
                __requireLookup: {},
                __forwards: [],
                __mapper: undefined,
                __instanceLookup: {}
            });

            // adding class to registry
            classes[classId] = Class;
        }

        return Class;
    },

    /**
     * Copies batch of members to class members container.
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
            contributionLookup = this.__contributorIndexLookup,
            classId = Class.__classId;

        if (!contributionLookup.hasOwnProperty(classId)) {
            contributionLookup[classId] = contributions.length;
            contributions.push(Class);
        }
    },

    /**
     * Adds methods to method lookup, indexed by method name, then order.
     * @param {object} members
     * @param {string} classId
     * @private
     */
    _addMethodsToMatrix: function (members, classId) {
        var methodMatrix = this.__methodMatrix,
            classIndex = this.__contributorIndexLookup[classId];

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            .forEach(function (methodName) {
                var methods = methodMatrix[methodName];
                if (!methods) {
                    methods = methodMatrix[methodName] = [];
                }
                methods[classIndex] = members[methodName];
            });
    },

    /**
     * Adds properties to class.
     * @param {object} members
     * @private
     */
    _addPropertiesToClass: function (members) {
        var Class = exports.Class,
            that = this;

        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] !== 'function';
            })
            .forEach(function (propertyName) {
                var propertyValue = members[propertyName];

                if (Class.isPrototypeOf(propertyValue) &&
                    Object.getPrototypeOf(propertyValue) !== Class
                ) {
                    $assert.assert(false, [
                        "Instance not allowed as static property value for '" + that.__classId + "." + propertyName + "'.",
                        "Can't build."
                    ].join(" "));
                }

                that[propertyName] = propertyValue;
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
            interfaceLookup[interfaceId] = Interface;
        }
    },

    /**
     * @param {object} members
     * @private
     */
    _removeFromMissingMethods: function (members) {
        var missingMethodNames = this.__missingMethodNames,
            missingMethodLookup = this.__missingMethodLookup;

        // removing methods from registry
        Object.getOwnPropertyNames(members)
            .filter(function (memberName) {
                return typeof members[memberName] === 'function';
            })
            // leaving only those already registered
            .filter(function (methodName) {
                return missingMethodLookup.hasOwnProperty(methodName);
            })
            // unregistering method names
            .forEach(function (implementedMethodName) {
                missingMethodNames.splice(missingMethodNames.indexOf(implementedMethodName), 1);
                delete missingMethodLookup[implementedMethodName];
            });
    },

    /**
     * Adds functions in members to registry of missing methods names,
     * unless they're already implemented by the class, or any of the includes.
     * @param {object} members
     * @private
     */
    _addToMissingMethods: function (members) {
        var contributions = this.__contributors,
            interfaces = this.__interfaces,
            missingMethodNames = this.__missingMethodNames,
            missingMethodLookup = this.__missingMethodLookup;

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
            .filter(function (missingMethodName) {
                return !missingMethodLookup.hasOwnProperty(missingMethodName);
            })
            // registering method names as missing
            .forEach(function (missingMethodName) {
                missingMethodNames.push(missingMethodName);
                missingMethodLookup[missingMethodName] = true;
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
            includeLookup[classId] = Class;
        }
    },

    /**
     * @param {$oop.Class} Class
     * @private
     */
    _addToIncluders: function (Class) {
        var includers = this.__includers,
            includerLookup = this.__includerLookup,
            classId = Class.__classId;

        if (!includerLookup.hasOwnProperty(classId)) {
            includers.push(Class);
            includerLookup[classId] = Class;
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
            requireLookup[requireId] = Class;
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
     * Delegates a batch of methods to includers.
     * @param {object} members
     * @private
     */
    _delegateToIncluders: function (members) {
        var classId = this.__classId;

        this.__includers
            .forEach(function (Class) {
                // adding methods to lookup at specified index
                Class._addMethodsToMatrix(members, classId);

                // adding / overwriting properties
                Class._addPropertiesToClass(members);

                // adding wrapper method when necessary
                Class._addWrapperMethodsToClass(members);

                // updating missing method names
                Class._removeFromMissingMethods(members);
            });
    },

    /**
     * Creates a new instance.
     * @returns {$oop.Class}
     */
    create: function () {
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

        // checking whether
        // ... methods match interfaces
        var missingMethodNames = this.__missingMethodNames;
        if (missingMethodNames.length) {
            $assert.assert(false, [
                "Class '" + that.__classId + "' doesn't implement method(s): " +
                missingMethodNames
                    .map(function (methodName) {
                        return "'" + methodName + "'";
                    }) + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // ... all requires are included
        var requires = that.__requires;
        if (requires.length) {
            // there are unfulfilled requires - can't instantiate
            $assert.assert(false, [
                "Class '" + that.__classId + "' doesn't satisfy require(s): " +
                requires
                    .map(function (Class) {
                        return "'" + Class.__classId + "'";
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
     * Defines a batch of properties and methods contributed by the current class.
     * Can be called multiple times.
     * @param {object} batch
     * @returns {$oop.Class}
     */
    define: function (batch) {
        $assert.isObject(batch, "No members specified.");

        // adding batch to members, overwriting conflicting properties
        this._addToMembers(batch);

        // marking self as contributor
        this._addToContributors(this);

        // adding methods to lookup at specified index
        this._addMethodsToMatrix(batch, this.__classId);

        // adding / overwriting properties
        this._addPropertiesToClass(batch);

        // adding wrapper method when necessary
        this._addWrapperMethodsToClass(batch);

        // updating missing methods names
        this._removeFromMissingMethods(batch);

        // delegating batch to includers
        this._delegateToIncluders(batch);

        return this;
    },

    /**
     * Specifies a class to be included by the host class.
     * @param {$oop.Class} Class
     * @returns {$oop.Class}
     */
    include: function (Class) {
        $assert.isClass(Class, "Class#include expects type Class.");

        // adding to includes
        this._addToIncludes(Class);

        // adding to reverse includes
        Class._addToIncluders(this);

        // adding included class to contributions
        this._addToContributors(Class);

        // removing fulfilled require
        this._removeFromRequires(Class);

        // transferring includes & requires from include
        this._transferRequires(Class);

        var members = Class.__members;

        // adding methods to lookup at specified index
        this._addMethodsToMatrix(members, Class.__classId);

        // adding / overwriting properties
        this._addPropertiesToClass(members);

        // adding wrapper method when necessary
        this._addWrapperMethodsToClass(members);

        // updating missing method names
        this._removeFromMissingMethods(members);

        return this;
    },

    /**
     * Specifies an interface to be implemented by the host class.
     * @param {$oop.Class} Interface
     * @returns {$oop.Class}
     */
    implement: function (Interface) {
        $assert.isClass(Interface, "Class#implement expects type Class.");

        // adding to interfaces
        this._addToInterfaces(Interface);

        // updating missing method names
        this._addToMissingMethods(Interface.__members);

        return this;
    },

    /**
     * Specifies a required base, or trait of the host class.
     * Used by traits only.
     * @param {$oop.Class} Class
     * @returns {$oop.Class}
     */
    require: function (Class) {
        $assert.isClass(Class, "Class#require expects type Class.");

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
        $assert.isClass(Class, "Class#forward expects type Class.");

        var forwards = this.__forwards;

        // adding forward descriptor
        forwards.push({
            'class': Class,
            'filter': filter,
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
        $assert.isFunction(mapper, "Class#cache expects function argument.");

        this.__mapper = mapper;

        return this;
    },

    /**
     * Tells whether current class implements the specified interface.
     * @param {$oop.Class} Interface
     * @returns {boolean}
     */
    implements: function (Interface) {
        $assert.isClass(Interface, "Class type expected");

        return !!this.__interfaceLookup[Interface.__classId];
    },

    /**
     * Tells whether the specified class implements the current Interface.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isImplementedBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.implements(this);
    },

    /**
     * Tells whether current class is or includes the specified class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    includes: function (Class) {
        $assert.isClass(Class, "Class type expected");

        var classId = Class.__classId;

        return this.__classId === classId || !!this.__includeLookup[classId];
    },

    /**
     * Tells whether the specified class includes the current class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isIncludedBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.includes(this);
    },

    /**
     * Tells whether current class requires the specified class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    requires: function (Class) {
        $assert.isClass(Class, "Class type expected");

        return !!this.__requireLookup[Class.__classId];
    },

    /**
     * Tells whether specified class requires the current class.
     * @param {$oop.Class} Class
     * @returns {boolean}
     */
    isRequiredBy: function (Class) {
        return exports.Class.isPrototypeOf(Class) &&
            Class.requires(this);
    },

    /**
     * Binds and stores the specified methods on the instance,
     * so they're reusable as callbacks.
     * @param {...string} methodName
     * @returns {$oop.Class}
     */
    elevateMethods: function (methodName) {
        var argumentCount = arguments.length,
            i, method;

        for (i = 0; i < argumentCount; i++) {
            methodName = arguments[i];
            if (this.hasOwnProperty(methodName)) {
                $assert.assert(false, "Method '" + this.__classId + "#" + methodName + "' already elevated.");
            } else {
                method = this[methodName];
                if (typeof method !== 'function') {
                    $assert.assert(false, [
                        "Method '" + this.__classId + '#' + methodName + "' not a function.",
                        "Can't elevate."
                    ].join(" "));
                } else {
                    this[methodName] = this[methodName].bind(this);
                }
            }
        }

        return this;
    }

    /**
     * Identifies class.
     * @member {string} $oop.Class#__classId
     * @private
     */

    /**
     * @member {object} $oop.Class#__members
     * @private
     */

    /**
     * @member {object} $oop.Class#__methodMatrix
     * @private
     */

    /**
     * @member {object[]} $oop.Class#__contributors
     * @private
     */

    /**
     * @member {object} $oop.Class#__contributorIndexLookup
     * @private
     */

    /**
     * @member {$oop.Class[]} $oop.Class#__interfaces
     * @private
     */

    /**
     * @member {object} $oop.Class#__interfaceLookup
     * @private
     */

    /**
     * @member {string[]} $oop.Class#__missingMethodNames
     * @private
     */

    /**
     * @member {object} $oop.Class#__missingMethodLookup
     * @private
     */

    /**
     * @member {$oop.Class[]} $oop.Class#__includes
     * @private
     */

    /**
     * @member {object} $oop.Class#__includeLookup
     * @private
     */

    /**
     * @member {$oop.Class[]} $oop.Class#__includers
     * @private
     */

    /**
     * @member {object} $oop.Class#__includerLookup
     * @private
     */

    /**
     * @member {string[]} $oop.Class#__requires
     * @private
     */

    /**
     * @member {object} $oop.Class#__requireLookup
     * @private
     */

    /**
     * List of surrogate descriptors.
     * @todo Do we need a lookup for this too?
     * @member {object[]} $oop.Class#__forwards
     * @private
     */

    /**
     * Instance hash function for cached classes.
     * @todo Rename
     * @function $oop.Class#__mapper
     * @returns {string}
     * @private
     */

    /**
     * Registry of instances indexed by hash.
     * @member {object} $oop.Class#__instanceLookup
     * @private
     */
});

/**
 * @param {$oop.Class} expr
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClass = function (expr, message) {
    return $assert.assert(
        exports.Class.isPrototypeOf(expr), message);
};

/**
 * @param {$oop.Class} [expr]
 * @param {string} [message]
 * @returns {$assert}
 */
$assert.isClassOptional = function (expr, message) {
    return $assert.assert(
        typeof expr === 'undefined' ||
        exports.Class.isPrototypeOf(expr), message);
};
