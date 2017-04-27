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
     * @name $oop.Class#__id
     * @type {string}
     */

    /**
     * @name $oop.Class#__extends
     * @type {$oop.Class}
     */

    /**
     * @name $oop.Class#__contributes
     * @type {object}
     */

    /**
     * @name $oop.Class#__requires_0
     * @type {$oop.Class}
     */

    /**
     * @name $oop.Class#create
     * @function
     * @returns {$oop.Class}
     */
}());
