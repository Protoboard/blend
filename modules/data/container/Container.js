/* globals $assert, $oop, $utils, slice */
"use strict";

/**
 * @function $data.Container.create
 * @param {object|Array} [data]
 * @returns {$data.Container}
 */

/**
 * Base for any data class that maintains a data buffer.
 * @class $data.Container
 * @implements $utils.Destroyable
 * @implements $data.Clearable
 * @mixes $utils.Cloneable
 */
exports.Container = $oop.getClass('$data.Container')
    .implement($oop.getClass('$utils.Destroyable'))
    .implement($oop.getClass('$data.Clearable'))
    .include($oop.getClass('$utils.Cloneable'))
    .define(/** @lends $data.Container# */{
        /**
         * @param {object|Array} [data]
         * @ignore
         */
        init: function (data) {
            $assert.isObjectOptional(data, "Invalid buffer data");

            /**
             * @type {Object|Array}
             * @protected
             */
            this._data = data || {};
        },

        /**
         * @inheritDoc
         * @returns {$data.Container}
         */
        destroy: function () {
            this.clear();
            return this;
        },

        /**
         * @inheritDoc
         * @returns {$data.Container}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._data = exports.shallowCopy(this._data);
            return cloned;
        },

        /**
         * Clears buffer data.
         * @returns {$data.Container}
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
