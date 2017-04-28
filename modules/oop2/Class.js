(function () {
    "use strict";

    /**
     * TODO: Add surrogates & caching.
     * TODO: Store reference to builder on class?
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
                throw new Error("Class has unmet requirements, can't instantiate.");
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
}());
