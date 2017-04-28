/* global $oop */
"use strict";

/**
 * TODO: Restore $oop.Base functionality.
 * TODO: Add diagnostic methods (extends, implements, requires).
 * @class
 */
$oop.Class = /** @lends $oop.Class# */{
    /**
     * Creates new instance of class.
     * TODO: Work in progress.
     * @returns {$oop.Class}
     */
    create: function () {
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

        return Object.create(this);
    }
};

/**
 * Identifies class.
 * @name $oop.Class#__id
 * @type {string}
 */

/**
 * Classes extended by current class.
 * @name $oop.Class#__extends
 * @type {object}
 */

/**
 * All classes required by current class to be operable.
 * Its presence determines whether class can be instantiated.
 * @name $oop.Class#__requires
 * @type {object}
 */

/**
 * Properties contributed by the class.
 * @name $oop.Class#__contributes
 * @type {object}
 */
