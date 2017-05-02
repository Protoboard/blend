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
     * @param {object} members
     * @private
     */
    _addProperties: function (members) {
        var registry = this.properties,
            memberNames = Object.getOwnPropertyNames(members),
            memberCount = memberNames.length,
            i, memberName, memberValue;

        for (i = 0; i < memberCount; i++) {
            memberName = memberNames[i];
            memberValue = members[memberName];
            if (typeof memberValue !== 'function') {
                registry[memberName] = memberValue;
            }
        }
    },

    /**
     * @memberOf $oop.ClassBuilder#
     * @param {object} members
     * @private
     */
    _addMethods: function (members) {
        var methods = this.methods,
            memberNames = Object.getOwnPropertyNames(members),
            memberCount = memberNames.length,
            i, memberName, memberValue, methodOverrides;

        for (i = 0; i < memberCount; i++) {
            memberName = memberNames[i];
            memberValue = members[memberName];
            if (typeof memberValue === 'function') {
                methodOverrides = methods[memberName] = methods[memberName] || [];
                methodOverrides.push(memberValue);
            }
        }
    },

    /**
     * Retrieves a list of Interface / method identifiers not implemented by the host class.
     * @memberOf $oop.ClassBuilder#
     * @returns {string[]}
     * @private
     */
    _getUnimplementedMethods: function () {
        var interfaces = this.interfaces,
            interfaceNames = Object.keys(interfaces),
            methods = this.methods;

        return interfaceNames.reduce(function (unimplemented, interfaceName) {
            var members = interfaces[interfaceName].__defines;

            return unimplemented.concat(Object.getOwnPropertyNames(members)
                .filter(function (memberName) {
                    return typeof members[memberName] === 'function' &&
                        !methods.hasOwnProperty(memberName);
                })
                .map(function (methodName) {
                    return interfaceName + '#' + methodName;
                }));
        }, []);
    },

    /**
     * Extracts includes and requires from class and transfers them
     * to the class being built.
     * @memberOf $oop.ClassBuilder#
     * @param {$oop.Class} class_
     * @private
     */
    _extractRequires: function (class_) {
        var requires = this.requires,
            demandedRequires = requires.demanded,
            classRequires = class_.__requires,
            classIncludes = class_.__includes,
            classRequireNames,
            classIncludeNames;

        if (classIncludes) {
            classIncludeNames = classIncludes && Object.keys(classIncludes);
            classIncludeNames.forEach(function (includeId) {
                demandedRequires[includeId] = true;
            });
        }
        if (classRequires) {
            classRequireNames = classRequires && Object.keys(classRequires);
            classRequireNames.forEach(function (requireId) {
                demandedRequires[requireId] = true;
            });
        }
    },

    /**
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getUnfulfilledRequires: function () {
        var requires = this.requires,
            demanded = requires.demanded,
            fulfilled = requires.fulfilled,
            unfulfilledClassIds = Object.keys(demanded)
                .filter(function (classId) {
                    return !fulfilled.hasOwnProperty(classId);
                }),
            result;

        if (unfulfilledClassIds.length) {
            result = {};
            unfulfilledClassIds
                .forEach(function (classId) {
                    result[classId] = true;
                });
        }

        return result;
    },

    /**
     * Retrieves a list of method names that can be copied over 1:1.
     * @memberOf $oop.ClassBuilder#
     * @private
     */
    _getSingularMethodNames: function () {
        var methods = this.methods,
            methodNames = Object.getOwnPropertyNames(methods);

        return methodNames
            .filter(function (methodName) {
                return methods[methodName].length === 1;
            });
    },

    /**
     * Retrieves a lookup of method names : anonymous functions that wrap
     * colliding methods coming from different sources. (Members, includes.)
     * @memberOf $oop.ClassBuilder#
     * @returns {object}
     * @private
     */
    _getWrapperMethods: function () {
        var methods = this.methods,
            methodNames = Object.keys(methods),
            result = {};

        methodNames
            .filter(function (methodName) {
                return methods[methodName].length > 1;
            })
            .forEach(function (methodName) {
                var functions = methods[methodName],
                    functionCount = functions.length;

                // generating wrapper method
                // it's very important that this function remains as light as possible
                result[methodName] = function () {
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
            });

        return result;
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
             * Registry of required classes
             * @member {{demanded: {}, fulfilled: {}}} $oop.ClassBuilder#requires
             */
            builder.requires = {
                demanded : {},
                fulfilled: {}
            };

            // adding self as fulfilled require
            builder.requires.fulfilled[classId] = true;

            /**
             * Registry of implemented interfaces.
             * @member {object} $oop.ClassBuilder#interfaces
             */
            builder.interfaces = {};

            /**
             * Registry of included classes.
             * @member {object} $oop.ClassBuilder#includes
             */
            builder.includes = {};

            /**
             * Class' own property & method members.
             * @member {object} $oop.ClassBuilder#members
             */
            builder.members = {};

            /**
             * Registry of surrogate descriptors.
             * @member {object[]} $oop.ClassBuilder#forwards
             */
            builder.forwards = [];

            /**
             * Registry of non-function properties indexed by property name.
             * @member {object} $oop.ClassBuilder#properties
             */
            builder.properties = {};

            /**
             * Method registry.
             * Indexed by method name, then serial.
             * @member {object} $oop.ClassBuilder#methods
             */
            builder.methods = {};

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

        // registering required class
        this.requires.demanded[class_.__id] = true;

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

        // registering interface
        this.interfaces[interface_.__id] = interface_;

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

        var classId = class_.__id;

        // registering class as include
        this.includes[classId] = true;

        // adding include to fulfilled requirements
        this.requires.fulfilled[classId] = true;

        // transferring includes & requires to class being built
        this._extractRequires(class_);

        // registering defined members
        var properties = class_.__defines;
        this._addProperties(properties);
        this._addMethods(properties);

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
     * Defines a batch of properties and methods contributed by the current class.
     * Can be called multiple times.
     * @memberOf $oop.ClassBuilder#
     * @param {object} membersBatch
     * @returns {$oop.ClassBuilder}
     */
    define: function (membersBatch) {
        if (!membersBatch) {
            throw new Error("No members specified.");
        }
        // TODO: Defining after build should be allowed. (Would require re-constructing overrides.)
        if (this['class']) {
            throw new Error("ClassBuilder#define may only be called before build.");
        }

        var members = this.members,
            memberNames = Object.getOwnPropertyNames(membersBatch),
            i, memberName;

        // copying properties to overall members
        for (i = 0; i < memberNames.length; i++) {
            memberName = memberNames[i];
            members[memberName] = membersBatch[memberName];
        }

        // registering properties & methods
        this._addProperties(membersBatch);
        this._addMethods(membersBatch);

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

        var unimplementedMethods = this._getUnimplementedMethods(),
            properties = this.properties,
            methods = this.methods,
            result = Object.create($oop.Class);

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
            __implements: {value: this.interfaces},
            __includes  : {value: this.includes},
            __requires  : {value: this._getUnfulfilledRequires()},
            __defines   : {value: this.members},
            __forwards  : {value: this.forwards},
            __mapper    : {value: this.mapper},
            __instances : {value: {}}
        });

        // copying non-method properties
        Object.getOwnPropertyNames(properties)
            .forEach(function (propertyName) {
                result[propertyName] = properties[propertyName];
            });

        // copying singular methods 1:1
        this._getSingularMethodNames()
            .forEach(function (methodName) {
                result[methodName] = methods[methodName][0];
            });

        // copying wrapper methods
        var wrapperMethods = this._getWrapperMethods();
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
