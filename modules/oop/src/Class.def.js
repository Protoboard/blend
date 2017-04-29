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
        // forwarding
        var forwards = this.__forwards,
            forwardsCount = forwards.length,
            i, forward,
            class_ = this;

        // retrieving forward class (if any)
        for (i = 0; i < forwardsCount; i++) {
            forward = forwards[i];
            if (forward.filter.apply(this, arguments)) {
                // ctr arguments fit forward filter
                class_ = forward['class'];
                break;
            }
        }

        // fetching cached instance

        // running checks
        if (class_.__requires) {
            // there are unfulfilled requires - can't instantiate
            throw new Error([
                "Class '" + class_.__id + "' doesn't satisfy require(s): " +
                Object.keys(class_.__requires)
                    .map(function (classId) {
                        return "'" + classId + "'";
                    })
                    .join(",") + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // instantiating class
        var instance = Object.create(class_);

        // invoking .init

        // caching instance (if necessary)

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
 * @private
 */

/**
 * Registry of forwarding definitions.
 * @name $oop.Class#__forwards
 * @type {object}
 * @private
 */
