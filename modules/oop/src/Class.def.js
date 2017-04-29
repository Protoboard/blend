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

        // fetching cached instance

        // running checks
        if (this.__requires) {
            // there are unfulfilled requires - can't instantiate
            throw new Error([
                "Class '" + this.__id + "' doesn't satisfy require(s): " +
                Object.keys(this.__requires)
                    .map(function (classId) {
                        return "'" + classId + "'";
                    })
                    .join(",") + ".",
                "Can't instantiate."
            ].join(" "));
        }

        // instantiating class
        var instance = Object.create(this);

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
     * Tells whether current class extends the specified class.
     * @param {$oop.Class} class_
     * @returns {boolean}
     */
    extends: function (class_) {
        if (!$oop.Class.isPrototypeOf(class_)) {
            throw new Error("Class type expected");
        }

        return !!this.__extends[class_.__id];
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
