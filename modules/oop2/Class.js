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
        }
    };

    /**
     * @name $oop.Class#__classId
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
     * @name $oop.Class#create
     * @function
     * @returns {$oop.Class}
     */
}());
