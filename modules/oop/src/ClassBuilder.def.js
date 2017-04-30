/* global $oop */
"use strict";

/**
 * Builds composable classes.
 * @class
 */
$oop.ClassBuilder = /** @lends $oop.ClassBuilder# */{
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
     * @returns {string[]}
     * @private
     */
    _getUnimplementedMethods: function () {
        var interfaces = this.interfaces,
            interfaceNames = Object.keys(interfaces),
            methods = this.methods;

        return interfaceNames.reduce(function (unimplemented, interfaceName) {
            var contributions = interfaces[interfaceName].__contributes;

            return unimplemented.concat(Object.getOwnPropertyNames(contributions)
                .filter(function (memberName) {
                    return typeof contributions[memberName] === 'function' &&
                        !methods.hasOwnProperty(memberName);
                })
                .map(function (methodName) {
                    return interfaceName + '#' + methodName;
                }));
        }, []);
    },

    /**
     * Extracts extensions and requires from class and transfers them
     * to the class being built.
     * @param {$oop.Class} class_
     * @private
     */
    _extractRequires: function (class_) {
        var requires = this.requires,
            demandedRequires = requires.demanded,
            classRequires = class_.__requires,
            classExtends = class_.__extends,
            classRequireNames,
            classExtensionNames;

        if (classExtends) {
            classExtensionNames = classExtends && Object.keys(classExtends);
            classExtensionNames.forEach(function (extensionId) {
                demandedRequires[extensionId] = true;
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
     * colliding methods coming from different sources. (Contributions, base(s), extensions.)
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

                    // running functions in order of extension
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
     * @param {string} classId
     * @returns {$oop.ClassBuilder}
     * @memberOf $oop.ClassBuilder
     */
    create: function (classId) {
        if (!classId) {
            throw new Error("No class ID was specified.");
        }

        if (this.classes.hasOwnProperty(classId)) {
            throw new Error("Class " + classId + " already built.");
        }

        var builders = this.builders,
            builder = builders[classId];

        if (!builder) {
            // builder is not initialized yet
            builder = Object.create(this);

            /**
             * Identifies class
             * @type {string}
             * @memberOf $oop.ClassBuilder#
             */
            builder.classId = classId;

            /**
             * Registry of required classes
             * @type {{demanded: {}, fulfilled: {}}}
             * @memberOf $oop.ClassBuilder#
             */
            builder.requires = {
                demanded: {},
                fulfilled: {}
            };

            // adding self as fulfilled require
            builder.requires.fulfilled[classId] = true;

            /**
             * Registry of implemented interfaces.
             * @type {object}
             * @memberOf $oop.ClassBuilder#
             */
            builder.interfaces = {};

            /**
             * Registry of extended classes.
             * @type {object}
             * @memberOf $oop.ClassBuilder#
             */
            builder.extensions = {};

            /**
             * Class' own property & method contributions.
             * @type {object}
             * @memberOf $oop.ClassBuilder#
             */
            builder.contributions = {};

            /**
             * Registry of surrogate descriptors.
             * @type {object[]}
             * @memberOf $oop.ClassBuilder#
             */
            builder.forwards = [];

            /**
             * Registry of non-function properties indexed by property name.
             * @type {object}
             * @memberOf $oop.ClassBuilder#
             */
            builder.properties = {};

            /**
             * Method registry.
             * Indexed by method name, then serial.
             * @type {object}
             * @memberOf $oop.ClassBuilder#
             */
            builder.methods = {};

            // adding builder to registry
            builders[classId] = builder;
        }

        return builder;
    },

    /**
     * Specifies a required base, or trait of the host class.
     * Used by traits only.
     * @param {$oop.Class} class_
     * @returns {$oop.ClassBuilder}
     */
    require: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#require expects type Class");
        }

        // registering required class
        this.requires.demanded[class_.__id] = true;

        // transferring extends & requires to class being built
        this._extractRequires(class_);

        return this;
    },

    /**
     * Specifies an interface to be implemented by the host class.
     * Every specified interface must be fully implemented by the host class,
     * otherwise build will fail.
     * @param {$oop.Class} interface_
     * @returns {$oop.ClassBuilder}
     */
    implement: function (interface_) {
        if (!$oop.Class.isPrototypeOf(interface_)) {
            throw new Error("ClassBuilder#implement expects type Class");
        }

        // registering interface
        this.interfaces[interface_.__id] = interface_;

        return this;
    },

    /**
     * Specifies a class to be extended by the host class.
     * @param {$oop.Class} class_
     * @returns {$oop.ClassBuilder}
     */
    extend: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#extend expects type Class");
        }

        var classId = class_.__id;

        // registering class as extension
        this.extensions[classId] = true;

        // adding extension to fulfilled requirements
        this.requires.fulfilled[classId] = true;

        // transferring extends & requires to class being built
        this._extractRequires(class_);

        // registering contributed methods
        var properties = class_.__contributes;
        this._addProperties(properties);
        this._addMethods(properties);

        return this;
    },

    /**
     * @param {$oop.Class} class_
     * @param {function} filter
     * @param {number} [priority=0]
     * @returns {$oop.ClassBuilder}
     */
    forward: function (class_, filter, priority) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("ClassBuilder#forward expects type Class");
        }

        var forwards = this.forwards;

        // adding forward descriptor
        forwards.push({
            'class': class_,
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
     * @param {function} mapper
     * @returns {$oop.ClassBuilder}
     */
    cache: function (mapper) {
        if (typeof mapper !== 'function') {
            throw new Error("ClassBuilder#cache expects function argument");
        }

        this.mapper = mapper;

        return this;
    },

    /**
     * Can be called multiple times.
     * @param {object} members
     * @returns {$oop.ClassBuilder}
     */
    contribute: function (members) {
        if (!members) {
            throw new Error("No contributions specified.");
        }

        var contributions = this.contributions,
            memberNames = Object.getOwnPropertyNames(members),
            i, memberName;

        // copying properties to overall contributions
        for (i = 0; i < memberNames.length; i++) {
            memberName = memberNames[i];
            contributions[memberName] = members[memberName];
        }

        // registering contributed methods
        this._addProperties(members);
        this._addMethods(members);

        return this;
    },

    /**
     * @todo Add 'built' flag for checking access to __builder.
     * @returns {object} The created class.
     */
    build: function () {
        var classId = this.classId,
            unimplementedMethods = this._getUnimplementedMethods(),
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
            __id: {value: classId},
            __implements: {value: this.interfaces},
            __extends: {value: this.extensions},
            __requires: {value: this._getUnfulfilledRequires()},
            __contributes: {value: this.contributions},
            __forwards: {value: this.forwards},
            __instances: {value: {}},
            __builder: {value: this}
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
        $oop.ClassBuilder.classes[classId] = result;

        return result;
    }
};
