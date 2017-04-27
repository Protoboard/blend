(function () {
    "use strict";

    /**
     * @class
     * TODO: Handle multiple additions (of same override).
     */
    $oop.ClassBuilder = /** @lends $oop.ClassBuilder# */{
        /**
         * Retrieves next index for meta property of the specified type.
         * @param {string} metaType
         * @returns {number}
         * @private
         */
        _getNextMetaIndex: function (metaType) {
            var i = 0;
            while (this.hasOwnProperty('__' + metaType + '_' + i)) {
                i++;
            }
            return i;
        },

        /**
         * Adds one named and one indexed meta property for the specified value.
         * @param {string} metaType
         * @param {string} metaName
         * @param {*} metaValue
         * @param {object} target
         * @private
         */
        _addMetaProperties: function (metaType, metaName, metaValue, target) {
            var metaNameByName = '__' + metaType + '_' + metaName,
                nextMetaIndex = this._getNextMetaIndex(metaType),
                metaNameByIndex = '__' + metaType + '_' + nextMetaIndex;

            target[metaNameByName] = metaValue;
            target[metaNameByIndex] = metaValue;
        },

        /**
         * @param {object} properties
         * @private
         */
        _addMethodsToRegistry: function (properties) {
            var overrides = this.overrides = this.overrides || {},
                propertyNames = Object.getOwnPropertyNames(properties),
                i, propertyName, propertyValue, methodOverrides;

            for (i = 0; i < propertyNames.length; i++) {
                propertyName = propertyNames[i];
                propertyValue = properties[propertyName];
                if (typeof propertyValue === 'function') {
                    methodOverrides = overrides[propertyName] = overrides[propertyName] || [];
                    methodOverrides.push(propertyValue);
                }
            }
        },

        /**
         * @returns {boolean}
         * @private
         */
        _areAllInterfacesImplemented: function () {
            var interfaces = this.interfaces,
                contributions = this.contributions;

            return interfaces ?
                interfaces.every(function (item) {
                    var propertyNames = Object.getOwnPropertyNames(item);
                    return propertyNames.every(function (propertyName) {
                        return contributions.hasOwnProperty(propertyName);
                    });
                }) :
                true;
        },

        /**
         * @returns {Array}
         * @private
         */
        _getTraitRequirements: function () {
            var includes = this.includes,
                result = [];

            console.log(includes);

            if (includes) {
                includes.forEach(function (/**$oop.Class#*/item) {
                    // adding base class as require
                    if (item.__extends) {
                        result.push(item.__extends);
                    }

                    result = result.concat(item.getMetaProperties('requires'));
                });
            }

            return result;
        },

        /**
         * Collects base class(es), traits, and requirements.
         * @returns {Array}
         * @private
         */
        _getRelatedClasses: function () {
            return [];
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

            var result = Object.create(this);

            /**
             * Identifies class
             * @type {string}
             */
            result.classId = classId;

            /**
             * Base class reference
             * @type {$oop.Class}
             */
            result.base = undefined;

            /**
             * Registry of required classes
             * TODO: Add 'allows' instead?
             * @type {$oop.Class[]}
             */
            result.requires = [];

            /**
             * Registry of implemented interfaces
             * @type {$oop.Class[]}
             */
            result.interfaces = [];

            /**
             * Registry of included classes.
             * @type {$oop.Class[]}
             */
            result.includes = [];

            /**
             * Method override registry.
             * Indexed by method name, then serial.
             * @type {object}
             */
            result.overrides = {};

            /**
             * Class' own property & method contributions.
             * @type {object}
             */
            result.contributions = {};

            return result;
        },

        /**
         * Specifies class to be extended.
         * @param {$oop.Class} baseClass
         * @returns {$oop.ClassBuilder}
         */
        extend: function (baseClass) {
            if (!baseClass) {
                throw new Error("No base class specified.");
            }

            if (this.base) {
                throw new Error("Base class already specified.");
            }

            // registering base class
            this.base = baseClass;

            // registering contributed overrides
            var baseProperties = baseClass.__contributes;
            if (baseProperties) {
                this._addMethodsToRegistry(baseProperties);
            }

            return this;
        },

        /**
         * Specifies a required base, or trait of the host class.
         * Used by traits only.
         * @param {$oop.Class} requiredClass
         * @returns {$oop.ClassBuilder}
         */
        require: function (requiredClass) {
            if (!requiredClass) {
                throw new Error("No class specified to be required.");
            }

            // registering required class
            this.requires.push(requiredClass);

            return this;
        },

        /**
         * Specifies an interface to be implemented by the host class.
         * @param {$oop.Class} implementedInterface
         * @returns {$oop.ClassBuilder}
         */
        implement: function (implementedInterface) {
            if (!implementedInterface) {
                throw new Error("No interface specified.");
            }

            // registering interface
            this.interfaces.push(implementedInterface);

            return this;
        },

        /**
         * Specifies a class to be included in the host class.
         * Optionally filtered by a list of property names.
         * TODO: Add option to filter inclusion by list of property names.
         * @param includedClass
         * @returns {$oop.ClassBuilder}
         */
        include: function (includedClass) {
            if (!includedClass) {
                throw new Error("No class specified to include.");
            }

            // registering includes
            this.includes.push(includedClass);

            // registering contributed overrides
            var includedProperties = includedClass.__contributes;
            if (includedProperties) {
                this._addMethodsToRegistry(includedProperties);
            }

            return this;
        },

        /**
         * Can be called multiple times.
         * TODO: Rename to 'contribute'.
         * @param {object} contributions
         * @returns {$oop.ClassBuilder}
         */
        contribute: function (contributions) {
            if (!contributions) {
                throw new Error("No contributions specified.");
            }

            var overallContributions = this.contributions,
                propertyNames = Object.getOwnPropertyNames(contributions),
                i, propertyName;

            // copying properties to overall contributions
            for (i = 0; i < propertyNames.length; i++) {
                propertyName = propertyNames[i];
                overallContributions[propertyName] = contributions[propertyName];
            }

            // registering contributed overrides
            this._addMethodsToRegistry(contributions);

            return this;
        },

        /**
         * @returns {object} The created class.
         */
        build: function () {
            var that = this,
                classId = this.classId,
                base = this.base,
                interfaces = this.interfaces,
                includes = this.includes,
                requires = this.requires,
                result = Object.create(base || $oop.Class);

            // checking whether
            // ... own properties match interfaces
            if (interfaces) {
                if (!this._areAllInterfacesImplemented()) {
                    // TODO: make message more granular
                    throw new Error("Class " + classId + " doesn't implement all interfaces");
                }
            }

            // ... bases & traits match new traits' expectations
            if (includes) {
                // collecting trait requirements (from new traits)
                console.log(this._getTraitRequirements());
                // collecting all involved classes
                // this._getRelatedClasses();
                // matching expectations against full list
                // host must either have or also require the same classes
            }

            // copying meta properties
            // ... class ID
            result.__classId = classId;

            // ... requires
            if (requires) {
                requires.forEach(function (require) {
                    that._addMetaProperties('requires', require.__classId, require, result);
                });
            }

            // copying own properties
            // ... from defined properties
            // ... from includes
            // ... creating wrapper methods for overrides

            return result;
        }
    };
}());
