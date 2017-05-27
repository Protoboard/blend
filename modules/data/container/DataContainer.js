/* globals $assert, $oop, $utils, slice */
"use strict";

/**
 * @function $data.DataContainer.create
 * @param {object|Array} [data]
 * @returns {$data.DataContainer}
 */

/**
 * Maintains data and provides access to it. Supports life cycle, clearing
 * and cloning.
 * @class $data.DataContainer
 * @implements $utils.Destroyable
 * @implements $data.Clearable
 * @mixes $utils.Cloneable
 */
exports.DataContainer = $oop.getClass('$data.DataContainer')
    .implement($oop.getClass('$utils.Destroyable'))
    .implement($oop.getClass('$data.Clearable'))
    .include($oop.getClass('$utils.Cloneable'))
    .define(/** @lends $data.DataContainer# */{
        /**
         * @param {object|Array} [data]
         * @ignore
         */
        init: function (data) {
            $assert.isObjectOptional(data, "Invalid data buffer");

            /**
             * @type {Object|Array}
             * @protected
             */
            this._data = data || {};
        },

        /**
         * @inheritDoc
         * @returns {$data.DataContainer}
         */
        destroy: function () {
            this.clear();
            return this;
        },

        /**
         * @inheritDoc
         * @returns {$data.DataContainer}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._data = exports.shallowCopy(this._data);
            return cloned;
        },

        /**
         * Clears buffer data.
         * @returns {$data.DataContainer}
         */
        clear: function () {
            if (this._data instanceof Array) {
                this._data = [];
            } else {
                this._data = {};
            }
            return this;
        },

        /**
         * @param {function} callback
         * @param {function} [context]
         * @param {number} [argIndex=0]
         * @param {...*} arg
         * @returns {*}
         */
        passDataTo: function (callback, context, argIndex, arg) {
            var args;
            if (arguments.length > 2) {
                args = slice.call(arguments, 2);
                args.splice(argIndex, 0, this._data);
                return callback.apply(context, args);
            } else {
                return callback.call(context, this._data);
            }
        },

        /**
         * TODO: Move to Passable?
         * @param {function} callback
         * @param {function} [context]
         * @param {number} [argIndex=0]
         * @param {...*} arg
         * @returns {*}
         */
        passSelfTo: function (callback, context, argIndex, arg) {
            var args;
            if (arguments.length > 2) {
                args = slice.call(arguments, 2);
                args.splice(argIndex, 0, this);
                return callback.apply(context, args);
            } else {
                return callback.call(context, this);
            }
        }
    });
