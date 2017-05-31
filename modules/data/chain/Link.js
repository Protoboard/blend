"use strict";

/**
 * @function $data.Link.create
 * @returns {$data.Link}
 */

/**
 * Basic link, can chain other links to it.
 * TODO: Add updating _itemCount on Chain.
 * @class $data.Link
 */
$data.Link = $oop.getClass('$data.Link')
    .define(/** @lends $data.Link# */{
        /** @ignore */
        init: function () {
            /**
             * Chain instance the link is associated with.
             * @type {$data.Chain}
             * @private
             */
            this._chain = undefined;

            /**
             * Link that comes before the current link in the chain.
             * @type {$data.Link}
             */
            this.previousLink = undefined;

            /**
             * Link that comes after the current link in the chain.
             * @type {$data.Link}
             */
            this.nextLink = undefined;
        },

        /**
         * Adds current unconnected link after the specified link.
         * @param {$data.Link} link
         * @returns {$data.Link}
         */
        addAfter: function (link) {
            if (this.previousLink || this.nextLink) {
                // preparing link to be added
                this.unlink();
            }

            // setting links on current link
            this.previousLink = link;
            this.nextLink = link.nextLink;
            this._chain = link._chain;

            // setting self as previous link on old next link
            if (link.nextLink) {
                link.nextLink.previousLink = this;
            }

            // setting self as next link on target link
            link.nextLink = this;

            return this;
        },

        /**
         * Adds current link before the specified link.
         * @param {$data.Link} link
         * @returns {$data.Link}
         */
        addBefore: function (link) {
            if (this.previousLink || this.nextLink) {
                // preparing link to be added
                this.unlink();
            }

            // setting links on current link
            this.nextLink = link;
            this.previousLink = link.previousLink;
            this._chain = link._chain;

            // setting self as next link on old previous link
            if (link.previousLink) {
                link.previousLink.nextLink = this;
            }

            // setting self as previous link on target link
            link.previousLink = this;

            return this;
        },

        /**
         * Removes link from the chain.
         * @returns {$data.Link}
         */
        unlink: function () {
            var nextLink = this.nextLink,
                previousLink = this.previousLink;

            // linking up neighbors
            if (nextLink) {
                nextLink.previousLink = previousLink;
            }
            if (previousLink) {
                previousLink.nextLink = nextLink;
            }

            // clearing references
            this.previousLink = undefined;
            this.nextLink = undefined;
            this._chain = undefined;

            return this;
        }
    });
