/* global $oop */
"use strict";

/**
 * General class functionality: instantiation & reflection.
 * @class
 */
$oop.Class = /** @lends $oop.Class# */{
    /**
     * Creates new instance of class.
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
        var mapper = that.__builder.mapper,
            instances,
            instanceId, instance;
        if (mapper) {
            instances = that.__instances;
            instanceId = mapper.apply(this, arguments);
            instance = instances[instanceId];
            if (instance) {
                // instance found in cache
                return instance;
            }
        }

        // running checks
        var requires = that.__requires;
        if (requires) {
            // there are unfulfilled requires - can't instantiate
            throw new Error([
                "Class '" + that.__id + "' doesn't satisfy require(s): " +
                Object.keys(requires)
                    .map(function (classId) {
                        return "'" + classId + "'";
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
     * Tells whether current class implements the specified interface.
     * @param {$oop.Class} interface_
     * @returns {boolean}
     */
    implements: function (interface_) {
        if (!$oop.Class.isPrototypeOf(interface_)) {
            throw new Error("Class type expected");
        }

        return !!this.__implements[interface_.__id];
    },

    /**
     * Tells whether current class is or extends the specified class.
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    extends: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        var classId = class_.__id;

        return this.__id === classId || !!this.__extends[classId];
    },

    /**
     * Tells whether current class requires the specified class.
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    requires: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        return !!this.__requires[class_.__id];
    }
};

/**
 * Identifies class.
 * @name $oop.Class#__id
 * @type {string}
 * @private
 */

/**
 * Classes extended by current class.
 * @name $oop.Class#__extends
 * @type {object}
 * @private
 */

/**
 * All classes required by current class to be operable.
 * Its presence determines whether class can be instantiated.
 * @name $oop.Class#__requires
 * @type {object}
 * @private
 */

/**
 * Properties contributed by the class.
 * @name $oop.Class#__contributes
 * @type {object}
 * @private
 */

/**
 * Reference to the builder that built the class.
 * @name $oop.Class#__builder
 * @type {$oop.ClassBuilder}
 * @deprecated Expose the public builder API on Class instead.
 * @private
 */

/**
 * Registry of forwarding definitions.
 * @name $oop.Class#__forwards
 * @type {object}
 * @private
 */

/**
 * Registry of cached instances.
 * @name $oop.Class#__instances
 * @type {object}
 * @private
 */
