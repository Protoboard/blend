/* global $oop, $utils */
"use strict";

/**
 * Keeps a registry of all living instances, and makes them accessible
 * by their unique IDs.
 * @mixin $utils.Retrievable
 * @mixes $utils.Identifiable
 * @implements $utils.Destroyable
 */
exports.Retrievable = $oop.getClass('$utils.Retrievable')
    .implement($oop.getClass('$utils.Destroyable'))
    .extend($oop.getClass('$utils.Identifiable'))
    .define(/** @lends $utils.Retrievable# */{
        /**
         * Global registry for instances having the Retrievable trait.
         * @memberOf $utils.Retrievable
         * @type {object}
         */
        instanceRegistry: {},

        /** @ignore */
        init: function () {
            this._addToInstanceRegistry();
        },

        /**
         * Adds instance to global registry.
         * @returns {$utils.Retrievable}
         * @private
         */
        _addToInstanceRegistry: function () {
            exports.Retrievable.instanceRegistry[this.instanceId] = this;
            return this;
        },

        /**
         * Removes instance from global registry.
         * @returns {$utils.Retrievable}
         * @private
         */
        _removeFromInstanceRegistry: function () {
            delete exports.Retrievable.instanceRegistry[this.instanceId];
            return this;
        },

        /**
         * @returns {$utils.Retrievable}
         */
        destroy: function () {
            this._removeFromInstanceRegistry();
            return this;
        },

        /**
         * Retrieves instance by its ID.
         * @param {number|string} instanceId
         * @returns {$utils.Retrievable}
         * @memberOf $utils.Retrievable
         */
        getInstanceById: function (instanceId) {
            return exports.Retrievable.instanceRegistry[instanceId];
        }
    });
