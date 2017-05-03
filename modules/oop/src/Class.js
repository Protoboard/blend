/* global $oop */
"use strict";

/**
 * General class functionality: instantiation & reflection.
 * @class $oop.Class
 */
$oop.Class = {
    /**
     * Creates new instance of class.
     * @memberOf $oop.Class#
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
            instances = that.__instances;
            instanceId = mapper.apply(this, arguments);
            instance = instances[instanceId];
            if (instance) {
                // instance found in cache
                return instance;
            }
        }

        // running checks
        var requireIds = that.__requireIds;
        if (requireIds.length) {
            // there are unfulfilled requires - can't instantiate
            throw new Error([
                "Class '" + that.__id + "' doesn't satisfy require(s): " +
                requireIds
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
     * @memberOf $oop.Class#
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
     * Tells whether current class is or includes the specified class.
     * @memberOf $oop.Class#
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    includes: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        var classId = class_.__id;

        return this.__id === classId || !!this.__includes[classId];
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
 * Classes included by current class.
 * @name $oop.Class#__includes
 * @type {object}
 * @private
 */

/**
 * List of class IDs for all unfulfilled requires.
 * Its contents determines whether class can be instantiated.
 * @member {string[]} $oop.Class#__requireIds
 * @private
 */

/**
 * All classes required by current class to be operable.
 * @member {object} $oop.Class#__requires
 * @private
 */

/**
 * Properties defined by the class.
 * @member {object} $oop.Class#__defines
 * @private
 */

/**
 * Registry of forwarding definitions.
 * @member {object} $oop.Class#__forwards
 * @private
 */

/**
 * Callback function that maps instances
 * to unique hashes.
 * @function $oop.Class#__mapper
 * @private
 */

/**
 * Registry of cached instances.
 * @member {object} $oop.Class#__instances
 * @private
 */
