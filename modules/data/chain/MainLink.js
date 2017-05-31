"use strict";

/**
 * @function $data.MainLink.create
 * @param {$data.Chain} parentChain
 * @returns {$data.MainLink}
 */

/**
 * Basic link, can chain other links to it.
 * @class $data.MainLink
 */
$data.MainLink = $oop.getClass('$data.MainLink')
    .define(/** @lends $data.MainLink# */{
        /**
         * @param {$data.Chain} chain
         * @ignore
         */
        init: function (chain) {
            // TODO: Assert

            /**
             * Chain instance the link is associated with.
             * @type {$data.Chain}
             * @private
             */
            this._chain = chain;

            /**
             * Link that comes before the current link in the chain.
             * @type {$data.MainLink}
             */
            this.previousLink = this;

            /**
             * Link that comes after the current link in the chain.
             * @type {$data.MainLink}
             */
            this.nextLink = this;
        }
    });
