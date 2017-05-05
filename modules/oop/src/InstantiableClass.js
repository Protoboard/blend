/* global $oop */
"use strict";

/**
 * @class $oop.InstantiableClass
 * @extends $oop.Class
 * @ignore
 */
$oop.InstantiableClass = $oop.ProtoclassBuilder.reset()
    .extend($oop.Class)
    .define(/** @lends $oop.InstantiableClass# */{
        /**
         * @memberOf $oop.InstantiableClass
         * @returns {$oop.InstantiableClass}
         * @private
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
                instances = that.__instanceLookup;
                instanceId = mapper.apply(this, arguments);
                instance = instances[instanceId];
                if (instance) {
                    // instance found in cache
                    return instance;
                }
            }

            // checking whether
            // ... methods match interfaces
            var unimplementedMethodNames = this.__unimplementedMethodNames;
            if (unimplementedMethodNames.length) {
                throw new Error([
                    "Class '" + that.__classId + "' doesn't implement method(s): " +
                    unimplementedMethodNames
                        .map(function (methodName) {
                            return "'" + methodName + "'";
                        }) + ".",
                    "Can't instantiate."
                ].join(" "));
            }

            // ... all requires are included
            var requires = that.__requires;
            if (requires.length) {
                // there are unfulfilled requires - can't instantiate
                throw new Error([
                    "Class '" + that.__classId + "' doesn't satisfy require(s): " +
                    requires
                        .map(function (Class) {
                            return "'" + Class.__classId + "'";
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
        }
    })
    .build();
