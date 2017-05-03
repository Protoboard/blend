/* global $oop */
"use strict";

/**
 * Builds composable classes.
 * @class $oop.ClassBuilder
 */
$oop.ClassBuilder = {
    /**
     * All class builders indexed by class ID.
     * @memberOf $oop.ClassBuilder
     */
    builders: {},

    /**
     * All built classes indexed by class ID.
     * @memberOf $oop.ClassBuilder
     */
    classes: {},

    /**
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getMethodNameLookup: function () {
        return this.contributions
            .reduce(function (methodLookup, members) {
                Object.getOwnPropertyNames(members)
                    .filter(function (memberName) {
                        return typeof members[memberName] === 'function';
                    })
                    .forEach(function (methodName) {
                        methodLookup[methodName] = true;
                    });

                return methodLookup;
            }, {});
    },

    /**
     * Retrieves a list of Interface / method identifiers not implemented by the host class.
     * @memberOf $oop.ClassBuilder#
     * @returns {string[]}
     * @private
     */
    _getUnimplementedMethodNames: function () {
        var methods = this._getMethodNameLookup(),
            interfaceIds = Object.keys(this.interfaceLookup);

        // order does not matter
        return interfaceIds
            .map(function (interfaceId) {
                return $oop.ClassBuilder.classes[interfaceId];
            })
            .reduce(function (unimplemented, interface_) {
                var members = interface_.__defines;

                // going through all interfaces and matching methods against members
                return unimplemented.concat(Object.getOwnPropertyNames(members)
                    .filter(function (memberName) {
                        return typeof members[memberName] === 'function' &&
                            !methods.hasOwnProperty(memberName);
                    })
                    .map(function (methodName) {
                        return interface_.__id + '#' + methodName;
                    }));
            }, []);
    },

    /**
     * Extracts includes and requires from class and transfers them
     * to the class being built as requires.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} class_
     * @private
     */
    _extractRequires: function (class_) {
        var requireLookup = this.requireLookup,
            classRequires = class_.__requires,
            classIncludes = class_.__includes,
            classRequireNames,
            classIncludeNames;

        if (classIncludes) {
            classIncludeNames = classIncludes && Object.keys(classIncludes);
            classIncludeNames.forEach(function (includeId) {
                requireLookup[includeId] = true;
            });
        }

        if (classRequires) {
            classRequireNames = classRequires && Object.keys(classRequires);
            classRequireNames.forEach(function (requireId) {
                requireLookup[requireId] = true;
            });
        }
    },

    /**
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getUnfulfilledRequireLookup: function () {
        var classId = this.classId,
            requireLookup = this.requireLookup,
            includeLookup = this.includeLookup,
            unfulfilledRequireIds = Object.keys(requireLookup)
                .filter(function (requireId) {
                    return classId !== requireId &&
                        !includeLookup.hasOwnProperty(requireId);
                });

        return unfulfilledRequireIds.length ?
            unfulfilledRequireIds
                .reduce(function (requireLookup, requireId) {
                    requireLookup[requireId] = true;
                    return requireLookup;
                }, {}) :
            undefined;
    },

    /**
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getProperties: function () {
        return this.contributions
            .reduce(function (properties, members) {
                Object.getOwnPropertyNames(members)
                    .filter(function (memberName) {
                        return typeof members[memberName] !== 'function';
                    })
                    .forEach(function (propertyName) {
                        properties[propertyName] = members[propertyName];
                    });

                return properties;
            }, {});
    },

    /**
     * Retrieves a structure with all methods in it.
     * @memberOf $oop.ClassBuilder#
     * @private
     */
    _getMethods: function () {
        return this.contributions
            .reduce(function (singularMethods, members) {
                Object.getOwnPropertyNames(members)
                    .filter(function (memberName) {
                        return typeof members[memberName] === 'function';
                    })
                    .forEach(function (methodName) {
                        if (!singularMethods[methodName]) {
                            singularMethods[methodName] = [];
                        }
                        singularMethods[methodName].push(members[methodName]);
                    });
                return singularMethods;
            }, {});
    },

    /**
     * Retrieves a list of method names that can be copied over 1:1.
     * @memberOf $oop.ClassBuilder#
     * @private
     */
    _getSingularMethods: function () {
        var methods = this._getMethods();

        return Object.getOwnPropertyNames(methods)
            .filter(function (methodName) {
                return methods[methodName].length === 1;
            })
            .reduce(function (singularMethods, singularMethodName) {
                singularMethods[singularMethodName] = methods[singularMethodName][0];
                return singularMethods;
            }, {});
    },

    /**
     * Retrieves a lookup of method names : anonymous functions that wrap
     * colliding methods coming from different sources. (Members, includes.)
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getWrapperMethods: function () {
        var methods = this._getMethods();

        return Object.getOwnPropertyNames(methods)
            .filter(function (methodName) {
                return methods[methodName].length > 1;
            })
            .reduce(function (wrapperMethods, methodName) {
                var functions = methods[methodName],
                    functionCount = functions.length;

                // generating wrapper method
                // it's very important that this function remains as light as possible
                wrapperMethods[methodName] = function () {
                    var results = new Array(functionCount),
                        i, result,
                        same = true;

                    // running functions in order of includes
                    for (i = 0; i < functionCount; i++) {
                        results[i] = functions[i].apply(this, arguments);
                    }

                    // evaluating return values
                    for (i = 1, result = results[0]; i < functionCount; i++) {
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

                return wrapperMethods;
            }, {});
    },

    /**
     * Creates a new ClassBuilder instance.
     * @memberOf $oop.ClassBuilder
     * @param {string} classId
     * @returns {$oop.ClassBuilder}
     */
    create: function (classId) {
        if (!classId) {
            throw new Error("No class ID was specified.");
        }

        var builders = this.builders,
            builder = builders[classId];

        if (!builder) {
            // builder is not initialized yet
            builder = Object.create(this);

            /**
             * Identifies class
             * @member {string} $oop.ClassBuilder#classId
             */
            builder.classId = classId;

            /**
             * Lookup of required classes indexed by class ID.
             * @member {object} $oop.ClassBuilder#requireLookup
             */
            builder.requireLookup = {};

            /**
             * Lookup of interfaces indexed by class ID.
             * @member {object} $oop.ClassBuilder#interfaceLookup
             */
            builder.interfaceLookup = {};

            /**
             * Lookup of includes indexed by class ID.
             * @member {object} $oop.ClassBuilder#includeLookup
             */
            builder.includeLookup = {};

            /**
             * Class' own properties & methods.
             * @member {object} $oop.ClassBuilder#members
             */
            builder.members = {};

            /**
             * All sets of contributed members, (as include or as member definition) in order of addition.
             * @todo Store class IDs only?
             * @member {object[]} $oop.ClassBuilder#contributions
             */
            builder.contributions = [];

            /**
             * Lookup of all contributions indexed by class ID.
             * @member {object} $oop.ClassBuilder#contributionLookup
             */
            builder.contributionLookup = {};

            /**
             * List of surrogate descriptors.
             * @todo Do we need a lookup for this too?
             * @member {object[]} $oop.ClassBuilder#forwards
             */
            builder.forwards = [];

            /**
             * Instance hash function for cached classes.
             * @member {function} $oop.ClassBuilder#mapper
             */
            builder.mapper = undefined;

            /**
             * Class built by builder.
             * @member {$oop.Class} $oop.ClassBuilder#class
             */
            builder.class = undefined;

            // adding builder to registry
            builders[classId] = builder;
        }

        return builder;
    },

    /**
     * Defines a batch of properties and methods contributed by the current class.
     * Can be called multiple times.
     * @memberOf $oop.ClassBuilder#
     * @param {object} batch
     * @returns {$oop.ClassBuilder}
     */
    define: function (batch) {
        if (!batch) {
            throw new Error("No members specified.");
        }
        // TODO: Defining after build should be allowed. (Would require re-constructing overrides.)
        if (this['class']) {
            throw new Error("ClassBuilder#define may only be called before build.");
        }

        var members = this.members;

        // adding batch to members, overwriting conflicting properties
        Object.getOwnPropertyNames(batch)
            .reduce(function (members, memberName) {
                members[memberName] = batch[memberName];
                return members;
            }, members);

        var contributions = this.contributions,
            contributionsLookup = this.contributionLookup,
            classId = this.classId;

        // adding members to contributions
        if (!contributionsLookup.hasOwnProperty(classId)) {
            contributions.push(members);
            contributionsLookup[classId] = true;
        }

        return this;
    },

    /**
     * Specifies a class to be included by the host class.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} class_
     * @returns {$oop.ClassBuilder}
     */
    include: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#include expects type Class.");
        }
        if (this['class']) {
            throw new Error("ClassBuilder#include may only be called before build.");
        }

        var includeLookup = this.includeLookup,
            classId = class_.__id;

        // adding interface to list
        if (!includeLookup.hasOwnProperty(classId)) {
            includeLookup[classId] = true;
        }

        var contributions = this.contributions,
            contributionsLookup = this.contributionLookup;

        // adding members to contributions
        if (!contributionsLookup.hasOwnProperty(classId)) {
            contributions.push(class_.__defines);
            contributionsLookup[classId] = true;
        }

        // transferring includes & requires to class being built
        this._extractRequires(class_);

        return this;
    },

    /**
     * Specifies an interface to be implemented by the host class.
     * Every specified interface must be fully implemented by the host class,
     * otherwise build will fail.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} interface_
     * @returns {$oop.ClassBuilder}
     */
    implement: function (interface_) {
        if (!$oop.Class.isPrototypeOf(interface_)) {
            throw new Error("ClassBuilder#implement expects type Class.");
        }
        if (this['class']) {
            throw new Error("ClassBuilder#implement may only be called before build.");
        }

        var interfaceLookup = this.interfaceLookup,
            classId = interface_.__id;

        // adding interface to list
        if (!interfaceLookup.hasOwnProperty(classId)) {
            interfaceLookup[classId] = true;
        }

        return this;
    },

    /**
     * Specifies a required base, or trait of the host class.
     * Used by traits only.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} class_
     * @returns {$oop.ClassBuilder}
     */
    require: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#require expects type Class.");
        }
        if (this['class']) {
            throw new Error("ClassBuilder#require may only be called before build.");
        }

        var requireLookup = this.requireLookup,
            classId = class_.__id;

        // adding require to list
        if (!requireLookup.hasOwnProperty(classId)) {
            requireLookup[classId] = true;
        }

        // transferring includes & requires to class being built
        this._extractRequires(class_);

        return this;
    },

    /**
     * Forwards the class to the specified class, if
     * constructor arguments satisfy the supplied filter.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} class_
     * @param {function} filter
     * @param {number} [priority=0]
     * @returns {$oop.ClassBuilder}
     */
    forward: function (class_, filter, priority) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#forward expects type Class.");
        }

        var forwards = this.forwards;

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
     * @memberOf $oop.ClassBuilder#
     * @param {function} mapper
     * @returns {$oop.ClassBuilder}
     */
    cache: function (mapper) {
        if (typeof mapper !== 'function') {
            throw new Error("ClassBuilder#cache expects function argument.");
        }
        if (this['class']) {
            throw new Error("ClassBuilder#cache may only be called before build.");
        }

        this.mapper = mapper;

        return this;
    },

    /**
     * @memberOf $oop.ClassBuilder#
     * @returns {$oop.Class} The created class.
     */
    build: function () {
        var classId = this.classId;

        if (this['class']) {
            throw new Error("Class " + classId + " already built.");
        }

        var result = Object.create($oop.Class),
            unimplementedMethods = this._getUnimplementedMethodNames();

        // checking whether
        // ... methods match interfaces
        if (unimplementedMethods.length) {
            throw new Error([
                "Class '" + classId + "' doesn't implement method(s): " +
                unimplementedMethods
                    .map(function (methodName) {
                        return "'" + methodName + "'";
                    }) + ".",
                "Can't build."
            ].join(" "));
        }

        // adding meta properties
        Object.defineProperties(result, {
            __id        : {value: classId},
            __implements: {value: this.interfaceLookup},
            __includes  : {value: this.includeLookup},
            __requires  : {value: this._getUnfulfilledRequireLookup()},
            __defines   : {value: this.members},
            __forwards  : {value: this.forwards},
            __mapper    : {value: this.mapper},
            __instances : {value: {}}
        });

        var properties = this._getProperties(),
            singularMethods = this._getSingularMethods(),
            wrapperMethods = this._getWrapperMethods();

        // copying non-method properties
        Object.getOwnPropertyNames(properties)
            .forEach(function (memberName) {
                result[memberName] = properties[memberName];
            });

        // copying singular methods 1:1
        Object.getOwnPropertyNames(singularMethods)
            .forEach(function (methodName) {
                result[methodName] = singularMethods[methodName];
            });

        // copying wrapper methods
        Object.getOwnPropertyNames(wrapperMethods)
            .forEach(function (methodName) {
                result[methodName] = wrapperMethods[methodName];
            });

        // adding class to registry
        this['class'] = result;
        $oop.ClassBuilder.classes[classId] = result;

        return result;
    }
};
