(function () {
    "use strict";

    /**
     * TODO: Add surrogates & caching.
     * TODO: Store reference to builder on class?
     * @class
     */
    $oop.Class = /** @lends $oop.Class# */{
        /**
         * @param {string} metaType
         * @returns {Array}
         */
        getMetaProperties: function (metaType) {
            var propertyNamePrefix = '__' + metaType + '_',
                i,
                result = [];

            for (i = 0; this.hasOwnProperty(propertyNamePrefix + i); i++) {
                result.push(this[propertyNamePrefix + i]);
            }

            return result;
        },

        /**
         * Creates new instance of class.
         * TODO: Work in progress.
         * @returns {$oop.Class}
         */
        create: function () {
            if (this.__requires_0) {
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
     * Builder that built the class.
     * @name $oop.Class#__builder
     * @type {$oop.ClassBuilder}
     */

    /**
     * Specifies 1st-degree base class.
     * @name $oop.Class#__extends
     * @type {$oop.Class}
     */

    /**
     * Properties contributed by the class.
     * @name $oop.Class#__contributes
     * @type {object}
     */

    /**
     * First require meta property.
     * Its presence determines whether class can be instantiated.
     * @name $oop.Class#__requires_0
     * @type {$oop.Class}
     */
}());
