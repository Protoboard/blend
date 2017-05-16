/* globals $assert, $oop, $utils */
"use strict";

/**
 * @function $data.Buffer.create
 * @param {object|Array} [data]
 * @returns {$data.Buffer}
 */

/**
 * Bass for any data class that maintains a data buffer.
 * @class $data.Buffer
 * @implements $utils.Destroyable
 * @implements $data.Clearable
 * @mixes $utils.Cloneable
 */
exports.Buffer = $oop.getClass('$data.Buffer')
    .implement($oop.getClass('$utils.Destroyable'))
    .implement($oop.getClass('$data.Clearable'))
    .include($oop.getClass('$utils.Cloneable'))
    .define(/** @lends $data.Buffer# */{
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
         * @returns {$data.Buffer}
         */
        destroy: function () {
            this.clear();
            return this;
        },

        /**
         * @inheritDoc
         * @returns {$data.Buffer}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._data = exports.shallowCopy(this._data);
            return cloned;
        },

        /**
         * Clears buffer data.
         * @returns {$data.Buffer}
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
         * @returns {*}
         */
        passDataTo: function (callback) {
            return callback(this._data);
        },

        /**
         * @param {function} callback
         * @returns {*}
         */
        passSelfTo: function (callback) {
            return callback(this);
        }
    });
