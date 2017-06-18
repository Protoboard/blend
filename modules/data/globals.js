"use strict";

var $assert = require('giant-assert'),
    $oop = require('giant-oop'),
    $utils = require('giant-utils'),
    $data = exports,
    hOP = Object.prototype.hasOwnProperty,
    slice = Array.prototype.slice;

/**
 * @namespace $data
 */

/**
 * @external Array
 */

/**
 * @external String
 */

$oop.copyProperties($data, /** @lends $data */{
    /**
     * Marks key-value container as having strings for keys.
     * @constant
     */
    KEY_TYPE_STRING: 'string',

    /**
     * Marks key-value container as having any type for keys.
     * @constant
     */
    KEY_TYPE_ANY: 'undefined',

    /**
     * Marks key-value container as having strings for values.
     * @constant
     */
    VALUE_TYPE_STRING: 'string',

    /**
     * Marks key-value container as having any type for values.
     * @constant
     */
    VALUE_TYPE_ANY: 'undefined',

    /**
     * Marks key-value container as having unique keys.
     * @constant
     */
    KEY_MUL_UNIQUE: 'unique',

    /**
     * Marks key-value container as having non-unique keys.
     * @constant
     */
    KEY_MUL_ANY: 'undefined'
});
